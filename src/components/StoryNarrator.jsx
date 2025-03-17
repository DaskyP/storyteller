import { useState, useRef, useEffect } from "react";

export default function StoryNarrator({ storyContent, storyId, onStatusChange, setHandleCommand }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const utteranceQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const synth = window.speechSynthesis;
  let utterance;

  useEffect(() => {
    console.log(`Registrando controlador en StoryNarrator para ID: ${storyId}`);
    setHandleCommand(() => handleCommand);
    loadLastPosition();
  }, []);

  useEffect(() => {
    savePosition(currentChunkIndex, currentCharIndex);
  }, [currentChunkIndex, currentCharIndex]);

  const savePosition = (chunkIndex, charIndex) => {
    localStorage.setItem(`story_${storyId}`, JSON.stringify({ chunkIndex, charIndex }));
    console.log(`📌 Posición guardada correctamente: chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
  };

  const loadLastPosition = () => {
    const savedPosition = localStorage.getItem(`story_${storyId}`);
    if (savedPosition) {
      const { chunkIndex, charIndex } = JSON.parse(savedPosition);
      console.log(`✅ Posición cargada correctamente: chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
      setCurrentChunkIndex(chunkIndex);
      setCurrentCharIndex(charIndex);
    }
  };

  const splitText = (text, wordsPerChunk = 15) => {
    const words = text.split(" ");
    let chunks = [];
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
    return chunks;
  };

  const speakText = (chunks, startIndex, charIndex = 0) => {
    utteranceQueueRef.current = chunks;
    isPlayingRef.current = true;
    setIsPaused(false);
    readNextChunk(startIndex, charIndex);
  };

  const readNextChunk = (index, charIndex) => {
    if (index < utteranceQueueRef.current.length && isPlayingRef.current) {
      const textToRead = utteranceQueueRef.current[index].slice(charIndex);

      utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (isPlayingRef.current && !isPaused) {
          const newChunkIndex = index + 1;
          setCurrentChunkIndex(newChunkIndex); // 🔥 Guardamos el nuevo índice
          setCurrentCharIndex(0);
          savePosition(newChunkIndex, 0); 
          readNextChunk(newChunkIndex, 0); 
        }
      };

      utterance.onboundary = (event) => {
        setCurrentCharIndex(event.charIndex);
      };

      synth.speak(utterance);
    } else {
      setIsPlaying(false);
      onStatusChange(false);
    }
  };

  const handleCommand = (command) => {
    if (command === "play") {
      const savedPosition = JSON.parse(localStorage.getItem(`story_${storyId}`)) || { chunkIndex: 0, charIndex: 0 };
      const { chunkIndex, charIndex } = savedPosition;

      if (isPaused) {
        console.log(`▶️ Reanudando desde chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
        synth.cancel();
        setIsPaused(false);
        speakText(utteranceQueueRef.current, chunkIndex, charIndex);
      } else if (!isPlayingRef.current) {
        console.log(`🎙️ Iniciando desde chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
        synth.cancel();
        const chunks = splitText(storyContent, 15);
        speakText(chunks, chunkIndex, charIndex);
        setIsPlaying(true);
        onStatusChange(true);
      }
    } else if (command === "pause") {
      console.log(`⏸️ Pausando en chunkIndex=${currentChunkIndex}, charIndex=${currentCharIndex}`);
      synth.cancel();
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(true);
      onStatusChange(false);
    } else if (command === "restart") {
      console.log(`🔄 Reiniciando historia`);
      synth.cancel();
      setCurrentChunkIndex(0);
      setCurrentCharIndex(0);
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
      localStorage.removeItem(`story_${storyId}`);
      onStatusChange(false);
    }
  };

  return <></>;
}
