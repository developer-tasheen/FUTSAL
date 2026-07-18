"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder: string;
  autoComplete: string;
};

export function PasswordInput({
  id,
  name,
  placeholder,
  autoComplete,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <LockKeyhole
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        size={18}
      />
      <input
        autoComplete={autoComplete}
        className="input input-icon-left input-icon-right"
        id={id}
        name={name}
        placeholder={placeholder}
        required
        type={show ? "text" : "password"}
      />
      <button
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:text-foreground"
        onClick={() => setShow((current) => !current)}
        type="button"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
