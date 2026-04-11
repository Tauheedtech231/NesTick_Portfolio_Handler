
import type { Metadata } from "next";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './globals.css'
 // Client wrapper



export const metadata: Metadata = {
  title: "College Portfolio Handler Portal",
  description: "Centralized portal for managing college portfolio content",
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


        {children}
      
      </body>
    </html>
  );
}
