import React from "react";
import { useState, useRef, useEffect } from "react";

export default function StoryNarrator({ storyContent, storyId, onStatusChange, setHandleCommand }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const utteranceQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const synth = window.speechSynthesis;

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
    console.log(`Posición guardada correctamente: chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
  };

  const loadLastPosition = () => {
    const savedPosition = localStorage.getItem(`story_${storyId}`);
    if (savedPosition) {
      const { chunkIndex, charIndex } = JSON.parse(savedPosition);
      console.log(`Posición cargada correctamente: chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
      setCurrentChunkIndex(chunkIndex);
      setCurrentCharIndex(charIndex);
    }
  };

  const splitText = (text, wordsPerChunk = 15) => {
    return text.split(" ").reduce((chunks, word, index) => {
      if (index % wordsPerChunk === 0) chunks.push([]);
      chunks[chunks.length - 1].push(word);
      return chunks;
    }, []).map(chunk => chunk.join(" "));
  };

  const handleCommand = (command) => {
    if (command === "play") {
      const savedPosition = JSON.parse(localStorage.getItem(`story_${storyId}`)) || { chunkIndex: 0, charIndex: 0 };
      const { chunkIndex, charIndex } = savedPosition;

      if (isPaused || !isPlayingRef.current) {
        console.log("Reanudando historia...");
        setTimeout(() => {
          setIsPaused(false);
          setIsPlaying(true);
          isPlayingRef.current = true;
          if (!utteranceQueueRef.current.length) {
            console.log("🛠️ Regenerando la cola de texto...");
            utteranceQueueRef.current = splitText(storyContent, 15);
          }
          console.log(`Reanudando en chunkIndex=${chunkIndex}, charIndex=${charIndex}`);
          setTimeout(() => {
            readNextChunk(chunkIndex, charIndex);
          }, 700);
        }, 300);
      }
    } else if (command === "pause") {
      console.log(`Pausando historia con ID=${storyId}`);
      synth.cancel();
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(true);
      onStatusChange(false);
    } else if (command === "restart") {
      console.log(`Reiniciando historia desde el principio`);
      synth.cancel();
      setCurrentChunkIndex(0);
      setCurrentCharIndex(0);
      isPlayingRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
      localStorage.removeItem(`story_${storyId}`);
      onStatusChange(false);
      setTimeout(() => handleCommand("play"), 100);
    }
  };

  const readNextChunk = (index, charIndex) => {
    if (!utteranceQueueRef.current.length) {
      console.warn("No hay texto para leer.");
      return;
    }
  
    if (index >= utteranceQueueRef.current.length || !isPlayingRef.current) {
      console.warn("No se puede continuar la narración (fuera de rango o no en reproducción).");
      setIsPlaying(false);
      onStatusChange(false);
      return;
    }
  
    console.log(`Leyendo chunkIndex=${index}, charIndex=${charIndex}`);
    console.log("Texto a leer:", utteranceQueueRef.current[index]);
  
    const textToRead = utteranceQueueRef.current[index].slice(charIndex);
  
    if (!textToRead.trim()) {
      console.warn("El texto a leer está vacío.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "es-ES";
    utterance.rate = 1;
    utterance.pitch = 1;
  
    utterance.onstart = () => console.log("🎙️ Iniciando narración...");
    utterance.onend = () => {
      console.log("Chunk completado.");
      if (isPlayingRef.current && !isPaused) {
        const newChunkIndex = index + 1;
        setCurrentChunkIndex(newChunkIndex);
        setCurrentCharIndex(0);
        savePosition(newChunkIndex, 0);
        readNextChunk(newChunkIndex, 0);
      }
    };
  
    utterance.onerror = (event) => {
      console.error("Error en síntesis:", event.error);
      console.warn("Error detectado, guardando última posición conocida...");
      savePosition(index, charIndex);
      setIsPaused(true); 
      isPlayingRef.current = false;
    };
  
    synth.speak(utterance);
  };
  

  return <></>;
}