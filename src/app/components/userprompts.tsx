"use client";

import { Button, Modal } from "flowbite-react";
import { Drawer } from "rsuite";
import {
  ProjectState,
  useDeploymentStore,
  useToolStore,
} from "../tool/toolstate";
import { useState } from "react";
import Link from "next/link";
import Login from "./Login";
import { BackendClient } from "../../../axios";

interface UserPromptsProps {
  user: any;
  projectStates: ProjectState[];
  authenticated: boolean;
  onLoadClick: (reactCode: string | null) => void;
}

const UserPrompts = ({
  user,
  projectStates,
  authenticated,
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
    <Drawer placement={"left"} open={true} onClose={() => {}}>
      <Drawer.Header>
        <Drawer.Title>Design Journey</Drawer.Title>
      </Drawer.Header>
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
              <Button
                onClick={() => onLoadClick(p.reactCode)}
                color="success"
                size={"xs"}
              >
                Load
              </Button>
              <Button
                onClick={() => onCreateDeploymentClick(p.id)}
                color="purple"
                size={"xs"}
              >
                Create Deployment
              </Button>

              <Button
                onClick={() => onRemovePromptClick(p.id)}
                color="failure"
                size={"xs"}
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
