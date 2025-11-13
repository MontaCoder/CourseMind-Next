import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  defaultValue?: string;
}

/**
 * Reusable form textarea with label
 */
export function FormTextarea({
  id,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  defaultValue,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        defaultValue={defaultValue}
      />
    </div>
  );
}
