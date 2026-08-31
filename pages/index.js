import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { CATEGORIES, WHATSAPP_NUMBER } from "../lib/config";
import { useCart } from "../lib/cart";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const { count } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = category === "All" ? products : products.filter((p) => p.category === category);

  return (
    <div className="page">
      <div className="announce">NOW DELIVERING IN SATNA & MAIHAR · COD</div>

      <header className="header">
        <div className="logo">THE OUTFIT ROOM</div>
        <div className="header-actions">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="wa-btn">
            WhatsApp
          </a>
          <a href="/cart" className="cart-btn">
            Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </a>
        </div>
      </header>

      <div className="hero">
        <img
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1400&q=80"
          alt="New arrivals"
        />
        <div className="hero-overlay" />
        <div className="hero-text">
          <div className="eyebrow">NEW ARRIVALS</div>
          <div className="headline">Everyday fits, delivered to your door in Satna & Maihar.</div>
          <a href="#shop" className="shop-btn">Shop Now</a>
        </div>
      </div>

      <div id="shop" className="subhead">
        <p>Pick your size, add to cart — we confirm fit on a call and deliver COD.</p>
      </div>

      <div className="cat-row">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={category === c ? "cat-btn active" : "cat-btn"}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Loading catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No products in this category yet.</div>
      ) : (
        <div className="grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelected} />)}
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

      <style jsx>{`
        .page { background: #fff; min-height: 100vh; }
        .announce {
          background: #111; color: #fff; text-align: center;
          font-size: 11px; padding: 8px 12px; letter-spacing: 0.4px;
        }
        .header {
          border-bottom: 1px solid #eee;
          padding: 14px 16px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; background: #fff; z-index: 10;
        }
        .logo { font-size: 17px; font-weight: 800; letter-spacing: 0.2px; }
        .header-actions { display: flex; gap: 8px; align-items: center; }
        .wa-btn {
          font-size: 12px; color: #25D366; font-weight: 700; text-decoration: none;
          border: 1.5px solid #25D366; padding: 7px 12px; border-radius: 20px;
        }
        .cart-btn {
          position: relative; font-size: 12px; color: #111; font-weight: 700;
          text-decoration: none; border: 1.5px solid #111; padding: 7px 12px; border-radius: 20px;
        }
        .cart-badge {
          position: absolute; top: -6px; right: -6px; background: #111; color: #fff;
          font-size: 10px; border-radius: 50%; width: 17px; height: 17px;
          display: flex; align-items: center; justify-content: center;
        }
        .hero { position: relative; height: 46vh; min-height: 300px; max-height: 480px; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%);
        }
        .hero-text { position: absolute; left: 18px; right: 18px; bottom: 22px; color: #fff; }
        .eyebrow { font-size: 11px; letter-spacing: 1.2px; opacity: 0.9; margin-bottom: 6px; }
        .headline {
          font-size: clamp(22px, 6vw, 32px);
          font-weight: 800; line-height: 1.2; margin-bottom: 14px; max-width: 460px;
        }
        .shop-btn {
          display: inline-block; background: #fff; color: #111; font-size: 13px;
          font-weight: 700; padding: 12px 24px; border-radius: 24px; text-decoration: none;
        }
        .subhead { padding: 22px 16px 8px; max-width: 1150px; margin: 0 auto; }
        .subhead p { font-size: 13px; color: #666; margin: 0; }
        .cat-row {
          max-width: 1150px; margin: 0 auto; padding: 0 16px 16px;
          display: flex; gap: 8px; overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none;
        }
        .cat-row::-webkit-scrollbar { display: none; }
        .cat-btn {
          flex-shrink: 0; padding: 8px 16px; border-radius: 20px; font-size: 12.5px;
          cursor: pointer; border: 1.5px solid #ddd; background: #fff; color: #333;
        }
        .cat-btn.active { border-color: #111; background: #111; color: #fff; }
        .empty-state { text-align: center; padding: 60px 20px; color: #999; font-size: 13px; }
        .grid {
          max-width: 1150px; margin: 0 auto; padding: 4px 12px 60px;
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 10px;
        }
        @media (min-width: 640px) {
          .grid { grid-template-columns: repeat(3, 1fr); gap: 18px 14px; padding: 4px 20px 60px; }
        }
        @media (min-width: 960px) {
          .grid { grid-template-columns: repeat(4, 1fr); gap: 22px 18px; }
          .header { padding: 16px 24px; }
          .subhead { padding: 32px 24px 10px; }
          .cat-row { padding: 0 24px 18px; }
        }
      `}</style>
    </div>
  );
}
