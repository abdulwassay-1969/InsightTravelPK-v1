import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | InsightTravelPK',
  description: 'Privacy Policy and data collection guidelines for InsightTravelPK.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-foreground">
      <h1 className="text-4xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: April 2026</p>

      <div className="prose max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
          <p>
            When you visit InsightTravelPK, we may collect minimal non-personally identifiable information such as browser type, operating system, and anonymous usage data via third-party analytics (like Google Analytics). When you use our contact forms, you may voluntarily provide your name and email address.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
          <p>
            Any personalized data is used strictly to respond to your inquiries. Usage data helps us improve the platform, fix bugs, and refine our AI Smart Planner suggestions. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. Cookies & Tracking</h2>
          <p>
            We use basic cookies to store personal preferences (such as your saved trips or gallery favorites). Third-party services like Google AdSense or Analytics may also use cookies to serve relevant ads or track aggregate usage patterns. You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Third-Party Links & Affiliate Partners</h2>
          <p>
            InsightTravelPK contains links to external websites, such as booking services or province tourism portals. We are not responsible for the privacy practices of those external sites. Some outward links may be affiliate links, meaning we may earn a small commission at no extra cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at <strong>privacy@insighttravelpk.pk</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
