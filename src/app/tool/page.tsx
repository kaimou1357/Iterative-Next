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
import { AppShellMain, AppShellNavbar, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Sidebar } from "../components/Sidebar";
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
    setPrompt,
    activeProjectState,
    setActiveProjectState,
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

  useEffect(() => {
    const convertCodeFromServer = async () => {
      if (activeProjectState !== null) {
        const code = activeProjectState.reactCode;
        const convertedCode = await convertCode(code);
        setReactCode(convertedCode);
      }
    };

    convertCodeFromServer();

    return () => {};
  }, [activeProjectState]);

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
    ).then(async (response: any) => {
      const projectStates = response.data.project_states.map((p: any) => {
        const pState: ProjectState = {
          id: p.id,
          reactCode: p.reactCode,
          prompt: p.messages[0] ? p.messages[0].content : null,
        };
        return pState;
      });
      setProjectStates(projectStates);
      if (projectStates.length > 0) {
        setActiveProjectState(projectStates[projectStates.length - 1]);
      }
    });
  };

  const onServerCode = (response: any) => {
    setLoading(false);
    setProgressLevel(5);
    refreshProjectStates();
    setPrompt("");
  };

  const onProjectId = (projectId: any) => {
    setProjectId(projectId);
  };

  const onLoadClick = async (projectState: ProjectState) => {
    setActiveProjectState(projectState);
    toggleDesignJourney();
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
      <ToastComponent />
      <DeploymentModal opened={openShareProject} onClose={toggleShareProject} />
      <ProjectModal
        projectId={projectId}
        opened={openSaveProject}
        onClose={toggleSaveProject}
      />

      <RecommendationsList
        recommendations={recommendations}
        toggle={toggleIterations}
        opened={openedIterations}
      />

      <PromptBox
        user={user}
        opened={openedDesignJourney}
        toggle={toggleDesignJourney}
        onLoadClick={onLoadClick}
        projectStates={projectStates}
      />

      <AppShellNavbar>
        <Sidebar
          opened={activeProjectState !== null}
          onDesignJourneyClick={toggleDesignJourney}
          onPotentialIterationClick={toggleIterations}
        />
      </AppShellNavbar>
      <div className="flex flex-col gap-4 p-4 h-[80vh]">
        <div className="flex flex-col gap-8 grow items-center justify-center">
          {activeProjectState ? (
            <div className="flex flex-col grow w-full bg-gray-50 rounded-lg p-3 gap-3">
              <ToolNavbar
                handleProjectClear={onResetProject}
                onSaveClick={toggleSaveProject}
                onShareClick={toggleShareProject}
                prompt={activeProjectState.prompt}
              />
              <LiveCodeEditor code={reactCode} />
            </div>
          ) : null}

          <div className="z-40 w-full flex justify-center origin-bottom">
            <PromptInput
              loading={loading}
              user={user}
              onProjectReset={onResetProject}
              onPromptSubmit={handleSend}
            />
          </div>
        </div>
      </div>
    </AppShellMain>
  );
}
