import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "../../lib/config";

const inputStyle = { padding: "9px 11px", borderRadius: 5, border: "1px solid #ddd", fontSize: 13, width: "100%", boxSizing: "border-box" };
const EMPTY_FORM = { name: "", price: "", mrp: "", category: "Tshirts", sizes: "S,M,L,XL" };

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("products");
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]); // array of {id, url, uploading}
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState(null); // null = adding new, else id of product being edited
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const loadProducts = () => fetch("/api/products").then((r) => r.json()).then(setProducts);
  const loadOrders = () => fetch(`/api/orders?password=${encodeURIComponent(pw)}`).then((r) => r.json()).then(setOrders);

  useEffect(() => {
    if (authed) {
      loadProducts();
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const tryLogin = async () => {
    const res = await fetch(`/api/orders?password=${encodeURIComponent(pw)}`);
    if (res.status === 401) {
      setLoginErr("Wrong password");
    } else {
      setAuthed(true);
      setLoginErr("");
    }
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setErr("");
    for (const file of files) {
      const tempId = Date.now() + Math.random();
      setImages((prev) => [...prev, { id: tempId, url: null, uploading: true }]);
      try {
        const dataUrl = await fileToDataUrl(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pw, filename: file.name, dataUrl }),
        });
        const data = await res.json();
        if (res.ok) {
          setImages((prev) => prev.map((img) => (img.id === tempId ? { ...img, url: data.url, uploading: false } : img)));
        } else {
          setImages((prev) => prev.filter((img) => img.id !== tempId));
          setErr(data.error || "Upload failed");
        }
      } catch (e) {
        setImages((prev) => prev.filter((img) => img.id !== tempId));
        setErr("Upload failed. Try again.");
      }
    }
    e.target.value = "";
  };

  const removeImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), mrp: String(p.mrp || ""), category: p.category, sizes: p.sizes.join(",") });
    setImages(p.images.map((url, i) => ({ id: "existing-" + i, url, uploading: false })));
    setErr("");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setErr("");
  };

  const saveProduct = async () => {
    const readyImages = images.filter((i) => i.url).map((i) => i.url);
    if (!form.name || !form.price || readyImages.length === 0) {
      setErr("Name, price and at least one image are required.");
      return;
    }
    setSaving(true);
    setErr("");
    const res = await fetch("/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: readyImages, password: pw, id: editingId || undefined }),
    });
    if (res.ok) {
      cancelEdit();
      loadProducts();
    } else {
      setErr("Could not save. Try again.");
    }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw }),
    });
    if (editingId === id) cancelEdit();
    loadProducts();
  };

  if (!authed) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#fafafa" }}>
        <div style={{ background: "#fff", padding: 28, borderRadius: 8, width: 300, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>The Outfit Room — Admin</div>
          <input type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryLogin()} style={inputStyle} />
          {loginErr && <div style={{ color: "#c0392b", fontSize: 12, marginTop: 6 }}>{loginErr}</div>}
          <button onClick={tryLogin} style={{ marginTop: 12, width: "100%", background: "#111", color: "#fff", border: "none", padding: "10px 0", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 28, fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Admin — The Outfit Room</h2>
        <a href="/" style={{ fontSize: 13, color: "#666" }}>← Back to store</a>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("products")} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: tab === "products" ? "1px solid #111" : "1px solid #ddd", background: tab === "products" ? "#111" : "#fff", color: tab === "products" ? "#fff" : "#333" }}>
          Products
        </button>
        <button onClick={() => setTab("orders")} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: tab === "orders" ? "1px solid #111" : "1px solid #ddd", background: tab === "orders" ? "#111" : "#fff", color: tab === "orders" ? "#fff" : "#333" }}>
          Orders ({orders.length})
        </button>
      </div>

      {tab === "products" && (
        <>
          <div ref={formRef} style={{ display: "grid", gap: 10, marginBottom: 24, background: editingId ? "#fff7e6" : "#fafafa", padding: 16, borderRadius: 6, border: editingId ? "1px solid #f0c674" : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {editingId ? "Editing product" : "Add new product"}
            </div>
            <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <div style={{ display: "flex", gap: 10 }}>
              <input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
              <input placeholder="MRP (₹, optional)" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} style={inputStyle} />
            </div>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Sizes, comma separated (S,M,L,XL)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} style={inputStyle} />

            <div style={{ fontSize: 12, color: "#666", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Product Images</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {images.map((img) => (
                <div key={img.id} style={{ position: "relative", width: 64, height: 78 }}>
                  {img.uploading ? (
                    <div style={{ width: 64, height: 78, borderRadius: 5, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#999" }}>
                      ...
                    </div>
                  ) : (
                    <>
                      <img src={img.url} style={{ width: 64, height: 78, objectFit: "cover", borderRadius: 5, border: "1px solid #ddd" }} />
                      <button
                        onClick={() => removeImage(img.id)}
                        style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#111", color: "#fff", border: "none", fontSize: 11, cursor: "pointer", lineHeight: 1 }}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              ))}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ width: 64, height: 78, borderRadius: 5, border: "1px dashed #bbb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 24, color: "#999", background: "#fff" }}
              >
                +
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelected} style={{ display: "none" }} />
            </div>
            <div style={{ fontSize: 11, color: "#999" }}>First image is the main photo. Second shows on hover in the grid.</div>

            {err && <div style={{ color: "#c0392b", fontSize: 12 }}>{err}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveProduct} disabled={saving} style={{ flex: 1, background: "#111", color: "#fff", border: "none", padding: "10px 0", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
              {editingId && (
                <button onClick={cancelEdit} style={{ padding: "10px 16px", borderRadius: 6, fontSize: 13, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Current products ({products.length})</div>
          {products.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <img src={p.images[0]} alt="" style={{ width: 36, height: 44, objectFit: "cover", borderRadius: 3 }} />
              <div style={{ flex: 1, fontSize: 13 }}>{p.name} — ₹{p.price}</div>
              <button onClick={() => startEdit(p)} style={{ border: "none", background: "none", color: "#111", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Edit</button>
              <button onClick={() => deleteProduct(p.id)} style={{ border: "none", background: "none", color: "#c0392b", fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
          ))}
        </>
      )}

      {tab === "orders" && (
        <>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
            Logged whenever a customer checks out — cross-check against what lands in your WhatsApp and what gets accepted at delivery.
          </div>
          {orders.length === 0 ? (
            <div style={{ color: "#999", fontSize: 13, padding: 20, textAlign: "center" }}>No orders logged yet.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee", fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{o.product_name} — ₹{o.price}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                  {o.customer_name || "—"} · {o.customer_phone || "—"}
                </div>
                <div style={{ fontSize: 11, color: "#999" }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
