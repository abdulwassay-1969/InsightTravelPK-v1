"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Tag, User, Share2, Facebook, Twitter, MessageSquare } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fdfcf6] pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-teal-600 font-black text-sm uppercase tracking-widest mb-10 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Hero Area */}
        <div className="space-y-8 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <Badge className="bg-teal-600 text-white border-none px-4 py-1 rounded-full font-bold">
              {post.category}
            </Badge>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#003D5B] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 py-6 border-y border-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#003D5B] border border-teal-100 shadow-inner">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black text-[#003D5B] uppercase tracking-wider">{post.author}</p>
              <p className="text-xs text-slate-500 font-medium">Verified Contributor</p>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl mb-12 relative aspect-[21/9]">
          <img 
            src={post.image} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-[1fr_80px] gap-12">
          <div className="prose prose-lg max-w-none prose-slate prose-headings:text-[#003D5B] prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-teal-700">
            <p className="text-xl font-medium text-slate-500 italic mb-10 leading-relaxed border-l-4 border-teal-500 pl-6">
              {post.description}
            </p>
            
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
            
            <div className="mt-16 p-10 rounded-[2rem] bg-teal-50 border border-teal-100 space-y-4">
              <h3 className="text-2xl font-black text-[#003D5B] m-0">Plan your own journey</h3>
              <p className="text-slate-600 m-0">Inspired by this story? Use our AI Travel Planner to build a custom itinerary for your next Pakistan adventure.</p>
              <div className="pt-4">
                <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 font-bold px-8">
                  <Link href="/planner">Start Planning Now</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Social Share (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">Share</p>
            <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">#TourismPK</Badge>
             <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">#Adventure</Badge>
          </div>
          <Link href="/blog" className="text-teal-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
            Read more stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
