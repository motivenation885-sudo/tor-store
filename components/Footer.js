import { WHATSAPP_NUMBER, CATEGORIES } from "../lib/config";

// Fill in your real Instagram handle URL here, or leave blank to hide the icon.
const INSTAGRAM_URL = "";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="col brand-col">
          <div className="logo">THE OUTFIT ROOM</div>
          <p className="tagline">Everyday fits, delivered to your door in Satna &amp; Maihar.</p>
          <div className="socials">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="social-btn">
              WhatsApp
            </a>
            {INSTAGRAM_URL && (
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="social-btn outline">
                Instagram
              </a>
            )}
          </div>
        </div>

        <div className="col">
          <div className="col-heading">SHOP</div>
          {CATEGORIES.filter((c) => c !== "All").map((c) => (
            <a key={c} href="#shop" className="footer-link">{c}</a>
          ))}
        </div>

        <div className="col">
          <div className="col-heading">DELIVERY</div>
          <div className="footer-note">💵 Cash on Delivery</div>
          <div className="footer-note">📍 Satna &amp; Maihar</div>
          <div className="footer-note">📞 Size confirmed on call</div>
        </div>
      </div>

      <div className="footer-bottom">
        © {year} The Outfit Room
      </div>

      <style jsx>{`
        .footer { background: #111; color: #fff; margin-top: 20px; }
        .footer-inner {
          max-width: 1150px; margin: 0 auto;
          padding: 40px 20px 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .col-heading { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #999; margin-bottom: 12px; }
        .logo { font-size: 16px; font-weight: 800; letter-spacing: 0.4px; margin-bottom: 10px; }
        .tagline { font-size: 13px; color: #bbb; line-height: 1.5; max-width: 320px; margin: 0 0 16px; }
        .socials { display: flex; gap: 10px; flex-wrap: wrap; }
        .social-btn {
          font-size: 12px; font-weight: 700; color: #111; background: #fff;
          padding: 8px 16px; border-radius: 20px; text-decoration: none;
        }
        .social-btn.outline { background: transparent; color: #fff; border: 1px solid #444; }
        .footer-link { display: block; font-size: 13px; color: #ccc; text-decoration: none; margin-bottom: 10px; }
        .footer-note { font-size: 12.5px; color: #ccc; margin-bottom: 10px; }
        .footer-bottom {
          border-top: 1px solid #2a2a2a;
          padding: 16px 20px;
          text-align: center;
          font-size: 11.5px;
          color: #777;
        }
        @media (min-width: 640px) {
          .footer-inner { grid-template-columns: 2fr 1fr 1fr; padding: 48px 24px 28px; }
        }
        @media (min-width: 900px) {
          .footer-inner { max-width: 1300px; padding: 56px 40px 32px; }
        }
      `}</style>
    </footer>
  );
}