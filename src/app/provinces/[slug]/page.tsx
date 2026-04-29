import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { provinces } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, ArrowLeft, Map as MapIcon, Type, CloudSun, Bookmark } from 'lucide-react';

import punjabSpots from "@/data/punjab.json";
import sindhSpots from "@/data/sindh.json";
import kpSpots from "@/data/kp.json";
import balochistanSpots from "@/data/balochistan.json";
import gilgitBaltistanSpots from "@/data/gilgit_baltistan.json";
import azadKashmirSpots from "@/data/azad_kashmir.json";
import capitalSpots from "@/data/capital.json";

import EmbeddedMapClient from '@/components/maps/embedded-map-client';
import { getPublicPartnersByProvinceSlug } from "@/lib/pro/supabase";

export async function generateStaticParams() {
  return provinces.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProvincePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const province = provinces.find(p => p.slug === slug);

  if (!province) notFound();

  // Find the exact image URL we use for the province visually on homepage, 
  // or fall back to an aesthetic Unsplash landscape.
  const getProvinceHero = (slug: string) => {
    const urls: Record<string, string> = {
      'gilgit-baltistan': 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2000&auto=format&fit=crop',
      'khyber-pakhtunkhwa': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000&auto=format&fit=crop',
      'punjab': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop',
      'sindh': 'https://images.unsplash.com/photo-1683553238308-9e33dcda0986?q=80&w=2000&auto=format&fit=crop',
      'balochistan': 'https://images.unsplash.com/photo-1604440095301-4ec2f9230155?q=80&w=2000&auto=format&fit=crop',
      'azad-kashmir': 'https://images.unsplash.com/photo-1604689846011-fabb50d9369c?q=80&w=2000&auto=format&fit=crop',
      'islamabad-capital-territory': 'https://images.unsplash.com/photo-1644337544049-08fb5ac82628?q=80&w=2000&auto=format&fit=crop',
    };
    return urls[slug] || 'https://images.unsplash.com/photo-1596422846543-74cac3b74db1?q=80&w=2000&auto=format&fit=crop';
  };

  const getProvinceSpots = (slug: string) => {
    switch (slug) {
      case 'gilgit-baltistan': return gilgitBaltistanSpots.features;
      case 'khyber-pakhtunkhwa': return kpSpots.features;
      case 'punjab': return punjabSpots.features;
      case 'sindh': return sindhSpots.features;
      case 'balochistan': return balochistanSpots.features;
      case 'azad-kashmir': return azadKashmirSpots.features;
      case 'islamabad-capital-territory': return capitalSpots.features;
      default: return [];
    }
  };

  const heroImage = getProvinceHero(province.slug);
  const spots = getProvinceSpots(province.slug);
  const publicPartners = await getPublicPartnersByProvinceSlug(province.slug);
  const blurUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8+v//fwAJaQOE+e1wFAAAAABJRU5ErkJggg==";

  const provinceDetails: Record<string, any> = {
    'gilgit-baltistan': {
      bestTime: 'May – October',
      weather: '15°C Sunny',
      about: 'Gilgit-Baltistan is the spectacular northernmost territory of Pakistan, home to some of the highest mountain ranges in the world including the Karakoram, western Himalayas, and Hindu Kush. It features breathtaking valleys, turquoise lakes like Attabad, and historic forts.'
    },
    'punjab': {
      bestTime: 'October – March',
      weather: '22°C Clear',
      about: 'Punjab, the land of five rivers, is the cultural heart of Pakistan. It boasts endless fertile plains, bustling metropolitan cities like Lahore, magnificent Mughal architecture, spiritual Sufi shrines, and incredibly rich culinary traditions.'
    },
    'sindh': {
      bestTime: 'November – February',
      weather: '28°C Warm',
      about: 'Sindh is a historically rich province that traces its roots to the ancient Indus Valley Civilization. Home to the bustling coastal megacity of Karachi and the ruins of Mohenjo-Daro, it offers a blend of desert landscapes, deep Sufi heritage, and Arabian Sea beaches.'
    },
    'khyber-pakhtunkhwa': {
      bestTime: 'April – October',
      weather: '18°C Mild',
      about: 'Khyber Pakhtunkhwa (KP) is a heavily forested, mountainous province known for its fierce Pashtun hospitality. It features lush paradises like the Swat Valley (the Switzerland of the East), the historic Khyber Pass, and vibrant bazaars in Peshawar.'
    },
    'balochistan': {
      bestTime: 'October – April',
      weather: '30°C Arid',
      about: 'Balochistan is Pakistan’s largest and most rugged province. It features dramatically stark landscapes, natural mud volcanoes, pristine untouched beaches along the Makran Coastal Highway, and the increasingly crucial deep-sea port of Gwadar.'
    },
    'azad-kashmir': {
      bestTime: 'March – October',
      weather: '16°C Breezy',
      about: 'Azad Kashmir is often described as "Heaven on Earth." It is abundantly green, filled with thick alpine forests, sweeping valleys like Neelum, and crystal clear meandering rivers. It’s an absolute paradise for nature lovers and hikers.'
    },
    'islamabad-capital-territory': {
      bestTime: 'September – April',
      weather: '20°C Pleasant',
      about: 'Islamabad, the capital city of Pakistan, is nestled against the Margalla Hills. Known for its high standard of living, sweeping avenues, and lush greenery, it stands out with architectural wonders like the iconic Faisal Mosque.'
    }
  };

  const details = provinceDetails[province.slug] || provinceDetails['gilgit-baltistan'];

  return (
      <main className="min-h-screen bg-stone-50 pb-20">
        {/* Province Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] w-full flex items-end pb-16">
          <Image
            src={heroImage}
            alt={province.name}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={blurUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="container mx-auto px-4 relative z-10 w-full">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 font-medium text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wider text-white uppercase">
                <MapPin className="w-3 h-3" /> Pakistan Region
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white font-headline drop-shadow-lg mb-4">
              {province.name}
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-6">
              <div className="flex items-center gap-4 flex-wrap text-sm md:text-base font-medium">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-white/70">Best time to visit:</span>
                  <span className="text-white drop-shadow-sm font-bold">{details.bestTime}</span>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-white flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-primary" />
                  {details.weather}
                </div>
              </div>

              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-lg px-6 flex items-center gap-2 shadow-xl">
                <Bookmark className="w-4 h-4" /> Bookmark this Province
              </Button>
            </div>
          </div>
        </section>

        {/* About & 3D Map Section */}
        <section className="bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Region Overview</span>
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-slate-900 mb-6 drop-shadow-sm">About {province.name}</h2>
                <div className="w-20 h-1.5 bg-primary/20 rounded-full mb-8" />
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  {details.about}
                </p>
                <div className="mt-8 flex gap-4">
                  <Button asChild className="rounded-full shadow-lg hover:shadow-primary/30 px-8">
                    <Link href={`/map?region=${province.slug}`}>
                      Open Full Screen Explorer <MapIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="h-[350px] md:h-[450px] w-full relative">
                <EmbeddedMapClient spots={spots} />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-stone-50/50 -skew-x-12 translate-x-32 z-0 hidden lg:block" />
        </section>

        {/* Districts Grid */}
        <section className="container mx-auto px-4 mt-12 relative z-20">
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-3xl font-bold font-headline text-slate-900">
                  Top Destinations in <span className="text-primary">{province.name}</span>
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Explore the {province.districts.length} most beautiful districts in this region.
                </p>
              </div>
            </div>

            {province.districts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {province.districts.map((district) => {
                  const image = getPlaceholderImage(district.image);
                  return (
                    <Link
                      key={district.slug}
                      href={`/districts/${district.slug}`}
                      className="group block"
                    >
                      <div className="relative h-72 rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300">
                        <Image
                          src={image.imageUrl}
                          alt={district.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          placeholder="blur"
                          blurDataURL={blurUrl}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity group-hover:opacity-90" />

                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                          <h3 className="text-2xl font-bold font-headline tracking-tight group-hover:text-primary transition-colors">
                            {district.name}
                          </h3>
                          <div className="mt-3 flex items-center font-bold text-sm bg-white/20 backdrop-blur-md w-max px-4 py-2 rounded-full opacity-0 transform translate-y-4 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 uppercase tracking-widest text-white shadow-lg">
                            Visit <ArrowRight className="ml-2 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 bg-stone-50 rounded-2xl border border-dashed border-slate-300">
                No districts available for this province yet. Check back soon!
              </div>
            )}
          </div>
        </section>

        {/* Tourist Spots from Map Data */}
        <section className="container mx-auto px-4 mt-20 relative z-20">
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-md border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-3xl font-bold font-headline text-slate-900">
                  Local Partners in <span className="text-primary">{province.name}</span>
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Approved hotels, guesthouses, cafes, restaurants, guides, and activity providers visible to all PakVista users.
                </p>
              </div>
              <Button asChild className="hidden md:flex rounded-full mt-6 md:mt-0 shadow-lg hover:shadow-primary/30">
                <Link href="/partners">
                  Become a Partner <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {publicPartners.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {publicPartners.map((partner) => (
                  <article
                    key={partner.id}
                    className="rounded-2xl border border-slate-200 bg-stone-50 p-6 transition-colors hover:border-primary/40 hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{partner.name}</h3>
                        <p className="mt-1 text-sm font-medium capitalize text-primary">{partner.type}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Verified
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p><strong>District:</strong> {partner.district || "Not specified"}</p>
                      <p><strong>Location:</strong> {partner.location || "Not specified"}</p>
                      {partner.contactPerson ? <p><strong>Contact:</strong> {partner.contactPerson}</p> : null}
                    </div>

                    {partner.description ? (
                      <p className="mt-4 text-sm leading-6 text-slate-600">{partner.description}</p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      {partner.phone ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{partner.phone}</span>
                      ) : null}
                      {partner.website ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{partner.website}</span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-stone-50 px-6 py-16 text-center text-slate-500">
                No approved local partners are listed for this province yet.
              </div>
            )}

            <div className="mt-8 flex justify-center md:hidden">
              <Button asChild className="rounded-full shadow-lg">
                <Link href="/partners">
                  Become a Partner <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 mt-20 relative z-20">
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-md border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-3xl font-bold font-headline text-slate-900">
                  Tourist Spots in <span className="text-primary">{province.name}</span>
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                  {spots.length} featured attractions and points of interest from our interactive map.
                </p>
              </div>
              <Button asChild className="hidden md:flex rounded-full mt-6 md:mt-0 shadow-lg hover:shadow-primary/30">
                <Link href={`/map?region=${province.slug}`}>
                  <MapIcon className="w-4 h-4 mr-2" /> View on Map
                </Link>
              </Button>
            </div>

            {spots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {spots.map((spot: any, index: number) => {
                  const p = spot.properties;
                  return (
                    <div key={`${p._key}-${index}`} className="group relative bg-stone-50 rounded-2xl p-6 border border-slate-200 hover:border-primary/50 transition-colors hover:shadow-xl hover:bg-white flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                          {p.category || 'Spot'}
                        </span>
                        <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 font-headline line-clamp-2">
                        {p._key || 'Tourist Destination'}
                      </h3>

                      {p.district && (
                        <p className="text-sm text-slate-500 font-medium mb-4 flex items-center">
                          {p.district} {p.tehsil ? `• ${p.tehsil}` : ''}
                        </p>
                      )}

                      <p className="text-sm text-slate-600 line-clamp-3 mt-auto relative z-10 group-hover:text-slate-700 transition-colors">
                        {p.Desc || "Experience the breathtaking beauty and cultural heritage of this magnificent location."}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 bg-stone-50 rounded-2xl border border-dashed border-slate-300">
                Map data is being updated.
              </div>
            )}

            <div className="mt-12 flex justify-center md:hidden">
              <Button asChild className="rounded-full shadow-lg">
                <Link href={`/map?region=${province.slug}`}>
                  <MapIcon className="w-4 h-4 mr-2" /> View on Interactive Map
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
  );
}
