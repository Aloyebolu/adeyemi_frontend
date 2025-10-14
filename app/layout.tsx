'use client'
import { NotificationContextProvider } from "@/context/NotificationContext";
import "./globals.css";
import {createContext, useContext, useEffect, useState } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const user = localStorage.getItem('userId')
  // const {user, setUser} = useContext(UserContext)
  
  return (
    <html lang="en" name="viewport" content="width=device-width, maximum-scale=1.0, users-scalable=no, initial-scale=1.0">
      <body className="select-none">
              <NotificationContextProvider>

          {children}
              </NotificationContextProvider>

      </body>
    </html>
  );
}
