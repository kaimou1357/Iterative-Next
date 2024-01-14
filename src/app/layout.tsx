import type { Metadata } from "next";
import "./globals.css";
import StytchProvider from "./components/StytchProvider";
import { Work_Sans } from "next/font/google";
import AppNavbar from "./components/navbar";
import "@mantine/core/styles.css";
import PageFooter from "./components/PageFooter";
import { AppShell, ColorSchemeScript, MantineProvider } from "@mantine/core";

const font = Work_Sans({ subsets: ["latin"] });

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
            <AppShell
              withBorder={false}
              header={{ height: 60 }}
              navbar={{ width: 200, breakpoint: "sm" }}
              padding="md"
            >
              <AppNavbar />
              {children}
              <PageFooter />
            </AppShell>
          </MantineProvider>
        </body>
      </html>
    </StytchProvider>
  );
}
