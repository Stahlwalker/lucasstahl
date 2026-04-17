import { readFileSync, writeFileSync } from "fs";
import Anthropic from "@anthropic-ai/sdk";

const ASTRO_FILE = "astro-site/src/pages/ai-models-guide.astro";
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractFrontmatter(content) {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) throw new Error("Could not find frontmatter in .astro file");
  return match[1];
}

function replaceFrontmatter(content, newFrontmatter) {
  return content.replace(FRONTMATTER_REGEX, `---\n${newFrontmatter}\n---`);
}

function validateFrontmatter(fm) {
  const required = [
    "quickReference",
    "frontierModels",
    "specializedModels",
    "openSourceModels",
    "imageVideoModels",
    "scenarios",
  ];
  for (const key of required) {
    if (!fm.includes(key)) {
      throw new Error(`Missing required data array: ${key}`);
    }
  }
  if (!fm.includes("import Layout")) {
    throw new Error("Missing Layout import");
  }
}

async function main() {
  const fileContent = readFileSync(ASTRO_FILE, "utf-8");
  const currentFrontmatter = extractFrontmatter(fileContent);

  const systemPrompt = `You are an AI research assistant that keeps an AI models guide accurate and up to date.

Your job:
1. Search the web for AI model news from the PAST 7 DAYS ONLY.
2. Also fetch lukestahl.io/ai-models-guide/ to confirm the current published state.
3. Compare what you find against the current data provided.
4. If there are meaningful updates, return the COMPLETE updated frontmatter JavaScript code.
5. If nothing meaningful changed, respond with exactly: NO_UPDATES

WHAT COUNTS AS A MEANINGFUL UPDATE:
- A new major model release (e.g., GPT-6, Claude 5, Gemini 4)
- A new model variant or tier (e.g., Flash, Flash-Lite, Codex, Mini, Nano)
- A significant version bump to an existing model (e.g., Claude Opus 4.8, GPT-5.5)
- A major new entrant to the market (any lab, including Microsoft, Apple, etc.)
- A new open-weight model release (e.g., new Gemma, Llama variants)
- A model being discontinued or replaced
- A significant new capability (new modality, large context window increase, agentic features)
- A new image/video/audio generation model release
- A pricing change that is 2x or more different from what's in the guide
- A restricted/specialized model released (e.g., cybersecurity-focused, domain-specific)

WHAT DOES NOT COUNT:
- Minor benchmark score changes
- Rumors or leaked info about unreleased models (note as "Expected" but don't treat as released)
- Blog posts or opinion pieces with no official announcement
- Minor API updates or SDK changes

SOURCE QUALITY RULES (CRITICAL):
- For EXISTING models, only use official sources: company blogs (openai.com/blog, anthropic.com/news, blog.google, mistral.ai/news, ai.meta.com/blog, deepseek.com, qwenlm.github.io, cursor.com/blog, x.ai/blog, perplexity.ai/blog, moonshot.cn, zhipuai.cn, stability.ai/news, blackforestlabs.ai, midjourney.com/blog), official docs, and arxiv.org papers.
- For discovering NEW models, search broadly, but MUST find an official announcement before adding. Do NOT rely on AI-generated roundup articles, SEO listicles, or aggregator sites.
- Every change in the CHANGELOG must include a URL to an official or primary source. If you cannot find one, do not include the claim.
- Do NOT use information sourced only from other AI models, AI-generated blog posts, or content farms.

RULES FOR OUTPUT:
- If updates are found, output the COMPLETE frontmatter code (everything between the --- markers).
- Preserve the EXACT same data structure, variable names, field names, and array shapes.
- Preserve the Layout import at the top.
- Keep all existing arrays: quickReference, frontierModels, specializedModels, openSourceModels, imageVideoModels, scenarios.
- Keep all existing models — never remove a model unless it was fully discontinued and replaced.
- Add a comment at the top: // Last auto-updated: YYYY-MM-DD
- After the frontmatter code block, output a section starting with "CHANGELOG:" listing each change with its official source URL.
- If no updates, respond with exactly: NO_UPDATES`;

  const userPrompt = `Here is the current AI models guide frontmatter data. Search the web for AI model updates from the past 7 days and tell me if anything needs to change.

Current data:
\`\`\`javascript
${currentFrontmatter}
\`\`\`

Search for recent updates to: GPT-5.x (OpenAI), Claude 4.x (Anthropic), Gemini 3.x / Gemma 4 (Google), Grok 4.x (xAI), Llama 4 (Meta), DeepSeek V3.2/V4, Mistral family (Large, Magistral, Devstral, Small, Voxtral), Qwen 3.x (Alibaba), Microsoft MAI, Kimi K2.5 (Moonshot), GLM-5.1 (Zhipu), Sonar (Perplexity), Composer 2 (Cursor), GPT-5.4-Cyber, Claude Mythos, Midjourney, Imagen, DALL-E, Stable Diffusion, FLUX.2, Veo 3.1, Kling, Runway, and any major new AI models or restricted/specialized models released in the past week.`;

  console.log("Searching for AI model updates via Claude web search...");

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 10 }],
  });

  // Extract text blocks from response (web_search results are handled server-side)
  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText += block.text;
    }
  }

  console.log(
    `Web searches used: ${response.usage?.server_tool_use?.web_search_requests ?? "unknown"}`
  );

  if (!responseText.trim()) {
    console.log("Empty response from Claude. Skipping update.");
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  if (responseText.trim() === "NO_UPDATES" || responseText.includes("NO_UPDATES")) {
    console.log("No meaningful updates found this week.");
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  // Extract the frontmatter code block
  const codeMatch = responseText.match(/```(?:javascript|js|astro)?\n([\s\S]*?)```/);
  if (!codeMatch) {
    console.log("Response did not contain a valid code block. Skipping update.");
    console.log("Raw response preview:", responseText.substring(0, 500));
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  const newFrontmatter = codeMatch[1].trim();

  try {
    validateFrontmatter(newFrontmatter);
  } catch (err) {
    console.error("Validation failed:", err.message);
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  const updatedContent = replaceFrontmatter(fileContent, newFrontmatter);
  writeFileSync(ASTRO_FILE, updatedContent, "utf-8");

  const changelogMatch = responseText.match(/CHANGELOG:([\s\S]*?)$/);
  const changelog = changelogMatch
    ? changelogMatch[1].trim()
    : "Updates applied (see diff for details)";

  console.log("\nUpdates applied successfully!");
  console.log("\n--- CHANGELOG ---");
  console.log(changelog);
  console.log("STATUS=updated");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
