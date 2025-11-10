import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Shield, FileText, Edit } from "lucide-react";
import Link from "next/link";

async function getPolicies() {
  const policies = await db.policy.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return policies;
}

export default async function AdminPoliciesPage() {
  const policies = await getPolicies();

  const policyTypes = [
    { type: "privacy", name: "Privacy Policy", icon: Shield, description: "Data protection and privacy practices" },
    { type: "terms", name: "Terms of Service", icon: FileText, description: "Terms and conditions for using the service" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Policy Management
          </h2>
          <p className="text-muted-foreground">
            Manage legal documents and policies
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.length > 0
                ? new Date(policies[0].updatedAt).toLocaleDateString()
                : "Never"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {policyTypes.map((policyType) => {
          const policy = policies.find((p) => p.type === policyType.type);
          const Icon = policyType.icon;

          return (
            <Card key={policyType.type}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{policyType.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {policyType.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {policy ? (
                  <div className="space-y-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Last updated:</p>
                      <p className="font-medium">
                        {new Date(policy.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Content length:</p>
                      <p className="font-medium">
                        {policy.content.length.toLocaleString()} characters
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/policies/edit/${policyType.type}`} className="flex-1">
                        <Button className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Policy
                        </Button>
                      </Link>
                      <Link href={`/${policyType.type}`} target="_blank">
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This policy hasn't been created yet.
                    </p>
                    <Link href={`/admin/policies/edit/${policyType.type}`}>
                      <Button className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Create Policy
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            • Policies are displayed on public pages ({" "}
            <Link href="/privacy" className="text-primary hover:underline" target="_blank">
              /privacy
            </Link>
            ,{" "}
            <Link href="/terms" className="text-primary hover:underline" target="_blank">
              /terms
            </Link>
            )
          </p>
          <p>
            • Changes are saved immediately and visible to all users
          </p>
          <p>
            • Content supports HTML formatting for better presentation
          </p>
          <p>
            • Always review changes before saving to avoid legal issues
          </p>
          <p>
            • Consider consulting with a legal professional for policy content
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
