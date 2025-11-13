import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface RoleBadgeProps {
  role: string;
}

/**
 * Semantic badge for user roles
 */
export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === "ADMIN") {
    return (
      <Badge variant="default" className="bg-primary">
        <Shield className="w-3 h-3 mr-1" />
        Admin
      </Badge>
    );
  }

  return (
    <Badge variant="outline">User</Badge>
  );
}
