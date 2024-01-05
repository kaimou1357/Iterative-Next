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
import { Flowbite, Progress } from "flowbite-react";
import { DeploymentModal } from "../components/DeploymentModal";
import { ToastComponent } from "../components/Toast";
import { ProjectModal } from "../components/ProjectModal";
import { BackendClient } from "../../../axios";
import { LiveCodeEditor } from "../components/LiveCodeEditor";
import { convertCode } from "../actions/actions";
let socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(SOCKET_IO_URL);

export default function Tool() {
  const {
    loading,
    setLoading,
    setProjectStates,
    projectStates,
    reactCode,
    setReactCode,
    recommendations,
    setRecommendations,
    resetProject,
    setOpenProjectModal,
  } = useToolStore();

  const { projectId, setProjectId, setProjectName, projectName } =
    useProjectStore();

  const { user } = useStytchUser();

  const [progressLevel, setProgressLevel] = useState<number>(5);
  // ref value used to get latest value inside interval callback
  const loadingRef = useRef<boolean>();
  // ref value used to get latest value inside interval callback
  const progressLevelRef = useRef<number>(5);

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
  }, [loading])
  
  // update ref value whenever state gets updated
  useEffect(() => {
    progressLevelRef.current = progressLevel;
  }, [progressLevel])

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
    setProgressLevel(5)
    onLoadClick(response);
    refreshProjectStates();
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
      if(loadingRef.current && progressLevelRef.current<91){
        setProgressLevel(prevProgressLevel => prevProgressLevel+5)
      } else if(!loadingRef.current) clearInterval(intervalId)
    }, 2000)
    socket.emit("user_message", { description: prompt, project_id: projectId });
  };

  return (
    <Flowbite>
      <div className="h-[calc(100vh-62px)] bg-slate-200 dark:bg-slate-900 ">
        <ToastComponent />
        <DeploymentModal />
        <ProjectModal projectId={projectId} />
        <div
          className={`w-[95%] max-w-[95%] 2xl:w-[98%] 2xl:max-w-[98%] max-h-full h-[90%] mx-auto flex flex-row gap-10 dark:text-white `}
        >
          <div className=" flex w-full justify-between gap-4 pt-10 ">
            <div className="w-[25%] flex-col items-center bg-slate-200 dark:bg-slate-900 ">
              <PromptBox
                user={user}
                onLoadClick={onLoadClick}
                projectStates={projectStates}
                authenticated={user !== null}
              />
            </div>
            <div
              className={`${
                recommendations.length ? "w-[50%]" : "w-[80%]"
              } flex h-full flex-col`}
            >
              <h1 className="mx-auto mb-2 text-xl font-bold">{projectName}</h1>
              {loading ? (
                <div className="flex text-center grow items-center justify-center">
                  <div className="flex-col">
                    <Progress
                      progress={progressLevel}
                      progressLabelPosition="inside"
                      textLabel="Generating... Give us a moment."
                      textLabelPosition="outside"
                      size="lg"
                      labelProgress
                      labelText
                    />
                  </div>
                </div>
              ) : (
                <div className="min-h-[72%] max-w-full grow rounded-md border-2 border-solid border-gray-500 flex">
                  <LiveCodeEditor
                    code={reactCode}
                    css={null}
                    cssFramework={"DAISYUI"}
                  />
                </div>
              )}
              <PromptInput
                loading={loading}
                user={user}
                onProjectReset={onResetProject}
                onPromptSubmit={handleSend}
                onProjectSaveClicked={setOpenProjectModal}
              />
            </div>
            {recommendations && recommendations.length ? (
              <div className="w-[15%]">
                <div className="w-full bg-slate-200 text-black dark:bg-slate-900 dark:text-white ">
                  <RecommendationsList recommendations={recommendations} />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Flowbite>
  );
}
