/**
 * Blog category clusters: each category aggregates a set of tags
 * (case-insensitive) and points to the related service pillar page.
 */

export type BlogCategory = {
  slug: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  pillar: 'genai' | 'architecture' | 'cloud' | 'web';
  servicePillarSlug: string;
  servicePillarLabel: string;
  /** Lowercased tag values that route an article into this category */
  tagMatchers: string[];
  accent: string;
  icon: string;
};

export const blogCategories: BlogCategory[] = [
  {
    slug: 'ia-generative',
    navLabel: 'IA générative',
    title: 'IA générative & LLM en production',
    metaTitle: 'Articles IA générative, LLM, RAG | Black Hole Consulting',
    metaDescription:
      "Articles techniques sur l'IA générative en entreprise : RAG en production, agents LLM, sécurité, choix de modèles, évaluation. Retours d'expérience freelance senior.",
    intro:
      "Les LLM transforment ce qu'on peut bâtir, mais entre une démo qui marche en notebook et un système qu'on peut opérer 24/7, il y a tout un savoir-faire. Voici mes articles techniques sur le RAG, les agents, l'évaluation et la mise en production des systèmes IA générative.",
    pillar: 'genai',
    servicePillarSlug: 'ia-generative-llm',
    servicePillarLabel: 'Service · IA générative & LLM',
    tagMatchers: ['ia', 'genai', 'llm', 'rag', 'ai', 'openai', 'claude', 'mistral'],
    accent: 'from-fuchsia-500 to-indigo-500',
    icon: '🤖',
  },
  {
    slug: 'architecture-cloud',
    navLabel: 'Architecture & Cloud',
    title: 'Architecture logicielle & Cloud-native',
    metaTitle: 'Architecture logicielle, microservices, cloud-native | Black Hole Consulting',
    metaDescription:
      'Patterns architecture logicielle : microservices, event-driven, modular monolith, DDD. Conception cloud-native pragmatique pour scale-ups et grands groupes.',
    intro:
      "L'architecture, ce n'est pas le bon nombre de microservices : c'est la bonne combinaison de découpages, contrats et flux pour que votre équipe livre vite sans casser ce qui existe. Articles, retours d'expérience et matrices de décision sur l'architecture logicielle.",
    pillar: 'architecture',
    servicePillarSlug: 'architecture-solutions',
    servicePillarLabel: 'Service · Architecture de solutions',
    tagMatchers: [
      'architecture',
      'microservices',
      'monolithe',
      'event-driven',
      'ddd',
      'patterns',
      'design',
    ],
    accent: 'from-indigo-500 to-cyan-500',
    icon: '🏛️',
  },
  {
    slug: 'devops-iac',
    navLabel: 'Cloud, DevOps & IaC',
    title: 'Cloud AWS, DevOps & Infrastructure as Code',
    metaTitle: 'Articles AWS, Terraform, DevOps, IaC, FinOps | Black Hole Consulting',
    metaDescription:
      'Articles techniques sur AWS, Terraform, CI/CD, FinOps, IaC. Migrations cloud, optimisation de coûts, infrastructures production-ready.',
    intro:
      "Une infra cloud bien faite, c'est invisible : l'équipe livre, ça scale, ça coûte ce que ça doit coûter. Articles sur Terraform, AWS, FinOps, CI/CD et migrations on-prem → cloud.",
    pillar: 'cloud',
    servicePillarSlug: 'cloud-aws-terraform',
    servicePillarLabel: 'Service · Cloud AWS & Terraform',
    tagMatchers: [
      'aws',
      'terraform',
      'cloud',
      'devops',
      'iac',
      'infrastructure as code',
      'ci/cd',
      'finops',
      'serverless',
      'lambda',
    ],
    accent: 'from-cyan-500 to-blue-500',
    icon: '☁️',
  },
  {
    slug: 'web-frontend',
    navLabel: 'Web & Frontend',
    title: 'Développement web React, Next.js & performance',
    metaTitle: 'Articles React, Next.js, Web Performance, Core Web Vitals | Black Hole Consulting',
    metaDescription:
      'Articles techniques React, Next.js, TypeScript et Core Web Vitals. Architecture frontend, performance et accessibilité pour applications B2B.',
    intro:
      "Bâtir une UI moderne, performante et accessible demande plus que de connaître React. Articles sur Next.js, TypeScript, Tailwind, Core Web Vitals, et l'architecture frontend.",
    pillar: 'web',
    servicePillarSlug: 'developpement-web',
    servicePillarLabel: 'Service · Développement Web',
    tagMatchers: [
      'react',
      'next.js',
      'nextjs',
      'typescript',
      'web',
      'frontend',
      'astro',
      'tailwind',
    ],
    accent: 'from-emerald-500 to-cyan-500',
    icon: '💻',
  },
];

/**
 * Match an article's tags to a list of category slugs.
 * Article tags are matched case-insensitively against each category's `tagMatchers`.
 * An article can belong to several categories (e.g. an Architecture+Cloud post).
 */
export function categoriesForTags(tags: string[]): BlogCategory[] {
  const lowered = tags.map((t) => t.toLowerCase().trim());
  return blogCategories.filter((cat) =>
    cat.tagMatchers.some((m) => lowered.includes(m.toLowerCase()))
  );
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}
