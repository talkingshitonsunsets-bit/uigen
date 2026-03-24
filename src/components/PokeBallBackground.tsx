"use client";

export function PokeBallBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden"
    >
      <style>{`
        /* ── Pokéball shake (0 – 1.5 s) ── */
        @keyframes pb-shake {
          0%,10%,90%,100% { transform: rotate(0deg); }
          15%  { transform: rotate(-12deg); }
          20%  { transform: rotate(12deg); }
          25%  { transform: rotate(-9deg); }
          30%  { transform: rotate(9deg); }
          35%  { transform: rotate(-5deg); }
          40%  { transform: rotate(0deg); }
        }

        /* ── Top half opens then vanishes ── */
        @keyframes pb-open {
          0%,38%           { transform: translateY(0px) rotate(0deg); opacity:1; }
          55%              { transform: translateY(-110px) rotate(-50deg); opacity:1; }
          68%,89%          { transform: translateY(-110px) rotate(-50deg); opacity:0; }
          90%,100%         { transform: translateY(0px) rotate(0deg); opacity:1; }
        }

        /* ── Bottom half fades while car is on screen ── */
        @keyframes pb-bottom-fade {
          0%,52%  { opacity:1; }
          60%     { opacity:0; }
          88%     { opacity:0; }
          95%     { opacity:1; }
          100%    { opacity:1; }
        }

        /* ── White core flash ── */
        @keyframes flash-core {
          0%,52%  { transform:scale(0); opacity:0; }
          56%     { transform:scale(1);   opacity:1; }
          64%     { transform:scale(5);   opacity:0; }
          100%    { transform:scale(0);   opacity:0; }
        }

        /* ── Individual light ray ── */
        @keyframes ray-burst {
          0%,53%  { transform:scaleX(0); opacity:0; }
          58%     { transform:scaleX(1);   opacity:1; }
          67%     { transform:scaleX(1.6); opacity:0.6; }
          76%     { transform:scaleX(1.2); opacity:0; }
          100%    { opacity:0; }
        }

        /* ── Countach drives through ── */
        @keyframes countach {
          0%,56%   { transform:translateX(-560px); opacity:0; }
          61%      { opacity:1; }
          80%      { transform:translateX(60px);   opacity:1; }
          88%      { transform:translateX(640px);  opacity:0.5; }
          89%,100% { transform:translateX(-560px); opacity:0; }
        }

        /* ── Wheel spin (continuous while driving) ── */
        @keyframes wspin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }

        /* ── Motion-blur speed lines ── */
        @keyframes sline {
          0%,57%  { opacity:0; transform:translateX(0); }
          62%     { opacity:0.9; }
          82%     { opacity:0.6; transform:translateX(40px); }
          88%     { opacity:0; }
          100%    { opacity:0; }
        }

        .pb-ball   { animation: pb-shake     12s linear infinite; transform-origin: 0px -40px; }
        .pb-top    { animation: pb-open      12s linear infinite; transform-origin: 0px -40px; }
        .pb-bot    { animation: pb-bottom-fade 12s linear infinite; }
        .fl-core   { animation: flash-core   12s linear infinite; transform-origin: 0px -40px; }
        .ray       { animation: ray-burst    12s linear infinite; transform-origin: 0px -40px; }
        .car       { animation: countach     12s linear infinite; }
        .wf        { animation: wspin 0.25s linear infinite; }
        .wr        { animation: wspin 0.25s linear infinite; }
        .sl1       { animation: sline 12s linear infinite 0s; }
        .sl2       { animation: sline 12s linear infinite 0.07s; }
        .sl3       { animation: sline 12s linear infinite 0.14s; }
      `}</style>

      <svg
        viewBox="-320 -180 640 340"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[900px] h-[500px] opacity-20"
      >

        {/* ═══ LIGHT RAYS ═══ */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const c = Math.cos(angle), s = Math.sin(angle);
          return (
            <line
              key={i}
              x1={c * 18}  y1={s * 18  - 40}
              x2={c * 280} y2={s * 280 - 40}
              stroke="#fffde7"
              strokeWidth={i % 2 === 0 ? 16 : 8}
              strokeLinecap="round"
              opacity="0"
              className="ray"
              style={{ animationDelay: `${i * 0.015}s` }}
            />
          );
        })}

        {/* ═══ CORE FLASH ═══ */}
        <g className="fl-core">
          <circle cx="0" cy="-40" r="50" fill="white" />
        </g>

        {/* ═══ POKÉBALL ═══ */}
        <g className="pb-ball">
          {/* Bottom half */}
          <g className="pb-bot">
            <path d="M -98 -40 A 98 98 0 0 0 98 -40 Z" fill="white" />
            <rect  x="-98" y="-52" width="196" height="24" fill="#1a1a1a" />
            <circle cx="0" cy="-40" r="22" fill="#1a1a1a" />
            <circle cx="0" cy="-40" r="14" fill="white" />
            <circle cx="-5" cy="-45" r="4"  fill="white" opacity="0.45" />
            {/* Outer ring drawn on bottom so it's always visible */}
            <circle cx="0" cy="-40" r="98" fill="none" stroke="#1a1a1a" strokeWidth="4" />
          </g>
          {/* Top half */}
          <g className="pb-top">
            <path d="M -98 -40 A 98 98 0 0 1 98 -40 Z" fill="#e53e3e" />
            <rect  x="-98" y="-52" width="196" height="12" fill="#1a1a1a" />
          </g>
        </g>

        {/* ═══ LAMBORGHINI COUNTACH ═══ */}
        {/*  Car local coords: ground = y=0, car faces right  */}
        {/*  Overall width ~210px, height ~75px above ground  */}
        <g className="car">
          {/* Speed lines (appear left of car) */}
          <line x1="-230" y1="100" x2="-155" y2="100" stroke="white" strokeWidth="3" strokeLinecap="round" className="sl1" />
          <line x1="-245" y1="110" x2="-148" y2="110" stroke="white" strokeWidth="2" strokeLinecap="round" className="sl2" />
          <line x1="-220" y1="120" x2="-160" y2="120" stroke="white" strokeWidth="3" strokeLinecap="round" className="sl3" />

          <g transform="translate(-105, 130)">
            {/* ── Ground shadow ── */}
            <ellipse cx="105" cy="4" rx="108" ry="7" fill="black" opacity="0.25" />

            {/* ── Body ── */}
            {/* Main silhouette – classic wedge */}
            <path
              d="
                M 0,0
                L 0,-20
                L 18,-34
                L 65,-44
                L 92,-58
                L 128,-58
                L 150,-46
                L 172,-46
                L 182,-36
                L 198,-22
                L 198,0
                Z
              "
              fill="#cc0000"
            />

            {/* Roof / cabin top */}
            <path d="M 92,-58 L 128,-58 L 150,-46 L 92,-46 Z" fill="#aa0000" />

            {/* Windshield */}
            <path d="M 66,-43 L 92,-57 L 92,-46 L 70,-34" fill="#99ccee" opacity="0.85" />

            {/* Rear quarter glass */}
            <path d="M 130,-57 L 148,-46 L 134,-46 L 122,-52 Z" fill="#99ccee" opacity="0.7" />

            {/* Hood (darker) */}
            <path d="M 0,-20 L 18,-34 L 65,-44 L 70,-34 L 22,-24 Z" fill="#aa0000" />

            {/* Rear wing mounts */}
            <rect x="178" y="-68" width="5" height="24" fill="#880000" />
            <rect x="192" y="-68" width="5" height="24" fill="#880000" />
            {/* Rear wing blade */}
            <path d="M 162,-72 L 210,-72 L 210,-64 L 162,-64 Z" fill="#880000" rx="2" />

            {/* NACA duct */}
            <path d="M 154,-48 L 172,-48 L 170,-40 L 156,-40 Z" fill="#880000" />

            {/* Door seam */}
            <line x1="92" y1="-57" x2="92" y2="0" stroke="#aa0000" strokeWidth="1.5" />

            {/* Rocker panel stripe */}
            <rect x="22" y="-5" width="158" height="6" fill="#aa0000" />

            {/* Front headlight slot */}
            <rect x="1"  y="-28" width="20" height="8" fill="#ffee88" rx="1" />
            <rect x="1"  y="-28" width="20" height="8" fill="none" stroke="#cc8800" strokeWidth="1" rx="1" />

            {/* Tail light */}
            <rect x="190" y="-32" width="8" height="12" fill="#ff4444" rx="1" />
            <rect x="190" y="-32" width="8" height="12" fill="none" stroke="#cc0000" strokeWidth="1" rx="1" />

            {/* Front bumper face */}
            <rect x="0" y="-22" width="5" height="24" fill="#cc2222" rx="1" />

            {/* ── Front wheel ── */}
            <g transform="translate(48, 0)">
              <circle r="28" fill="#111" />
              <circle r="20" fill="#2a2a2a" />
              <circle r="9"  fill="#555" />
              <g className="wf">
                <line x1="0" y1="-19" x2="0"  y2="19"  stroke="#444" strokeWidth="3" />
                <line x1="-19" y1="0" x2="19" y2="0"   stroke="#444" strokeWidth="3" />
                <line x1="-13" y1="-13" x2="13" y2="13" stroke="#444" strokeWidth="2" />
                <line x1="13" y1="-13" x2="-13" y2="13" stroke="#444" strokeWidth="2" />
              </g>
            </g>

            {/* ── Rear wheel ── */}
            <g transform="translate(162, 0)">
              <circle r="30" fill="#111" />
              <circle r="21" fill="#2a2a2a" />
              <circle r="10" fill="#555" />
              <g className="wr">
                <line x1="0" y1="-20" x2="0"  y2="20"  stroke="#444" strokeWidth="3" />
                <line x1="-20" y1="0" x2="20" y2="0"   stroke="#444" strokeWidth="3" />
                <line x1="-14" y1="-14" x2="14" y2="14" stroke="#444" strokeWidth="2" />
                <line x1="14" y1="-14" x2="-14" y2="14" stroke="#444" strokeWidth="2" />
              </g>
            </g>

            {/* Front wheel arch */}
            <path d="M 18,0 A 30 30 0 0 1 78,0 Z" fill="#b00000" />
            {/* Rear wheel arch */}
            <path d="M 130,0 A 32 32 0 0 1 194,0 Z" fill="#b00000" />
          </g>
        </g>

      </svg>
    </div>
  );
}
