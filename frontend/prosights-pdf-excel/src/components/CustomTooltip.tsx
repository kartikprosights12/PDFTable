import React from "react";
import { PiLinkBreakBold } from "react-icons/pi";

const CustomTooltip = (props: any) => {
  const { link, value = "" } = props; // Retrieve tooltip data

  // Determine what to display for the page
  const displayValue = value === "N/A" ? "" : `Page ${value}`;

  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        color: "#ffffff",
        textAlign: "center",
        padding: "8px 12px",
        borderRadius: "4px",
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        fontFamily: "sans-serif",
        fontSize: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {displayValue && <span>{displayValue}</span>} {/* Conditionally render */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              color: "#ffffff",
              padding: "4px",
            }}
          >
            {<PiLinkBreakBold size={28} />}
          </a>
        )}
      </div>
    </div>
  );
};

export default CustomTooltip;
