
import type { Metadata } from "next";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './globals.css'
 // Client wrapper

import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
  title: "College Portfolio Handler Portal",
  description: "Centralized portal for managing college portfolio content",
  icons:{
    icon:'/logo.jpg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      
      >
      
        


        <ThemeProvider>
  
          {children}
        </ThemeProvider>
      
      </body>
    </html>
  );
}
