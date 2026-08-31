import { supabase } from "../../lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tor2026";
const BUCKET = "product-images";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const { password, filename, dataUrl } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong admin password" });
  }
  if (!filename || !dataUrl) {
    return res.status(400).json({ error: "Missing file data" });
  }

  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ error: "Invalid image data" });
  }
  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");

  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const finalName = `${Date.now()}-${safeName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(finalName, buffer, { contentType, upsert: false });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: "Upload failed. Check Supabase storage bucket setup." });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(finalName);
    return res.status(201).json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed. Check Supabase connection/env vars." });
  }
}
