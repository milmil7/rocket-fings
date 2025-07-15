import React, { useState, useEffect, useRef } from "react";
// import "./BannerMode.css";

export default function BannerMode() {
    const [text, setText] = useState("the quick brown fox jumps over the lazy dog");
    const [inputIndex, setInputIndex] = useState(0);
    const [mistakes, setMistakes] = useState([]);
    const [position, setPosition] = useState(window.innerWidth);
    const [speed, setSpeed] = useState(2);
    const [dialogMessage, setDialogMessage] = useState(null);

    const typeSound = useRef(null);
    const requestRef = useRef();

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
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [position]);

    const animate = () => {
        if (position + text.length * 24 < 0) {
            setDialogMessage("😢 You failed to finish before it disappeared!");
            reset(false);
        } else {
            setPosition(pos => pos - speed);
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key.length !== 1 && e.key !== "Backspace") return;

        // play typing sound with pitch tied to speed
        if (typeSound.current) {
            typeSound.current.pause();
            typeSound.current.currentTime = 0;
            const baseRate = 0.5 + speed * 0.2;
            const variation = (Math.random() - 0.5) * 0.1; // ±0.05
            typeSound.current.playbackRate = baseRate + variation;
            if (settings.bannerMode.sounds) {
                typeSound.current.play();
            }
        }

        if (e.key === "Backspace") {
            if (inputIndex > 0) {
                setInputIndex(i => i - 1);
            }
            return;
        }

        const currentChar = text[inputIndex];
        if (!currentChar) return;

        if (e.key === currentChar) {
            setMistakes(m => {
                const newMistakes = [...m];
                newMistakes[inputIndex] = false;
                return newMistakes;
            });
        } else {
            setMistakes(m => {
                const newMistakes = [...m];
                newMistakes[inputIndex] = true;
                return newMistakes;
            });
        }

        setInputIndex(i => i + 1);

        if (inputIndex + 1 === text.length) {
            const totalMistakes = mistakes.filter(m => m).length;
            setDialogMessage(`🎉 Done! Total mistakes: ${totalMistakes}`);
            reset(false);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [inputIndex, mistakes, speed]);

    const reset = (fresh = true) => {
        setInputIndex(0);
        setPosition(window.innerWidth);
        setMistakes([]);
        if (fresh) {
            setText(settings.bannerMode.paragraph.split(" ")
                .sort(() => Math.random() - 0.5).join(" "));
        }
    };

    return (
        <div className="banner-container">
            <div className="controls">
                <label>Speed: </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                />
            </div>

            <div
                className="banner-text"
                style={{ transform: `translateX(${position}px)` }}
            >
                {text.split("").map((char, i) => {
                    let className = "";
                    if (i < inputIndex) {
                        className = mistakes[i] ? "incorrect" : "typed";
                    } else if (i === inputIndex) {
                        className = "current";
                    }
                    return (
                        <span key={i} className={className}>
                            {char}
                        </span>
                    );
                })}
            </div>

            <div className="stats">
                <p>Total mistakes: {mistakes.filter(m => m).length}</p>
            </div>

            {dialogMessage && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p>{dialogMessage}</p>
                        <button onClick={() => { setDialogMessage(null); reset(); }}>
                            OK
                        </button>
                    </div>
                </div>
            )}

            <audio ref={typeSound} src="/press.wav" preload="auto"></audio>
        </div>
    );
}
