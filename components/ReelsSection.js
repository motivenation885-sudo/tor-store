import { useEffect, useState } from "react";

export default function ReelsSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reels")
      .then((r) => r.json())
      .then((data) => {
        setReels(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || reels.length === 0) return null;

  return (
    <div className="reels-section">
      <div className="reels-heading">SEE IT IN ACTION</div>
      <div className="reels-grid">
        {reels.map((r) => (
          <div className="reel-card" key={r.id}>
            <video src={r.video_url} muted loop playsInline autoPlay preload="metadata" />
            {r.caption && <div className="reel-caption">{r.caption}</div>}
          </div>
        ))}
      </div>

      <style jsx>{`
        .reels-section { max-width: 1150px; margin: 0 auto; padding: 26px 16px 6px; }
        .reels-heading { font-size: 12.5px; font-weight: 800; letter-spacing: 1.2px; text-align: center; margin-bottom: 14px; color: #111; }
        .reels-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .reel-card { position: relative; aspect-ratio: 9 / 16; border-radius: 10px; overflow: hidden; background: #111; }
        .reel-card video { width: 100%; height: 100%; object-fit: cover; }
        .reel-caption { position: absolute; left: 10px; right: 10px; bottom: 10px; color: #fff; font-size: 12px; font-weight: 600; line-height: 1.3; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
        @media (min-width: 640px) {
          .reels-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
          .reels-section { padding: 30px 24px 6px; }
        }
        @media (min-width: 900px) {
          .reels-section { padding: 34px 40px 6px; max-width: 1300px; }
        }
      `}</style>
    </div>
  );
}