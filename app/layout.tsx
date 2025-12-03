"use client";

import "./globals.css";
import { DialogProvider } from "@/context/DialogContext";
import { NotificationContextProvider } from "@/context/NotificationContext";
import { TooltipProvider } from "@/components/ui/Tooltip";

export default function RootLayout({
  children,
  modal, // <-- ADD THIS
}: {
  children: React.ReactNode;
  modal: React.ReactNode; // <-- ADD THIS
}) {
  return (
    <html lang="en">
      <body className="select-none">
        <DialogProvider>
          <NotificationContextProvider>
            <TooltipProvider>
              {children}
              {modal}  {/* <-- THIS IS THE CRITICAL PART */}
            </TooltipProvider>
          </NotificationContextProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
