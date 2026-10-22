"use client";

export default function AdminLogout() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }
  return (
    <button type="button" className="btn btn-outline" onClick={logout} style={{ fontSize: 13, padding: "8px 16px" }}>
      Logout →
    </button>
  );
}
