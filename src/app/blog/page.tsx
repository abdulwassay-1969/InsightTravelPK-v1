"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf6] pt-24 pb-12 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <Badge className="bg-teal-600/10 text-teal-700 hover:bg-teal-600/20 px-4 py-1 rounded-full border-teal-600/20">
            Explorer Insights
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-black text-[#003D5B] tracking-tight">
            The PakVista Blog
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Discover travel stories, destination guides, and local secrets from every corner of Pakistan.
          </p>
        </div>

        {/* Featured Post (Optional/Top) */}
        {BLOG_POSTS.filter(p => p.featured).map(post => (
          <Link key={post.id} href={`/blog/${post.id}`} className="block mb-12 group">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-2xl hover:border-teal-500/20 grid md:grid-cols-2">
              <div className="relative h-[300px] md:h-full overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white/90 backdrop-blur-md text-teal-700 font-bold border-none">
                    Featured Story
                  </Badge>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4 text-xs font-bold text-teal-600 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {post.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#003D5B] group-hover:text-teal-600 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {post.description}
                </p>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[#003D5B]">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{post.author}</span>
                  </div>
                  <div className="flex items-center text-teal-600 font-black text-sm uppercase tracking-widest">
                    Read Story <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {BLOG_POSTS.filter(p => !p.featured).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group h-full">
              <Card className="h-full flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/20">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-100 font-bold">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-[#003D5B] group-hover:text-teal-600 transition-colors leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-400">{post.date}</span>
                    <div className="flex items-center text-teal-600 font-black text-xs uppercase tracking-widest">
                      Read More <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-24 rounded-[3rem] bg-[#003D5B] p-12 md:p-20 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -mr-32 -mt-32" />
          <div className="max-w-2xl mx-auto space-y-6 relative">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">Stay Updated on Pakistan Travel</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Join 5,000+ travelers getting our monthly guide to the best events, 
              weather windows, and hidden spots across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow rounded-2xl bg-white/10 border border-white/20 px-6 h-14 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="bg-teal-600 hover:bg-teal-500 text-white rounded-2xl px-10 h-14 font-black shadow-xl transition-transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
