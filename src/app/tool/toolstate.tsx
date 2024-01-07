import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Deployment } from "../deployments/types";

interface ToolState {
  loading: boolean;
  prompt: string;
  showRecommendations: boolean;
  progressLevel: number;
  reactCode: string | null;
  recommendations: Recommendation[];
  projectStates: ProjectState[];
  openDeploymentModal: boolean;
  openProjectModal: boolean;
  shouldShowToast: boolean;
  toastMessage: string;

  showToast: (message: string) => void;
  setPrompt: (value: string) => void;
  removeToast: () => void;
  setReactCode: (code: string) => void;
  setLoading: (isLoading: boolean) => void;
  setShowRecommendations: (value: boolean) => void;
  setProgressLevel: (value: number) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setProjectStates: (projectStates: ProjectState[]) => void;
  setOpenDeploymentModal: (openModal: boolean) => void;
  setOpenProjectModal: (openModal: boolean) => void;
  resetProject: () => void;
}

export const useToolStore = create<ToolState>()((set) => ({
  loading: false,
  prompt: "",
  recommendations: [],
  showRecommendations: false,
  progressLevel: 5,
  projectStates: [],
  reactCode: null,
  openDeploymentModal: false,
  openProjectModal: false,
  shouldShowToast: false,
  toastMessage: "",

  showToast: (message) =>
    set(() => ({ shouldShowToast: true, toastMessage: message })),
  resetProject: () =>
    set(() => ({
      prompts: [],
      projectStates: [],
      reactCode: null,
      recommendations: [],
    })),
  setPrompt: (value) => set(() => ({ prompt: value })),
  removeToast: () => set(() => ({ shouldShowToast: false })),
  setOpenDeploymentModal: (openModal: boolean) =>
    set(() => ({ openDeploymentModal: openModal })),
  setOpenProjectModal: (openModal: boolean) =>
    set(() => ({ openProjectModal: openModal })),
  setReactCode: (code) => set(() => ({ reactCode: code })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setShowRecommendations: (value: boolean) => set(() => ({ showRecommendations: value })),
  setProgressLevel: (value: number) => set({ progressLevel: value }),
  setProjectStates: (projectStates: ProjectState[]) =>
    set(() => ({ projectStates: projectStates })),
  setRecommendations: (newRecommendations: Recommendation[]) => {
    set(() => ({
      recommendations: newRecommendations,
    }));
  },
}));

export interface ProjectState {
  reactCode: string | null;
  prompt: string;
  id: number;
}

export type ProjectObj = {
  id: string;
  name: string;
};

interface Project {
  projects: ProjectObj[];
  setProjects: (projects: ProjectObj[]) => void;
  setFilteredProjects: (id: string, projects: ProjectObj[]) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  projectName: string;
  setProjectName: (name: string) => void;
}

interface DeploymentState {
  deployments: Deployment[];
  deploymentName: string;
  passcode: string;
  projectStateId: number | null;
  modalOpen: boolean;

  setDeployments: (deployments: Deployment[]) => void;
  setFilteredDeployments: (id: string, deployments: Deployment[]) => void;
  setDeploymentName: (name: string) => void;
  setPasscode: (passcode: string) => void;
  setProjectStateId: (projectId: number) => void;
  setDeploymentModalOpen: (isOpen: boolean) => void;
}

export const useProjectStore = create<Project>()(
  persist(
    (set, get) => ({
      projects: [],
      projectId: null,
      projectName: "",
      setProjects: (projects) => set({ projects }),
      setFilteredProjects: (id, projects) => set(() => {
        const filterProjects = projects?.filter(project => {
          return project.id !== id;
        })
        return { projects: filterProjects }
      }),
      setProjectId: (id: string | null) => set({ projectId: id }),
      setProjectName: (name: string) => set({ projectName: name }),
    }),
    {
      name: "project-id-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    },
  ),
);

export const useDeploymentStore = create<DeploymentState>()((set) => ({
  deployments: [],
  deploymentName: "",
  passcode: "",
  projectStateId: null,
  modalOpen: false,
  setDeployments: (deployments) => set(() => ({ deployments })),
  setFilteredDeployments: (id, deployments) => set(() => {
    const filteredDeployments =  deployments?.filter(deployment => {
      return deployment.id !== id
    });
    return { deployments: filteredDeployments }
  }),
  setDeploymentName: (deploymentName) =>
    set(() => ({ deploymentName: deploymentName })),
  setPasscode: (passcode) => set(() => ({ passcode: passcode })),
  setProjectStateId: (projectId) => set(() => ({ projectStateId: projectId })),
  setDeploymentModalOpen: (isOpen) => set(() => ({ modalOpen: isOpen })),
}));