import type { Metadata } from "next";
import "./globals.css";
import StytchProvider from "./components/StytchProvider";
import { Work_Sans } from "next/font/google";
import { Container, Header, Footer, Content } from "rsuite";
import AppNavbar from "./components/navbar";
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
      <main className={font.className}>
        <Container className="flex flex-col h-screen">
          <Header>
            <AppNavbar />
          </Header>
          <Content className="grow">{children}</Content>
          <Footer>
            <PageFooter />
          </Footer>
        </Container>
      </main>
    </StytchProvider>
  );
}
