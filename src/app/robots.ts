import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

/** Gated, personal or transactional routes — never index, never feed an LLM. */
const PRIVATE_PATHS = [
  "/api/",
  "/profile",
  "/courses/", // gated, personalised course pages + viewers
  "/*/viewer",
  "/*/success",
];

/**
 * Crawlers that feed answer engines (ChatGPT, Claude, Perplexity, Copilot,
 * Gemini / AI Overviews).
 *
 * They already inherit the "*" rule, but naming them explicitly matters: some
 * of these agents are configured by their operators to skip sites that never
 * grant them a named rule, and a wildcard-only robots.txt gives an auditor no
 * way to tell "allowed on purpose" from "nobody ever thought about it".
 * Removing a name here is how you opt OUT of that engine's answers.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — crawl behind ChatGPT
  "OAI-SearchBot", // OpenAI — ChatGPT Search index
  "ChatGPT-User", // OpenAI — live fetch while answering a user
  "ClaudeBot", // Anthropic — crawl
  "Claude-User", // Anthropic — live fetch while answering
  "Claude-SearchBot", // Anthropic — search index
  "anthropic-ai",
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity live fetch
  "Google-Extended", // Gemini + AI Overviews grounding
  "Applebot-Extended", // Apple Intelligence
  "Bingbot", // the index Microsoft Copilot answers from
  "CCBot", // Common Crawl — corpus behind most open models
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
];

/**
 * robots.txt — allow crawling of public content, keep private / transactional
 * routes (checkout, account, course viewers, API) out of the index, and grant
 * answer-engine crawlers the same access as classic search bots.
 */
export default function robots(): MetadataRoute.Robots {
  const publicRule = (userAgent: string | string[]) => ({
    userAgent,
    allow: "/",
    disallow: PRIVATE_PATHS,
  });

  return {
    rules: [publicRule("*"), publicRule(AI_CRAWLERS)],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
