"use client";

import { useState, useEffect, useRef } from "react";
import AgentChart from "./AgentChart";
import ComputeChart from "./ComputeChart";
import StatsGrid from "./StatsGrid";
import { timelineData } from "../lib/data";

export default function Timeline() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [aiInsight, setAiInsight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([]);
  const [animatedComputeValue, setAnimatedComputeValue] = useState(0);

  const leftContentRef = useRef(null);
  const sectionRefs = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: leftContentRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          setCurrentSectionIndex(index);
          setAiInsight("");
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  useEffect(() => {
    const startData = timelineData[currentSectionIndex];
    const initialStats = startData.stats.map((s) => {
      const num = parseFloat(s.value.replace(/[^0-9.-]+/g, ""));
      return {
        value: s.value,
        label: s.label,
      };
    });
    setAnimatedStats(initialStats);
    setAnimatedComputeValue(startData.computeValue);

    const animateNumbers = () => {
      const duration = 1500;
      const startTime = performance.now();
      const startStats = timelineData[
        currentSectionIndex > 0 ? currentSectionIndex - 1 : 0
      ].stats.map((s) => parseFloat(s.value.replace(/[^0-9.-]+/g, "")));
      const endStats = timelineData[currentSectionIndex].stats.map((s) =>
        parseFloat(s.value.replace(/[^0-9.-]+/g, ""))
      );
      const startCompute =
        timelineData[currentSectionIndex > 0 ? currentSectionIndex - 1 : 0]
          .computeValue;
      const endCompute = timelineData[currentSectionIndex].computeValue;

      const animateStep = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const newStats = timelineData[currentSectionIndex].stats.map((s, i) => {
          const startVal = startStats[i];
          const endVal = endStats[i];
          const interpolatedValue = startVal + (endVal - startVal) * progress;

          const unit = s.value.replace(/[0-9.-]+/g, "");
          let formattedValue = "";
          if (
            s.label === "Approval" ||
            s.label === "Importance" ||
            s.label === "Timeline"
          ) {
            formattedValue = `${Math.round(interpolatedValue)}${unit}`;
          } else if (
            unit.includes("T") ||
            unit.includes("B") ||
            unit.includes("M")
          ) {
            formattedValue = `${interpolatedValue.toFixed(1)}${unit}`;
          } else {
            formattedValue = `${interpolatedValue.toFixed(2)}${unit}`;
          }
          return { value: formattedValue, label: s.label };
        });

        const interpolatedCompute =
          startCompute + (endCompute - startCompute) * progress;
        setAnimatedStats(newStats);
        setAnimatedComputeValue(interpolatedCompute);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateStep);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateStep);
    };

    animateNumbers();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentSectionIndex]);

  const generateInsight = async () => {
    setIsLoading(true);
    setAiInsight("");
    const sectionData = timelineData[currentSectionIndex];

    // Since we don't have an API key, we'll simulate the response
    setTimeout(() => {
      const insights = [
        "The 1950s-1970s marked the dawn of artificial intelligence as a field of study. Pioneers like Alan Turing, John McCarthy, and Marvin Minsky laid the theoretical foundations, fostering optimism about creating thinking machines. Early AI programs could solve algebra problems and prove logical theorems, but limitations in computing power and fundamental understanding soon became apparent.",
        "The first AI winter was a period of reduced funding and interest in artificial intelligence research. Despite early promise, AI systems failed to deliver on ambitious promises, leading to skepticism from funders and the research community. This period saw a significant reduction in AI research funding and a shift toward more practical, limited applications of computational intelligence.",
        "The 1980s witnessed the rise of expert systems, which were AI programs that emulated the decision-making ability of human experts. These systems used knowledge bases of if-then rules to solve complex problems in specific domains like medical diagnosis and chemical analysis. Commercial applications flourished, with corporations deploying expert systems to automate complex decision-making processes.",
        "The 2010s Deep Learning revolution was fueled by three factors: big data, improved algorithms, and powerful GPUs. Breakthroughs in neural network architectures like CNNs and LSTMs enabled machines to surpass human performance in image recognition, speech recognition, and game playing. This period saw AI transition from academic research to mainstream technology adoption.",
        "Generative AI represents the current frontier, with models like GPT and DALL-E demonstrating remarkable ability to create human-like text, images, and even code. These transformer-based models have moved beyond pattern recognition to content creation, raising both excitement about their potential and concerns about ethical implications and societal impact.",
      ];

      setAiInsight(insights[currentSectionIndex]);
      setIsLoading(false);

      // Scroll to insight
      setTimeout(() => {
        const insightBox = document.querySelector(".ai-insight-box");
        if (insightBox) {
          insightBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }, 1500);
  };

  const data = timelineData[currentSectionIndex];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f7f7f7] text-[#1a1a1a] overflow-x-hidden">
      <div
        ref={leftContentRef}
        className="md:w-1/2 p-8 md:p-12 space-y-[100vh] overflow-y-scroll md:h-screen"
      >
        {timelineData.map((section, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            data-index={index}
            className={`scroll-section ${
              index === currentSectionIndex ? "is-active" : ""
            }`}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {section.date}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {section.mainText}
            </p>
          </div>
        ))}
        <div className="h-96"></div>
      </div>

      <div className="md:w-1/2 md:p-12 md:sticky top-0 h-screen flex flex-col justify-start items-center p-8 transition-all duration-300">
        <div className="max-w-xl w-full transition-opacity duration-700 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <span className="mono-font text-2xl font-bold">{data.date}</span>
            <span className="mono-font text-sm text-gray-500">Dec 2024</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold mb-4 text-center mono-font">
            Unreliable Agent
          </h2>

          <div className="h-64 mb-8">
            <AgentChart graphData={data.graphData} />
          </div>

          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg">Hacking</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-lg">Bioweapons</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="text-lg">Coding</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg">Robotics</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2m-4-2H9a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V4z"
                />
              </svg>
              <span className="text-lg">Politics</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0h2m-4 0v-7a2 2 0 012-2h2a2 2 0 012 2v7"
                />
              </svg>
              <span className="text-lg">Forecasting</span>
            </div>
          </div>

          <div className="my-8">
            <p className="text-sm md:text-base text-center">{data.mainText}</p>
          </div>

          <StatsGrid stats={animatedStats} />

          <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mt-8 mono-font">
            <span>Currently Exists</span>
            <span>Emerging Tech</span>
            <span>Science Fiction</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            {data.timelineIcons.map((icon, index) => (
              <span key={index} className="text-2xl md:text-4xl">
                {icon}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={generateInsight}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "✨ Generate AI Insight"}
            </button>
            {aiInsight && (
              <div className="ai-insight-box mt-4">
                <p className="text-sm md:text-base text-gray-800">
                  {aiInsight}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block absolute right-0 bottom-0 p-8 w-64 h-64">
          <h3 className="mono-font font-bold mb-2">Compute</h3>
          <ComputeChart computeValue={animatedComputeValue} />
        </div>
      </div>
    </div>
  );
}
