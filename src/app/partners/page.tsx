"use client";

import { useState } from "react";

const PARTNER_TYPES = [
  "hotel",
  "guesthouse",
  "restaurant",
  "cafe",
  "guide",
  "transport",
  "activity",
  "trekking-operator",
];

const REGIONS = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

export default function PartnersPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("hotel");
  const [region, setRegion] = useState("Punjab");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          region,
          district,
          location,
          description,
          contactPerson,
          phone,
          email,
          website,
        }),
      });

      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(data.message || "Application submitted successfully! We'll review it and get back to you soon.");
      setName("");
      setType("hotel");
      setRegion("Punjab");
      setDistrict("");
      setLocation("");
      setDescription("");
      setContactPerson("");
      setPhone("");
      setEmail("");
      setWebsite("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 mb-4">
            <span className="text-sm font-semibold text-primary">Vendor Program</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Become A Vendor
          </h1>
          <p className="text-lg text-slate-600">
            Become a vendor and register your hotel, event planning service or tour planning and booking service with us today to boost your business' visibility and gain lots of new customers.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl border border-green-200 bg-green-50">
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Info */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Mountain Peak Hotel"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {PARTNER_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Region *
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      District/City *
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Hunza"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location/Address *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Street address or landmark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your business, unique offerings, and why travelers should visit..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <p className="text-xs text-slate-500 text-center mt-3">
                We'll review your application and get back to you within 5 business days.
              </p>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">✓</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Admin Reviewed</h3>
            <p className="text-sm text-slate-600">
              Every application is carefully reviewed to maintain quality standards.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">★</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Premium Visibility</h3>
            <p className="text-sm text-slate-600">
              Featured across destination pages where travelers discover the best places.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-lg font-bold text-primary">→</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Direct Bookings</h3>
            <p className="text-sm text-slate-600">
              Get connected directly with travelers planning trips to your region.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
