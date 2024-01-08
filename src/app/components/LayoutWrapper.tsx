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
    <div className={`flex flex-col ${pathname === "/tool" ? 'max-h-screen' : 'min-h-screen'}`}>
      <AppNavbar />
      {children}
      {pathname !== "/tool" ? <Footers /> : <div className="mt-auto min-h-20 w-full bg-slate-200 dark:bg-black"></div>}
    </div>
  );
}
