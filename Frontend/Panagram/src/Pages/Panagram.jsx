import React, { useState, useEffect } from "react";
import "./Panagram.css";

const Panagram = ({
  targetWord = "REACT",
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}) => {
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [matchedWord, setMatchedWord] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const word = selectedLetters.join("");
    setMatchedWord(word);

    if (word === targetWord) {
      setMessage("Congratulations! You've spelled the word correctly!");
    } else if (targetWord.startsWith(word)) {
      setMessage("Keep going!");
    } else if (word.length > 0) {
      setMessage("Try a different letter.");
    } else {
      setMessage("Start selecting letters to spell: " + targetWord);
    }
  }, [selectedLetters, targetWord]);

  const handleLetterClick = (letter) => {
    if (matchedWord.length < targetWord.length) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleReset = () => {
    setSelectedLetters([]);
    setMessage("Start selecting letters to spell: " + targetWord);
  };

  const handleBackspace = () => {
    setSelectedLetters(selectedLetters.slice(0, -1));
  };

  return (
    <div className="panagram-container">
      <h2>Word Builder</h2>
      <p className="target-word">Target: {targetWord}</p>

      <div className="letter-display">
        {matchedWord.split("").map((letter, index) => (
          <span
            key={index}
            className={`letter ${
              letter === targetWord[index] ? "correct" : "incorrect"
            }`}
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

      <div className="keyboard">
        {alphabet.split("").map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className="letter-btn"
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="controls">
        <button onClick={handleBackspace} className="control-btn backspace">
          ⌫ Backspace
        </button>
        <button onClick={handleReset} className="control-btn reset">
          ↻ Reset
        </button>
      </div>
    </div>
  );
};

export default Panagram;
