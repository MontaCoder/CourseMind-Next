import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import { db } from "@/lib/db";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Get user for email
        const user = await db.user.findUnique({
          where: { id: session.metadata?.userId! },
        });

        // Create subscription in database
        await db.subscription.create({
          data: {
            userId: session.metadata?.userId!,
            plan: session.metadata?.plan as "MONTHLY" | "YEARLY",
            status: "ACTIVE",
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        // Send welcome email
        if (user?.email) {
          const plan = session.metadata?.plan as "MONTHLY" | "YEARLY";
          const planDetails = STRIPE_PLANS[plan];
          const email = emailTemplates.subscriptionSuccess({
            userName: user.name || "User",
            plan: planDetails.name,
            price: `$${planDetails.price}`,
            nextBillingDate: new Date(
              subscription.current_period_end * 1000
            ).toLocaleDateString(),
          });

          await sendEmail({
            to: user.email,
            subject: email.subject,
            html: email.html,
            text: email.text,
          });
        }

        console.log("Subscription created:", subscription.id);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          // Update subscription period end
          await db.subscription.updateMany({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });

          console.log("Subscription updated:", subscription.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Get subscription and user for email
        const dbSubscription = await db.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
          include: { user: true },
        });

        // Mark subscription as canceled
        await db.subscription.updateMany({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: "CANCELED",
          },
        });

        // Send cancellation email
        if (dbSubscription?.user.email) {
          const email = emailTemplates.subscriptionCanceled({
            userName: dbSubscription.user.name || "User",
            plan: dbSubscription.plan,
            endDate: new Date(
              subscription.current_period_end * 1000
            ).toLocaleDateString(),
          });

          await sendEmail({
            to: dbSubscription.user.email,
            subject: email.subject,
            html: email.html,
            text: email.text,
          });
        }

        console.log("Subscription canceled:", subscription.id);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Update subscription status
        await db.subscription.updateMany({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status:
              subscription.status === "active"
                ? "ACTIVE"
                : subscription.status === "canceled"
                ? "CANCELED"
                : "ACTIVE",
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        console.log("Subscription updated:", subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
