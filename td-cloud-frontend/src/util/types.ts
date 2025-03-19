export interface QuestionResponse {
  question: string | null;
  answers: string[];
}

export interface Word {
  [key: string]: any;
  text: string;
  value: number;
}
