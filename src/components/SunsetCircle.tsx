"use client";

interface SunsetCircleProps {
  stops: { top: string; mid: string; bottom: string };
  isLoaded: boolean;
}

export function SunsetCircle({ stops, isLoaded }: SunsetCircleProps) {
  return (
    <div
      className="w-[min(920px,85vw)] h-[min(920px,85vw)] max-sm:w-[min(647px,95vw)] max-sm:h-[min(647px,95vw)] relative"
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "scale(1)" : "scale(0.92)",
        filter: isLoaded ? "blur(0px)" : "blur(18px)",
        transition:
          "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 1400ms cubic-bezier(0.22, 1, 0.36, 1), filter 1400ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform, opacity, filter",
      }}
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 920 920"
      >
        <g filter="url(#filter0_noise)">
          <circle cx="460" cy="460" r="460" fill="url(#paint0_linear)" />
        </g>
        <defs>
          <filter
            id="filter0_noise"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            x="0" y="0" width="920" height="920"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="4 4"
              numOctaves={3}
              seed={7255}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
            <feComponentTransfer in="alphaNoise" result="coloredNoise">
              <feFuncA
                type="discrete"
                tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
              />
            </feComponentTransfer>
            <feComposite in="coloredNoise" in2="shape" operator="in" result="noiseClipped" />
            <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="colorFlood" />
            <feComposite in="colorFlood" in2="noiseClipped" operator="in" result="colorLayer" />
            <feMerge>
              <feMergeNode in="shape" />
              <feMergeNode in="colorLayer" />
            </feMerge>
          </filter>
          <linearGradient
            id="paint0_linear"
            gradientUnits="userSpaceOnUse"
            x1="460" x2="460" y1="0" y2="920"
          >
            <stop stopColor={stops.top} />
            <stop offset="0.5" stopColor={stops.mid} />
            <stop offset="1" stopColor={stops.bottom} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
