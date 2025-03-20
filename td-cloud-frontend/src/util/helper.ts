import { Word } from "./types";

export const serverURL = process.env.SERVER_URL || "https://172.27.46.71:4001";

export const getWordFrequency = (words: string[] = []): Word[] => {
  const wordWithFrequency = words?.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  // return Object.entries(wordWithFrequency).map((word) => ({
  //   text: word,
  //   value: wordWithFrequency[word] * 10, // Size based on frequency
  // }));
  return Object.entries(wordWithFrequency).map(([text, value]) => ({
    text,
    value,
  }));
};
