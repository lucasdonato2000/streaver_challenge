"use client";

import { ReactNode } from "react";

type DropdownOption = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger" | "success";
};

type DropdownProps = {
  trigger: ReactNode;
  options: DropdownOption[];
  isOpen: boolean;
  onClose: () => void;
  align?: "left" | "right";
};

export function Dropdown({ trigger, options, isOpen, onClose, align = "right" }: DropdownProps) {
  const variantClasses = {
    default: "text-light hover:bg-surface-600",
    danger: "text-warning hover:bg-surface-600",
    success: "text-success hover:bg-surface-600",
  };

  const alignClasses = {
    left: "left-0",
    right: "right-[-10px]",
  };

  return (
    <div className="relative">
      {trigger}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className={`absolute ${alignClasses[align]} mt-2 w-40 bg-surface-700 border border-border rounded-lg shadow-xl z-20`}>
            {options.map((option, index) => (
              <button
                key={index}
                onClick={option.onClick}
                className={`w-full text-left px-4 py-2 text-sm transition-colors rounded-lg flex items-center gap-2 ${variantClasses[option.variant || "default"]}`}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
