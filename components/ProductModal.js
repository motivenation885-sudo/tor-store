import { useState } from "react";
import { discountPct } from "../lib/config";
import { useCart } from "../lib/cart";

export default function ProductModal({ product, onClose }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const pct = discountPct(product.price, product.mrp);

  const handleAdd = () => {
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drag-handle" />
        <div className="sheet-body">
          <div className="image-col">
            <div className="main-image">
              <img src={product.images[activeImg]} alt={product.name} />
              <button className="close-btn" onClick={onClose}>×</button>
              {pct > 0 && <div className="discount-badge">{pct}% OFF</div>}
            </div>
            {product.images.length > 1 && (
              <div className="thumb-row">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    onClick={() => setActiveImg(idx)}
                    className={activeImg === idx ? "thumb active" : "thumb"}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="info-col">
            <div className="category">{product.category}</div>
            <h2 className="title">{product.name}</h2>
            <div className="price-row">
              <span className="price">₹{product.price}</span>
              {product.mrp > product.price && <span className="mrp">₹{product.mrp}</span>}
              {pct > 0 && <span className="off">{pct}% off</span>}
            </div>

            <div className="section-label">Select Size</div>
            <div className="size-row">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={size === s ? "size-btn active" : "size-btn"}>
                  {s}
                </button>
              ))}
            </div>

            <div className="note">
              Cash on delivery · Size confirmed on a quick call before dispatch · Delivered in Satna & Maihar
            </div>
          </div>
        </div>

        <div className="sticky-cta">
          <button onClick={handleAdd} className={added ? "cta added" : "cta"}>
            {added ? "Added ✓" : `Add to Cart — ₹${product.price}`}
          </button>
        </div>
      </div>

      <style jsx>{`
        .sheet-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 50;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .sheet {
          background: #fff;
          width: 100%;
          max-height: 92vh;
          border-radius: 16px 16px 0 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.25s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .drag-handle {
          width: 36px;
          height: 4px;
          background: #ddd;
          border-radius: 2px;
          margin: 10px auto 0;
          flex-shrink: 0;
        }
        .sheet-body {
          overflow-y: auto;
          flex: 1;
        }
        .image-col { position: relative; }
        .main-image {
          position: relative;
          aspect-ratio: 4 / 5;
          background: #f4f4f4;
        }
        .main-image img { width: 100%; height: 100%; object-fit: cover; }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none;
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
        }
        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #111;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .thumb-row { display: flex; gap: 8px; padding: 10px 14px; }
        .thumb { width: 48px; height: 58px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; cursor: pointer; }
        .thumb.active { border: 2px solid #111; }
        .info-col { padding: 16px 18px 24px; }
        .category { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .title { font-size: 18px; font-weight: 700; margin: 0 0 10px; line-height: 1.3; }
        .price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 20px; }
        .price { font-size: 20px; font-weight: 800; }
        .mrp { font-size: 14px; color: #999; text-decoration: line-through; }
        .off { font-size: 12px; color: #c0392b; font-weight: 700; }
        .section-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .size-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .size-btn {
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          border: 1.5px solid #ddd;
          background: #fff;
          cursor: pointer;
        }
        .size-btn.active { border-color: #111; background: #111; color: #fff; }
        .note { font-size: 12px; color: #888; line-height: 1.6; }
        .sticky-cta {
          padding: 12px 18px;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
          border-top: 1px solid #eee;
          background: #fff;
          flex-shrink: 0;
        }
        .cta {
          width: 100%;
          background: #111;
          color: #fff;
          border: none;
          padding: 15px 0;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }
        .cta.added { background: #2e7d32; }

        /* Desktop: same stacked layout, just centered as a card instead of full-width sheet */
        @media (min-width: 768px) {
          .sheet-overlay { align-items: center; padding: 20px; }
          .sheet {
            max-width: 420px;
            max-height: 88vh;
            border-radius: 14px;
          }
          .drag-handle { display: none; }
          .main-image { aspect-ratio: 4 / 5; }
        }
      `}</style>
    </div>
  );
}
