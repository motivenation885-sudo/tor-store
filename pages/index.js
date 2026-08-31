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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = category === "All" ? products : products.filter((p) => p.category === category);

  return (
    <div className="page">
      <header className={scrolled ? "header scrolled" : "header"}>
        <div className="logo">THE OUTFIT ROOM</div>
        <nav className="nav">
          {CATEGORIES.filter((c) => c !== "All").map((c) => (
            <a key={c} href="#shop" onClick={() => setCategory(c)} className="nav-link">
              {c.toUpperCase()}
            </a>
          ))}
        </nav>
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
        <img src="https://opyxazheidtjkylembsw.supabase.co/storage/v1/object/public/product-images/1788177417248-ChatGPTImageAug31202605_25_30PM.png" alt="The Outfit Room" className="hero-img" />
        <div className="hero-gradient" />
        <div className="hero-content">
          <div className="eyebrow">BETTER FITS. EVERYDAY.</div>
          <h1 className="headline">
            Everyday Fits,<br />Delivered Right.
          </h1>
          <p className="subhead">
            Premium basics and easy fits — ordered on WhatsApp, delivered to your door in Satna &amp; Maihar.
          </p>
          <a href="#shop" className="shop-btn">
            Shop Now <span className="arrow">→</span>
          </a>
        </div>
        <div className="trust-bar">
          <div className="trust-item">
            <span className="trust-icon">💵</span>
            <span>Cash on Delivery</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📍</span>
            <span>Delivered in Satna &amp; Maihar</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📞</span>
            <span>Size Confirmed on Call</span>
          </div>
        </div>
      </div>

      <div id="shop" className="cat-row">
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

        .header {
          position: sticky; top: 0; z-index: 20;
          padding: 18px 20px;
          display: flex; align-items: center; justify-content: space-between;
          background: transparent;
          transition: background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease;
        }
        .header.scrolled {
          background: #fff;
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
          padding: 12px 20px;
        }
        .logo { font-size: 16px; font-weight: 800; letter-spacing: 0.4px; color: #111; z-index: 2; }
        .nav { display: none; }
        .header-actions { display: flex; gap: 8px; align-items: center; z-index: 2; }
        .wa-btn {
          font-size: 12px; color: #25D366; font-weight: 700; text-decoration: none;
          border: 1.5px solid #25D366; padding: 7px 12px; border-radius: 20px; background: #fff;
        }
        .cart-btn {
          position: relative; font-size: 12px; color: #111; font-weight: 700;
          text-decoration: none; border: 1.5px solid #111; padding: 7px 12px; border-radius: 20px; background: #fff;
        }
        .cart-badge {
          position: absolute; top: -6px; right: -6px; background: #111; color: #fff;
          font-size: 10px; border-radius: 50%; width: 17px; height: 17px;
          display: flex; align-items: center; justify-content: center;
        }

        .hero {
          position: relative;
          height: 92vh;
          min-height: 560px;
          max-height: 860px;
          margin-top: -68px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(20,18,15,0.72) 0%, rgba(20,18,15,0.35) 48%, rgba(20,18,15,0.05) 75%);
        }
        .hero-content { position: relative; z-index: 2; padding: 0 20px; max-width: 640px; color: #fff; }
        .eyebrow { font-size: 11px; letter-spacing: 2px; font-weight: 700; opacity: 0.85; margin-bottom: 14px; }
        .headline { font-size: clamp(30px, 8vw, 48px); font-weight: 800; line-height: 1.08; margin: 0 0 16px; }
        .subhead { font-size: 14px; line-height: 1.6; opacity: 0.9; margin: 0 0 26px; max-width: 420px; }
        .shop-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #111; font-size: 13px; font-weight: 800;
          padding: 14px 26px; border-radius: 2px; text-decoration: none; letter-spacing: 0.5px;
        }
        .arrow { transition: transform 0.2s; }
        .shop-btn:hover .arrow { transform: translateX(3px); }

        .trust-bar {
          position: relative; z-index: 2;
          display: flex; gap: 20px; flex-wrap: wrap;
          padding: 22px 20px; margin-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.25);
        }
        .trust-item { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 11.5px; font-weight: 600; letter-spacing: 0.3px; }
        .trust-icon { font-size: 14px; }

        .cat-row {
          max-width: 1150px; margin: 0 auto; padding: 26px 16px 16px;
          display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
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
          .cat-row { padding: 26px 24px 16px; }
        }
        @media (min-width: 900px) {
          .nav { display: flex; gap: 26px; z-index: 2; }
          .nav-link {
            font-size: 12px; font-weight: 700; letter-spacing: 0.6px; color: #fff;
            text-decoration: none; opacity: 0.9;
          }
          .header.scrolled .nav-link { color: #111; }
          .header { padding: 22px 40px; }
          .header.scrolled { padding: 14px 40px; }
          .hero-content { padding: 0 40px; }
          .trust-bar { padding: 22px 40px; }
          .grid { grid-template-columns: repeat(4, 1fr); gap: 22px 18px; padding: 4px 40px 70px; }
          .cat-row { padding: 30px 40px 16px; max-width: 1300px; }
        }
      `}</style>
    </div>
  );
}
