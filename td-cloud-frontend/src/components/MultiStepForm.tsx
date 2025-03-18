import useSessionStorage from "@/hooks/useSessionStorage";
import { SESSION_IS_MULTISTEP_PROCESS_DONE } from "@/util/constant";
import React, { useState } from "react";

interface MultiStepForm {
  gotoDashboard: () => void;
}

const MultiStepForm = ({ gotoDashboard }: MultiStepForm) => {
  const [step, setStep] = useState(1);
  const [selection1, setSelection1] = useState("");
  const [selection2, setSelection2] = useState("");
  const [selection3, setSelection3] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsMultiStepProcessDone] = useSessionStorage(
    SESSION_IS_MULTISTEP_PROCESS_DONE,
    "false"
  );

  const nextStep = () => {
    setStep(step + 1);
    if (step === 3) {
      setIsMultiStepProcessDone("true");
      gotoDashboard();
    }
  };

  // Check if the current step has a selection made
  const isSelectionMade = () => {
    if (step === 1) return !!selection1;
    if (step === 2) return !!selection2;
    if (step === 3) return !!selection3;
    return true;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        {/* TD Cloud Logo */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-14 h-14 relative">
              <div className="absolute bottom-0 left-0 w-10 h-8 bg-red-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-10 h-12 bg-blue-500 rounded-br-md"></div>
            </div>
            <span className="text-4xl font-bold ml-2">TD Cloud</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {step === 1 && (
            <>
              <h1 className="text-4xl font-normal text-gray-700 mb-2">
                Welcome to TD Cloud
              </h1>
              <h2 className="text-3xl font-normal text-gray-700 mb-6">
                How will you use TD Cloud?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your choice will help us customize your experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                {[
                  "Personal Projects",
                  "Team Collaboration",
                  "Enterprise Solutions",
                  "Educational Institution",
                  "Startup",
                  "Other/Not sure",
                ].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center border ${
                      selection1 === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    } rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors`}
                  >
                    <input
                      type="radio"
                      name="usage"
                      value={option}
                      checked={selection1 === option}
                      onChange={() => setSelection1(option)}
                      className="opacity-0 absolute"
                    />
                    <div className="w-6 h-6 rounded-full border border-gray-300 mr-4 flex items-center justify-center">
                      {selection1 === option ? (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      ) : null}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-4xl font-normal text-gray-700 mb-6">
                What do you want to achieve with TD Cloud?
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Choose the option that best fits your needs
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                {[
                  "Collaborative Presentations",
                  "Real-time Data Visualization",
                  "Interactive Q&A Sessions",
                  "Audience Engagement",
                  "Word Cloud Generation",
                  "Other / I'm not sure",
                ].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center border ${
                      selection2 === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    } rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors`}
                  >
                    <input
                      type="radio"
                      name="purpose"
                      value={option}
                      checked={selection2 === option}
                      onChange={() => setSelection2(option)}
                      className="opacity-0 absolute"
                    />
                    <div className="w-6 h-6 rounded-full border border-gray-300 mr-4 flex items-center justify-center">
                      {selection2 === option ? (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      ) : null}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-4xl font-normal text-gray-700 mb-6">
                What would you like to create first?
              </h1>

              <div className="flex flex-col gap-4 mb-16">
                {[
                  {
                    name: "Word Cloud",
                    description: "Visualize participant responses in real time",
                    icon: "☁️",
                    bgColor: "bg-red-400",
                  },
                  {
                    name: "Quick Poll",
                    description:
                      "Get instant feedback with multiple choice questions",
                    icon: "📊",
                    bgColor: "bg-blue-500",
                  },
                  {
                    name: "Q&A Session",
                    description:
                      "Collect and prioritize questions from your audience",
                    icon: "❓",
                    bgColor: "bg-blue-500",
                  },
                ].map((option) => (
                  <label
                    key={option.name}
                    className={`flex items-center border ${
                      selection3 === option.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    } rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors`}
                  >
                    <input
                      type="radio"
                      name="firstAction"
                      value={option.name}
                      checked={selection3 === option.name}
                      onChange={() => setSelection3(option.name)}
                      className="opacity-0 absolute"
                    />
                    <div
                      className={`w-12 h-12 rounded-md ${option.bgColor} mr-4 flex items-center justify-center shadow-sm`}
                    >
                      <div className="text-xl text-white">{option.icon}</div>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {option.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-normal text-gray-700 mb-6 text-center">
                You're all set!
              </h1>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Your TD Cloud setup is complete. Let's get started!
              </p>
              <button
                onClick={gotoDashboard}
                className="bg-gray-800 text-white text-xl py-3 px-12 rounded-full hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="flex justify-between mb-2">
            <div className="text-gray-700">Step {step} of 4</div>
            <div className="text-gray-500">
              {Math.round((step / 4) * 100)}% Complete
            </div>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Continue button */}
        {step < 4 && (
          <div className="flex justify-end mt-8">
            <button
              onClick={nextStep}
              disabled={!isSelectionMade()}
              className={`text-white text-lg py-3 px-12 rounded-full transition-colors ${
                isSelectionMade()
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {step === 3 ? "Finish" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
