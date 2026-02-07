import { toast } from "sonner";

export function handleApiError(error, context = "", showToast = true) {
  console.error(`[${context || "API Error"}]`, error);

  const message = error.message || "An unexpected error occurred";

  if (showToast) {
    toast.error(message);
  }

  return message;
}

export function handleApiSuccess(message, showToast = true) {
  if (showToast) {
    toast.success(message);
  }
}
