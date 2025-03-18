"use client";
import AnswerForm from "@/components/AnswerForm";
import { NextPage } from "next";

const UserView: NextPage = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <AnswerForm />
    </div>
  );
};

export default UserView;
