import { useState, useRef } from "react";

export function useSpeechNarrator(storyContent, wordsPerChunk = 15) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const utteranceQueueRef = useRef([]);
  const synth = window.speechSynthesis;
  let utterance;

  const splitText = (text, wordsPerChunk) => {
    const words = text.split(" ");
    let chunks = [];
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
    return chunks;
  };

  const speakText = (chunks, startIndex, charIndex = 0) => {
    utteranceQueueRef.current = chunks;
    readNextChunk(startIndex, charIndex);
  };

  // 🔹 Función para leer fragmentos en orden
  const readNextChunk = (index, charIndex) => {
    if (index < utteranceQueueRef.current.length) {
      utterance = new SpeechSynthesisUtterance(utteranceQueueRef.current[index].slice(charIndex));
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (!isPaused) {
          setCurrentChunkIndex(index + 1);
          setCurrentCharIndex(0);
          readNextChunk(index + 1, 0);
        }
      };

      utterance.onboundary = (event) => {
        setCurrentCharIndex(event.charIndex);
      };

      synth.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  // 🔹 Función para iniciar o pausar la narración
  const togglePlay = () => {
    if (isPlaying) {
      synth.cancel(); // Pausar
      setIsPaused(true);
    } else {
      const chunks = splitText(storyContent, wordsPerChunk);
      speakText(chunks, currentChunkIndex, currentCharIndex);
      setIsPaused(false);
    }
    setIsPlaying(!isPlaying);
  };

  const restartStory = () => {
    synth.cancel();
    setCurrentChunkIndex(0);
    setCurrentCharIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
  };

  return { isPlaying, togglePlay, restartStory };
}
