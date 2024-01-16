import { Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import { useState } from "react";
import { ArrowIteration, FilePencil } from "tabler-icons-react";
import classes from "./Sidebar.module.css";

interface NavbarLinkProps {
  icon: typeof ArrowIteration | typeof FilePencil;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} />
      </UnstyledButton>
    </Tooltip>
  );
}

interface SidebarProps {
  opened: boolean;
  onDesignJourneyClick: () => void;
  onPotentialIterationClick: () => void;
}

export const Sidebar = ({
  opened,
  onDesignJourneyClick,
  onPotentialIterationClick,
}: SidebarProps) => {
  const data = [
    {
      icon: FilePencil,
      label: "Design Journey",
      onClick: onDesignJourneyClick,
    },
    {
      icon: ArrowIteration,
      label: "Potential Iterations",
      onClick: onPotentialIterationClick,
    },
  ];

  const links = data.map((link, index) => (
    <NavbarLink {...link} key={link.label} onClick={link.onClick} />
  ));

  return opened ? (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  ) : null;
};
