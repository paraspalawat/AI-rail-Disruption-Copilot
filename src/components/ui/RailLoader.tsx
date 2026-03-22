import React from "react";

const RailLoader: React.FC = () => {
  return (
    <div style={container}>
      <div style={track}>
        <div style={train}>
          <svg
            width="70"
            height="35"
            viewBox="0 0 120 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="20" y="22" width="70" height="22" rx="5" fill="#1e293b" />
            <rect x="60" y="10" width="25" height="16" rx="3" fill="#334155" />
            <rect x="65" y="14" width="10" height="7" rx="2" fill="#93c5fd" />
            <rect x="25" y="12" width="7" height="10" rx="2" fill="#475569" />
            <circle cx="95" cy="33" r="4" fill="#fde047" />
            <circle cx="35" cy="46" r="5" fill="#020617" />
            <circle cx="60" cy="46" r="5" fill="#020617" />
            <circle cx="85" cy="46" r="5" fill="#020617" />
          </svg>
        </div>
      </div>
      <p style={text}>RailWise Guide is loading...</p>
    </div>
  );
};

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f172a",
};

const track: React.CSSProperties = {
  width: "320px",
  height: "20px",
  background: "#94a3b8",
  borderRadius: "10px",
  position: "relative",
  overflow: "hidden",
};

const train: React.CSSProperties = {
  position: "absolute",
  top: "-8px",
  left: 0,
  animation: "moveTrain 2s linear infinite",
};

const text: React.CSSProperties = {
  marginTop: "22px",
  color: "#e5e7eb",
  fontSize: "16px",
};

export default RailLoader;
