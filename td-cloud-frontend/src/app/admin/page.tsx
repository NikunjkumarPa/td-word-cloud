"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import QuestionForm from "@/components/QuestionForm";
import { QuestionResponse } from "@/util/types";
import { serverURL } from "@/util/helper";

const socket = io(serverURL);

export default function AdminView() {
  const [question, setQuestion] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/question")
      .then((res) => res.json())
      .then((data: QuestionResponse) => {
        setQuestion(data.question);
        setAnswers(data.answers);
      });

    socket.on("newQuestion", (q: string) => setQuestion(q));
    socket.on("newAnswer", (answer: string) =>
      setAnswers((prev) => [...prev, answer])
    );

    return () => {
      socket.off("newQuestion");
      socket.off("newAnswer");
    };
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      <QuestionForm />
      <h2 className="mt-6 text-lg font-semibold">Current Question:</h2>
      <p>{question || "No question set yet"}</p>
      <h2 className="mt-6 text-lg font-semibold">User Answers:</h2>
      <ul>
        {answers.map((a, idx) => (
          <li key={idx} className="mt-2 p-2 border">
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
