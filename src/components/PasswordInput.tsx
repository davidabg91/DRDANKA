"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password field with an eye button that reveals the typed value, so the user
 * can compare it with what they expect (e.g. a browser-autofilled password).
 */
export default function PasswordInput({
  className = "",
  iconClassName = "text-white/50 hover:text-brand-gold",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { iconClassName?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${className} pr-10`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Скрий паролата" : "Покажи паролата"}
        title={visible ? "Скрий паролата" : "Покажи паролата"}
        className={`absolute inset-y-0 right-0 flex items-center px-3 transition-colors cursor-pointer ${iconClassName}`}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
