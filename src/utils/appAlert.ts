"use client";

import { toast } from "sonner";

type AlertIcon = "success" | "error" | "warning" | "info" | "question";

type AlertOptions = {
  icon?: AlertIcon;
  title?: string;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  timer?: number;
  showConfirmButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  position?: string;
};

type AlertResult = {
  isConfirmed: boolean;
};

const getMessage = (title?: string, text?: string) => {
  if (title && text) return `${title}: ${text}`;
  return title || text || "";
};

const showToast = (icon: AlertIcon | undefined, message: string, duration?: number) => {
  if (!message) return;

  const options = duration ? { duration } : undefined;

  if (icon === "success") {
    toast.success(message, options);
    return;
  }

  if (icon === "error") {
    toast.error(message, options);
    return;
  }

  if (icon === "warning") {
    toast.warning(message, options);
    return;
  }

  toast.info(message, options);
};

const showConfirmDialog = (options: AlertOptions, message: string) =>
  new Promise<AlertResult>((resolve) => {
    if (typeof document === "undefined") {
      resolve({ isConfirmed: false });
      return;
    }

    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4";

    const dialog = document.createElement("div");
    dialog.className =
      "w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl";

    const content = document.createElement("div");
    content.className = "space-y-2";

    if (options.title) {
      const title = document.createElement("h3");
      title.className = "text-lg font-bold text-gray-950";
      title.textContent = options.title;
      content.appendChild(title);
    }

    const text = document.createElement("p");
    text.className = "text-sm font-medium leading-6 text-gray-600";
    text.textContent = options.text || message || "Are you sure?";
    content.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "mt-6 flex justify-end gap-3";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className =
      "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50";
    cancelButton.textContent = "Cancel";

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className =
      "rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors hover:brightness-110";
    confirmButton.textContent = options.confirmButtonText || "OK";
    confirmButton.style.background =
      options.confirmButtonColor ||
      "var(--Gradian-Colur, linear-gradient(180deg, #258200 0%, #58B500 100%))";

    const close = (isConfirmed: boolean) => {
      overlay.remove();
      resolve({ isConfirmed });
    };

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close(false);
    });
    cancelButton.addEventListener("click", () => close(false));
    confirmButton.addEventListener("click", () => close(true));

    actions.append(cancelButton, confirmButton);
    dialog.append(content, actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  });

export const appAlert = {
  fire: async (
    titleOrOptions?: string | AlertOptions,
    text?: string,
    icon?: AlertIcon
  ): Promise<AlertResult> => {
    if (typeof titleOrOptions === "string") {
      showToast(icon, getMessage(titleOrOptions, text));
      return { isConfirmed: true };
    }

    const options = titleOrOptions || {};
    const message = getMessage(options.title, options.text);

    if (options.showCancelButton) {
      return showConfirmDialog(options, message);
    }

    showToast(options.icon, message, options.timer);
    return { isConfirmed: true };
  },
};
