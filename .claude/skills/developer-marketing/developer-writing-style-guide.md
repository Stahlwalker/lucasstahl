# Developer Writing Style Guide

## Purpose

This writing style defines how to communicate with developers across all content — blog posts, documentation, changelogs, landing pages, and AI-generated outputs. It represents a deliberate shift away from generic tech marketing in favor of clarity, specificity, and humility.

The goal is to earn trust with a technical audience by speaking directly, showing rather than selling, and respecting their time and experience.

---

## Core Attributes

### Plainspoken, but informed

Explain real things clearly and concisely. Avoid fluff, hype, and empty modifiers.

### Matter-of-fact tone

Say what something is, what it does, and why it's useful — not why it's revolutionary.

### Grounded in developer reality

Acknowledge edge cases, tradeoffs, and limitations. Don't oversimplify.

### Casual, but never careless

Use fragments, contractions, and natural phrasing, but make sure every sentence is tight and purposeful.

### Humble confidence

Don't oversell. Let the facts, examples, and outcomes speak for themselves.

---

## Writing Do's

- Use bullet points, short paragraphs, and code blocks for readability
- Use product names consistently
- Write headlines without colons
- Use semantic punctuation — avoid em dashes
- Show examples instead of promising outcomes
- Include practical comparisons when helpful
- Structure long-form content like good documentation: clear headings, defined use cases, and references to source material

---

## Writing Don'ts

- Don't use empty superlatives like "game-changing," "cutting-edge," or "unleash the power of"
- Don't start articles with "Let's explore…" or "In this post, we'll dive into…"
- Don't generalize — specificity builds trust
- Don't use vague adverbs (e.g. "seamlessly," "robustly")
- Don't imply that your product replaces developers — it enables them
- Don't inject "AI tone" (e.g. abstract metaphors, sweeping statements, overly polished transitions)
- Avoid weasel words like very, often, typically, virtually
- Avoid language that diminishes developers' role

---

## Visuals and Code-first Storytelling

- Use code snippets, payloads, or architecture diagrams whenever they make a point clearer
- Practical comparisons are more helpful than abstract descriptions
- For complex workflows or decisions, use diagrams (e.g. Mermaid) to supplement text

---

## Social Platforms

### Community replies (Reddit, forums)

Short, peer-level, factual.

### Social posts (X, LinkedIn)

Matter-of-fact. Tight phrasing. No hashtags. Minimal emojis.

## Removing AI Writing Patterns

This style guide applies to both human-written and AI-assisted content.

If something sounds polished but empty, it doesn’t belong here.

LLMs tend to produce writing that feels broadly correct, overly balanced, and emotionally flat. Developers notice this immediately. This section exists to remove patterns that weaken clarity, credibility, and voice.

Use this as a required editing pass for all developer-facing content.

---

### The baseline rule

If a sentence wouldn’t sound normal coming from a developer explaining a decision in Slack, a design review, or a code review, rewrite it.

---

### Write like someone who owns the outcome

Developer content should sound like it was written by someone accountable for the product, system, or decision.

- Write from firsthand experience or responsibility
- Use first person when it improves clarity or honesty
- Anchor claims in real constraints, failures, or tradeoffs

If a sentence could be written by someone who never shipped the thing, it’s probably wrong.

---

### Cut insight theater

AI is good at sounding insightful without saying anything.

Remove sentences that:

- Reframe obvious facts as conclusions
- Explain why something “matters” without showing how
- Exist to signal intelligence rather than convey information

If a sentence does not introduce a constraint, decision, tradeoff, or outcome, delete it.

---

### Default to specificity over narrative

Narrative is earned through detail.

Prefer:

- Named tools, APIs, limits, workflows, and edge cases
- Concrete examples of what worked or failed
- Clear descriptions of how something is implemented

Avoid:

- Abstract journeys or visions
- Metaphors that replace explanation
- Language that could apply to any B2B SaaS product

If the sentence could be copy-pasted into another company’s blog, cut it.

---

### Avoid borrowed credibility

Do not gesture at authority or consensus.

Remove phrases like:

- "Experts agree that"
- "Developers are increasingly"
- "Modern teams need"

Unless you can name who, where, and why it matters, the claim adds no value.

Developers trust evidence, not vibes.

---

### Don't signal authenticity with "real"

AI overuses "real" to manufacture credibility it doesn't have.

Remove phrases like:

- "Real-world applications"
- "Real developers"
- "Real production environments"
- "In the real world"

If you're writing for developers, the context is already real. Adding "real" implies everything else might be theoretical—which undermines your credibility.

Either the example is specific enough to stand on its own, or it isn't worth including.

---

### No faux balance

AI defaults to symmetrical pros and cons. Humans don’t.

- Take a position
- Acknowledge downsides honestly
- Explain why a tradeoff was accepted

Avoid neutralizing your own point to appear objective.

---

### Prefer simple constructions

AI often avoids direct language to sound sophisticated.

- Use "is," "has," and "does"
- Avoid inflated substitutes like "functions as," "acts as," or "constitutes"

Clarity beats elegance every time.

---

### Eliminate superficial depth

Watch for present-participle padding that adds motion without information.

Examples to cut:

- "…enabling teams to…"
- "…allowing developers to…"
- "…providing a way to…"

Replace with concrete actions, constraints, or outcomes.

---

### Remove promotional tone by default

Developer content is not a landing page.

Avoid:

- Superlatives
- Aspirational adjectives
- Claims of importance or impact without proof

If it sounds like copywriting, it’s probably wrong.

---

### Respect developer pattern recognition

Developers spot templates quickly.

Avoid:

- Forcing ideas into groups of three
- Overly symmetrical sections
- Predictable "problem → solution → future" arcs

Slight irregularity reads as human. Perfect structure reads as generated.

---

### AI should compress thinking, not replace it

AI can:

- Summarize notes
- Tighten phrasing
- Improve clarity
- Reduce repetition

AI cannot:

- Invent insight
- Decide what matters
- Fill gaps with generalities

If AI output contains ideas you didn’t already believe, stop and reassess.

---

### Eliminate conclusion padding

Most AI-written conclusions add nothing.

Delete by default:

- "To summarize"
- "Moving forward"
- Vague statements about impact or potential

End with:

- A concrete next step
- A remaining limitation
- An unresolved question

If nothing meaningful remains, end the piece earlier.

---

## Final AI Writing Checklist (Required Before Publishing)

Use this checklist as the last pass before any developer-facing content ships.

### Ownership and voice

- Does this sound like it was written by someone accountable for the system?
- Is first person used where it improves clarity?
- Could this be written by someone who never shipped the product?

### Substance

- Does every sentence introduce a constraint, decision, tradeoff, or outcome?
- Have I removed insight theater and filler explanations?

### Specificity

- Are tools, APIs, limits, or workflows named explicitly?
- Could any paragraph apply to another B2B SaaS product?

### Evidence

- Are claims based on firsthand experience or observable behavior?
- Did I remove vague attributions and consensus language?

### Position

- Is there a clear point of view?
- Are tradeoffs explained honestly?

### Structure

- Did I avoid templated symmetry and rule-of-three patterns?
- Does the structure feel human, not algorithmic?

### AI discipline

- Did AI compress thinking instead of inventing it?
- Did I replace generalities with specifics?

### Ending

- Did I remove padded conclusions?
- Does the ending add real value?

### Reality check

- Would this sound normal in a code or design review?
- Could a senior engineer reasonably disagree with something here?

If everything reads smooth, balanced, and inoffensive, keep editing.

---
