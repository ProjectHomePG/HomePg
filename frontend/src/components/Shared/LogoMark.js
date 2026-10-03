"use client";

import { useId } from "react";

export default function LogoMark({ className = "w-6 h-6" }) {
  const id = useId();
  const gradientId = `livio-mark-${id.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="4"
          y1="2"
          x2="60"
          y2="62"
        >
          <stop offset="0" stopColor="#fb7185" />
          <stop offset="0.5" stopColor="#f43f5e" />
          <stop offset="1" stopColor="#be123c" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${gradientId})`} />
      <path d="M32 11 59 35 H5 Z" fill="#ffffff" />
      <rect x="16" y="33" width="32" height="20" rx="3" fill="#ffffff" />
      <rect x="20.5" y="37.5" width="6" height="6" rx="1.2" fill={`url(#${gradientId})`} />
      <rect x="37.5" y="37.5" width="6" height="6" rx="1.2" fill={`url(#${gradientId})`} />
      <path d="M28 53 v-9 a4 4 0 0 1 8 0 v9 Z" fill={`url(#${gradientId})`} />
    </svg>
  );
}
