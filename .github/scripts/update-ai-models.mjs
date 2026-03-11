import { readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";

const ASTRO_FILE = "astro-site/src/pages/ai-models-guide.astro";
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Extract frontmatter from .astro file
function extractFrontmatter(content) {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) throw new Error("Could not find frontmatter in .astro file");
  return match[1];
}

// Replace frontmatter in .astro file, preserving everything else
function replaceFrontmatter(content, newFrontmatter) {
  return content.replace(FRONTMATTER_REGEX, `---\n${newFrontmatter}\n---`);
}

// Validate that the output looks like valid frontmatter (basic checks)
function validateFrontmatter(fm) {
  const required = ["quickReference", "frontierModels", "openSourceModels", "imageVideoModels", "scenarios"];
  for (const key of required) {
    if (!fm.includes(key)) {
      throw new Error(`Missing required data: ${key}`);
    }
  }
  // Check it starts with an import
  if (!fm.includes("import Layout")) {
    throw new Error("Missing Layout import");
  }
}

async function main() {
  const fileContent = readFileSync(ASTRO_FILE, "utf-8");
  const currentFrontmatter = extractFrontmatter(fileContent);

  const systemPrompt = `You are an AI research assistant that checks for updates to AI models.

Your job:
1. Search the web for AI model news from the PAST 7 DAYS ONLY.
2. Compare what you find against the current data provided.
3. If there are meaningful updates, return the COMPLETE updated frontmatter JavaScript code.
4. If nothing meaningful changed, respond with exactly: NO_UPDATES

WHAT COUNTS AS A MEANINGFUL UPDATE:
- A new major model release (e.g., GPT-6, Claude 5, Gemini 4)
- A significant version bump to an existing model (e.g., GPT-5.5)
- A major new entrant to the market
- A model being discontinued or replaced
- A significant new capability added (e.g., new modality support)
- A new image/video generation model release

WHAT DOES NOT COUNT:
- Minor benchmark score changes
- Pricing changes
- Rumors or leaked info about unreleased models
- Blog posts or opinion pieces
- Minor API updates or SDK changes

SOURCE QUALITY RULES (CRITICAL):
- For EXISTING models, only use official sources: company blogs (openai.com/blog, anthropic.com/news, blog.google, mistral.ai/news, ai.meta.com/blog, deepseek.com, qwenlm.github.io), official docs, and arxiv.org papers
- For discovering NEW models, you may search broadly, but you MUST find an official announcement or company source before adding a model. Do NOT rely on AI-generated roundup articles, SEO listicles, or aggregator sites as primary sources.
- Every change in the CHANGELOG must include a URL to an official or primary source. If you cannot find an official source for a claim, do not include that claim.
- Do NOT use information sourced only from other AI models, AI-generated blog posts, or content farms.

RULES FOR OUTPUT:
- If updates are found, output the COMPLETE frontmatter code (everything between the --- markers)
- Preserve the EXACT same data structure, variable names, field names, and array shapes
- Preserve the Layout import at the top
- Keep all existing models — never remove a model unless it was fully discontinued and replaced
- Add a comment at the top of the output: // Last auto-updated: YYYY-MM-DD
- After the frontmatter code block, add a section starting with "CHANGELOG:" listing each change with its official source URL
- If no updates, respond with exactly: NO_UPDATES`;

  const userPrompt = `Here is the current AI models guide frontmatter data. Search the web for any AI model updates from the past 7 days and tell me if anything needs to change.

Current data:
\`\`\`javascript
${currentFrontmatter}
\`\`\`

Search for recent updates to: GPT-5, Claude 4.6, Gemini 3, Grok 4, Llama 4, DeepSeek, Mistral, Qwen 3, Kimi K2.5, GLM-5, Sonar (Perplexity), Composer (Cursor), Midjourney, Imagen, DALL-E, Stable Diffusion, FLUX.2, Nano Banana, Kling, Sora, Veo, and any major new AI models released this week.`;

  console.log("Searching for AI model updates...");

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    tools: [{ type: "web_search" }],
  });

  // Extract text from response
  const output = response.output;
  let responseText = "";
  for (const item of output) {
    if (item.type === "message") {
      for (const block of item.content) {
        if (block.type === "text") {
          responseText += block.text;
        }
      }
    }
  }

  // Check if no updates
  if (responseText.trim() === "NO_UPDATES" || responseText.includes("NO_UPDATES")) {
    console.log("No meaningful updates found this week.");
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  // Extract the frontmatter code from the response
  const codeMatch = responseText.match(/```(?:javascript|js)?\n([\s\S]*?)```/);
  if (!codeMatch) {
    console.log("Response did not contain a valid code block. Skipping update.");
    console.log("Raw response:", responseText.substring(0, 500));
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  const newFrontmatter = codeMatch[1].trim();

  // Validate before writing
  try {
    validateFrontmatter(newFrontmatter);
  } catch (err) {
    console.error("Validation failed:", err.message);
    console.log("STATUS=no_updates");
    process.exit(0);
  }

  // Write the updated file
  const updatedContent = replaceFrontmatter(fileContent, newFrontmatter);
  writeFileSync(ASTRO_FILE, updatedContent, "utf-8");

  // Extract and print changelog
  const changelogMatch = responseText.match(/CHANGELOG:([\s\S]*?)$/);
  const changelog = changelogMatch ? changelogMatch[1].trim() : "Updates applied (see diff for details)";

  console.log("\nUpdates applied successfully!");
  console.log("\n--- CHANGELOG ---");
  console.log(changelog);
  console.log("STATUS=updated");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
