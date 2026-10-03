"use client";

export default function AdminLogout() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }
  return (
    <button className="btn btn-outline" onClick={logout}>Logout</button>
  );
}
