import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: boolean | string;
  trueLabel?: string;
  falseLabel?: string;
}

/**
 * Semantic badge for status (published/draft, active/inactive, etc.)
 */
export function StatusBadge({
  status,
  trueLabel = "Active",
  falseLabel = "Inactive"
}: StatusBadgeProps) {
  // Handle boolean status
  if (typeof status === "boolean") {
    return status ? (
      <Badge variant="default" className="bg-green-600">
        {trueLabel}
      </Badge>
    ) : (
      <Badge variant="secondary">{falseLabel}</Badge>
    );
  }

  // Handle string status
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive"; className?: string }> = {
    ACTIVE: { label: "Active", variant: "default", className: "bg-green-600" },
    INACTIVE: { label: "Inactive", variant: "secondary" },
    PUBLISHED: { label: "Published", variant: "default", className: "bg-green-600" },
    DRAFT: { label: "Draft", variant: "secondary" },
    RESOLVED: { label: "Resolved", variant: "default", className: "bg-green-600" },
    PENDING: { label: "Pending", variant: "secondary" },
    CANCELED: { label: "Canceled", variant: "destructive" },
    EXPIRED: { label: "Expired", variant: "destructive" },
  };

  const config = statusMap[status.toUpperCase()] || { label: status, variant: "secondary" as const };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
