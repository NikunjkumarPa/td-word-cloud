"use client";
import React, { useState } from "react";

const AnswerForm: React.FC = () => {
  const [input1, setInput1] = useState<string>("");
  const [input2, setInput2] = useState<string>("");
  const [input3, setInput3] = useState<string>("");

  const handleSubmit = () => {
    console.log("Submitted values:", { input1, input2, input3 });
    setInput1("");
    setInput2("");
    setInput3("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        {/* Logo */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-14 h-14 relative">
              <div className="absolute bottom-0 left-0 w-10 h-8 bg-red-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-10 h-12 bg-blue-500 rounded-br-md"></div>
            </div>
            <span className="text-4xl font-bold ml-2">Mentimeter</span>
          </div>
        </div>

        {/* Question */}
        <h1 className="text-4xl font-bold mb-8">Why did you Join Tech Data</h1>

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
              <span className="absolute right-4 top-6 text-gray-500">25</span>
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
              <span className="absolute right-4 top-6 text-gray-500">25</span>
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
              <span className="absolute right-4 top-6 text-gray-500">25</span>
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

          <div className="flex justify-center mt-12">
            <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerForm;

// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// export default function AnswerForm() {
//   const [answer, setAnswer] = useState("");
//   const [question, setQuestion] = useState("");
//   const [answers, setAnswers] = useState<string[]>([]);

//   const fetchQuestion = async () => {
//     try {
//       const response = await fetch("http://localhost:4001/api/active-question");
//       const data = await response.json();
//       setQuestion(data.question);
//     } catch (error) {
//       console.error("Error fetching question:", error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch("http://localhost:4001/submit-answer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ answer }),
//     });
//     setAnswer("");
//   };

//   useEffect(() => {
//     fetchQuestion();

//     // Listen for new answers
//     socket.on("answer", (answer) => {
//       setAnswers((prevAnswers) => [...prevAnswers, answer]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border">
//       <input
//         type="text"
//         value={answer}
//         onChange={(e) => setAnswer(e.target.value)}
//         placeholder="Enter your answer"
//         className="p-2 border w-full"
//       />
//       <button type="submit" className="mt-2 p-2 bg-green-500 text-white">
//         Submit Answer
//       </button>
//     </form>
//   );
// }
