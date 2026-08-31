import { getProducts, addProduct, updateProduct, deleteProduct } from "../../lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tor2026";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const products = await getProducts();
      return res.status(200).json(products);
    }

    if (req.method === "POST") {
      const { password, name, price, mrp, category, sizes, images } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!name || !price || !category || !sizes || !images || images.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const product = {
        id: "p" + Date.now(),
        name,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        category,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        images,
        rating: 4.2,
      };
      await addProduct(product);
      return res.status(201).json({ ok: true, id: product.id });
    }

    if (req.method === "PUT") {
      const { password, id, name, price, mrp, category, sizes, images } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!id || !name || !price || !category || !sizes || !images || images.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      await updateProduct(id, {
        name,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        category,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        images,
      });
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { password, id } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!id) return res.status(400).json({ error: "Missing id" });
      await deleteProduct(id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Check Supabase connection/env vars." });
  }
}
