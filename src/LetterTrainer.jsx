import React, { useState, useEffect } from "react";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export default function LetterTrainer() {
    const [currentLetter, setCurrentLetter] = useState("");
    const [lastLetter, setLastLetter] = useState("");
    const [settings,setSettings] = useState({
        theme: "flat",
        normalMode: {
            showKeyboard: true,
            withSounds: true,
        },
        letterMode: {
            speech: true,
            showLetter: true,
        },
        bannerMode: {
            paragraph: "the quick brown fox jumps over the lazy dog",
            sounds: true,
        },
        memoryTyper: {
            length: 8,
            sounds: true,
            showTime: 3,
        },
    });

    useEffect(() => {
        const settings_ = JSON.parse(localStorage.getItem("typingSettings"));
        if (settings_) {
            setSettings(settings_)
        }
    }, []);

    useEffect(() => {
        pickNewLetter();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (currentLetter && settings.letterMode.speech) {
            speak(currentLetter);
        }
    }, [currentLetter]);

    const pickNewLetter = () => {
        let newLetter;
        do {
            newLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        } while (newLetter === lastLetter);

        setCurrentLetter(newLetter);
        setLastLetter(newLetter);
    };

    const speak = (letter) => {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.8; // slower
        speechSynthesis.speak(utterance);
    };

    const handleKeyPress = (e) => {
        const pressed = e.key.toLowerCase();
        if (pressed === currentLetter) {
            pickNewLetter();
        } else {
            // repeat the letter until correct
            speak(currentLetter);
        }
    };

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress);
        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [currentLetter]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>Letter Typing Trainer</h1>
            <p>Type the letter you hear</p>
            <div style={{ fontSize: "80px", margin: "40px" }}>
                {settings.letterMode.showLetter && currentLetter}
            </div>
            <p>(It will keep repeating until you type it correctly)</p>
        </div>
    );
}
