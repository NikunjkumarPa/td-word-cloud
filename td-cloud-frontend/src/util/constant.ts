//Socket: Event and Emitters
export const QUESTION_EVENT = "create_question";
export const QUESTION_EMIT = "question_created";
export const ASK_QUESTION_EVENT = "ask_question";
export const QUESTION_ASKED_EMIT = "question_asked";
export const ANSWER_EVENT = "submit_answer";
export const ANSWER_EMIT = "answer_submited";
export const THUMB_EVENT = "press_thumb";
export const THUMB_EMIT = "thumb_pressed";
export const SESSION_IS_MULTISTEP_PROCESS_DONE = "isMultiStepProcessDone";

export const SERVER_URL = process.env.SERVER_URL ?? "http://172.27.46.71:4001/";
export const QR_LINK = "http://172.27.46.71:3000/answer?questionid=";
