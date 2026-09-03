import Script from "next/script";
import "../styles/globals.css";
import { CartProvider } from "../lib/cart";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <script src="https://c36afef3-bd1c-41d8-9c28-4cc63f3daede-00-1452hpvj5auww.pike.replit.dev/widget.js" data-store-id="220514a0-115c-43d2-932b-45c8f8aa28fb" data-cart-event="cart-to-whatsapp:updated"></script>
    </CartProvider>
  );
}
