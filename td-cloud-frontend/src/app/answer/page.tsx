"use client";
import AnswerForm from "@/components/AnswerForm";
import { NextPage } from "next";
import { Suspense } from "react";

const UserView: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-6 max-w-2xl mx-auto">
        <AnswerForm />
      </div>
    </Suspense>
  );
};

export default UserView;
