import { useState } from "react";
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
  const [hover, setHover] = useState(false);
  const pct = discountPct(product.price, product.mrp);
  const mainImg = product.images[0];
  const hoverImg = product.images[1] || mainImg;

  return (
    <div
      onClick={() => onOpen(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", background: "#fff", position: "relative" }}
    >
      {pct > 0 && (
        <div style={{ position: "absolute", top: 8, left: 8, background: "#111", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 3, zIndex: 2 }}>
          {pct}% OFF
        </div>
      )}
      <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#f4f4f4" }}>
        <img
          src={hover ? hoverImg : mainImg}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: "10px 2px" }}>
        <div style={{ fontSize: 13.5, color: "#111", fontWeight: 500, marginBottom: 3, lineHeight: 1.3 }}>{product.name}</div>
        <Stars rating={product.rating || 4.0} />
        <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>₹{product.price}</span>
          {product.mrp > product.price && (
            <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>₹{product.mrp}</span>
          )}
        </div>
      </div>
    </div>
  );
}
