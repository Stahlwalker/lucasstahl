# review-content Examples

## Example 1: Review AI-generated page content

```bash
/review-content astro-site/src/pages/projects.astro
```

After Claude generates a new "Projects" page, review it against your writing style guide.

## Example 2: Review newly created documentation

```bash
/review-content docs/NEW_FEATURE_GUIDE.md
```

Checks AI-generated or newly written documentation for style consistency.

## Example 3: Review updated page copy

```bash
/review-content astro-site/src/pages/about.astro
```

After updating site copy, verify it follows your writing guidelines.

## Example 4: Interactive review

```bash
/review-content
```

You'll be prompted to specify which content to review.

## What you'll get

**Sample output:**

```
Overall Assessment: Strong alignment with style guide. Content is clear and engaging.

Strengths:
- Conversational tone matches style guide
- Good use of code examples
- Clear section structure

Issues Found:
- Line 23: Passive voice ("was implemented") - prefer active voice
- Line 45: Overly technical jargon without explanation
- Missing introduction that hooks the reader

Suggestions:
- Line 23: Change "The feature was implemented" to "I implemented the feature"
- Line 45: Add a brief explanation: "webhooks (automated event notifications)"
- Add a compelling opening that previews the value

Style Guide References:
- "Use active voice and first-person perspective"
- "Explain technical terms for broader audience"
- "Start with a hook that shows value"
```
