import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ShieldCheck, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);
  
  if (!post) {
    return {
      title: "Статията не е намерена | Д-р Данка Николова",
      description: "Търсената блог статия не е намерена.",
    };
  }

  return {
    title: `${post.title} | Д-р Данка Николова`,
    description: post.summary,
    alternates: {
      canonical: `/blog/${post.id}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-brand-light min-h-screen pb-24">
      {/* Breadcrumb section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          Назад към блога
        </Link>
      </div>

      {/* Banner / Header Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg border border-brand-green/10">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded bg-brand-gold text-brand-dark text-[10px] font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-brand-green/5 p-6 sm:p-10 md:p-12 shadow-sm space-y-8">
          
          {/* Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-green/5 text-xs sm:text-sm text-brand-dark/50">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-brand-gold" />
                Публикувано на: <strong className="ml-1 text-brand-green">{post.date}</strong>
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-brand-gold" />
                Време за четене: <strong className="ml-1 text-brand-green">{post.readTime}</strong>
              </span>
            </div>
            
            <div className="flex items-center text-brand-gold font-semibold uppercase tracking-wider text-xs">
              <BookOpen className="h-4 w-4 mr-1.5" />
              <span>Д-р Данка Николова</span>
            </div>
          </div>

          {/* Render article body */}
          <div className="prose max-w-none text-brand-dark/90 leading-relaxed font-sans">
            {post.content}
          </div>

          {/* Action / Booking Card at the bottom */}
          <div className="mt-12 bg-brand-light border border-brand-green/10 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green flex items-center justify-center md:justify-start">
                <ShieldCheck className="h-5 w-5 mr-2 text-brand-gold" />
                Не оставяйте бизнеса си в риск от глоби!
              </h4>
              <p className="text-xs sm:text-sm text-brand-dark/70 max-w-xl">
                Желаете ли професионална проверка на Вашите етикети, НАССР системи или консултация за безпроблемна БАБХ регистрация?
              </p>
            </div>
            <Link
              href="/consultations"
              className="px-6 py-3.5 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-widest transition-colors rounded shadow shrink-0 text-center cursor-pointer hover:text-white"
            >
              Заяви консултация
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
