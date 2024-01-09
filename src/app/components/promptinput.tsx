"use client";
import { ChangeEvent, useState } from "react";
import {
  Button,
  DarkThemeToggle,
  Flowbite,
  Label,
  Modal,
  Spinner,
  Textarea,
} from "flowbite-react";
import Login from "./Login";
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
    setPrompt("");
  };

  const onSuccessfulLogin = () => {
    setShowLoginModal(false);
    window.location.reload();
  };

  return (
    <Flowbite>
      <div>
        <div className="mt-4 block">
          <Label
            htmlFor="prompt"
            className="text-xl font-bold"
            value="Describe your idea in a few words.."
          />
        </div>
        <Textarea
          className="mb-2"
          id="prompt"
          placeholder="Build an app that.."
          required
          rows={4}
          onChange={onChange}
          value={prompt}
          disabled={loading}
          readOnly={loading}
        />
        {loading ? (
          <div>
            <Button>
              <Spinner aria-label="Spinner button example" size="sm" />
              <span className="pl-3">Loading...</span>
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex flex-row gap-1 ">
              <Button onClick={() => onPromptInputSubmit()} size={"sm"}>
                Build
              </Button>

              <Button color="failure" onClick={() => onProjectReset()}>
                Clear Idea
              </Button>

              <Button color="success" onClick={handleSaveProject}>
                Save Progress
              </Button>
            </div>
          </div>
        )}
      </div>
      {showLoginModal && (
        <Modal
          dismissible
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        >
          <Modal.Header>Please login</Modal.Header>
          <Modal.Body className="w-full">
            <div className="flex w-full justify-center">
              <Login onLoginSuccess={onSuccessfulLogin} />
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Flowbite>
  );
};

export default PromptInput;
