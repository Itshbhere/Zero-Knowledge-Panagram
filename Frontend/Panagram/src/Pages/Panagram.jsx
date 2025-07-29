import React, { useState, useEffect } from "react";
import "./Panagram.css";
import Navbar from "../Components/Navbar/Navbar";
import Excalifont from "../Fonts/Excalifont-Regular.woff2";
import gsap from "gsap";

const Panagram = ({
  targetWord = "ORANGE",
  hint = "A color and a fruit",
  letters = ["O", "R", "A", "N", "G", "E", "L"], // 6 for word, 1 distractor
}) => {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [matchedWord, setMatchedWord] = useState("");
  const [message, setMessage] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState([...letters]);

  const titleRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const honeycombRef = React.useRef(null);
  const letterDisplayRef = React.useRef(null);
  const controlsRef = React.useRef(null);

  useEffect(() => {
    gsap.from(titleRef.current, { y: -40, opacity: 0, duration: 0.8, ease: "power2.out", clearProps: "all" });
    gsap.from(hintRef.current, { y: -20, opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out", clearProps: "all" });
    gsap.from(
      honeycombRef.current.querySelectorAll(".hex-btn"),
      {
        scale: 0.5,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        delay: 0.4,
        ease: "back.out(1.7)",
        clearProps: "all"
      }
    );
    gsap.from(letterDisplayRef.current, { opacity: 0, y: 30, duration: 0.7, delay: 0.7, ease: "power2.out", clearProps: "all" });
    gsap.from(controlsRef.current, { opacity: 0, y: 30, duration: 0.7, delay: 0.9, ease: "power2.out", clearProps: "all" });

    // Fallback: ensure all are visible after animation
    setTimeout(() => {
      [titleRef, hintRef, honeycombRef, letterDisplayRef, controlsRef].forEach(ref => {
        if (ref.current) ref.current.style.opacity = 1;
      });
      honeycombRef.current && honeycombRef.current.querySelectorAll('.hex-btn').forEach(btn => btn.style.opacity = 1);
    }, 2000);
  }, []);

  useEffect(() => {
    const word = selectedLetters.join("");
    setMatchedWord(word);

    if (word === targetWord) {
      setMessage("Congratulations! You've spelled the word correctly!");
    } else if (targetWord.startsWith(word)) {
      setMessage("Keep going!");
    } else if (word.length > 0) {
      setMessage(""); // Remove wrong letter message
    } else {
      setMessage("Start selecting letters to spell: " + targetWord);
    }
  }, [selectedLetters, targetWord]);

  const handleLetterClick = (letter) => {
    if (matchedWord.length < targetWord.length) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleShuffle = () => {
    let arr = [...shuffledLetters];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledLetters(arr);
  };

  const handleReset = () => {
    setSelectedLetters([]);
    setMessage("Start selecting letters to spell: " + targetWord);
  };

  const handleBackspace = () => {
    setSelectedLetters(selectedLetters.slice(0, -1));
  };

  return (
    <div>
      <Navbar />
      <div className="panagram-container excalifont">
        <h2 ref={titleRef}>Word Builder</h2>
        <p className="hint" ref={hintRef}>Hint: {hint}</p>
        <div className="honeycomb" ref={honeycombRef}>
          {shuffledLetters.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handleLetterClick(letter)}
              className={`hex-btn${selectedLetters.includes(letter) ? " selected" : ""}`}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="letter-display" ref={letterDisplayRef}>
          {matchedWord.split("").map((letter, index) => (
            <span
              key={index}
              className="letter neutral"
            >
              {letter}
            </span>
          ))}
          {Array(targetWord.length - matchedWord.length)
            .fill("")
            .map((_, index) => (
              <span key={index + matchedWord.length} className="letter empty">
                _
              </span>
            ))}
        </div>
        <p className="message">{message}</p>
        <div className="controls" ref={controlsRef}>
          <button onClick={handleBackspace} className="control-btn backspace">
            Backspace
          </button>
          <button onClick={handleShuffle} className="control-btn shuffle">
            Shuffle
          </button>
          {matchedWord.length === targetWord.length && (
            <button onClick={() => {
              if (matchedWord === targetWord) {
                setMessage("Congratulations! You've spelled the word correctly!");
              } else {
                setMessage("Try again!");
              }
            }} className="control-btn submit">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panagram;
