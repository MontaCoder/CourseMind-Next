import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  labelAction?: React.ReactNode;
  defaultValue?: string;
}

/**
 * Reusable form input with optional icon and label action
 */
export function FormInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  labelAction,
  defaultValue,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={Icon ? "pl-10" : ""}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
}
