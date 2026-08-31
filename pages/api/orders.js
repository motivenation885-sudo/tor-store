import { getOrders, addOrder } from "../../lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tor2026";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { productName, price, size, customerName, customerPhone } = req.body || {};
      if (!productName || !price || !size) {
        return res.status(400).json({ error: "Missing fields" });
      }
      const order = {
        id: "o" + Date.now(),
        product_name: productName,
        price: Number(price),
        size,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        status: "new",
      };
      await addOrder(order);
      return res.status(201).json({ ok: true, id: order.id });
    }

    if (req.method === "GET") {
      const { password } = req.query;
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      const orders = await getOrders();
      return res.status(200).json(orders);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Check Supabase connection/env vars." });
  }
}
