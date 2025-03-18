import { ANSWER_EMIT, QUESTION_EMIT, QUESTION_EVENT } from "@/util/constant";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface QuestionForm {
  socket?: SocketIOClient.Socket | undefined;
}

export default function QuestionForm({ socket }: QuestionForm) {
  const [question, setQuestion] = useState("");
  const [answers] = useState<string[]>();
  const [qrlink, setQrlink] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    socket?.emit(QUESTION_EVENT, question);
  };

  useEffect(() => {
    const createNewQuestion = ({
      queKey,
    }: {
      question: string;
      queKey: string;
    }) => {
      const link = `http://localhost:3000/answer?questionid=${queKey}`;
      console.log("link:\n", link);

      setQrlink(link);
    };
    const updateAnswerCloud = (allAnswers: string[]) => {
      console.log("updateAnswerCloud.......");

      console.log("allAnswers===>", allAnswers);
      // setAnswers(allAnswers);
    };

    socket?.on(QUESTION_EMIT, createNewQuestion);
    socket?.on(ANSWER_EMIT, updateAnswerCloud);
    return () => {
      socket?.off(QUESTION_EMIT);
      socket?.off(ANSWER_EMIT);
    };
  });

  return (
    <form onSubmit={handleSubmit} className="p-4 border">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter a question"
        className="p-2 border w-full"
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
        Create Question
      </button>
      <ol>
        {answers?.map((word) => (
          <li key={"word" + Math.random()}>{word}</li>
        ))}
      </ol>
      {qrlink && <QRCode size={150} value={qrlink} />}
    </form>
  );
}
