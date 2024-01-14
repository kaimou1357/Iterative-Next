import type { Metadata } from "next";
import "./globals.css";
import StytchProvider from "./components/StytchProvider";
import { Work_Sans } from "next/font/google";
import { CustomProvider} from "rsuite";
import AppNavbar from "./components/navbar";
import 'rsuite/dist/rsuite-no-reset.min.css';
import PageFooter from "./components/PageFooter";

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
        <body>
          <CustomProvider>
            <div className="flex flex-col h-lvh">
              <AppNavbar />
              <div className="grow">
                {children}
              </div>
              <PageFooter />
            </div>
          </CustomProvider>
        </body>
      </html>
    </StytchProvider>
  );
}
