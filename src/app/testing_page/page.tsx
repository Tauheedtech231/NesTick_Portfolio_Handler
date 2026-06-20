"use client";

export default function UniqueDiagram() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-[500px] h-[500px]">
        <svg
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main Circle */}
          <circle
            cx="250"
            cy="250"
            r="230"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dividers */}
          <line
            x1="250"
            y1="20"
            x2="160"
            y2="155"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="160"
            y1="155"
            x2="330"
            y2="210"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="120"
            y1="260"
            x2="210"
            y2="330"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="210"
            y1="330"
            x2="480"
            y2="250"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="160"
            y1="155"
            x2="120"
            y2="260"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="330"
            y1="210"
            x2="480"
            y2="250"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="20"
            y1="310"
            x2="120"
            y2="260"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="210"
            y1="330"
            x2="130"
            y2="465"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          <line
            x1="210"
            y1="330"
            x2="310"
            y2="475"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          {/* Top Left Text */}
          <text
            x="115"
            y="90"
            textAnchor="middle"
            fill="#1e293b"
            fontSize="18"
            transform="rotate(-12 115 90)"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
          >
            <tspan x="115" dy="0">
              Ready to made
            </tspan>
            <tspan x="115" dy="24">
              Portfolio
            </tspan>
          </text>

          {/* Top Right Text */}
          <text
            x="325"
            y="110"
            textAnchor="middle"
            fill="#1e293b"
            fontSize="20"
            transform="rotate(12 325 110)"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
          >
            Multiportal
          </text>

          {/* Center Text */}
          <text
            x="235"
            y="205"
            textAnchor="middle"
            fill="#1e293b"
            fontSize="18"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
          >
            Centraliz
          </text>

          {/* Bottom Left */}
          <text
            x="130"
            y="295"
            fill="#1e293b"
            fontSize="28"
            fontWeight="bold"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
          >
            - -
          </text>

          {/* Bottom Center */}
          <text
            x="180"
            y="430"
            fill="#1e293b"
            fontSize="28"
            fontWeight="bold"
            transform="rotate(-12 180 430)"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
          >
            - -
          </text>

          {/* Bottom Right */}
          <text
            x="305"
            y="400"
            fill="#1e293b"
            fontSize="28"
            fontWeight="bold"
            transform="rotate(12 305 400)"
            style={{ fontFamily: "'Architects Daughter', cursive" }}
          >
            - -
          </text>
        </svg>
      </div>
    </div>
  );
}