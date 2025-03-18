"use client";
import MultiStepForm from "@/components/MultiStepForm";
import QuestionForm from "@/components/QuestionForm";
import useSessionStorage from "@/hooks/useSessionStorage";
import { socket } from "@/socket";
import { SESSION_IS_MULTISTEP_PROCESS_DONE } from "@/util/constant";
import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:4001");

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMultiStepProcessDone, _] = useSessionStorage(
    SESSION_IS_MULTISTEP_PROCESS_DONE,
    "false"
  );

  const [dashboardVisible, setDashboardVisible] = useState(
    isMultiStepProcessDone === "true"
  );

  useEffect(() => {
    setDashboardVisible(isMultiStepProcessDone === "true");
  }, [isMultiStepProcessDone]);

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
