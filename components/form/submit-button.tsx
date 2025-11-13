import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable submit button with loading state
 */
export function SubmitButton({
  isLoading,
  loadingText,
  children,
  variant = "default",
  className,
  disabled,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      className={className}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
