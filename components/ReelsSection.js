import { useEffect, useRef, useState, useCallback } from "react";

const CARD_WIDTH = 190;
const GAP = 16;

export default function ReelsSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pad, setPad] = useState(0);
  const [scales, setScales] = useState([]);
  const scrollerRef = useRef(null);

  useEffect(() => {
    fetch("/api/reels")
      .then((r) => r.json())
      .then((data) => {
        setReels(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const computeStyles = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    const next = reels.map((_, i) => {
      const itemCenter = pad + i * (CARD_WIDTH + GAP) + CARD_WIDTH / 2;
      const dist = (itemCenter - containerCenter) / (CARD_WIDTH + GAP);
      const scale = Math.max(0.72, 1 - Math.abs(dist) * 0.18);
      const opacity = Math.max(0.45, 1 - Math.abs(dist) * 0.35);
      return { scale, opacity };
    });
    setScales(next);
  }, [reels, pad]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || reels.length === 0) return;
    const updatePad = () => setPad(Math.max(16, (el.clientWidth - CARD_WIDTH) / 2));
    updatePad();
    window.addEventListener("resize", updatePad);
    return () => window.removeEventListener("resize", updatePad);
  }, [reels]);

  useEffect(() => { computeStyles(); }, [pad, computeStyles]);

  if (loading || reels.length === 0) return null;

  return (
    <div className="reels-section">
      <div className="reels-heading">SEE IT IN ACTION</div>
      <div
        className="reels-scroller"
        ref={scrollerRef}
        onScroll={computeStyles}
        style={{ paddingLeft: pad, paddingRight: pad }}
      >
        {reels.map((r, i) => {
          const s = scales[i] || { scale: 1, opacity: 1 };
          return (
            <div
              className="reel-card"
              key={r.id}
              style={{ transform: `scale(${s.scale})`, opacity: s.opacity }}
            >
              <video src={r.video_url} muted loop playsInline autoPlay preload="metadata" />
              {r.caption && <div className="reel-caption">{r.caption}</div>}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .reels-section { padding: 26px 0 10px; }
        .reels-heading { font-size: 12.5px; font-weight: 800; letter-spacing: 1.2px; text-align: center; margin-bottom: 14px; color: #111; }
        .reels-scroller {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .reels-scroller::-webkit-scrollbar { display: none; }
        .reel-card {
          position: relative;
          flex: 0 0 190px;
          aspect-ratio: 9 / 16;
          border-radius: 14px;
          overflow: hidden;
          background: #111;
          scroll-snap-align: center;
          transition: transform 0.15s ease-out, opacity 0.15s ease-out;
        }
        .reel-card video { width: 100%; height: 100%; object-fit: cover; }
        .reel-caption {
          position: absolute; left: 8px; right: 8px; bottom: 8px;
          color: #fff; font-size: 11px; font-weight: 600; line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        }
      `}</style>
    </div>
  );
}