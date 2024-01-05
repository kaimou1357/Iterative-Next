"use client";

import axios from "axios";
import { Button, Flowbite, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../components/config";
import Loading from "../components/loading";
import Link from "next/link";
import { BackendClient } from "../../../axios";
import { ProjectModal } from "../components/ProjectModal";
import { useToolStore } from "../tool/toolstate";

export type Project = {
  id: string;
  name: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { setOpenProjectModal, openProjectModal } = useToolStore();
  // Trigger projects fetching on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await BackendClient.get("projects")
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        console.error("Error Fetching projects");
        setError("Error Fetching projects, please try again");
      });
    setLoading(false);
  };

  const onCreateProjectClick = () => {
    setOpenProjectModal(true);
  };

  const handleDelete = async (project_id: string) => {
    setLoading(true);
    await BackendClient.delete("projects", { data: { project_id } }).then(response => {
      // filter project from frontend if successfully deleted from backend
      const filterProjects = projects?.filter(project => {
        return project.id !== project_id;
      })
      setProjects(filterProjects);
    })
    .catch(error => {
      // set error so it can be displayed on the UI
      setError(error)
    });
    setLoading(false);
  };

  // Show loading spinner while projects are being fetched
  if (loading) return <Loading />;
  // Show error message if error is thrown by server
  if (error)
    return (
      <div className="h-[calc(100vh-10rem)] rounded-lg bg-slate-200 pt-10 dark:bg-slate-900">
        <p aria-label="Error message" className="text-center text-xl">
          {error}
        </p>
      </div>
    );
  // Show projects table if projects are fetched correctly
  else
    return (
      <Flowbite>
        <div className="h-[calc(100vh-10rem)] rounded-lg bg-slate-200 pt-10 dark:bg-slate-900">
          <div className="container mx-auto flex-col max-h-[90%] w-[90%] flex-row gap-10 dark:bg-slate-950 dark:text-white ">
            {openProjectModal ? <ProjectModal projectId={null} /> : null}
            <Button
              className="mb-2 ml-auto"
              color="success"
              onClick={onCreateProjectClick}
            >
              New Project
            </Button>
            <div className="relative w-full overflow-auto ">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Project Name
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Open Project
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Action
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {projects &&
                    projects.length &&
                    projects.map((project: Project) => {
                      return (
                        <Table.Row
                          key={project.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="px-6 py-4">
                            {project.name}
                          </Table.Cell>
                          <Table.Cell className="px-6 py-4 text-blue-600 underline underline-offset-2">
                            <Link href={`/tool/${project.id}`}>
                              Open in Tool
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="px-6 py-4">
                            <Button color="failure" size={'xs'} onClick={() => handleDelete(project.id)}>Delete</Button>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </Flowbite>
    );
}
