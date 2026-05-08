"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth-context";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("If an account exists, a password reset email has been sent.");
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold mb-2">Reset your password</h1>
        <p className="text-sm text-slate-500 mb-6">Enter your email and we'll send a link to reset your password.</p>

        {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{message}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary text-white py-3 font-semibold disabled:opacity-60">{loading ? 'Sending...' : 'Send reset email'}</button>
        </form>
      </div>
    </div>
  );
}
