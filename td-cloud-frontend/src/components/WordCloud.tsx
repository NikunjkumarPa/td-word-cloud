import { getWordFrequency } from "@/util/helper";
import React, { forwardRef, useCallback, useMemo } from "react";
import WordCloud from "react-d3-cloud";

type Props = {
  words: string[];
};

const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 150;

export const WordCloudComponent = forwardRef<HTMLDivElement, Props>(
  ({ words }, ref) => {
    const sortedWords = useMemo(
      () =>
        getWordFrequency(words)
          .sort((a, b) => b.value - a.value)
          .slice(0, MAX_WORDS),
      [words]
    );
    const [minOccurences, maxOccurences] = useMemo(() => {
      const min = Math.min(...sortedWords.map((w) => w.value));
      const max = Math.max(...sortedWords.map((w) => w.value));
      return [min, max];
    }, [sortedWords]);

    const calculateFontSize = useCallback(
      (wordOccurrences: number) => {
        if (maxOccurences === minOccurences) {
          return MIN_FONT_SIZE; // Avoid division by zero
        }
        const normalizedValue =
          (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
        return Math.round(
          MIN_FONT_SIZE + normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE)
        );
      },
      [maxOccurences, minOccurences]
    );

    const calculateFontWeight = useCallback(
      (wordOccurrences: number) => {
        if (maxOccurences === minOccurences) {
          return MIN_FONT_WEIGHT; // Avoid division by zero
        }
        const normalizedValue =
          (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
        return Math.round(
          MIN_FONT_WEIGHT +
            normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT)
        );
      },
      [maxOccurences, minOccurences]
    );

    const width = window.innerWidth - 150;
    const height = window.innerHeight / 2;
    return (
      <div ref={ref} className="w-[70vh] h-fit">
        <WordCloud
          width={width}
          height={height}
          font={"Poppins"}
          fontWeight={(word) => calculateFontWeight(word.value)}
          data={sortedWords}
          rotate={0}
          padding={1}
          fontSize={(word) => calculateFontSize(word.value)}
          random={() => 0.5}
        />
      </div>
    );
  }
);

WordCloudComponent.displayName = "WordCloud";
