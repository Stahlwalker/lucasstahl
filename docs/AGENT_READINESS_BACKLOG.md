# Agent Readiness Backlog

Recommendations from [isitagentready.com](https://isitagentready.com/) that we evaluated and chose **not** to implement immediately. Each entry captures what the check wants, whether it applies to lukestahl.io, what it would cost to fix, and why it's deferred.

Baseline score: **33** (Level 1 — Basic Web Presence), as of 2026-05-14.

Category scores at baseline:
- Discoverability: 67 (2/3)
- Content: 0 (0/1)
- Bot Access Control: 50 (1/2)
- API, Auth, MCP & Skill Discovery: 17 (1/6)
- Commerce: Not checked (N/A — no commerce on this site)

---

## Deferred

### Link response headers (RFC 8288)

**What it wants:** HTTP `Link:` response headers on the homepage pointing agents to useful resources (e.g. `</docs/api>; rel="service-doc"`, `</.well-known/api-catalog>; rel="api-catalog"`).

**Applies to lukestahl.io?** Partially. The API examples don't fit (no API), but the site has three real candidates already:
- `Link: </rss.xml>; rel="alternate"; type="application/rss+xml"`
- `Link: </sitemap.xml>; rel="sitemap"`
- `Link: </llms.txt>; rel="describedby"`

**Cost to fix:** Cannot be done in this repo. GitHub Pages doesn't allow custom HTTP headers. Implementation path is **Cloudflare → Rules → Transform Rules → Modify Response Header**, configured in the dashboard.

**Why deferred:** All three resources are already discoverable via HTML `<link>` tags in the document head, so practical agent benefit is small. This is spec-purity for the score, not net-new capability.

**When to revisit:** If the score becomes a priority, or if we add an actual API/MCP endpoint that warrants a `service-doc` / `api-catalog` rel.

**Docs:** [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288), [RFC 9727 §3](https://www.rfc-editor.org/rfc/rfc9727#section-3)

### WebMCP

**What it wants:** Call `navigator.modelContext.provideContext()` with tool definitions (name, description, JSON Schema input, execute callback) so an in-browser AI agent can invoke site actions.

**Applies to lukestahl.io?** Marginally. WebMCP is built for *apps* with action surfaces (buy, file, send). This site is read-only content — an agent doesn't need a tool to "go to the about page." The only candidate action is search (currently fuse.js), and agents can already crawl the corpus via HTML, RSS, and `llms.txt`, so a `searchPosts(query)` tool would be redundant.

**Cost to fix:** Non-trivial. Adds client-side JS (against the site's intentional minimal-JS posture), depends on an experimental Chrome origin trial that's not in stable defaults, and requires designing tool schemas that don't currently exist.

**Why deferred:** Experimental standard + no natural action surface + cost mismatch with benefit.

**Better use of the same effort:** Treat WebMCP as a *content opportunity* instead of a checklist item — a blog post about adding it to an Astro site would be more valuable than the feature itself.

**Docs:** [WebMCP draft](https://webmachinelearning.github.io/webmcp/), [Chrome blog post](https://developer.chrome.com/blog/webmcp-epp)

---

## Not applicable

Checks we evaluated and confirmed don't fit this site. Recording them so we don't re-evaluate next audit.

### Web Bot Auth request signing

**What it wants:** Publish a JWKS at `/.well-known/http-message-signatures-directory` so the site can identify itself with signed HTTP requests when it acts as a bot/agent against other sites.

**Why N/A:** lukestahl.io is a static content site — it doesn't make outbound bot or agent requests anywhere. Web Bot Auth is for crawler/agent *operators* (e.g. Cloudflare's verified-bot ecosystem), not for sites that bots visit. The check itself is flagged "informational only" with no score impact.

**Docs:** [IETF Web Bot Auth WG](https://datatracker.ietf.org/wg/webbotauth/about/), [Cloudflare bot verification](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/)

### API Catalog (RFC 9727)

**What it wants:** Publish `/.well-known/api-catalog` returning `application/linkset+json`, with entries linking to `service-desc` (OpenAPI spec), `service-doc` (API docs), and `status` (health endpoint).

**Why N/A:** lukestahl.io has no HTTP APIs. There's no OpenAPI spec to point to, no API reference docs, and no health endpoint. Publishing an empty or fabricated catalog would mislead agents that fetch it expecting machine-readable API contracts.

**When to revisit:** Only if a real API ships on this domain (e.g. an MCP server, a public endpoint).

**Docs:** [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727), [RFC 9264](https://www.rfc-editor.org/rfc/rfc9264)

### OAuth / OIDC discovery

**What it wants:** Publish `/.well-known/openid-configuration` or `/.well-known/oauth-authorization-server` with issuer, `authorization_endpoint`, `token_endpoint`, `jwks_uri`, and `grant_types_supported` so agents can programmatically start an auth flow.

**Why N/A:** Conditional on the site having protected APIs (the recommendation itself says "If your site has protected APIs..."). lukestahl.io has no authorization server, no token endpoint, and nothing protected. Publishing fake OAuth metadata would mislead any agent that tries to authenticate against it.

**When to revisit:** Only if a protected API ships on this domain and needs an auth flow.

**Docs:** [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html), [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414)

### OAuth Protected Resource metadata (RFC 9728)

**What it wants:** Publish `/.well-known/oauth-protected-resource` with the resource identifier, `authorization_servers` (issuers that can mint tokens for this resource), and `scopes_supported`.

**Why N/A:** Resource-server companion to the OAuth/OIDC discovery check above. No protected APIs on this domain, no authorization servers to list, nothing to scope. Same disposition for the same reason.

**When to revisit:** Bundle with the OAuth/OIDC entry — both ship together if a protected API ever lands here.

**Docs:** [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)

### MCP Server Card (SEP-1649)

**What it wants:** Serve `/.well-known/mcp/server-card.json` with `serverInfo` (name, version), transport endpoint, and capabilities — describing a running MCP server hosted on this domain.

**Why N/A:** lukestahl.io doesn't host an MCP server. The card's `transport` and `capabilities` fields are descriptions of a live endpoint; with nothing behind them, the card would mislead agents into attempting a connection that doesn't exist.

**Future possibility (not deferred — separate project):** Building a real MCP server that exposes blog posts as resources would let agents fetch the corpus via MCP instead of HTML scraping. That's a product decision, not a score fix — track it separately if it ever becomes interesting.

**Docs:** [SEP-2127 PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

### Commerce protocols (entire section)

**Checks covered:** x402 Protocol, MPP (Machine Payment Protocol), Universal Commerce Protocol, ACP (Agentic Commerce Protocol).

**What they want:** Endpoints and metadata so AI agents can transact on the site — discover prices, submit payments, complete checkouts programmatically.

**Why N/A:** lukestahl.io sells nothing. No products, no paid content, no checkout flow. The Commerce section is already flagged "OPTIONAL" with 0/0 weight and "No e-commerce signals were detected on this site. These checks are shown for informational purposes and do not affect the score."

**When to revisit:** Only if a transactional surface ever ships here (paid posts, coaching slots, products) — and even then, evaluate each protocol on adoption before implementing.
