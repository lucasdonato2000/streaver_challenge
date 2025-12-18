"use client";

import { X, AlertTriangle } from "lucide-react";

type ErrorBannerProps = {
  message: string;
  onClose?: () => void;
};

export function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <div className="bg-warning/10 border border-warning rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-warning font-semibold mb-1">Error</h3>
          <p className="text-muted text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted hover:text-light transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
