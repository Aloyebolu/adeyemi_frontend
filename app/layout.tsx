'use client';

import "./globals.css";
import { NotificationContextProvider } from "@/context/NotificationContext";
import { DialogProvider } from "@/context/DialogContext";
import { TooltipProvider } from "@/components/ui/Tooltip";
import DevToolsOverlay from "@/components/dev-tools/DevToolsOverlay";
import { Toaster } from "sonner";
import '@/components/print/print.css'


export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="select-none">
        <TooltipProvider>
          <DialogProvider>
            <NotificationContextProvider>


              {/* MAIN APP CONTENT */}
              <DevToolsOverlay />
              {children}

              {/* 🔥 THIS IS WHERE THE MODAL WILL APPEAR */}
              {modal}

            </NotificationContextProvider>
          </DialogProvider>
        </TooltipProvider>

      </body>
    </html>
  );
}
