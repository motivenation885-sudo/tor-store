export const WHATSAPP_NUMBER = "919999999999"; // TODO: replace with real number, digits only, country code first
export const CATEGORIES = ["All", "Tshirts", "Shirts", "Jackets", "Bottoms"];

export function whatsappLink(product, size) {
  const msg = `Hi! I want to order:\n${product.name} (₹${product.price})\nSize: ${size}\n\nPlease confirm availability.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function discountPct(price, mrp) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
