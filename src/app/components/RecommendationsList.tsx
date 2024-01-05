"use client";
import { Accordion } from "flowbite-react";
import { useState } from "react";

interface ChatProps {
  recommendations: Recommendation[];
}

export const RecommendationsList = ({ recommendations }: ChatProps) => {
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  return (
    <>
      <div className="relative w-full max-h-full max-h-[80%] flex flex-col justify-center items-center">
        <button id="dropdownDefaultButton" onClick={() => setShowRecommendations(prev=>!prev)} data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
          Potential Iterations
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{recommendations.length}</div>
          <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
        </button>

        <div id="dropdown" className={`z-10 ${!showRecommendations && 'hidden'} absolute top-12 right-0 bg-white w-[20vw] divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}>
          <span className="text-xs font-light text-center">Based on your vision, here are actionable insights to refine your prototype:</span>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <Accordion className="max-h-[70vh] overflow-y-auto min-w-[50%] pb-2">
              {recommendations.map((r, idx) => (
                <Accordion.Panel>
                    <div key={r.id}>
                      <Accordion.Title className="dark:text-gray-200">
                        Recommendation #{idx + 1}
                      </Accordion.Title>
                      <Accordion.Content>
                        <p className="mb-2 max-h-[100px] overflow-y-auto text-black sm:max-h-[200px] xl:max-h-[100px] dark:text-gray-400">
                          {r.description}
                        </p>
                      </Accordion.Content>
                    </div>
                </Accordion.Panel>
              ))}
            </Accordion>
          </ul>
        </div>
      </div>
    </>
  );
};
