# AI Models Cheat Sheet

_A quick-reference guide to the major AI models, who makes them, and what they do best._

**Updated March 2026**

---

## Quick Reference

| Model          | Company         | Best For           | Key Differentiator                                                   |
| -------------- | --------------- | ------------------ | -------------------------------------------------------------------- |
| GPT-5.x        | OpenAI          | General purpose    | Dynamic routing picks the right sub-model per request                |
| Claude 4.6     | Anthropic       | Coding & reasoning | Top human-preference scores; agentic autonomy                        |
| Gemini 3.x     | Google DeepMind | Multimodal         | Best benchmark breadth; strong pricing; Google Workspace integration |
| Grok 4.x       | xAI             | Real-time info     | Live X/Twitter data; multi-agent parallel reasoning                  |
| Llama 4        | Meta            | Open-source        | 10M token context; fully self-hostable                               |
| DeepSeek V3/R1 | DeepSeek (CN)   | Cost efficiency    | Frontier performance trained for under $6M; open source              |
| Mistral Large  | Mistral (FR)    | EU compliance      | Enterprise-safe; strong open-weight models for regulated industries  |
| Qwen 3         | Alibaba (CN)    | Multilingual       | 119 languages; models from 0.5B to 1T+ parameters                    |

---

## Frontier Language Models (LLMs)

### GPT-5.x Series

**OpenAI** · San Francisco

The versatile all-rounder with dynamic internal routing.

- GPT-5.4 is the current flagship with a 1M token context window
- Uses an internal router to select the right sub-model per request in real time
- Lowest syntax error rate in code generation among frontier models
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

- Grok 4 Heavy uses multi-agent parallel reasoning for hard problems
- Real-time integration with X (Twitter) for current events and trending data
- Scored 100% on AIME 2025 math competition (Heavy variant)
- Less filtered personality; positioned as an alternative to corporate AI
- **Best for:** Real-time info, math/science, users who want less guardrails

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

### DeepSeek V3 / R1

**DeepSeek** · Hangzhou, China

Frontier performance at a fraction of the cost.

- 671B parameter MoE model famously trained for under $6M
- R1 variant excels at transparent, step-by-step mathematical reasoning
- Open-source with competitive benchmark scores against top proprietary models
- Can face occasional service reliability challenges
- **Best for:** Budget-conscious teams, math/reasoning, open-source self-hosting

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
- Parameter scales exceeding 1 trillion; models from 0.5B to 235B available
- Matches or beats GPT-4 on many benchmarks with less compute
- Specialized variants for vision, coding, math, and long context
- **Best for:** International businesses, multilingual apps, flexible deployment

---

## Image & Video Generation

| Model                | Company      | Best For                                                      |
| -------------------- | ------------ | ------------------------------------------------------------- |
| Midjourney v7        | Midjourney   | Artistic, stylized visuals with strong aesthetic control      |
| Imagen 4             | Google       | Photorealistic composition, spelling, and typography accuracy |
| DALL-E 4             | OpenAI       | Integrated with ChatGPT; strong prompt adherence              |
| Stable Diffusion 3.5 | Stability AI | Open-source; self-hostable; highly customizable               |

**Video generation leaders:** Google Veo 3 (physics simulation + native audio), Sora (OpenAI), and Runway Gen-4 (creative/cinematic).

---

## Picking the Right Model

| Use Case                             | Go With             |
| ------------------------------------ | ------------------- |
| General purpose                      | GPT-5.x             |
| Coding & agentic work                | Claude 4.6          |
| Multimodal & Google ecosystem        | Gemini 3.x          |
| Real-time data & math                | Grok 4.x            |
| Open-source self-hosting             | Llama 4 or DeepSeek |
| EU compliance & regulated industries | Mistral             |
| Multilingual / international         | Qwen 3              |

---

_There is no single "best" model in 2026. The landscape has shifted from a winner-take-all race to specialized excellence. Match the model to the task._
