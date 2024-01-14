import { Footer } from "flowbite-react";

export default function PageFooter() {
  return (
    <Footer container>
      <Footer.Copyright href="/" by="Iterative" year={2024} />
      <Footer.LinkGroup>
        <Footer.Link href="/privacy">Privacy Policy</Footer.Link>
        <Footer.Link href="/terms-of-service">Terms of Service</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}
