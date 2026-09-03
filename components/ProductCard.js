import { useState, useRef } from "react";
import { discountPct } from "../lib/config";

function Stars({ rating }) {
  return (
    <span style={{ fontSize: 11, color: "#e0a800" }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
      <span style={{ color: "#999", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

export default function ProductCard({ product, onOpen }) {
  const [activeImg, setActiveImg] = useState(0);
  const pct = discountPct(product.price, product.mrp);
  const scrollerRef = useRef(null);
  const dragStartX = useRef(null);
  const didDrag = useRef(false);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeImg) setActiveImg(idx);
  };

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX ?? (e.touches && e.touches[0].clientX);
    didDrag.current = false;
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current == null) return;
    const x = e.clientX ?? (e.touches && e.touches[0].clientX);
    if (Math.abs(x - dragStartX.current) > 8) didDrag.current = true;
  };

  const handleCardClick = () => {
    if (didDrag.current) return;
    onOpen(product);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      {pct > 0 && <div className="badge">{pct}% OFF</div>}

      <div className="image-wrap">
        <div
          className="scroller"
          ref={scrollerRef}
          onScroll={handleScroll}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
        >
          {product.images.map((img, idx) => (
            <div className="slide" key={idx}>
              <img src={img} alt={product.name} draggable={false} />
            </div>
          ))}
        </div>
        {product.images.length > 1 && (
          <div className="dots">
            {product.images.map((_, idx) => (
              <span key={idx} className={idx === activeImg ? "dot active" : "dot"} />
            ))}
          </div>
        )}
      </div>

      <div className="info">
        <div className="name">{product.name}</div>
        <Stars rating={product.rating || 4.0} />
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          {product.mrp > product.price && <span className="mrp">₹{product.mrp}</span>}
        </div>
      </div>

      <style jsx>{`
        .card { cursor: pointer; background: #fff; position: relative; }
        .badge {
          position: absolute; top: 8px; left: 8px; background: #111; color: #fff;
          font-size: 11px; font-weight: 700; padding: 3px 7px; border-radius: 3px; z-index: 2;
        }
        .image-wrap { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: #f4f4f4; }
        .scroller {
          display: flex; width: 100%; height: 100%;
          overflow-x: auto; scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .scroller::-webkit-scrollbar { display: none; }
        .slide { flex: 0 0 100%; scroll-snap-align: start; height: 100%; }
        .slide img { width: 100%; height: 100%; object-fit: cover; user-select: none; }
        .dots {
          position: absolute; bottom: 8px; left: 0; right: 0;
          display: flex; justify-content: center; gap: 5px; z-index: 2; pointer-events: none;
        }
        .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.6); }
        .dot.active { background: #fff; }
        .info { padding: 10px 2px; }
        .name { font-size: 13.5px; color: #111; font-weight: 500; margin-bottom: 3px; line-height: 1.3; }
        .price-row { margin-top: 4px; display: flex; align-items: baseline; gap: 6px; }
        .price { font-size: 14px; font-weight: 700; color: #111; }
        .mrp { font-size: 12px; color: #999; text-decoration: line-through; }
      `}</style>
    </div>
  );
}
