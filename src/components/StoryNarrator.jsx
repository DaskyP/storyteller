import { useState, useRef, useEffect } from "react";

export default function StoryNarrator({ storyContent, onStatusChange, setHandleCommand }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const utteranceQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const synth = window.speechSynthesis;
  let utterance;

  useEffect(() => {
    setHandleCommand(() => handleCommand);
  }, []);

  // 🔹 Divide la historia en fragmentos de 15 palabras
  const splitText = (text, wordsPerChunk = 15) => {
    const words = text.split(" ");
    let chunks = [];
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }
    return chunks;
  };

  // 🔹 Inicia o reanuda la narración desde la posición guardada
  const speakText = (chunks, startIndex, charIndex = 0) => {
    utteranceQueueRef.current = chunks;
    isPlayingRef.current = true;
    readNextChunk(startIndex, charIndex);
  };

  // 🔹 Lee fragmentos en orden sin perder la posición
  const readNextChunk = (index, charIndex) => {
    if (index < utteranceQueueRef.current.length && isPlayingRef.current) {
      utterance = new SpeechSynthesisUtterance(utteranceQueueRef.current[index].slice(charIndex));
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (isPlayingRef.current) {
          setCurrentChunkIndex(index + 1);
          setCurrentCharIndex(0);
          readNextChunk(index + 1, 0);
        }
      };

      utterance.onboundary = (event) => {
        setCurrentCharIndex(event.charIndex); // 🔥 Guarda la última posición en el fragmento
      };

      synth.speak(utterance);
    } else {
      setIsPlaying(false);
      onStatusChange(false);
    }
  };

  // 🔹 Maneja los comandos de `PlayButton`
  const handleCommand = (command) => {
    if (command === "play") {
      if (!isPlayingRef.current) {
        synth.cancel(); // 🔥 Cancelar cualquier narración activa antes de iniciar nuevamente
        const chunks = splitText(storyContent, 15);
        speakText(chunks, currentChunkIndex, currentCharIndex); // 🔥 Continúa desde donde quedó
        setIsPlaying(true);
        onStatusChange(true);
      }
    } else if (command === "pause") {
      synth.cancel(); // 🔥 Cancelar en lugar de pausar para permitir reanudar después
      isPlayingRef.current = false;
      setIsPlaying(false);
      onStatusChange(false);
    } else if (command === "restart") {
      synth.cancel();
      setCurrentChunkIndex(0);
      setCurrentCharIndex(0);
      isPlayingRef.current = false;
      setIsPlaying(false);
      onStatusChange(false);
    }
  };

  return <></>;
}
