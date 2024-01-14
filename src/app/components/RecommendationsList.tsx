"use client";
import { Accordion, Button } from "flowbite-react";
import { useToolStore } from "../tool/toolstate";

interface ChatProps {
  recommendations: Recommendation[];
}

export const RecommendationsList = ({ recommendations }: ChatProps) => {
  const { showRecommendations, setShowRecommendations, setPrompt } =
    useToolStore();

  return (
    <>
      <div className="relative w-full max-h-full max-h-[80%] flex flex-col justify-center items-center">
        <button
          id="dropdownDefaultButton"
          onClick={() => setShowRecommendations(!showRecommendations)}
          data-dropdown-toggle="dropdown"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          <span className="mr-2">Potential Iterations</span>
          <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {recommendations.length}
          </div>
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          id="dropdown"
          className={`z-10 ${
            !showRecommendations && "hidden"
          } absolute top-12 right-0 bg-white w-[20vw] divide-y divide-gray-100 rounded-lg shadow`}
        >
          <span className="text-xs font-light text-center flex justify-self-center p-2">
            Based on your vision, here are actionable insights to refine your
            prototype:
          </span>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <Accordion className="max-h-[70vh] overflow-y-auto min-w-[50%] pb-2 border-none">
              <Accordion.Panel>
                {recommendations.map((r, idx) => (
                  <div key={r.id}>
                    <Accordion.Title className="dark:text-gray-200">
                      Recommendation #{idx + 1}
                    </Accordion.Title>
                    <Accordion.Content>
                      <p className="mb-2 max-h-[100px] overflow-y-auto text-black sm:max-h-[200px] xl:max-h-[100px] dark:text-gray-400">
                        {r.description}
                      </p>
                      <Button
                        color="blue"
                        onClick={() => setPrompt(r.description)}
                      >
                        Copy
                      </Button>
                    </Accordion.Content>
                  </div>
                ))}
              </Accordion.Panel>
            </Accordion>
          </ul>
        </div>
      </div>
    </>
  );
};
