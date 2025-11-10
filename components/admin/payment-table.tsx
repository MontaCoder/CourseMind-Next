"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
}

interface PaymentTableProps {
  subscriptions: Subscription[];
}

export function PaymentTable({ subscriptions }: PaymentTableProps) {
  const [search, setSearch] = useState("");

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Subscriptions</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Period End</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sub.user.name || "No name"}</div>
                      <div className="text-sm text-muted-foreground">
                        {sub.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sub.plan === "MONTHLY" ? "Monthly" : "Yearly"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.status === "ACTIVE" ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Canceled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${sub.plan === "MONTHLY" ? "9.99" : "99.99"}
                    {sub.plan === "MONTHLY" ? "/mo" : "/yr"}
                  </TableCell>
                  <TableCell>
                    {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
