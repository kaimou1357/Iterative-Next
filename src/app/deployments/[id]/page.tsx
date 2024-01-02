"use client";

import { useEffect, useState } from "react";
import { Deployment } from "../types";
import { PasscodeModal } from "@/app/components/PasscodeModal";
import { Flowbite } from "flowbite-react";
import { BackendClient } from "../../../../axios";
import { LiveCodeEditor } from "@/app/components/LiveCodeEditor";

export default function DeploymentView({ params }: { params: { id: string } }) {
  const deploymentId = params.id;

  const [loading, setLoading] = useState(false);
  const [deployment, setDeployment] = useState<Deployment | null>(null);

  const [openPasswordCollection, setOpenPasswordCollection] = useState(false);
  const [invalidPasscode, setInvalidPasscode] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    BackendClient.get(`deployments/${deploymentId}`)
      .then((response) => {
        setLoading(false);
        setDeployment(response.data.deployment);
      })
      .catch((error) => {
        setOpenPasswordCollection(true);
        console.error(
          "Unauthenticated Deployment - showing Modal to collect password",
        );
      });
  };

  const verifyPassword = (passcode: string) => {
    BackendClient.get(`deployments/${deploymentId}?passcode=${passcode}`)
      .then((response) => {
        setLoading(false);
        setDeployment(response.data.deployment);
        setOpenPasswordCollection(false);
      })
      .catch((error) => {
        setInvalidPasscode(true);
        setOpenPasswordCollection(true);
        console.error("Passcode validation failed. Re-opening modal");
      });
  };

  return (
    <Flowbite>
      {openPasswordCollection ? (
        <PasscodeModal
          isOpen={openPasswordCollection}
          onPasswordSubmit={verifyPassword}
          invalidPasscode={invalidPasscode}
        />
      ) : null}
      <div className="items stretch h-screen min-h-screen grow rounded-md">
        <LiveCodeEditor
          code={deployment?.react_code}
          css={null}
          cssFramework={"DAISYUI"}
        />
      </div>
    </Flowbite>
  );
}
