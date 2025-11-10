import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import Link from "next/link";
import { UserSearch } from "@/components/admin/user-search";
import { Users, Plus } from "lucide-react";

async function getUsers() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: true,
      _count: {
        select: {
          courses: true,
        },
      },
    },
  });
  return users;
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage all users and their subscriptions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.subscriptions.some(s => s.status === "ACTIVE")).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => !u.subscriptions.some(s => s.status === "ACTIVE")).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "ADMIN").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <UserSearch users={users} />
    </div>
  );
}
