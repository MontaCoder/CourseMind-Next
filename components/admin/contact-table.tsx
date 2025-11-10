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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Eye, CheckCircle } from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  resolved: boolean;
  createdAt: Date;
}

interface ContactTableProps {
  contacts: Contact[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No submissions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{contact.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                        {contact.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.resolved ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-600 text-white">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedContact(contact)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Contact Submission Details</DialogTitle>
                            <DialogDescription>
                              Submitted on {new Date(contact.createdAt).toLocaleString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-semibold text-muted-foreground mb-1">
                                Name
                              </div>
                              <div>
                                {contact.firstName} {contact.lastName}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-muted-foreground mb-1">
                                Email
                              </div>
                              <div>{contact.email}</div>
                            </div>
                            {contact.phone && (
                              <div>
                                <div className="text-sm font-semibold text-muted-foreground mb-1">
                                  Phone
                                </div>
                                <div>{contact.phone}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-muted-foreground mb-1">
                                Message
                              </div>
                              <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                                {contact.message}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-muted-foreground mb-1">
                                Status
                              </div>
                              {contact.resolved ? (
                                <Badge variant="default" className="bg-green-600">
                                  Resolved
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-orange-600 text-white">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
