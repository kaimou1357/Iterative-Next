"use client";

import axios from "axios";
import { Button, Flowbite, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../components/config";
import { Deployment } from "./types";
import Loading from "../components/loading";
import Link from "next/link";
import { BackendClient } from "../../../axios";

export default function Deployments() {
  const [deployments, setDeployments] = useState<Deployment[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  axios.defaults.withCredentials = true;
  // Trigger deployments fetching on component mount
  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    await BackendClient.get("deployments")
      .then((response) => {
        setDeployments(response.data.deployments);
      })
      .catch((error) => {
        console.error("Error Fetching Deployments");
        setError("Error Fetching Deployments, please try again");
      });
    setLoading(false);
  };

  const handleDelete = async (deployment_id: string) => {
    setLoading(true);
    await BackendClient.delete("deployments", { data: { deployment_id } }).then(response => {
      // Handle the response
      console.log('deleted deployment: ', response)
      // filter deployment from frontend if successfully deleted from backend
      const filterDeployments = deployments?.filter(deployment => {
        return deployment.id !== deployment_id
      });
      setDeployments(filterDeployments);
    })
    .catch(error => {
      // Handle the error
      console.log('error deployment: ', error);
      // set error so it can be displayed on the UI
      setError(error);
    });
    setLoading(false);
  }

  // Show error message if error is thrown by server
  if (error)
    return (
      <div className="h-[calc(100vh-16rem)] rounded-lg bg-slate-200 pt-10 dark:bg-slate-900">
        <p aria-label="Error message" className="text-center text-xl">
          {error}
        </p>
      </div>
    );
  // Show loading spinner while deployments are being fetched
  if (loading) return <Loading />;
  // Show deployments table if deployments are fetched correctly
  else
    return (
      <Flowbite>
        <div className="h-[calc(100vh-10rem)] bg-slate-200 pt-10 dark:bg-slate-900">
          <div className="container mx-auto flex max-h-[90%] w-[90%] flex-row gap-10 bg-white dark:bg-slate-950 dark:text-white ">
            <div className="relative w-full overflow-auto ">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Deployment name
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Passcode
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Access
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                    Action
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {deployments &&
                    deployments.map((deployment: Deployment) => {
                      return (
                        <Table.Row
                          key={deployment.id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="px-6 py-4">
                            {deployment.name}
                          </Table.Cell>
                          <Table.Cell className="px-6 py-4">
                            {deployment.password}
                          </Table.Cell>
                          <Table.Cell className="px-6 py-4 text-blue-600 underline underline-offset-2">
                            <Link target="_blank" href={`/deployments/${deployment.id}`}>
                              Open
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="px-6 py-4">
                            <Button color="failure" size={'xs'} onClick={() => handleDelete(deployment.id)}>Delete</Button>
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
