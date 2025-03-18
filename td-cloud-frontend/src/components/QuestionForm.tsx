"use client";

import { ANSWER_EMIT, QUESTION_EMIT, QUESTION_EVENT } from "@/util/constant";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface QuestionForm {
  socket?: any; // Changed from SocketIOClient.Socket for compatibility
}

export default function QuestionForm({ socket }: QuestionForm) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [qrlink, setQrlink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setIsLoading(true);
    socket?.emit(QUESTION_EVENT, question);
  };

  useEffect(() => {
    const createNewQuestion = ({
      queKey,
      question: questionText,
    }: {
      question: string;
      queKey: string;
    }) => {
      const link = `http://localhost:3000/answer?questionid=${queKey}`;
      console.log("link:\n", link);
      setQrlink(link);
      setIsLoading(false);

      const interval = setInterval(async () => {
        try {
          const response = await fetch("http://localhost:3000/getAnswers");
          const data = await response.json();
          setAnswers(data);
        } catch (error) {
          console.error("Error fetching answers:", error);
        }
      }, 5000);

      // Clear interval on component unmount
      return () => clearInterval(interval);
    };

    const updateAnswerCloud = (allAnswers: string[]) => {
      console.log("Answers updated:", allAnswers);
      setAnswers(allAnswers);
    };

    socket?.on(QUESTION_EMIT, createNewQuestion);
    socket?.on(ANSWER_EMIT, updateAnswerCloud);

    return () => {
      socket?.off(QUESTION_EMIT);
      socket?.off(ANSWER_EMIT);
    };
  }, [socket]);

  console.log("====================================");
  console.log(answers);
  console.log("====================================");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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

        <h1 className="text-3xl font-bold mb-6">Create a Question</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                maxLength={100}
                className="w-full p-6 bg-gray-100 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-4 top-6 text-gray-500">100</span>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading || !question}
              className={`text-white text-xl py-3 px-12 rounded-full transition-colors ${
                isLoading || !question
                  ? "bg-gray-400"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {isLoading ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>

        {qrlink && (
          <div className="mt-8 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Scan to Answer</h2>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <QRCode size={200} value={qrlink} />
            </div>
            <p className="mt-4 text-sm text-gray-600 break-all text-center">
              {qrlink}
            </p>
          </div>
        )}

        {answers && answers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Answers</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {answers.map((answer, index) => (
                  <li
                    key={`answer-${index}`}
                    className="p-3 bg-white border border-gray-200 rounded-md shadow-sm"
                  >
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
