"use client";

import { Button, Modal } from "flowbite-react";
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
    <div className="w-full h-full">
      <div className="mb-3 text-xl font-bold text-center">Design Journey</div>
      <ul className="flex max-h-full w-full flex-col gap-4 overflow-y-auto rounded-md ">
        {projectStates.map((p, idx) => (
          <div key={idx} className="flex flex-col">
            <h5 className="text-1xl truncate font-bold tracking-tight text-gray-900 dark:text-white">
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
                // className="my-auto rounded-full bg-purple-700 p-3 text-sm text-white dark:bg-cyan-500 "
              >
                Create Deployment
              </Button>

              <Button
                onClick={() => onRemovePromptClick(p.id)}
                color="failure"
                size={"xs"}
                // className="my-auto rounded-full bg-purple-700 p-3 text-sm text-white dark:bg-cyan-500 "
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </ul>
      {showLoginModal && (
        <Modal
          dismissible
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        >
          <Modal.Header>Please login</Modal.Header>
          <Modal.Body>
            <div className="flex w-full justify-center">
              <Login onLoginSuccess={() => setShowLoginModal(false)} />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default UserPrompts;
