"use client";

import React, { useRef, useState } from "react";
import { RecommendationsList } from "../components/RecommendationsList";
import io, { Socket } from "socket.io-client";
import { SOCKET_IO_URL } from "../components/config";
import { useEffect } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import PromptBox from "../components/userprompts";
import PromptInput from "../components/promptinput";
import { useProjectStore, useToolStore, ProjectState } from "./toolstate";
import { useStytchUser } from "@stytch/nextjs";
import { DeploymentModal } from "../components/DeploymentModal";
import { ToastComponent } from "../components/Toast";
import { ProjectModal } from "../components/ProjectModal";
import { BackendClient } from "../../../axios";
import { LiveCodeEditor } from "../components/LiveCodeEditor";
import { convertCode } from "../actions/actions";
import { TextLoop } from "easy-react-text-loop";
import { loadingWords } from "../components/loadingWords";
import { ToolNavbar } from "../components/ToolNavbar";
import { ArrowRight } from "tabler-icons-react";
import { AppShellMain, AppShellNavbar, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
let socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(SOCKET_IO_URL);

export default function Tool() {
  const {
    loading,
    progressLevel,
    setProgressLevel,
    setLoading,
    setProjectStates,
    projectStates,
    reactCode,
    setReactCode,
    recommendations,
    setRecommendations,
    resetProject,
    setOpenProjectModal,
    setPrompt,
  } = useToolStore();

  const [openedDesignJourney, { toggle: toggleDesignJourney }] =
    useDisclosure();
  const [openedIterations, { toggle: toggleIterations }] = useDisclosure();
  const [openSaveProject, { toggle: toggleSaveProject }] = useDisclosure();
  const [openShareProject, { toggle: toggleShareProject }] = useDisclosure();

  const { projectId, setProjectId, setProjectName, projectName } =
    useProjectStore();

  const { user } = useStytchUser();

  // ref value used to get latest value inside interval callback
  const loadingRef = useRef<boolean>();
  // ref value used to get latest value inside interval callback
  const progressLevelRef = useRef<number>(5);

  const loadingWord =
    loadingWords[Math.floor(Math.random() * loadingWords.length)];

  useEffect(() => {
    socket.on("server_recommendation", onServerRecommendation);
    socket.on("server_code", onServerCode);
    socket.on("project_id", onProjectId);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    createProject();
  }, []);

  // update ref value whenever state gets updated
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // update ref value whenever state gets updated
  useEffect(() => {
    progressLevelRef.current = progressLevel;
  }, [progressLevel]);

  function createProject() {
    BackendClient.post(
      `projects`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    )
      .then((response) => {
        setProjectId(response.data.project.id);
        setProjectName(response.data.project.name);
        refreshProjectStates();
        refreshRecommendations();
      })
      .catch((err) => {
        console.log("Failed to create project");
      });
  }

  async function refreshRecommendations() {
    const response = await BackendClient.get(
      `recommendations?project_id=${projectId}`,
    );
    setRecommendations(response.data.recommendations);
  }

  const onServerRecommendation = () => {
    refreshRecommendations();
  };

  const refreshProjectStates = () => {
    BackendClient.post(
      `projects/project_state`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    ).then((response: any) => {
      const projectStates = response.data.project_states.map((p: any) => {
        const pState: ProjectState = {
          id: p.id,
          reactCode: p.reactCode,
          prompt: p.messages[0] ? p.messages[0].content : null,
        };
        return pState;
      });
      setProjectStates(projectStates);
    });
  };

  const onServerCode = (response: any) => {
    setLoading(false);
    setProgressLevel(5);
    onLoadClick(response);
    refreshProjectStates();
    setPrompt("");
  };

  const onProjectId = (projectId: any) => {
    setProjectId(projectId);
  };

  const onLoadClick = async (reactCode: string | null) => {
    if (reactCode !== null) {
      const convertedCode = await convertCode(reactCode);
      setReactCode(convertedCode);
    }
  };

  async function onResetProject() {
    await BackendClient.post(
      `projects/reset`,
      { project_id: projectId },
      { headers: { "Content-Type": "application/json" } },
    );
    resetProject();
  }

  const handleSend = (prompt: string) => {
    setLoading(true);
    const intervalId = setInterval(() => {
      // use ref values here as state values would not be updated inside callback
      if (loadingRef.current && progressLevelRef.current < 99) {
        setProgressLevel(progressLevelRef.current + 2);
      } else if (!loadingRef.current) clearInterval(intervalId);
    }, 2000);
    socket.emit("user_message", { description: prompt, project_id: projectId });
  };

  return (
    <AppShellMain>
      <div className="flex gap-4 p-4">
        <ToastComponent />
        <DeploymentModal />
        <ProjectModal
          projectId={projectId}
          opened={openSaveProject}
          onClose={toggleSaveProject}
        />

        <AppShellNavbar>
          <Button
            className="mb-2"
            variant="light"
            onClick={toggleDesignJourney}
            rightSection={<ArrowRight size={14} />}
          >
            My Design Journey
          </Button>
          <Button
            variant="light"
            onClick={toggleIterations}
            rightSection={<ArrowRight size={14} />}
          >
            Potential Iterations
          </Button>
        </AppShellNavbar>

        <PromptBox
          user={user}
          opened={openedDesignJourney}
          toggle={toggleDesignJourney}
          onLoadClick={onLoadClick}
          projectStates={projectStates}
        />
        <RecommendationsList
          recommendations={recommendations}
          toggle={toggleIterations}
          opened={openedIterations}
        />
        <div className="flex flex-col gap-8 flex-1 w-80">
          <div className="flex flex-col bg-gray-50 rounded-lg p-3 gap-3">
            <ToolNavbar
              handleProjectClear={onResetProject}
              onSaveClick={toggleSaveProject}
              onShareClick={toggleShareProject}
            />
            <LiveCodeEditor
              code={reactCode}
              css={null}
              cssFramework={"DAISYUI"}
            />
          </div>
          <div className="z-40 w-full flex justify-center origin-bottom">
            <PromptInput
              loading={loading}
              user={user}
              onProjectReset={onResetProject}
              onPromptSubmit={handleSend}
              onProjectSaveClicked={setOpenProjectModal}
            />
          </div>
        </div>

        {/* <div className=" flex w-full justify-between gap-4 pt-10 ">
            <div className="w-[25%] flex-col items-center">
              
            </div>
            <div
              className={`${
                recommendations.length ? "w-[50%]" : "w-[80%]"
              } flex h-full flex-col`}
            >
              <h1 className="mx-auto mb-2 text-xl font-bold">{projectName}</h1>
              {loading ? (
                <div className="flex text-center grow items-center justify-center rounded-md border-2 border-solid border-gray-500">
                  <div className="basis-3/4 relative flex-col flex">
                    <TextLoop>
                      <span>{loadingWord}</span>
                    </TextLoop>
                    <div>
                      <Progress
                        progress={progressLevel}
                        className="bg-slate-700 mt-6"
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[72%] max-w-full grow rounded-md border-2 border-solid border-gray-500 flex">
                  
                </div>
              )}
            </div>
          </div> */}
      </div>
    </AppShellMain>
  );
}
