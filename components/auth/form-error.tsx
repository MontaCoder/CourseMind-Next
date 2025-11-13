interface FormErrorProps {
  message?: string;
}

/**
 * Shared error message display for auth forms
 */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  );
}
