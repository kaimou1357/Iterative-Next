import { Anchor, AppShellFooter, Group } from "@mantine/core";
import { Image } from "@mantine/core";

export default function PageFooter() {
  const links = [
    { link: "/privacy", label: "Privacy Policy" },
    { link: "/terms-of-service", label: "Terms of Service" },
  ];

  const items = links.map((link) => (
    <Anchor<"a"> c="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));
  return (
    <AppShellFooter>
      <div className="flex w-full px-4">
        <Group className="ml-auto">{items}</Group>
      </div>
    </AppShellFooter>
  );
}
