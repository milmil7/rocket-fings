import React, { useState, useEffect, useRef } from "react";


export default function MemoryTyper() {
    const [text, setText] = useState("");
    const [showText, setShowText] = useState(true);
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);

    const typeSound = useRef(null);
    const timerRef = useRef(null);
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
        startNewRound();
    }, []);

    const startNewRound = async () => {
        const res = await fetch("https://baconipsum.com/api/?type=meat-and-filler&sentences=10");
        const data = await res.json();
        let sentence = data[0].toLowerCase().replace(/[^a-z0-9 .]/g, "");
        let words = sentence.split(" ") // only ~8 words
        words = words.slice(0,settings.memoryTyper.length).join(" ")
        setText(words);
        setShowText(true);
        setInput("");
        setResult(null);

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setShowText(false);
        }, settings.memoryTyper.showTime*1000);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        // play typing sound with slight random pitch
        if (typeSound.current) {
            typeSound.current.pause();
            typeSound.current.currentTime = 0;
            const variation = (Math.random() - 0.5) * 0.2; // ±0.1
            typeSound.current.playbackRate = 0.9 + variation;
            if (settings.memoryTyper.sounds) {
                typeSound.current.play();
            }
        }
    };

    const handleSubmit = () => {
        if (input === text) {
            setResult({ perfect: true });
        } else {
            let lines = [];
            for (let i = 0; i < Math.max(input.length, text.length); i++) {
                const inputChar = input[i] || "";
                const textChar = text[i] || "";
                lines.push({
                    char: textChar,
                    typed: inputChar,
                    correct: inputChar === textChar
                });
            }
            setResult({ perfect: false, lines });
        }
    };

    return (
        <div className="memory-container">
            <h1>🧠 Memory Typer</h1>

            {showText ? (
                <div className="text-to-memorize">
                    {text}
                </div>
            ) : result ? (
                <div className="results">
                    {result.perfect ? (
                        <div className="perfect">
                            🚀 INSANE MEMORY! x3 SCORE
                        </div>
                    ) : (
                        <div className="corrections">
                            <h3>Corrections:</h3>
                            <div className="correction-lines">
                                {result.lines.map((line, i) => (
                                    <span
                                        key={i}
                                        className={
                                            line.correct ? "correct" : "incorrect"
                                        }
                                    >
                                        {line.typed || "_"}
                                    </span>
                                ))}
                            </div>
                            <div style={{marginTop: "10px"}}>
                                <small>(Green=correct, Red=wrong)</small>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="typing-phase">
                    <textarea
                        value={input}
                        onChange={handleChange}
                        rows="3"
                        autoFocus
                        placeholder="Type from memory..."
                    />
                    <button onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            )}

            <div style={{marginTop: "20px"}}>
                <button onClick={startNewRound}>
                    🔄 New Round
                </button>
            </div>

            <audio ref={typeSound} src="/press.wav" preload="auto"></audio>
        </div>
    );
}
