import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | InsightTravelPK',
  description: 'Terms of service and user guidelines for InsightTravelPK.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-foreground">
      <h1 className="text-4xl font-bold mb-6 text-primary">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: April 2026</p>

      <div className="prose max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using InsightTravelPK, you accept and agree to be bound by the terms and provision of this agreement. InsightTravelPK serves as an informational travel guide for tourism in Pakistan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">2. Accuracy of Information</h2>
          <p>
            We strive to provide accurate and up-to-date information about tourist destinations, weather, and travel plans. However, we cannot guarantee the complete accuracy, reliability, or availability of all details. Always verify crucial travel information (like visa requirements, road conditions, and safety) with official local authorities before traveling.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">3. AI-Generated Content</h2>
          <p>
            Features like the "Smart Planner" utilize generative Artificial Intelligence to create custom itineraries. These are suggestions and may occasionally hallucinate or provide impractical routes. It is your responsibility to fact-check AI-generated plans.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">4. Intellectual Property & User Content</h2>
          <p>
            Content on this site is either owned by InsightTravelPK, sourced from public domain entities, or used under open licenses like Unsplash. If you upload photos to the Gallery, you retain copyright but grant us a non-exclusive license to display those images across the platform. You may only upload content you have the right to share.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
          <p>
            Under no circumstances shall InsightTravelPK or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from the use of or inability to use this website, including but not limited to reliance on any information obtained from this site.
          </p>
        </section>
      </div>
    </div>
  );
}
