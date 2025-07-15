
import React, { useState, useEffect, useRef } from "react";
// import "./App.css";
import LetterTrainer from "./LetterTrainer.jsx";
import NormalTrainer from "./NormalTrainer.jsx";
import BannerMode from "./BannerMode.jsx";
import MemoryTyper from "./MemoryTyper.jsx";
import SettingsPage from "./SettingsPage.jsx";
import {Icon} from "@iconify/react";


export default function App() {

    const [mode, setMode] = useState("normal");

    const renderMode = () => {
        switch (mode) {
            case "normal": return <NormalTrainer />;
            case "letter": return <LetterTrainer />;
            case "banner": return <BannerMode />;
            case "memory": return <MemoryTyper />;
            case "settings": return <SettingsPage />;
            default: return <NormalTrainer />;
        }
    };

    return (
        <div>
            {/* Sidebar */}
            <div style={{
                position:"fixed",
                left:0,top:0,height:"100%",
                width: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // paddingTop: "10px",
            }}
                 className={"bg-primary-blue color-neutral-text-dark"}
            >
                <SidebarIcon
                    icon="mdi:keyboard-outline"
                    label="Normal Mode"
                    active={mode === "normal"}
                    onClick={() => setMode("normal")}
                />
                <SidebarIcon
                    icon="mdi:alpha-l-box-outline"
                    label="Letter Mode"
                    active={mode === "letter"}
                    onClick={() => setMode("letter")}
                />
                <SidebarIcon
                    icon="mdi:flag-variant-outline"
                    label="Banner Mode"
                    active={mode === "banner"}
                    onClick={() => setMode("banner")}
                />
                <SidebarIcon
                    icon="mdi:brain"
                    label="Memory Typer"
                    active={mode === "memory"}
                    onClick={() => setMode("memory")}
                />
                <SidebarIcon
                    icon="mdi:cog-outline"
                    label="Settings"
                    active={mode === "settings"}
                    onClick={() => setMode("settings")}
                />
            </div>
        <div style={{ display: "flex", maxHeight: "100vh" }}>

            {/* Content */}
            <div style={{ flex: 1, padding: "20px" }}>
                {renderMode()}
            </div>
        </div>
        </div>
    );
}

function SidebarIcon({ icon, label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            title={label}
            style={{
                opacity: active ? "100%" : "30%",
                fontSize: "28px",
                margin: "20px 0",
                cursor: "pointer",
            }}
        >
            <Icon icon={icon} />
        </div>
    );
}
