import { supabase } from "./supabase";

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function addProduct(product) {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}
export async function updateProduct(id, updates) {
  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) throw error;
  return true;
}
export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getOrders() {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function addOrder(order) {
  const { data, error } = await supabase.from("orders").insert(order).select().single();
  if (error) throw error;
  return data;
}

export async function getReels() {
  const { data, error } = await supabase.from("reels").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function addReel(reel) {
  const { data, error } = await supabase.from("reels").insert(reel).select().single();
  if (error) throw error;
  return data;
}
export async function deleteReel(id) {
  const { error } = await supabase.from("reels").delete().eq("id", id);
  if (error) throw error;
}

export async function getHeroImages() {
  const { data, error } = await supabase.from("hero_images").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
export async function addHeroImage(hero) {
  const { data, error } = await supabase.from("hero_images").insert(hero).select().single();
  if (error) throw error;
  return data;
}
export async function deleteHeroImage(id) {
  const { error } = await supabase.from("hero_images").delete().eq("id", id);
  if (error) throw error;
}