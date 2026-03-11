# AI Models Cheat Sheet

_A quick-reference guide to the major AI models, who makes them, and what they do best._

**Updated March 2026**

---

## Quick Reference

| Model          | Company         | Best For            | Key Differentiator                                                   |
| -------------- | --------------- | ------------------- | -------------------------------------------------------------------- |
| GPT-5.x        | OpenAI          | General purpose     | Dynamic routing picks the right sub-model per request                |
| Claude 4.6     | Anthropic       | Coding & reasoning  | Top human-preference scores; agentic autonomy                        |
| Gemini 3.x     | Google DeepMind | Multimodal          | Best benchmark breadth; strong pricing; Google Workspace integration |
| Grok 4.x       | xAI             | Real-time info      | Live X/Twitter data; multi-agent parallel reasoning                  |
| Llama 4        | Meta            | Open-source         | 10M token context; fully self-hostable                               |
| DeepSeek V3/R1 | DeepSeek (CN)   | Cost efficiency     | Frontier performance trained for under $6M; open source              |
| Mistral Large  | Mistral (FR)    | EU compliance       | Enterprise-safe; strong open-weight models for regulated industries  |
| Qwen 3         | Alibaba (CN)    | Multilingual        | 119 languages; models from 0.6B to 1T+ parameters                   |
| Kimi K2.5      | Moonshot AI     | Agentic open-source | 1T params; Agent Swarm coordinates up to 100 sub-agents             |
| GLM-5          | Zhipu AI        | Open frontier       | 744B MoE; MIT license; trained on zero NVIDIA GPUs                   |

---

## Frontier Language Models (LLMs)

### GPT-5.x Series

**OpenAI** · San Francisco

The versatile all-rounder with dynamic internal routing.

- GPT-5.4 is the current flagship with a 1M token context window
- Uses an internal router to select the right sub-model per request in real time
- Native computer use and tool calling for agentic automation
- Strong at documentation, unit tests, and complex SQL queries
- **Best for:** Rapid prototyping, general-purpose tasks, API automation

### Claude 4.6 Family

**Anthropic** · San Francisco

The developer favorite for coding, reasoning, and safety.

- **Models:** Opus 4.6 (flagship), Sonnet 4.6 (best value), Haiku 4.5 (fast/cheap)
- Leads human-preference leaderboards (GDPval-AA); strong ARC-AGI-2 scores
- Agentic capabilities: can work autonomously on multi-step coding tasks
- Known for safety, steerability, and high-quality long-form writing
- **Best for:** Software development, agentic workflows, analysis, writing

### Gemini 3.x

**Google DeepMind** · Mountain View

Multimodal powerhouse with top benchmark breadth.

- Gemini 3.1 Pro leads the Artificial Analysis Intelligence Index
- Native multimodal: processes text, images, audio, and video natively
- 1M token context window; deep Google Workspace integration
- Strong value at $2/$12 per million input/output tokens
- **Best for:** Multimodal apps, Google Workspace users, cost-conscious teams

### Grok 4.x

**xAI (Elon Musk)** · Austin

Real-time data meets raw reasoning power.

- Grok 4.20 uses native multi-agent architecture with four specialist agents that debate before responding
- Real-time integration with X (Twitter) for current events and trending data
- Scored 100% on AIME 2025 math competition (Heavy variant)
- Less filtered personality; positioned as an alternative to corporate AI
- **Best for:** Real-time info, math/science, users who want less guardrails

### Sonar (Perplexity)

**Perplexity AI** · San Francisco

Search-native AI built for grounded, cited answers.

- Built on Llama 3.3 70B, further trained for search-grounded factuality
- Runs at 1,200 tokens/sec on Cerebras inference hardware
- Model family: Sonar, Sonar Pro, Reasoning Pro, Deep Research
- Matches GPT-4o on user satisfaction benchmarks
- **Best for:** Research with citations, competitive analysis, fact-checking

### Composer 1.5 (Cursor)

**Cursor** · San Francisco

AI-native coding model built for software engineering.

- Mixture-of-experts model trained via RL in real development environments
- 4x faster generation than comparable frontier coding models
- Background agents run tasks autonomously while you work
- Cursor Automations trigger agents from GitHub PRs, Slack, Linear, PagerDuty
- **Best for:** Agentic coding, background development, automated workflows

---

## Open-Source & Cost-Efficient Models

### Llama 4

**Meta** · Menlo Park

The leading open-source model family.

- Llama 4 Scout: industry-leading 10M token context window
- Fully open weights; can be self-hosted for complete data control
- Performance competitive with paid frontier models
- Requires powerful hardware for full-scale deployment
- **Best for:** Self-hosting, privacy-sensitive orgs, custom fine-tuning

### DeepSeek V3.2 / R1

**DeepSeek** · Hangzhou, China

Frontier performance at a fraction of the cost.

- 671B parameter MoE model famously trained for under $6M
- R1 variant excels at transparent, step-by-step reasoning
- V3.2-Speciale matches GPT-5 level performance on key benchmarks
- Open-source with competitive benchmark scores; V4 multimodal imminent
- **Best for:** Budget-conscious teams, math/reasoning, open-source self-hosting

### Kimi K2.5

**Moonshot AI** · Beijing, China

Open-source agentic powerhouse with Agent Swarm.

- 1T total parameters (32B active), MoE architecture with native vision-language
- Agent Swarm coordinates up to 100 specialized sub-agents in parallel
- Kimi Code CLI agent rivals Claude Code and Gemini CLI
- Backed by Alibaba and HongShan; strong global traction
- **Best for:** Agentic workflows, open-source self-hosting, multimodal tasks

### GLM-5

**Zhipu AI** · Beijing, China

Frontier-class model on a MIT license.

- 744B parameter MoE model (44B active) with 200K context window
- Released under MIT license; trained entirely on Huawei Ascend chips
- 77.8% on SWE-bench Verified; 50.4% on Humanity's Last Exam
- Priced roughly 6x cheaper than comparable proprietary models
- **Best for:** Budget-conscious teams, open-source deployment, coding

### Mistral Large 3

**Mistral AI** · Paris, France

The enterprise-safe European choice.

- Strong open-weight models designed for EU AI Act compliance
- Default choice for regulated industries (finance, healthcare, government)
- Good multilingual support, especially French and European languages
- Balances capability with privacy and sovereignty requirements
- **Best for:** EU-regulated enterprises, privacy-first deployments

### Qwen 3

**Alibaba Cloud** · Hangzhou, China

The multilingual giant.

- Supports 119 languages with hybrid Mixture-of-Experts architecture
- 0.6B to 235B open-weight; Qwen3-Max (1T+) API-only; Qwen3-Coder (480B) for code
- Competitive with DeepSeek-R1 and OpenAI o1 on reasoning benchmarks
- Qwen3-Coder achieves 69.6% on SWE-Bench Verified, surpassing many frontier models
- **Best for:** International businesses, multilingual apps, flexible deployment

---

## Image & Video Generation

| Model                | Company          | Best For                                                              |
| -------------------- | ---------------- | --------------------------------------------------------------------- |
| Midjourney v7        | Midjourney       | Artistic, stylized visuals with strong aesthetic control              |
| Imagen 4             | Google           | Photorealistic composition, spelling, and typography accuracy         |
| Nano Banana 2        | Google           | Fast AI image editing, remixing, and style transfers                  |
| DALL-E 4             | OpenAI           | Integrated with ChatGPT; strong prompt adherence                     |
| Stable Diffusion 3.5 | Stability AI    | Open-source; self-hostable; highly customizable                      |
| FLUX.2               | Black Forest Labs | From the Stable Diffusion creators; up to 4MP; open-weight Klein variant |

**Video generation leaders:** Google Veo 3.1 (native 4K + vertical video), Sora 2 (OpenAI, up to 25s + Disney partnership), Kling 3.0 (native 4K/60fps), and Runway Gen-4 (creative/cinematic).

---

## Picking the Right Model

| Use Case                             | Go With              |
| ------------------------------------ | -------------------- |
| General purpose                      | GPT-5.x              |
| Coding & agentic work               | Claude 4.6           |
| Multimodal & Google ecosystem        | Gemini 3.x           |
| Real-time data & math               | Grok 4.x             |
| Open-source self-hosting             | Llama 4 or DeepSeek  |
| Open-source agentic workflows       | Kimi K2.5            |
| MIT-licensed frontier alternative    | GLM-5                |
| EU compliance & regulated industries | Mistral              |
| Multilingual / international         | Qwen 3               |

---

_There is no single "best" model in 2026. The landscape has shifted from a winner-take-all race to specialized excellence. Match the model to the task._

---

## Resources

Official sources used to verify model claims and attributes.

### GPT-5.x (OpenAI)
- [Introducing GPT-5.4](https://openai.com/index/introducing-gpt-5-4/)
- [GPT-5.4 Model — API Docs](https://developers.openai.com/api/docs/models/gpt-5.4)
- [Introducing GPT-5](https://openai.com/index/introducing-gpt-5/)
- [GPT-5 System Card](https://openai.com/index/gpt-5-system-card/)
- [Using GPT-5.4 — Prompt Guidance](https://developers.openai.com/api/docs/guides/latest-model/)

### Claude 4.6 (Anthropic)
- [Introducing Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6)
- [Introducing Claude Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6)
- [Introducing Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)
- [Claude Opus 4.6 Product Page](https://www.anthropic.com/claude/opus)
- [Claude Opus 4.6 Risk Report](https://anthropic.com/claude-opus-4-6-risk-report)
- [Models Overview — Anthropic Docs](https://docs.anthropic.com/en/docs/about-claude/models/overview)

### Gemini 3.x (Google DeepMind)
- [Gemini 3.1 Pro Model Card](https://deepmind.google/models/model-cards/gemini-3-1-pro/)
- [Gemini 3.1 Pro Blog Post](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/)
- [Gemini 3.1 Pro Preview — API Docs](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Artificial Analysis — Gemini 3.1 Pro: New Leader in AI](https://artificialanalysis.ai/articles/gemini-3-1-pro-preview-new-leader-in-ai)

### Grok 4.x (xAI)
- [xAI Launches Grok 4.20 — NextBigFuture](https://www.nextbigfuture.com/2026/02/xai-launches-grok-4-20-and-it-has-4-ai-agents-collaborating.html)
- [Evaluating Grok 4's Math Capabilities — Epoch AI](https://epoch.ai/blog/grok-4-math)
- [AIME 2025 Benchmark Analysis — IntuitionLabs](https://intuitionlabs.ai/articles/aime-2025-ai-benchmark-explained)

### Llama 4 (Meta)
- [Llama 4 Multimodal Intelligence — Meta AI Blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Llama 4 Models — llama.com](https://www.llama.com/models/llama-4/)

### DeepSeek V3.2 / R1
- [DeepSeek-V3 Technical Report — arXiv](https://arxiv.org/html/2412.19437v1)
- [DeepSeek-R1 Paper — arXiv](https://arxiv.org/pdf/2501.12948)
- [DeepSeek-R1 — Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1)
- [DeepSeek-V3.2 — Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3.2)
- [Complete Guide to DeepSeek Models — BentoML](https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond)

### Kimi K2.5 (Moonshot AI)
- [Moonshot Releases Kimi K2.5 — TechCrunch](https://techcrunch.com/2026/01/27/chinas-moonshot-releases-a-new-open-source-model-kimi-k2-5-and-a-coding-agent/)
- [Kimi K2.5 Swarm Architecture — InfoQ](https://www.infoq.com/news/2026/02/kimi-k25-swarm/)
- [Moonshot AI Releases Kimi K2.5 — SiliconANGLE](https://siliconangle.com/2026/01/27/moonshot-ai-releases-open-source-kimi-k2-5-model-1t-parameters/)

### GLM-5 (Zhipu AI)
- [Zhipu AI Launches GLM-5 — South China Morning Post](https://www.scmp.com/tech/article/3343239/chinas-zhipu-ai-launches-new-major-model-glm-5-challenge-its-rivals)
- [Zhipu Unveils New AI Model — Bloomberg](https://www.bloomberg.com/news/articles/2026-02-11/china-s-zhipu-unveils-new-ai-model-jolting-race-with-deepseek)
- [GLM-5: China's First Public AI Company Ships a Frontier Model — Maxime Labonne](https://medium.com/@mlabonne/glm-5-chinas-first-public-ai-company-ships-a-frontier-model-a068cecb74e3)

### Mistral Large 3
- [Introducing Mistral 3](https://mistral.ai/news/mistral-3)
- [Mistral Large 3 — AI Governance](https://legal.mistral.ai/ai-governance/models/mistral-large-3)
- [Mistral Solutions](https://mistral.ai/solutions)

### Qwen 3 (Alibaba)
- [Qwen3: Think Deeper, Act Faster — Official Blog](https://qwenlm.github.io/blog/qwen3/)
- [Qwen3-Coder — Official Blog](https://qwenlm.github.io/blog/qwen3-coder/)
- [Qwen3-Max Arrives with 1T+ Parameters — VentureBeat](https://venturebeat.com/ai/qwen3-max-arrives-in-preview-with-1-trillion-parameters-blazing-fast)

### Sonar (Perplexity)
- [Meet New Sonar — Perplexity Blog](https://www.perplexity.ai/hub/blog/meet-new-sonar)
- [Improved Sonar Models — Perplexity Blog](https://www.perplexity.ai/hub/blog/new-sonar-search-modes-outperform-openai-in-cost-and-performance)
- [Perplexity API Changelog](https://docs.perplexity.ai/changelog/changelog)

### Composer 1.5 (Cursor)
- [Composer: Building a Fast Frontier Model with RL](https://cursor.com/blog/composer)
- [Cursor Automations — TechCrunch](https://techcrunch.com/2026/03/05/cursor-is-rolling-out-a-new-system-for-agentic-coding/)
- [Cursor Changelog](https://cursor.com/changelog)

### Image & Video Generation
- [FLUX.2 — Black Forest Labs](https://bfl.ai/flux2)
- [Kling 3.0 Launch — Kuaishou](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-launches-30-model-ushering-era-where-everyone-can-be/)
- [Sora 2 — OpenAI](https://openai.com/index/sora-2/)
- [Veo 3.1 — Google Blog](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/)
