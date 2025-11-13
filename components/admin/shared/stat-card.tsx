import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

/**
 * Reusable stat card for admin dashboards
 */
export function StatCard({ title, value, description, icon: Icon, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "",
    success: "border-green-500/20 bg-green-50/50 dark:bg-green-950/20",
    warning: "border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20",
    danger: "border-red-500/20 bg-red-50/50 dark:bg-red-950/20",
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
