'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const provinceData = [
  {
    name: 'Gilgit-Baltistan',
    slug: 'gilgit-baltistan',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2000&auto=format&fit=crop',
    teaser: 'Home to the world\'s highest peaks and breathtaking valleys.',
    colSpan: 'md:col-span-2 lg:col-span-2'
  },
  {
    name: 'Khyber Pakhtunkhwa',
    slug: 'khyber-pakhtunkhwa',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000&auto=format&fit=crop',
    teaser: 'Lush green valleys, roaring rivers, and rich Pashtun heritage.',
    colSpan: 'col-span-1'
  },
  {
    name: 'Punjab',
    slug: 'punjab',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop',
    teaser: 'The land of five rivers, vibrant culture, and historical marvels.',
    colSpan: 'col-span-1'
  },
  {
    name: 'Sindh',
    slug: 'sindh',
    image: 'https://images.unsplash.com/photo-1683553238308-9e33dcda0986?q=80&w=2000&auto=format&fit=crop',
    teaser: 'Ancient civilizations, mystic shrines, and the coastal breeze.',
    colSpan: 'col-span-1'
  },
  {
    name: 'Balochistan',
    slug: 'balochistan',
    image: 'https://images.unsplash.com/photo-1604440095301-4ec2f9230155?q=80&w=2000&auto=format&fit=crop',
    teaser: 'Rugged mountains, unique mud volcanoes, and pristine coastline.',
    colSpan: 'col-span-1'
  },
  {
    name: 'Azad Kashmir',
    slug: 'azad-kashmir',
    image: 'https://images.unsplash.com/photo-1604689846011-fabb50d9369c?q=80&w=2000&auto=format&fit=crop',
    teaser: 'Heaven on earth with its dense forests and crystal clear lakes.',
    colSpan: 'col-span-1'
  },
  {
    name: 'Islamabad Capital',
    slug: 'islamabad-capital-territory',
    image: 'https://images.unsplash.com/photo-1644337544049-08fb5ac82628?q=80&w=2000&auto=format&fit=crop',
    teaser: 'Margalla hills nested capital offering a blend of nature and modern life.',
    colSpan: 'md:col-span-2 lg:col-span-1'
  }
];

const blurUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8+v//fwAJaQOE+e1wFAAAAABJRU5ErkJggg==";

export default function DistrictsSection() {
  return (
    <section id="provinces" className="py-20 md:py-32 bg-stone-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline md:text-5xl">
              Provinces of <span className="text-primary">Pakistan</span>
            </h2>
            <p className="mt-4 text-xl text-slate-600 font-medium">
              Explore the cultural and geographical diversity of Pakistan’s breathtaking regions. From snowy peaks to golden deserts.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full px-6 py-6 border-slate-300 hover:bg-primary hover:text-white transition-colors text-lg" asChild>
            <Link href="/map">View Detailed Map <MapPin className="w-5 h-5"/></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[350px]">
          {provinceData.map((province) => (
            <Link 
              href={`/provinces/${province.slug}`} 
              key={province.slug} 
              className={`group relative overflow-hidden rounded-3xl border-0 shadow-lg cursor-pointer ${province.colSpan}`}
            >
              <Card className="h-full w-full border-0 bg-transparent rounded-none">
              <Image
                src={province.image}
                alt={province.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                placeholder="blur"
                blurDataURL={blurUrl}
                priority={province.slug === 'gilgit-baltistan'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent transition-opacity duration-300" />
              
              <CardContent className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform transition-transform duration-500 ease-out translate-y-4 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wider uppercase mb-3">
                    <MapPin className="w-3 h-3" /> Region
                  </span>
                  <CardTitle className="text-3xl font-bold font-headline mb-2 drop-shadow-md">
                    {province.name}
                  </CardTitle>
                  <p className="text-sm md:text-base text-slate-200 line-clamp-2 md:line-clamp-none opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                    {province.teaser}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-bold text-sm bg-white w-max px-5 py-2.5 rounded-full opacity-0 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 uppercase tracking-widest shadow-xl">
                    Explore <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="flex items-center gap-2 rounded-full px-8 py-6 border-slate-300 hover:bg-primary hover:text-white transition-colors" asChild>
            <Link href="/map">View Detailed Map <MapPin className="w-4 h-4"/></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
