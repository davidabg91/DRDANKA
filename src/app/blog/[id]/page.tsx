import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, ShieldCheck, BookOpen, ExternalLink } from "lucide-react";
import { BLOG_POSTS, postIsoDate, type BlogPost } from "@/data/blogPosts";
import JsonLd from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { AUTHOR } from "@/lib/siteConfig";

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
      title: "Статията не е намерена",
      description: "Търсената блог статия не е намерена.",
    };
  }

  const published = postIsoDate(post);
  const image = { url: post.image, alt: post.imageAlt ?? post.title };

  return {
    title: post.seoTitle ?? post.title,
    description: post.summary,
    ...(post.keywords ? { keywords: post.keywords } : {}),
    alternates: {
      canonical: `/blog/${post.id}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/blog/${post.id}`,
      images: [image],
      ...(published ? { publishedTime: published, modifiedTime: published } : {}),
      authors: [AUTHOR.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image],
    },
  };
}

/** Up to `limit` other posts, preferring ones that share a tag with `post`. */
function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const others = BLOG_POSTS.filter((p) => p.id !== post.id);
  const shared = (p: BlogPost) => p.tags.filter((t) => post.tags.includes(t)).length;
  return [...others].sort((a, b) => shared(b) - shared(a)).slice(0, limit);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  const published = postIsoDate(post);
  const related = relatedPosts(post);

  return (
    <article className="bg-brand-light min-h-screen pb-24">
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.summary,
            path: `/blog/${post.id}`,
            image: post.image,
            datePublished: published,
            section: post.tags[0],
            keywords: post.keywords ?? post.tags,
            citations: post.sources,
          }),
          breadcrumbSchema([
            { name: "Начало", path: "/" },
            { name: "Блог", path: "/blog" },
            { name: post.title, path: `/blog/${post.id}` },
          ]),
          ...(post.faq?.length ? [faqSchema(post.faq)] : []),
        ]}
      />
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
        <div className="relative aspect-[4/3] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg border border-brand-green/10">
          <Image
            src={post.image}
            alt={post.imageAlt ?? post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 sm:p-10 text-white">
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
            <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-brand-green/5 p-6 sm:p-10 md:p-12 shadow-sm space-y-8">

          {/* Metadata Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-green/5 text-xs sm:text-sm text-brand-dark/50">
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6">
              <span className="flex items-center whitespace-nowrap">
                <Calendar className="h-4 w-4 mr-2 text-brand-gold shrink-0" />
                Публикувано на: <time dateTime={published} className="ml-1 font-bold text-brand-green">{post.date}</time>
              </span>
              <span className="flex items-center whitespace-nowrap">
                <Clock className="h-4 w-4 mr-2 text-brand-gold shrink-0" />
                Време за четене: <strong className="ml-1 text-brand-green">{post.readTime}</strong>
              </span>
            </div>

            <Link href="/about" rel="author" className="flex items-center text-brand-gold font-semibold uppercase tracking-wider text-xs whitespace-nowrap hover:underline">
              <BookOpen className="h-4 w-4 mr-1.5 shrink-0" />
              <span>{AUTHOR.name}</span>
            </Link>
          </div>

          {/* Render article body */}
          <div className="prose max-w-none text-brand-dark/90 leading-relaxed font-sans">
            {post.content}
          </div>

          {/* FAQ — mirrored as FAQPage JSON-LD above */}
          {post.faq?.length ? (
            <section className="pt-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mb-4">Често задавани въпроси</h2>
              <div className="space-y-3">
                {post.faq.map((qa) => (
                  <details key={qa.question} className="group bg-brand-light/60 border border-brand-green/10 rounded-xl px-5 py-4 open:bg-white open:border-brand-gold/40">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-sm sm:text-base text-brand-green">
                      <span>{qa.question}</span>
                      <span className="text-brand-gold text-xl leading-none transition-transform group-open:rotate-45 shrink-0">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-brand-dark/80 leading-relaxed">{qa.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* Sources */}
          {post.sources?.length ? (
            <section className="pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-dark/50 mb-2">Източници</h2>
              <ul className="space-y-1.5 text-xs text-brand-dark/60">
                {post.sources.map((s) => (
                  <li key={s.url} className="flex items-start gap-1.5">
                    <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-brand-gold" />
                    <a href={s.url} target="_blank" rel="noopener" className="underline hover:text-brand-gold">{s.name}</a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Author box — E-E-A-T: who stands behind the advice */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-brand-light/60 border border-brand-green/10 rounded-xl p-5 sm:p-6">
            <Image
              src="/danka-portrait.webp"
              alt={AUTHOR.name}
              width={88}
              height={88}
              className="rounded-full object-cover w-[88px] h-[88px] border-2 border-brand-gold/50 shrink-0"
            />
            <div className="text-center sm:text-left space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold">За автора</span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-brand-green">{AUTHOR.name}</h2>
              <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
                Доктор по контрол на храните и ветеринарно-санитарна експертиза, лицензиран водещ одитор по ISO 22000, IFS Food и ISO 9001, с над {AUTHOR.experienceYears} години опит в официалния контрол на храните.
              </p>
              <Link href="/about" className="inline-flex items-center text-xs font-bold text-brand-gold hover:underline">
                Повече за д-р Николова <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </section>

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

        {/* Related posts — internal linking */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mb-5">Още полезни статии</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.id}`}
                  className="group bg-white border border-brand-green/5 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-brand-light">
                    <Image
                      src={p.image}
                      alt={p.imageAlt ?? p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <time dateTime={postIsoDate(p)} className="text-[10px] text-brand-dark/50">{p.date}</time>
                    <h3 className="font-serif text-sm font-bold text-brand-green leading-snug line-clamp-3 group-hover:text-brand-gold transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
