"use client";
import { socket } from "@/socket";
import {
  ANSWER_EVENT,
  ASK_QUESTION_EVENT,
  QUESTION_ASKED_EMIT,
} from "@/util/constant";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const AnswerForm = () => {
  const questionid = useSearchParams().get("questionid");
  const [question, setQuestion] = useState<string>("");
  const [input1, setInput1] = useState<string>("");
  const [input2, setInput2] = useState<string>("");
  const [input3, setInput3] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Only emit if questionid exists
    if (questionid) {
      console.log("Asking for question with ID:", questionid);
      socket?.emit(ASK_QUESTION_EVENT, questionid);
    }
  }, [questionid]);

  useEffect(() => {
    const handleQuestionAsked = (questionText: string) => {
      console.log("Received question:", questionText);
      setQuestion(questionText);
    };

    socket?.on(QUESTION_ASKED_EMIT, handleQuestionAsked);

    return () => {
      socket?.off(QUESTION_ASKED_EMIT, handleQuestionAsked);
    };
  }, []);

  const handleSubmit = () => {
    if (!input1 && !input2 && !input3) {
      alert("Please enter at least one answer");
      return;
    }

    const answers = [input1, input2, input3].filter(
      (answer) => answer.trim() !== ""
    );

    console.log("Submitting answers:", answers);
    socket?.emit(ANSWER_EVENT, answers, questionid);
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        {/* Logo */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-14 h-14 relative">
              <div className="absolute bottom-0 left-0 w-10 h-8 bg-red-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-10 h-12 bg-blue-500 rounded-br-md"></div>
            </div>
            <span className="text-4xl font-bold ml-2">TD Cloud</span>
          </div>
        </div>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
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
            <h2 className="text-3xl font-bold mb-4">Thank you!</h2>
            <p className="text-lg text-gray-600">
              Your answers have been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Question */}
            <h1 className="text-4xl font-bold mb-8">{question}</h1>
            <div>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter a word"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                    maxLength={25}
                    className="w-full p-6 bg-gray-100 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-6 text-gray-500">
                    {input1.length}/25
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter another word"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    maxLength={25}
                    className="w-full p-6 bg-gray-100 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-6 text-gray-500">
                    {input2.length}/25
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter another word"
                    value={input3}
                    onChange={(e) => setInput3(e.target.value)}
                    maxLength={25}
                    className="w-full p-6 bg-gray-100 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-6 text-gray-500">
                    {input3.length}/25
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmit}
                  className="bg-gray-800 text-white text-xl py-3 px-12 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerForm;
