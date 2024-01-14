"use client";
import { Modal, Button, TextInput, ModalTitle, ModalHeader, ModalBody } from "@mantine/core";
import { useState } from "react";
import { BackendClient } from "../../../axios";
import { navigatetoProject } from "../actions/actions";

interface ProjectModalProps {
  projectId: string | null;
  opened: boolean;
  onClose: () => void;
}

export const ProjectModal = ({
  projectId,
  opened,
  onClose,
}: ProjectModalProps) => {
  const [projectName, setProjectName] = useState<string>("");

  const handleSaveProject = () => {
    if (projectId === null) {
      BackendClient.post("projects", {
        project_name: projectName,
      }).then((response) => {
        const projectId = response.data.project.id;
        onClose();
        navigatetoProject(projectId);
      });
    } else {
      BackendClient.patch(`projects`, {
        project_id: projectId,
        project_name: projectName,
      }).then((_) => {
        onClose();
      });
    }
  };

  return (
    <>
      <Modal opened={opened} size="md" onClose={onClose}>
      <ModalHeader>
          <ModalTitle>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Create your project
            </h3>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
        <div className="flex flex-col gap-2">
          <TextInput
            label="Project Name"
            placeholder="My First Project"
            value={projectName}
            onChange={(event) => {
              setProjectName(event.target.value);
            }}
          />
          <Button className="mt-2" onClick={handleSaveProject}>Create Project</Button>
        </div>
        </ModalBody>
      </Modal>
    </>
  );
};
