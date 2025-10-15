'use client'
import React, { useRef } from "react";

const Home = () => {
  const message = `aloye@aloye-LIFEBOOK-LH531:~/Documents/AFUED-result-processing-package$ git pull origin main
From https://github.com/Ajiboyeadeoye/AFUED-result-processing-package
 * branch            main       -> FETCH_HEAD
Already up to date.
aloye@aloye-LIFEBOOK-LH531:~/Documents/AFUED-result-processing-package$ `;

  const textRef = useRef(null);

  const handleSelect = () => {
    if (textRef.current) {
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    alert("✅ Text selected! Now tap and hold to copy on your phone 💚");
  };

  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: "20px",
        backgroundColor: "#111",
        color: "#0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "text", // ✅ THIS MAKES TEXT SELECTABLE
        WebkitUserSelect: "text",
      }}
    >
      <pre
        ref={textRef}
        style={{
          background: "#000",
          color: "#0f0",
          padding: "15px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          userSelect: "text", // ✅ make sure selection works here too
          WebkitUserSelect: "text",
        }}
      >
        {message}
      </pre>

      <button
        onClick={handleSelect}
        style={{
          marginTop: "15px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          userSelect: "none", // button should stay non-selectable
        }}
      >
        Select Message 📋
      </button>
    </div>
  );
};

export default Home;
