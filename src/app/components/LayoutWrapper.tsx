"use client";

import { usePathname } from "next/navigation";
import Footers from "./footer";
import AppNavbar from "./navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      {children}
      {pathname !== "/tool" && <Footers />}
    </div>
  );
}
