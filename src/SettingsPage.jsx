import React, { useState, useEffect } from "react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
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
        const stored = localStorage.getItem("typingSettings");
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    const updateSetting = (mode, key, value) => {
        if (mode === "theme") {
            const newSettings = { ...settings, theme: value };
            setSettings(newSettings);
            localStorage.setItem("typingSettings", JSON.stringify(newSettings));
            const theme = value; // fallback if not set
            // console.log(settings);
            // Dynamically load the CSS file
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.id = "style";
            link.href = `./src/${theme.charAt(0).toUpperCase() + theme.slice(1)}.css`; // e.g. ./Brutal.css
            document.head.removeChild(document.getElementById("style"));
            document.head.appendChild(link);

        } else {
            const newSettings = {
                ...settings,
                [mode]: {
                    ...settings[mode],
                    [key]: value
                }
            };
            setSettings(newSettings);
            localStorage.setItem("typingSettings", JSON.stringify(newSettings));
        }
    };

    return (
        <div className="settings-container">
            <h1>⚙️ Settings</h1>

            <div className="mode-settings">
                <h2>Global</h2>
                <label>
                    <span className={"label"}>Theme</span>
                    <select
                        className={"text_input"}
                        value={settings.theme}
                        onChange={(e) => updateSetting("theme", null, e.target.value)}
                    >
                        <option value="flat">Flat</option>
                        <option value="material">Material</option>
                        <option value="morph">Morph</option>
                        <option value="brutal">Brutal</option>
                        <option value="neoBrutal">NeuBrutal</option>
                    </select>
                </label>
            </div>

            <div className="mode-settings">
                <h2>Normal Mode</h2>
                <label>
                    <span className={"label"}>Show Keyboard</span>
                    <input
                        type="checkbox"
                        className={"check_input"}
                        checked={settings.normalMode.showKeyboard}
                        onChange={(e) => updateSetting("normalMode", "showKeyboard", e.target.checked)}
                    />
                </label>
                <label>
                    <span className={"label"}>With Sounds</span>
                    <input
                        type="checkbox"
                        className={"check_input"}
                        checked={settings.normalMode.withSounds}
                        onChange={(e) => updateSetting("normalMode", "withSounds", e.target.checked)}
                    />
                </label>
            </div>

            <div className="mode-settings">
                <h2>Letter Mode</h2>
                <label>
                    <span className={"label"}>Speech</span>
                    <input
                        type="checkbox"
                        className={"check_input"}
                        checked={settings.letterMode.speech}
                        onChange={(e) => updateSetting("letterMode", "speech", e.target.checked)}
                    />
                </label>
                <label>
                    <span className={"label"}>Show Letter</span>
                    <input
                        type="checkbox"
                        className={"check_input"}
                        checked={settings.letterMode.showLetter}
                        onChange={(e) => updateSetting("letterMode", "showLetter", e.target.checked)}
                    />
                </label>
                <p><small>Note: Speech or Show Letter must be on. Both can be on at once.</small></p>
            </div>

            <div className="mode-settings">
                <h2>Banner Mode</h2>
                <label>
                    <span className={"label"}>Paragraph:</span>
                    <input
                        className={"text_input"}
                        type="text"
                        value={settings.bannerMode.paragraph}
                        onChange={(e) => updateSetting("bannerMode", "paragraph", e.target.value)}
                    />
                </label>
                <label>
                    <span className={"label"}>Sounds</span>
                    <input
                        type="checkbox"
                        className={"check_input"}
                        checked={settings.bannerMode.sounds}
                        onChange={(e) => updateSetting("bannerMode", "sounds", e.target.checked)}
                    />
                </label>
            </div>

            <div className="mode-settings">
                <h2>Memory Typer</h2>
                <label>
                    <span className={"label"}>Length of paragraph (words):</span>
                    <input
                        type="number"
                        className={"numb_input"}
                        min="1"
                        value={settings.memoryTyper.length}
                        onChange={(e) => updateSetting("memoryTyper", "length", parseInt(e.target.value))}
                    />
                </label>
                <label>
                    <span className={"label"}>Sounds</span>
                    <input
                        type="checkbox"
                        className={"check_input"}
                        checked={settings.memoryTyper.sounds}
                        onChange={(e) => updateSetting("memoryTyper", "sounds", e.target.checked)}
                    />
                </label>
                <label>
                    <span className={"label"}>Show time (seconds):</span>
                    <input
                        type="number"
                        className={"numb_input"}
                        min="1"
                        value={settings.memoryTyper.showTime}
                        onChange={(e) => updateSetting("memoryTyper", "showTime", parseInt(e.target.value))}
                    />
                </label>
            </div>
        </div>
    );
}
