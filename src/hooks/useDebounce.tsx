import { CheckCircle, Error } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export const statusIcons = {
  ok: <CheckCircle color="success" />,
  error: <Error color="error" />,
  inProgress: <CircularProgress className="!w-6 !h-6" />,
  idle: null,
} as const;

export function useDebounce({
  value,
  debounceTime = 1000,
  action,
}: {
  value: string;
  debounceTime?: number;
  action?: (value: string) => "ok" | "error";
}): keyof typeof statusIcons {
  const [validationStatus, setValidationStatus] =
    useState<keyof typeof statusIcons>("idle");

  useEffect(() => {
    setValidationStatus(value ? "inProgress" : "idle");
    let timeoutId: number;

    if (value) {
      timeoutId = window.setTimeout(() => {
        if (action) {
          setValidationStatus(action(value));
        } else {
          setValidationStatus(value === "code" ? "ok" : "error");
        }
      }, debounceTime);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [action, debounceTime, value]);

  return validationStatus;
}
