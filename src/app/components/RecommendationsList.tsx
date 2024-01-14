"use client";

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Drawer,
} from "@mantine/core";

interface ChatProps {
  recommendations: Recommendation[];
  toggle: () => void;
  opened: boolean;
}

export const RecommendationsList = ({
  recommendations,
  toggle,
  opened,
}: ChatProps) => {
  const items = recommendations.map((item) => (
    <AccordionItem key={item.id} value={item.description}>
      <AccordionControl>{item.name}</AccordionControl>
      <AccordionPanel>{item.description}</AccordionPanel>
    </AccordionItem>
  ));
  return (
    <>
      <Drawer opened={opened} onClose={toggle} title={"Potential Iterations"}>
        <Drawer.Body>
          <Accordion variant="separated">{items}</Accordion>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
