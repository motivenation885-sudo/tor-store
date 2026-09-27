import { getHeroImages, addHeroImage, deleteHeroImage } from "../../lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tor2026";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const images = await getHeroImages();
      return res.status(200).json(images);
    }

    if (req.method === "POST") {
      const { password, image_url } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!image_url) {
        return res.status(400).json({ error: "Missing image" });
      }
      const hero = { id: "h" + Date.now(), image_url };
      await addHeroImage(hero);
      return res.status(201).json({ ok: true, id: hero.id });
    }

    if (req.method === "DELETE") {
      const { password, id } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!id) return res.status(400).json({ error: "Missing id" });
      await deleteHeroImage(id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Check Supabase connection/env vars." });
  }
}