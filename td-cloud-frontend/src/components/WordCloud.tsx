/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const getWordFrequency = (words: string[]) => {
  return words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const WordCloud = ({ wordsArray }: { wordsArray: string[] }) => {
  console.log("wordsArray===>", wordsArray);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const wordFrequency = getWordFrequency(wordsArray);
    const words = Object.keys(wordFrequency).map((word) => ({
      text: word,
      size: wordFrequency[word] * 20, // Size based on frequency
    }));

    const width = 400;
    const height = 250;

    const layout = cloud()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // 50% chance of rotation
      .fontSize((d) => d.size ?? 0)
      .on("end", draw);

    layout.start();

    function draw(words: any) {
      const svg = d3.select(svgRef.current!);
      svg.selectAll("*").remove();

      svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d: any) => `${d.size}px`)
        .style("fill", () => `hsl(${Math.random() * 360}, 100%, 50%)`)
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d: any) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
        )
        .text((d: any) => d.text);
    }
  }, [wordsArray]);

  return <svg ref={svgRef}></svg>;
};

export default WordCloud;

// "use client"; // For Next.js App Router

// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import cloud from "d3-cloud";

// interface WordCloudProps {
//   words: { text: string; value: number }[];
// }

// const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     const width = 500;
//     const height = 300;

//     const layout = cloud()
//       .size([width, height])
//       .words(words.map((d) => ({ text: d.text, size: d.value })))
//       .padding(5)
//       .rotate(() => (Math.random() > 0.5 ? 0 : 90))
//       .fontSize((d) => d?.size ?? 0)
//       .on("end", draw);

//     layout.start();

//     function draw(words: any) {
//       const svg = d3.select(svgRef.current);
//       svg.selectAll("*").remove(); // Clear previous content

//       svg
//         .attr("width", width)
//         .attr("height", height)
//         .append("g")
//         .attr("transform", `translate(${width / 2}, ${height / 2})`)
//         .selectAll("text")
//         .data(words)
//         .enter()
//         .append("text")
//         .style("font-size", (d: any) => `${d.size}px`)
//         .style("fill", () => `hsl(${Math.random() * 360}, 100%, 50%)`)
//         .attr("text-anchor", "middle")
//         .attr(
//           "transform",
//           (d: any) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
//         )
//         .text((d: any) => d.text);
//     }
//   }, [words]);

//   return <svg ref={svgRef}></svg>;
// };

// export default WordCloud;
