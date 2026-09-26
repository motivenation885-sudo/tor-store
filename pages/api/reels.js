import { getReels, addReel, deleteReel } from "../../lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tor2026";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const reels = await getReels();
      return res.status(200).json(reels);
    }

    if (req.method === "POST") {
      const { password, video_url, caption } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!video_url) {
        return res.status(400).json({ error: "Missing video" });
      }
      const reel = { id: "r" + Date.now(), video_url, caption: caption || null };
      await addReel(reel);
      return res.status(201).json({ ok: true, id: reel.id });
    }

    if (req.method === "DELETE") {
      const { password, id } = req.body || {};
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Wrong admin password" });
      }
      if (!id) return res.status(400).json({ error: "Missing id" });
      await deleteReel(id);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Check Supabase connection/env vars." });
  }
}