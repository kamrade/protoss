"use client";

import * as React from "react";
import Link from "next/link";

interface HSSidebarProps {
  children: React.ReactNode;
}

export function HSSidebar({ children }: HSSidebarProps) {
  return (
    <nav className="w-full md:w-64 shrink-0 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="space-y-2">{children}</div>
    </nav>
  );
}

interface HSSidebarSubtitleProps {
  children: React.ReactNode;
}

export function HSSidebarSubtitle({ children }: HSSidebarSubtitleProps) {
  return (
    <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </p>
  );
}

interface HSSidebarItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export function HSSidebarItem({ href, children, active }: HSSidebarItemProps) {
  return (
    <Link
      href={href}
      className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}

interface HSSidebarAccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function HSSidebarAccordion({
  title,
  children,
  defaultOpen = false,
}: HSSidebarAccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-800"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span className="text-xs text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="border-t border-gray-100 px-2 py-2 space-y-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
