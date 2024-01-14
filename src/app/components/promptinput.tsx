"use client";
import { ChangeEvent, useState } from "react";
import { Button, Textarea } from "@mantine/core";
import { useToolStore } from "../tool/toolstate";

interface PromptInputProps {
  user: any;
  onPromptSubmit: (prompt: string) => void;
  onProjectReset: () => void;
  onProjectSaveClicked: (openModal: boolean) => void;
  loading: boolean;
}

const PromptInput = ({
  user,
  onProjectReset,
  onPromptSubmit,
  onProjectSaveClicked,
  loading,
}: PromptInputProps) => {
  const { prompt, setPrompt } = useToolStore();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPrompt(event.currentTarget.value);
  };

  const handleSaveProject = () => {
    if (!user) {
      setShowLoginModal(true);
    } else onProjectSaveClicked(true);
  };

  const onPromptInputSubmit = () => {
    onPromptSubmit(prompt);
  };

  const onSuccessfulLogin = () => {
    setShowLoginModal(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-2 max-w-[500px]">
      <Textarea
        className="w-full"
        id="prompt"
        placeholder="Build me a coffee order management system"
        radius="xl"
        autosize
        onChange={onChange}
        value={prompt}
        disabled={loading}
        readOnly={loading}
      />
      <Button fullWidth variant="filled">
        Build!
      </Button>
    </div>
  );
};

export default PromptInput;
