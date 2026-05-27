import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Блог за безопасност на храните | Д-р Данка Николова",
  description: "Практическа информация, експертни анализи на законите на БАБХ, НАССР системи и съвети за Вашия сигурен и безпроблемен бизнес с храни.",
};

export default function Blog() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header section */}
      <PageHero
        badgeText="ПОЛЕЗНИ СЪВЕТИ И СТАТИИ"
        title="Блог за безопасност на храните"
        subtitle="Практическа информация, експертни анализи на законите на БАБХ и съвети за Вашия сигурен и безпроблемен бизнес."
        icon={FileText}
      />

      {/* Grid of articles */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id}
              className="bg-white border border-brand-green/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-brand-light">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-4 text-[10px] sm:text-xs text-brand-dark/50">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-brand-gold/80" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-brand-gold/80" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-base sm:text-lg font-bold text-brand-green line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors duration-300">
                    <Link href={`/blog/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-brand-dark/70 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-brand-light text-brand-green text-[9px] sm:text-[10px] font-semibold border border-brand-green/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${post.id}`}
                  className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-brand-green hover:bg-brand-green/90 text-white rounded transition-all duration-300 flex items-center justify-center cursor-pointer hover:shadow-md hover:text-white"
                >
                  Прочети статията
                  <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials Banner to Consultations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-8 sm:p-12 border border-brand-gold/20 shadow-2xl relative overflow-hidden z-10">
          {/* Glow blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
          {/* Subtle mesh pattern for texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h3 className="font-serif text-xl sm:text-3xl font-bold">Имате ли казус във Вашия обект?</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Не оставяйте проверките на случайността. Запазете час за индивидуална онлайн консултация с д-р Николова и получете ясни отговори и решения.
            </p>
            <div className="pt-2">
              <Link
                href="/consultations"
                className="inline-flex items-center px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-colors rounded shadow-lg cursor-pointer"
              >
                Заяви консултация
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
