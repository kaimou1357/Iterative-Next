"use client";
import { Button, Modal, ModalBody, ModalHeader, ModalTitle, TextInput } from "@mantine/core";
import { useDeploymentStore, useToolStore } from "../tool/toolstate";
import { BackendClient } from "../../../axios";

interface DeploymentModalProps {
  opened: boolean;
  onClose: () => void;
}
export const DeploymentModal = ({opened, onClose}: DeploymentModalProps) => {
  const {
    passcode,
    deploymentName,
    setPasscode,
    setDeploymentName,
    projectStateId,
  } = useDeploymentStore();

  const { showToast } = useToolStore();

  const onCloseModal = () => {
    setDeploymentName("");
    setPasscode("");
    onClose();
  };

  const handleCreateDeployment = () => {
    BackendClient.post(`deployments`, {
      project_state_id: projectStateId,
      deployment_name: deploymentName,
      passcode: passcode,
    }).then((_) => {
      onCloseModal();
      showToast("Deployment Created Successfully");
    });
  };

  return (
    <>
      <Modal opened={opened} size="md" onClose={onCloseModal}>
        <ModalHeader>
          <ModalTitle>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create a New Prototype
            </h3>
          </ModalTitle>
        </ModalHeader>
        
        <ModalBody>
            <div className="flex flex-col gap-2">
              <TextInput
                label="Prototype Name"
                placeholder="My First Prototype"
                value={deploymentName}
                onChange={(event) => {
                  setDeploymentName(event.target.value);
                }}
              />
              <TextInput
                label="Password"
                placeholder="123456"
                value={passcode}
                onChange={(event) => {
                  setPasscode(event.target.value);
                }}
              />
              <Button className="mt-2" onClick={handleCreateDeployment}>
                Create Deployment
              </Button>
            </div>
        </ModalBody>
      </Modal>
    </>
  );
};
