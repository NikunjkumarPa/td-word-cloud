"use client";

import {
  ANSWER_EMIT,
  MAX_QUESTION_LENGTH,
  QR_LINK,
  QUESTION_EMIT,
  QUESTION_EVENT,
} from "@/util/constant";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { WordCloudComponent } from "./WordCloud";

interface QuestionForm {
  socket?: SocketIOClient.Socket; // Changed from SocketIOClient.Socket for compatibility
}

export default function QuestionForm({ socket }: QuestionForm) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [qrlink, setQrlink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setIsLoading(true);
    socket?.emit(QUESTION_EVENT, question);
  };

  // useEffect(() => {
  //   if (!qrlink) return;
  // const interval = setInterval(async () => {
  //   try {
  //     console.log("qrlink", qrlink);
  //     const endpointAllAnswers =
  //       SERVER_URL + "getAnswers?" + qrlink.split("?")[1];
  //     const response = await fetch(endpointAllAnswers).then((json) =>
  //       json.json()
  //     );
  //     console.log("response===>", response);
  //     // setAnswers(data?.allAnswers);
  //   } catch (error) {
  //     console.error("Error fetching answers:", error);
  //   }
  // }, 5000);
  // return () => clearInterval(interval);
  // }, [qrlink]);

  useEffect(() => {
    const createNewQuestion = ({
      queKey,
    }: {
      question: string;
      queKey: string;
    }) => {
      const link = QR_LINK + queKey;
      console.log("link:\n", link);
      setQrlink(link);
      setIsLoading(false);
    };

    const updateAnswerCloud = (
      allAnswers: string[],
      questionId: string,
      responses: string
    ) => {
      setResponse(responses);
      questionId === qrlink.split("=")[1] && setAnswers(allAnswers);
    };

    socket?.on(QUESTION_EMIT, createNewQuestion);
    socket?.on(ANSWER_EMIT, updateAnswerCloud);

    return () => {
      socket?.off(QUESTION_EMIT);
      socket?.off(ANSWER_EMIT);
    };
  }, [socket, qrlink]);

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
            <span className="text-4xl font-bold text-gray-700 ml-2">
              TD Cloud
            </span>
          </div>
        </div>
        {!qrlink && (
          <h1 className="text-3xl font-bold text-gray-700 mb-6">
            Create a Question
          </h1>
        )}
        {!qrlink ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question"
                  maxLength={MAX_QUESTION_LENGTH}
                  className="w-full p-6 bg-gray-100 rounded-lg text-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <span className="absolute right-4 top-6 text-gray-500">
                  {MAX_QUESTION_LENGTH - question.length}
                </span>
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
        ) : (
          <>
            <h1 className="text-5xl text-blue-600 font-bold">{question}</h1>
            <p className="text-2xl text-gray-400 font-light">{`${response} Response`}</p>
            <div className="mt-8 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Scan to Answer
              </h2>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                <QRCode size={200} value={qrlink} />
              </div>
              <p className="mt-4 text-sm text-gray-600 break-all text-center">
                {qrlink}
              </p>
            </div>
          </>
        )}
        {answers.length && <WordCloudComponent words={answers} />}
      </div>
    </div>
  );
}
