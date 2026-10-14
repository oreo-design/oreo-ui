import { useId } from "react";
import { cn } from "@/lib/cn";
import "./knowledge-base.css";

export const FOLDER_TONES = ["violet", "blue", "yellow"] as const;
export type FolderTone = (typeof FOLDER_TONES)[number];

/** Decorative vector artwork. Unique gradient IDs allow any number of folders per page. */
export function FolderArtwork({
  tone = "violet",
  className,
}: {
  tone?: FolderTone;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      viewBox="0 0 320 250"
      aria-hidden="true"
      focusable="false"
      className={cn("kb-folder-art", className)}
      data-tone={tone}
    >
      <defs>
        <linearGradient id={`${id}-back`} x2="0" y2="1">
          <stop stopColor="var(--folder-light)" />
          <stop offset="1" stopColor="var(--folder-deep)" />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2=".15" y2="1">
          <stop stopColor="var(--folder-light)" />
          <stop offset=".5" stopColor="var(--folder-color)" />
          <stop offset="1" stopColor="var(--folder-deep)" />
        </linearGradient>
        <linearGradient id={`${id}-paper`} x2=".5" y2="1">
          <stop stopColor="var(--color-slate-50)" />
          <stop offset="1" stopColor="var(--color-slate-200)" />
        </linearGradient>
        <linearGradient id={`${id}-shine`}>
          <stop stopColor="var(--color-white)" stopOpacity=".35" />
          <stop offset=".1" stopColor="var(--color-white)" stopOpacity="0" />
          <stop offset=".85" stopColor="var(--color-white)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-white)" stopOpacity=".18" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-30%"
          y="-30%"
          width="160%"
          height="180%"
        >
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="10"
            floodColor="var(--folder-deep)"
            floodOpacity=".25"
          />
        </filter>
        <filter
          id={`${id}-paper-shadow`}
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="var(--color-slate-900)"
            floodOpacity=".15"
          />
        </filter>
      </defs>
      <g filter={paint("shadow")}>
        <path
          d="M35 78Q35 60 53 60H116Q125 60 131 67L145 80H268Q285 80 285 99V212H35Z"
          fill={paint("back")}
        />
        {tone === "blue" ? (
          <g filter={paint("paper-shadow")}>
            <rect
              x="63"
              y="86"
              width="62"
              height="88"
              rx="10"
              transform="rotate(-20 94 130)"
              fill="var(--color-indigo-500)"
              stroke="var(--color-white)"
              strokeWidth="4"
            />
            <rect
              x="117"
              y="56"
              width="86"
              height="110"
              rx="15"
              transform="rotate(-5 160 110)"
              fill="var(--color-blue-100)"
              stroke="var(--color-white)"
              strokeWidth="5"
            />
            <text
              x="132"
              y="112"
              fontSize="38"
              fontWeight="600"
              fill="var(--color-blue-900)"
            >
              Aa
            </text>
            <rect
              x="203"
              y="80"
              width="58"
              height="92"
              rx="9"
              transform="rotate(15 230 125)"
              fill="var(--color-amber-300)"
              stroke="var(--color-white)"
              strokeWidth="4"
            />
          </g>
        ) : (
          <g filter={paint("paper-shadow")}>
            {[
              { x: 57, y: 35, r: -13 },
              { x: 164, y: 47, r: 10 },
            ].map(({ x, y, r }) => (
              <g key={x} transform={`translate(${x} ${y}) rotate(${r} 48 60)`}>
                <path
                  d="M8 0H76L108 31V120H0V9Q0 0 8 0Z"
                  fill={paint("paper")}
                  stroke="var(--color-slate-200)"
                />
                <path d="M76 0V24Q76 31 84 31H108" fill="var(--color-white)" />
                {[24, 37, 50].map((y, i) => (
                  <rect
                    key={y}
                    x="15"
                    y={y}
                    width={i === 2 ? 43 : 52}
                    height="5"
                    rx="2.5"
                    fill="var(--color-slate-400)"
                    opacity={0.5 - i * 0.1}
                  />
                ))}
              </g>
            ))}
          </g>
        )}
        <path
          d="M27 145Q27 128 44 128H126Q136 128 145 121L153 117Q160 114 171 114H279Q294 114 294 132L289 227Q288 242 272 242H48Q32 242 31 226Z"
          fill={paint("front")}
          stroke="var(--folder-light)"
          strokeWidth="1.5"
        />
        <path
          d="M27 145Q27 128 44 128H126Q136 128 145 121L153 117Q160 114 171 114H279Q294 114 294 132L289 227Q288 242 272 242H48Q32 242 31 226Z"
          fill={paint("shine")}
        />
        {tone === "blue" && (
          <>
            <text
              x="137"
              y="211"
              fontSize="82"
              fontWeight="500"
              fill="var(--color-white)"
              opacity=".38"
            >
              a
            </text>
            <rect
              x="230"
              y="130"
              width="50"
              height="28"
              rx="14"
              fill="var(--color-white)"
              opacity=".2"
            />
            <text x="242" y="149" fontSize="13" fill="var(--color-white)">
              v2.1
            </text>
          </>
        )}
        {tone === "yellow" && (
          <g
            transform="translate(240 128) rotate(8)"
            filter={paint("paper-shadow")}
          >
            <rect width="53" height="70" rx="4" fill="var(--color-white)" />
            <rect
              x="5"
              y="9"
              width="43"
              height="54"
              fill="var(--color-blue-600)"
            />
            <text
              x="11"
              y="46"
              fontSize="29"
              fontWeight="600"
              fill="var(--color-white)"
            >
              W
            </text>
            <path
              d="M19 15V-9C19-18 31-18 31-9V15C31 22 24 22 24 15V-6"
              stroke="var(--color-slate-400)"
              strokeWidth="3"
              fill="none"
            />
          </g>
        )}
        {tone !== "violet" && (
          <path
            d="M66 218H254M66 227H254"
            stroke="var(--folder-light)"
            opacity=".35"
            strokeWidth="2"
          />
        )}
      </g>
    </svg>
  );
}
