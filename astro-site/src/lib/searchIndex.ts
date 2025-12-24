// Search index builder for Fuse.js
import { getBlogPosts } from './notion';

export interface SearchItem {
  type: 'blog' | 'build' | 'gem' | 'website';
  title: string;
  description: string;
  url: string;
  tags?: string[];
  date?: string;
}

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const searchIndex: SearchItem[] = [];

  // Get Notion blog posts
  const notionPosts = await getBlogPosts();
  notionPosts.forEach(post => {
    searchIndex.push({
      type: 'blog',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}/`,
      tags: post.tags,
      date: post.publishedDate
    });
  });

  // Static blog posts from blog.astro
  const staticBlogPosts = [
    {
      title: "Developers love headless until they're stuck maintaining it",
      description: "Exploring the limitations of headless CMS platforms for marketing websites and why a hybrid approach might be the better solution for team velocity and reduced complexity.",
      url: "https://webflow.com/blog/headless-cms-developer-tradeoffs",
      tags: ["CMS", "Headless", "DevOps"],
      date: "Oct 8, 2025"
    },
    {
      title: "MCP servers worth knowing if you're building with AI",
      description: "Explore Model Context Protocol servers that provide structured context for AI tools. Learn about integrating MCP servers like Context7, Figma, GitHub, and more with AI-powered development environments.",
      url: "https://webflow.com/blog/ai-mcp-servers",
      tags: ["AI", "MCP", "Development"],
      date: "Aug 13, 2025"
    }
  ];

  staticBlogPosts.forEach(post => {
    searchIndex.push({
      type: 'blog',
      title: post.title,
      description: post.description,
      url: post.url,
      tags: post.tags,
      date: post.date
    });
  });

  // Builds from builds.astro
  const builds = [
    {
      title: "Fantasy Football Legend",
      description: "A showcase website for a Fantasy Football League built with HTML, CSS, and JavaScript.",
      url: "https://stahlwalker.github.io/fantasyfootball/",
      tags: ["HTML", "CSS", "JavaScript"]
    },
    {
      title: "SERP Tracker",
      description: "Real-time search engine ranking tracker built with React and TypeScript. Features Chart.js visualizations, TanStack Table for data display, and SERP API integration.",
      url: "https://seo-rank-tracker-iota.vercel.app/",
      tags: ["React", "TypeScript", "Chart.js", "Tailwind CSS"]
    },
    {
      title: "Stahlwalker Cookbook",
      description: "Full-stack recipe app with Next.js and Contentful CMS featuring JAMstack architecture and dynamic content delivery.",
      url: "https://cookblog.vercel.app/",
      tags: ["Next.js", "React", "Contentful"]
    },
    {
      title: "Shacks Bloom & Co",
      description: "Modern web application built with React and Vite featuring fast build times and optimized performance.",
      url: "https://bloom-ebon-two.vercel.app/",
      tags: ["React", "Vite", "JavaScript"]
    },
    {
      title: "Developer Hub",
      description: "Modern developer portal built with Vite, React, and TypeScript. Features Framer Motion animations, Tailwind CSS styling, and syntax highlighting with Prism.",
      url: "https://developer-hub-webflow.vercel.app/",
      tags: ["Vite", "React", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Packers Nation Invasion",
      description: "A site dedicated to tracking away games for the Green Bay Packers. Site created using Materialize CSS.",
      url: "https://stahlwalker.github.io/greenbaypackers/",
      tags: ["Materialize", "CSS", "Portfolio"]
    },
    {
      title: "Stahlwalker.org",
      description: "My first portfolio site built with Jekyll, a static site generator. Features a clean design with blog integration and project showcase.",
      url: "https://stahlwalker.org/",
      tags: ["Jekyll", "Ruby", "Portfolio"]
    },
    {
      title: "Portfolio Template",
      description: "Single page portfolio template created using Materialize CSS. A clean, responsive design showcasing work and skills.",
      url: "https://stahlwalker.github.io/materialize/",
      tags: ["Materialize", "CSS", "Template"]
    }
  ];

  builds.forEach(build => {
    searchIndex.push({
      type: 'build',
      title: build.title,
      description: build.description,
      url: build.url,
      tags: build.tags
    });
  });

  // Gems from gems.astro
  const gems = [
    {
      title: "Developer-Led Links Repository",
      description: "The ultimate curated repository of developer marketing and developer relations resources. Includes comprehensive collections of blogs, talks, podcasts, books, newsletters, and communities—everything you need to level up your developer marketing game.",
      url: "https://github.com/developer-led/links",
      tags: ["Featured", "Resources"]
    },
    {
      title: "DevToolJobs",
      description: "A focused job board for GTM roles at developer tooling companies. Find marketing, sales, and community positions at the intersection of developer tools and go-to-market strategy.",
      url: "https://devtooljobs.com/",
      tags: ["Jobs", "Career"]
    },
    {
      title: "Developer Marketing Slack Community",
      description: "Active Slack community for developer marketing professionals. Connect with peers, share strategies, and discuss best practices for marketing to developers.",
      url: "https://marketingto.dev/",
      tags: ["Community", "Slack"]
    },
    {
      title: "Frontend Developer Roadmap",
      description: "Step by step guide to becoming a modern frontend developer in 2025. Covers HTML, CSS, JavaScript, frameworks, and essential skills for web development.",
      url: "https://roadmap.sh/frontend",
      tags: ["Learning", "Roadmap"]
    },
    {
      title: "Plug - Developer Influencer Marketing",
      description: "Platform connecting developer tools with technical influencers. Amplify your product through authentic developer voices and community engagement.",
      url: "https://plug.dev/",
      tags: ["Marketing", "Influencer"]
    },
    {
      title: "How to Spend Your Marketing Budget",
      description: "PostHog's guide on allocating marketing budget for developer tools. Real insights on what works and what doesn't when marketing to developers.",
      url: "https://posthog.com/founders/actual-marketing-budget",
      tags: ["Strategy", "Budget"]
    },
    {
      title: "Dev.Events - Developer Conferences",
      description: "Comprehensive listing of 1,151+ developer conferences worldwide for 2025/2026. Filter by technology, region, or topic to find the perfect events for your community.",
      url: "https://dev.events/",
      tags: ["Events", "Conferences"]
    },
    {
      title: "Markepear - Dev Tool Marketing Examples",
      description: "Collection of the best developer tool marketing campaigns, designs, and copy. Features landing pages, social posts, product tours, and creative positioning strategies.",
      url: "https://www.markepear.dev/examples",
      tags: ["Examples", "Inspiration"]
    },
    {
      title: "Stytch's Out-of-Home Campaign",
      description: "Behind-the-scenes look at how Stytch executed an impressive outdoor advertising campaign. Learn their strategy, execution, and results from going big with OOH.",
      url: "https://stytch.com/blog/the-making-of-an-ooh-campaign/",
      tags: ["Case Study", "OOH"]
    },
    {
      title: "DevRel Careers",
      description: "Job board for Developer Relations and Developer Marketing roles. Find opportunities in developer advocacy, community management, and technical marketing.",
      url: "https://devrelcareers.com/",
      tags: ["Careers", "Jobs"]
    },
    {
      title: "Stefan Judis - DevRel Contractor",
      description: "Stefan Judis is a developer advocate and independent contractor who runs Web Weekly, a curated newsletter covering web platform updates, browser changes, and tools for modern developers.",
      url: "https://www.stefanjudis.com/",
      tags: ["DevRel", "Newsletter"]
    },
    {
      title: "Brand Over Matter",
      description: "Brand agency specializing in creating impactful brand identities and experiences. Helping companies stand out with creative design and strategic branding expertise.",
      url: "https://brandovermatter.com/",
      tags: ["Design", "Branding"]
    },
    {
      title: "Wappalyzer - Technology Profiler",
      description: "Discover what technologies websites are built with. Identify CMS, frameworks, analytics tools, and tech stacks for competitive research and lead generation.",
      url: "https://www.wappalyzer.com/",
      tags: ["Tools", "Research"]
    },
    {
      title: "Carbon - Code Snippet Tool",
      description: "Create and share beautiful images of your source code. Perfect for social media posts, documentation, and presentations with customizable themes and syntax highlighting.",
      url: "https://carbon.now.sh/",
      tags: ["Tools", "Design"]
    }
  ];

  gems.forEach(gem => {
    searchIndex.push({
      type: 'gem',
      title: gem.title,
      description: gem.description,
      url: gem.url,
      tags: gem.tags
    });
  });

  // Fancy websites from gems.astro
  const websites = [
    {
      title: "PostHog",
      description: "Product analytics platform with great website design",
      url: "https://posthog.com/",
      tags: ["Platform"]
    },
    {
      title: "Stripe Developers",
      description: "Stripe's developer hub with excellent documentation design",
      url: "https://stripe.dev/",
      tags: ["Dev Hub"]
    },
    {
      title: "Cloudflare Sandbox",
      description: "Cloudflare's interactive sandbox platform",
      url: "https://sandbox.cloudflare.com/",
      tags: ["Platform"]
    },
    {
      title: "GitHub",
      description: "GitHub's platform and website design",
      url: "https://github.com/home",
      tags: ["Platform"]
    }
  ];

  websites.forEach(website => {
    searchIndex.push({
      type: 'website',
      title: website.title,
      description: website.description,
      url: website.url,
      tags: website.tags
    });
  });

  return searchIndex;
}
