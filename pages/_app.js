import "../styles/globals.css";
import { CartProvider } from "../lib/cart";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />

      <Script
        src="https://c36afef3-bd1c-41d8-9c28-4cc63f3daede-00-1452hpvj5auww.pike.replit.dev/widget.js"
        data-store="80cdf60b-d73d-4659-b792-a48a3ca07a7e"
        strategy="afterInteractive"
      />
    </CartProvider>
  );
}
