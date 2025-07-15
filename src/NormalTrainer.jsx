import React, { useState, useEffect, useRef } from "react";
// import "./App.css";

const KEYBOARD_ROWS = [
    "1234567890",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
    " "
];

export default function NormalTrainer() {
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
    })
    const [dialogMessage, setDialogMessage] = useState(null);
    const [bestWpm, setBestWpm] = useState(0);
    const [textToType, setTextToType] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [finished, setFinished] = useState(false);
    const [difficulty, setDifficulty] = useState("short");
    const [mistakes, setMistakes] = useState(0);
    const [hardcore, setHardcore] = useState(false);
    const correctSound = useRef(null);
    const wrongSound = useRef(null);

    useEffect(() => {
        startNewRound();
    }, [difficulty]);

    useEffect(() => {
        const settings_ = JSON.parse(localStorage.getItem("typingSettings"));
        if (settings_) {
            setSettings(settings_)
        }
    }, []);

    useEffect(() => {
        if (!startTime || finished) return;
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 60000;
            if (elapsed > 0) {
                setWpm((input.length / 5) / elapsed);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [startTime, input, finished]);

    useEffect(() => {
        const savedBest = localStorage.getItem("bestWpm");
        if (savedBest) {
            setBestWpm(parseFloat(savedBest));
        }
    }, []);
    useEffect(() => {
        const correctChars = input
            .split("")
            .filter((c, i) => c === textToType[i]).length;
        if (input.length > 0) {
            setAccuracy((correctChars / input.length) * 100);
        } else {
            setAccuracy(100);
        }
        if (input === textToType) {
            setFinished(true);

            // update best WPM
            if (wpm > bestWpm) {
                setBestWpm(wpm);
                localStorage.setItem("bestWpm", wpm);
            }
        }
    }, [input, textToType]);

    const handleChange = (e) => {
        const value = e.target.value;
        const newChar = value[value.length - 1];
        const correctChar = textToType[value.length - 1];

        if (!startTime) setStartTime(Date.now());
        setInput(value);

        if (newChar !== undefined) {
            if (newChar === correctChar) {
                if (settings.normalMode.withSounds) {
                    correctSound.current.currentTime = 0;
                    correctSound.current.play();
                }
            } else {
                if (settings.normalMode.withSounds) {
                    wrongSound.current.currentTime = 0;
                    wrongSound.current.play();
                }
                setMistakes(m => m + 1);

                if (hardcore) {
                    // alert("❌ Hardcore mode: mistake! Try again from start.");
                    setDialogMessage("❌ Hardcore mode: mistake! Try again from start.");
                    setInput("");
                    setStartTime(null);
                    setWpm(0);
                    setAccuracy(100);
                    setMistakes(0);
                }

            }
        }
    };


    const startNewRound = async () => {
        const numSentences = difficulty === "short" ? 1 : 3;
        const res = await fetch(`https://baconipsum.com/api/?type=meat-and-filler&sentences=${numSentences}`);
        const data = await res.json();
        let sentence = data.join(" ");
        sentence = sentence.toLowerCase().replace(/[^a-z0-9 .]/g, "");
        setTextToType(sentence);
        setInput("");
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setMistakes(0);
        setFinished(false);
    };

    const nextChar = textToType[input.length] || "";

    return (
        <div className="container">
            {dialogMessage && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p>{dialogMessage}</p>
                        <button onClick={() => setDialogMessage(null)}>OK</button>
                    </div>
                </div>
            )}
            <h1>Typing Game</h1>

            <div>
                <label style={{marginRight: "10px"}}>Difficulty:</label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="short">Short</option>
                    <option value="long">Long</option>
                </select>
            </div>

            <div style={{marginTop: "10px"}}>
                <label>
                    <span>Hardcore mode (restart on first mistake)</span>
                    <input
                        style={{width: "20px"}}
                        type="checkbox"
                        checked={hardcore}
                        onChange={() => setHardcore(!hardcore)}
                    />
                </label>
            </div>

            <div
                style={{position: "absolute", top:2,right:14}}
                className={"stats"}>
                <p >WPM: {wpm.toFixed(2)}</p>
                <p >Accuracy: {accuracy.toFixed(2)}%</p>
                <p >Mistakes: {mistakes}</p>
                <p >🏆 Best WPM: {bestWpm.toFixed(2)}</p>
            </div>

            <div className="text-to-type">
                {textToType.split("").map((char, i) => {
                    let className = "";
                    let style = {};
                    if (i < input.length) {
                        if (char === input[i]) {
                            className = "correct";
                        } else {
                            className = "incorrect";
                            if (finished) {
                                style.textDecoration = "underline";
                                style.textDecorationColor = "red";
                            }
                        }
                    }
                    return (
                        <span key={i} className={className} style={style}>
              {char}
            </span>
                    );
                })}
            </div>

            <input
                type="text"
                value={input}
                onChange={handleChange}
                disabled={finished}
                autoFocus
            />

            <div className="keyboard">
                {settings.normalMode.showKeyboard && KEYBOARD_ROWS.map((row, r) => (
                    <div key={r} className="keyboard-row">
                        {row.split("").map((key, k) => {
                            let className = "key";
                            if (key === nextChar) {
                                className += " highlight";
                            } else if (key === " " && nextChar === " ") {
                                className += " highlight";
                            }
                            return (
                                <div key={k} className={className}>
                                    {key === " " ? "␣" : key}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div>
                {finished && (
                    <button onClick={startNewRound}>
                        New Sentence
                    </button>
                )}
            </div>

            <audio ref={correctSound} src="/press.wav" preload="auto"/>
            <audio ref={wrongSound} src="/wrong.wav" preload="auto"/>
        </div>
    );
}
