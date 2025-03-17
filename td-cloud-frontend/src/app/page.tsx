"use client";
import MultiStepForm from "@/components/MultiStepForm";
import QuestionForm from "@/components/QuestionForm";
import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4001");

export default function Home() {
  const [dashboardVisible, setDashboardVisible] = useState(false);

  return dashboardVisible ? (
    <QuestionForm socket={socket} />
  ) : (
    <MultiStepForm
      gotoDashboard={() => {
        setTimeout(() => {
          setDashboardVisible(true);
        }, 3000);
      }}
    />
  );
}
