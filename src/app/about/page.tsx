import { Metadata } from 'next';
import { Mountain, Heart, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | InsightTravelPK',
  description: 'Learn about InsightTravelPK, our mission to digitize tourism in Pakistan, and the passionate team behind the platform.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-foreground">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary tracking-tight">About InsightTravelPK</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We are on a mission to modernize and digitize the travel experience in Pakistan, making its unparalleled beauty accessible to the world.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-secondary/30 p-8 rounded-2xl text-center border border-border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Our Vision</h3>
          <p className="text-muted-foreground">To become the ultimate digital gateway for tourism in Pakistan, connecting global travelers with authentic local experiences.</p>
        </div>
        <div className="bg-secondary/30 p-8 rounded-2xl text-center border border-border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mountain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">The Destination</h3>
          <p className="text-muted-foreground">From the towering peaks of K2 to the sprawling deserts of Cholistan, we believe Pakistan is the world's best-kept secret.</p>
        </div>
        <div className="bg-secondary/30 p-8 rounded-2xl text-center border border-border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Community Driven</h3>
          <p className="text-muted-foreground">We rely on local travelers and international tourists to share their honest reviews, photos, and insights to help others.</p>
        </div>
      </div>

      <div className="prose max-w-none text-muted-foreground text-lg leading-relaxed">
        <h2 className="text-3xl font-bold text-foreground mb-4">The Story Behind InsightTravelPK</h2>
        <p className="mb-6">
          InsightTravelPK was born out of a simple realization: while Pakistan boasts some of the most dramatic landscapes and rich historical heritage in the world, finding reliable, digitized travel information was often difficult. We wanted to change that.
        </p>
        <p className="mb-6">
          By leveraging modern web technologies and generative AI, we've created a platform that not only provides comprehensive district guides but also helps you plan smart itineraries in seconds. Whether you're exploring the ancient ruins of Mohenjo-daro or braving the Fairy Meadows trek, InsightTravelPK is designed to be your digital companion.
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mt-10">
          <h3 className="text-2xl font-bold text-foreground mb-3 mt-0">Join the Journey</h3>
          <p className="mb-0">
            We are constantly growing our database of attractions, photos, and reviews. If you are passionate about travel in Pakistan, you can contribute by uploading your HD photos to our Gallery or sharing your thoughts in the district review sections.
          </p>
        </div>
      </div>
    </div>
  );
}
