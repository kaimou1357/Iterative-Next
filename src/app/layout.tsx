import type { Metadata } from "next";
import "./globals.css";
import StytchProvider from "./components/StytchProvider";
import AppNavbar from "./components/navbar";
import "@mantine/core/styles.css";
import PageFooter from "./components/PageFooter";
import { AppShell, ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Iterative",
  description:
    "Build amazing applications without writing a single line of code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StytchProvider>
      <html lang="en">
        <head>
          <ColorSchemeScript />
        </head>
        <body>
          <MantineProvider>
            <Notifications />
            <LayoutWrapper children={children} />
          </MantineProvider>
        </body>
      </html>
    </StytchProvider>
  );
}
