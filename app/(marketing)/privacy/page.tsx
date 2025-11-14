import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export const metadata = {
  title: "Privacy Policy - CourseMind",
  description: "CourseMind's privacy policy and data protection practices.",
};

async function getPrivacyPolicy() {
  try {
    const policy = await db.policy.findUnique({
      where: { type: "privacy" },
    });
    return policy;
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return null;
  }
}

const DEFAULT_CONTENT = `
<h2>1. Introduction</h2>
<p>
  Welcome to CourseMind ("we," "our," or "us"). We respect your
  privacy and are committed to protecting your personal data. This
  privacy policy explains how we collect, use, and safeguard your
  information when you use our services.
</p>

<h2>2. Information We Collect</h2>
<h3>2.1 Information You Provide</h3>
<p>
  We collect information you provide directly to us, including:
</p>
<ul>
  <li>Name and email address when you create an account</li>
  <li>Profile information and preferences</li>
  <li>Course content you create</li>
  <li>Messages you send through our platform</li>
  <li>Payment information (processed securely through Stripe)</li>
</ul>

<h3>2.2 Automatically Collected Information</h3>
<p>
  When you use our services, we automatically collect:
</p>
<ul>
  <li>Device and browser information</li>
  <li>IP address and location data</li>
  <li>Usage data and analytics</li>
  <li>Cookies and similar tracking technologies</li>
</ul>

<h3>2.3 AI Interaction Data</h3>
<p>
  To provide our AI-powered course generation and tutoring services, we collect:
</p>
<ul>
  <li>Course topics and generation requests</li>
  <li>Questions asked to the AI tutor</li>
  <li>Quiz responses and results</li>
  <li>Learning progress and completion data</li>
</ul>

<h2>3. How We Use Your Information</h2>
<p>
  We use your information to:
</p>
<ul>
  <li>Provide, maintain, and improve our services</li>
  <li>Generate personalized AI-powered course content</li>
  <li>Process your transactions and manage subscriptions</li>
  <li>Send you service-related communications</li>
  <li>Respond to your questions and support requests</li>
  <li>Detect and prevent fraud and abuse</li>
  <li>Comply with legal obligations</li>
</ul>

<h2>4. Data Sharing and Disclosure</h2>
<p>
  We do not sell your personal information. We may share your data with:
</p>
<ul>
  <li><strong>Service Providers:</strong> Third-party vendors who help us operate our services (hosting, AI services, email delivery)</li>
  <li><strong>Payment Processors:</strong> Stripe for secure payment processing</li>
  <li><strong>AI Services:</strong> Google Gemini AI for course generation and tutoring (data is processed according to Google's privacy policy)</li>
  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
</ul>

<h2>5. Data Security</h2>
<p>
  We implement industry-standard security measures to protect your data, including:
</p>
<ul>
  <li>Encryption of data in transit and at rest</li>
  <li>Regular security audits and updates</li>
  <li>Access controls and authentication</li>
  <li>Secure data storage with trusted providers</li>
</ul>

<h2>6. Your Rights and Choices</h2>
<p>
  You have the right to:
</p>
<ul>
  <li><strong>Access:</strong> Request access to your personal data</li>
  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
  <li><strong>Export:</strong> Receive a copy of your data in a portable format</li>
  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
</ul>

<h2>7. Cookies and Tracking</h2>
<p>
  We use cookies and similar technologies to:
</p>
<ul>
  <li>Remember your preferences and settings</li>
  <li>Analyze site usage and improve performance</li>
  <li>Provide personalized content</li>
</ul>
<p>
  You can control cookies through your browser settings.
</p>

<h2>8. Children's Privacy</h2>
<p>
  Our services are not intended for children under 13. We do not
  knowingly collect information from children under 13. If you believe
  we have collected information from a child, please contact us.
</p>

<h2>9. International Data Transfers</h2>
<p>
  Your information may be transferred to and processed in countries
  other than your own. We ensure appropriate safeguards are in place
  for such transfers.
</p>

<h2>10. Data Retention</h2>
<p>
  We retain your data for as long as your account is active or as
  needed to provide services. After account deletion, we may retain
  certain data for legal and business purposes.
</p>

<h2>11. Third-Party Links</h2>
<p>
  Our services may contain links to third-party websites. We are not
  responsible for the privacy practices of these sites. Please review
  their privacy policies.
</p>

<h2>12. Changes to This Policy</h2>
<p>
  We may update this privacy policy from time to time. We will notify
  you of significant changes through our services or via email.
</p>

<h2>13. GDPR Compliance</h2>
<p>
  If you are in the European Economic Area (EEA), you have additional rights under GDPR:
</p>
<ul>
  <li>Right to data portability</li>
  <li>Right to object to processing</li>
  <li>Right to restrict processing</li>
  <li>Right to withdraw consent</li>
</ul>

<h2>14. CCPA Compliance</h2>
<p>
  If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
</p>
<ul>
  <li>Right to know what personal information is collected</li>
  <li>Right to know if personal information is sold or disclosed</li>
  <li>Right to opt-out of sale of personal information</li>
  <li>Right to non-discrimination for exercising CCPA rights</li>
</ul>

<h2>15. Contact Us</h2>
<p>
  If you have questions about this privacy policy or our data practices, please contact us:
</p>
<ul>
  <li><strong>Email:</strong> privacy@coursemind.com</li>
  <li><strong>Website:</strong> <a href="/contact">Contact Form</a></li>
</ul>
`;

export default async function PrivacyPage() {
  const policy = await getPrivacyPolicy();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">
          {policy?.title || "Privacy Policy"}
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {policy?.updatedAt
            ? new Date(policy.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "January 1, 2025"}
        </p>

        <Card>
          <CardContent
            className="prose prose-gray dark:prose-invert max-w-none pt-6 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-2 whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: policy?.content || DEFAULT_CONTENT,
            }}
          />
        </Card>

        {/* Footer Links */}
        <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact Us
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About Us
          </Link>
        </div>
      </div>
  );
}
