"use client";
import { useState, useEffect } from "react";
import AnswerForm from "@/components/AnswerForm";
import { QuestionResponse } from "@/util/types";

export default function UserView() {
  const [question, setQuestion] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/question")
      .then((res) => res.json())
      .then((data: QuestionResponse) => setQuestion(data.question));

    return () => {};
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">User Panel</h1>
      <h2 className="mt-6 text-lg font-semibold">Current Question:</h2>
      <p>{question || "No question available"}</p>
      <AnswerForm />
    </div>
  );
}
