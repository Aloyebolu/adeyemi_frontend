"use client";

import React from "react";
import { NotificationContextProvider } from "@/context/NotificationContext";
import "../globals.css";
import { DialogProvider } from "@/context/DialogContext";
import { TooltipProvider } from "@/components/ui/Tooltip";

/**
 * MAIN SEGMENT LAYOUT
 * 
 * IMPORTANT:
 * The `(main)` segment becomes its own routing tree.
 * Therefore: to make modals work here (e.g. /login overlay), 
 * your @modal folder MUST live inside `(main)`
 * like this:
 *
 * app/
 *   (main)/
 *     layout.tsx       ← this file
 *     page.tsx
 *     @modal/
 *       default.tsx
 *       (.)login/
 *         page.tsx
 *
 * Next.js will inject the modal into this slot:
 *       {modal}
 */

type Props = {
  children: React.ReactNode;
  modal?: React.ReactNode;
};

export default function MainLayout({ children, modal }: Props) {
  return (
    <html
      lang="en"
      name="viewport"
      content="width=device-width, maximum-scale=1.0, users-scalable=no, initial-scale=1.0"
    >
      <body className="select-none">
        <TooltipProvider>
          <DialogProvider>
            <NotificationContextProvider>
              {children}

              {/* 🔥 CRITICAL — This is where intercepted routes render */}
              {modal}
            </NotificationContextProvider>
          </DialogProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
