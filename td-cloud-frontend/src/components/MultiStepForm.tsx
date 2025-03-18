import useSessionStorage from "@/hooks/useSessionStorage";
import { SESSION_IS_MULTISTEP_PROCESS_DONE } from "@/util/constant";
import React, { useState } from "react";

interface MultStepForm {
  gotoDashboard: () => void;
}

const MultiStepForm = ({ gotoDashboard }: MultStepForm) => {
  const [step, setStep] = useState(1);
  const [selection1, setSelection1] = useState("");
  const [selection2, setSelection2] = useState("");
  const [selection3, setSelection3] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsMultStepProcessDone] = useSessionStorage(
    SESSION_IS_MULTISTEP_PROCESS_DONE,
    "false"
  );

  const nextStep = () => {
    setStep(step + 1);
    if (step === 3) {
      setIsMultStepProcessDone("true");
      gotoDashboard();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-16 h-12 relative">
            <div className="absolute top-0 left-0 w-6 h-12 bg-black"></div>
            <div className="absolute top-4 left-3 w-10 h-8 bg-blue-500"></div>
            <div className="absolute top-6 left-1 w-6 h-6 rounded-full bg-red-300"></div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {step === 1 && (
            <>
              <h1 className="text-4xl font-normal text-gray-700 mb-2">
                Welcome, Rahul.
              </h1>
              <h2 className="text-4xl font-normal text-gray-700 mb-6">
                Where will you use Mentimeter?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your choice will help us customize your experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                {[
                  "Company",
                  "Educational institution",
                  "Public sector",
                  "Non-profit",
                  "I am a student",
                  "Other/Not sure",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center border border-gray-300 rounded-full px-6 py-4 cursor-pointer hover:bg-gray-50"
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
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
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
                What do you want to achieve with Mentimeter?
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Choose the option that fits you the best
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                {[
                  "Make teaching and training interactive",
                  "Clearly communicate your message",
                  "Collaborate effectively in meetings",
                  "Collect honest feedback",
                  "Other / I'm not sure",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center border border-gray-300 rounded-full px-6 py-4 cursor-pointer hover:bg-gray-50"
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
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
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
                What would you like to do first?
              </h1>

              <div className="flex flex-col gap-4 mb-16">
                {[
                  {
                    name: "Word cloud",
                    description: "Visualize participants' input in real time",
                    icon: "✖",
                    bgColor: "bg-red-300",
                  },
                  {
                    name: "Poll",
                    description: "Let your participants vote on set options",
                    icon: "📊",
                    bgColor: "bg-blue-500",
                  },
                  {
                    name: "Quiz",
                    description:
                      "Test participants with questions that have set correct answers",
                    icon: "❓",
                    bgColor: "bg-red-300",
                  },
                ].map((option) => (
                  <label
                    key={option.name}
                    className={`flex items-center border border-gray-300 rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                      selection3 === option.name ? "bg-gray-50" : ""
                    }`}
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
                      className={`w-10 h-10 rounded-md ${option.bgColor} mr-4 flex items-center justify-center`}
                    >
                      <div className="w-6 h-6 text-white">{option.icon}</div>
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
              <h1 className="text-4xl font-normal text-gray-700 mb-6 text-center">
                Awesome! You finished!
              </h1>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Your Mentimeter setup is complete.
              </p>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="flex items-center mb-2">
            <div className="text-gray-700">Step {step} of 4</div>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full">
            <div
              className="h-1 bg-indigo-600 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Continue button */}
        {step < 4 && (
          <div className="flex justify-end mt-8">
            <button
              onClick={nextStep}
              className="bg-gray-200 text-gray-500 font-medium px-8 py-2 rounded-full hover:bg-gray-300"
            >
              {step === 3 ? "Next" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
