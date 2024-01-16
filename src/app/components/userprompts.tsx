"use client";

import { Drawer, Button } from "@mantine/core";

import {
  ProjectState,
  useDeploymentStore,
  useToolStore,
} from "../tool/toolstate";
import { useState } from "react";
import { BackendClient } from "../../../axios";

interface UserPromptsProps {
  user: any;
  opened: boolean;
  toggle: () => void;
  projectStates: ProjectState[];
  onLoadClick: (projectState: ProjectState) => void;
}

const UserPrompts = ({
  user,
  projectStates,
  opened,
  toggle,
  onLoadClick,
}: UserPromptsProps) => {
  const { setProjectStateId, setDeploymentModalOpen } = useDeploymentStore();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const { removePrompt } = useToolStore();

  const onSuccessfulLogin = () => {
    setShowLoginModal(false);
    window.location.reload();
  };

  const onCreateDeploymentClick = (projectStateId: number) => {
    if (!user) setShowLoginModal(true);
    else {
      setProjectStateId(projectStateId);
      setDeploymentModalOpen(true);
    }
  };

  const onRemovePromptClick = (projectStateId: number) => {
    BackendClient.delete("/projects/project_state", {
      data: { project_state_id: projectStateId },
    }).then((_) => {
      removePrompt(projectStateId);
    });
  };

  return (
    <Drawer opened={opened} onClose={toggle} title={"Design Journey"}>
      <Drawer.Body>
        {projectStates.map((p, idx) => (
          <div key={idx} className="flex flex-col">
            <h5
              data-tooltip-target="tooltip_default"
              className="text-1xl text-wrap font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {p.prompt}
            </h5>
            <div className="flex flex-wrap gap-1">
              <Button onClick={() => onLoadClick(p)} variant="filled">
                Load
              </Button>
              <Button
                onClick={() => onCreateDeploymentClick(p.id)}
                variant="filled"
              >
                Create Deployment
              </Button>

              <Button
                onClick={() => onRemovePromptClick(p.id)}
                variant="filled"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </Drawer.Body>
    </Drawer>
  );
};

export default UserPrompts;
