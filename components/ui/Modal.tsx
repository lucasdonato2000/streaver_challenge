"use client";

import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 h-screen">
      <div className="bg-surface border border-border rounded-xl max-w-md w-full shadow-2xl">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-xl font-bold text-light">{title}</h3>
        </div>

        <div className="px-6 py-4">{children}</div>

        {footer && (
          <div className="px-6 py-4 bg-surface-600 border-t border-border flex gap-3 justify-end rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "success" | "default";
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "default",
}: ConfirmModalProps) {
  const variantClasses = {
    danger: "bg-warning hover:bg-warning-600 text-navy",
    success: "bg-success hover:bg-success-600 text-white",
    default: "bg-accent hover:bg-accent-600 text-white",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-surface-700 text-light rounded-lg hover:bg-surface-800 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
          >
            {isLoading ? "Loading..." : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-muted">{message}</p>
    </Modal>
  );
}
