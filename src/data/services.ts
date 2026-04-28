export type Service = {
  slug: string;
  pillar: 'genai' | 'architecture' | 'cloud' | 'web';
  navOrder: number;
  title: string; // <h1>
  navLabel: string; // header / hub label
  metaTitle: string; // <title>
  metaDescription: string;
  heroEyebrow: string; // small label above H1
  heroIntro: string; // paragraph under H1
  heroIcon: string; // emoji or short icon
  heroAccent: string; // CSS color for accent gradient
  whoFor: string[]; // bullet list "for who"
  outcomes: string[]; // bullet list "what you get"
  offerings: {
    name: string;
    description: string;
    duration?: string;
    deliverables?: string[];
  }[];
  method: {
    phase: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedArticles?: { title: string; href: string }[];
  relatedProjects?: { title: string; href: string }[];
  primaryKeyword: string;
  longTailKeywords: string[];
  // For Service JSON-LD
  serviceType: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const services: Service[] = [
  {
    slug: 'ia-generative-llm',
    pillar: 'genai',
    navOrder: 1,
    title: 'IA générative & LLM en production',
    navLabel: 'IA générative & LLM',
    metaTitle: 'Consultant IA générative & LLM en entreprise | Black Hole Consulting',
    metaDescription:
      "Mise en production de RAG, agents LLM, intégrations OpenAI/Claude/Mistral. Audit, architecture et accompagnement d'équipes. Freelance senior, 17+ ans d'expérience.",
    heroEyebrow: 'IA générative · LLM · RAG',
    heroIntro:
      "Votre entreprise veut tirer parti des LLM, mais entre les démos qui marchent en notebook et les systèmes qui tiennent en production, il y a un monde. J'aide les équipes tech à concevoir, déployer et opérer des produits IA générative qui apportent une vraie valeur business — sans pile technique inutile, sans coûts qui s'envolent, sans dépendance bloquante à un seul fournisseur.",
    heroIcon: '🤖',
    heroAccent: 'from-fuchsia-500 to-indigo-500',
    whoFor: [
      'CTO ou Head of Engineering qui veut un POC GenAI productisable, pas un jouet',
      "Direction métier face à un projet IA qui s'enlise (latence, coût, qualité)",
      "Équipe data/ML qui maîtrise l'IA mais a besoin d'architecture cloud-native solide",
      'Startup qui doit livrer une feature IA différenciante avant ses concurrents',
    ],
    outcomes: [
      'Une architecture RAG/agent claire, documentée, déployable par votre équipe',
      'Des coûts maîtrisés (modèles, vector DB, observabilité) avec budget par requête',
      'Des garde-fous sécurité (prompt injection, data leakage, PII) intégrés dès le design',
      'Une stratégie de fallback et de mesure (qualité, coût, latence) dès le jour 1',
    ],
    offerings: [
      {
        name: 'Audit & cadrage IA générative',
        duration: '5 à 10 jours',
        description:
          "Analyse de votre cas d'usage, de la donnée disponible et de votre infra. Recommandation d'architecture (RAG vs fine-tuning, choix du modèle, vector DB, orchestration), estimation budget et planning.",
        deliverables: [
          "Document d'architecture cible (C4) avec choix techniques argumentés",
          "Estimation coûts opérationnels par scénario d'usage",
          'Backlog priorisé pour la phase de mise en œuvre',
        ],
      },
      {
        name: 'Conception & mise en production de RAG',
        duration: '6 à 12 semaines',
        description:
          "Pipeline d'ingestion documentaire, embeddings, vector store, retrieval augmenté, prompts robustes, évaluation continue. Intégration dans votre stack (Python/Node) et déploiement cloud (AWS de préférence) avec observabilité.",
        deliverables: [
          'Pipeline RAG production-ready (ingestion, retrieval, génération)',
          "Jeux de test et métriques d'évaluation (faithfulness, answer relevance, context precision)",
          'Tableau de bord coût + qualité + latence',
        ],
      },
      {
        name: 'Audit sécurité & gouvernance LLM',
        duration: '5 jours',
        description:
          'Revue des risques spécifiques aux LLM : prompt injection, jailbreaks, fuites de données, hallucinations critiques, gestion PII, traçabilité des décisions. Recommandations actionnables.',
        deliverables: [
          'Threat model adapté à votre contexte LLM',
          'Plan de remédiation priorisé',
          'Politiques de prompt et de logging recommandées',
        ],
      },
      {
        name: 'Accompagnement équipe & montée en compétence',
        duration: 'Régulier (½ à 2 jours/semaine)',
        description:
          "Sessions de design review, pair-programming sur les modules sensibles, formation aux patterns RAG/agents, mise en place des bonnes pratiques d'évaluation et d'observabilité côté équipe.",
      },
    ],
    method: [
      {
        phase: '01',
        title: 'Cadrer le vrai problème',
        description:
          "On commence par challenger le besoin : est-ce vraiment un cas d'usage IA ? Quelle valeur business ? Quelles métriques de succès ? Beaucoup de projets GenAI échouent sur cette étape, pas sur la technique.",
      },
      {
        phase: '02',
        title: 'Concevoir une architecture sobre',
        description:
          "Choix du modèle (open source vs fermé, taille), pattern (RAG, fine-tune, agent), stockage (Postgres/pgvector, Qdrant, Pinecone), orchestration (LangChain, LlamaIndex, custom). Chaque choix s'argumente sur coût + qualité + lock-in.",
      },
      {
        phase: '03',
        title: 'Livrer en itérations courtes',
        description:
          'Premier déploiement en 4-6 semaines, avec un sous-ensemble du périmètre. On mesure tout : qualité réponses, latence, coût, satisfaction utilisateur. On itère.',
      },
      {
        phase: '04',
        title: 'Industrialiser et passer la main',
        description:
          "Observabilité production (Langfuse, OpenTelemetry), CI/CD des prompts, évaluation continue, runbooks. À la fin, l'équipe interne opère seule.",
      },
    ],
    faqs: [
      {
        question: 'RAG ou fine-tuning : par où commencer ?',
        answer:
          "RAG dans 80 % des cas. Le fine-tuning ne s'envisage que pour des contraintes très spécifiques : style de réponse fortement marqué, domaine ultra-niche, ou besoin de réduire la latence sur un cas d'usage figé. Avec un bon RAG bien évalué, on couvre la plupart des besoins B2B sans la dette opérationnelle d'un modèle entraîné.",
      },
      {
        question: 'Quel budget prévoir pour mettre un RAG en production ?',
        answer:
          "Pour un POC sérieux : 4-6 semaines de mission, soit ~30-50 k€ TJM consultant. Pour un système production-grade avec évaluation et observabilité : 3-4 mois, 80-150 k€. À cela s'ajoutent les coûts opérationnels (modèle, vector DB, infra) qui dépendent du volume — typiquement 200 à 5 000 €/mois selon l'usage.",
      },
      {
        question: 'Faut-il choisir OpenAI, Anthropic, Mistral ou un modèle open source ?',
        answer:
          "Cela dépend de quatre critères : sensibilité des données (souveraineté), exigences de qualité (Claude et GPT-4 sont en tête), coût par requête, et tolérance au lock-in. Je recommande presque systématiquement de coder avec une couche d'abstraction (provider switchable) pour ne pas dépendre d'un seul fournisseur.",
      },
      {
        question: "Comment mesurer la qualité d'un système RAG ?",
        answer:
          "On utilise un ensemble de métriques techniques (faithfulness, context precision, answer relevance — voir RAGAS, TruLens) appliquées à un golden set de questions/réponses. Plus une boucle de feedback utilisateur réel. Sans cette mesure, impossible d'itérer sereinement.",
      },
      {
        question: 'Et la sécurité dans tout ça ?',
        answer:
          "Trois angles : prompt injection (un utilisateur manipule l'instruction), data leakage (le modèle révèle des données sensibles), et hallucinations critiques (réponse fausse présentée comme vraie). On travaille avec des défenses en profondeur : sanitization en entrée, isolation des contextes, validation en sortie, et un threat model spécifique LLM.",
      },
    ],
    primaryKeyword: 'expert ia générative entreprise',
    longTailKeywords: [
      'mise en place rag production',
      'consultant rag entreprise france',
      'sécurité llm entreprise',
      'évaluation rag métriques',
      'consultant fine-tuning llm',
      'audit ia générative entreprise',
      'consultant agents llm',
      'choix modèle llm open source vs closed',
    ],
    serviceType: 'Generative AI Consulting',
    ctaPrimary: { label: 'Discutons de votre projet IA', href: '/contact' },
    ctaSecondary: {
      label: 'Réserver un appel · 30 min',
      href: 'https://calendly.com/cedric-blkhole/30min',
    },
  },
  {
    slug: 'architecture-solutions',
    pillar: 'architecture',
    navOrder: 2,
    title: 'Architecture de solutions logicielles',
    navLabel: 'Architecture',
    metaTitle:
      'Consultant Solution Architect freelance | Architecture logicielle B2B - Black Hole Consulting',
    metaDescription:
      "Audit, conception et accompagnement sur les architectures microservices, event-driven, modular monolith. 17+ ans d'expérience, France entière et remote.",
    heroEyebrow: 'Solution Architecture · Microservices · Event-Driven',
    heroIntro:
      "Une bonne architecture, c'est celle qui permet à votre équipe de livrer plus vite sans casser ce qui existe. Trop de microservices tuent la vélocité. Un monolithe mal organisé tue la maintenabilité. Mon job : trouver le bon équilibre pour votre contexte, et le rendre opérable au quotidien.",
    heroIcon: '🏛️',
    heroAccent: 'from-indigo-500 to-cyan-500',
    whoFor: [
      'Startup qui scale et se demande si elle doit casser son monolithe',
      'Scale-up confrontée aux problèmes de cohabitation de microservices anarchiques',
      'Grand groupe en transformation digitale qui veut un avis externe et indépendant',
      'CTO qui doit pitcher une refonte architecture à son COMEX et veut un cadrage solide',
    ],
    outcomes: [
      'Une architecture cible documentée (C4 model), partageable et défendable',
      "Une roadmap d'évolution réaliste, séquencée par valeur business",
      'Des Architectural Decision Records (ADR) sur les choix structurants',
      "Une équipe alignée sur les principes (DDD, event-driven, contrats d'API)",
    ],
    offerings: [
      {
        name: 'Audit architecture & quick wins',
        duration: '5 à 10 jours',
        description:
          "Cartographie de l'existant, identification des frictions (couplage, dette, performances), priorisation des chantiers. Livrable actionnable immédiatement.",
        deliverables: [
          "Diagramme C4 de l'architecture actuelle",
          'Liste priorisée de quick wins + chantiers structurels',
          'ADR sur les 3-5 décisions critiques',
        ],
      },
      {
        name: 'Conception architecture cible (greenfield ou refonte)',
        duration: '4 à 8 semaines',
        description:
          "Design pas-à-pas avec votre équipe : choix des bounded contexts (DDD), patterns (microservices, monolith modulaire, event-driven), contrats d'API, stratégie de données.",
        deliverables: [
          'Architecture cible C4 niveaux 1-3',
          "Modèle de données et contrats d'API",
          'Plan de migration séquencé',
        ],
      },
      {
        name: 'Tech leadership en mission longue',
        duration: '3 à 6 mois',
        description:
          "Présence régulière (2-3 jours/semaine) pour piloter techniquement la mise en œuvre, former l'équipe, ancrer les standards et arbitrer les compromis.",
      },
    ],
    method: [
      {
        phase: '01',
        title: 'Comprendre le business avant la tech',
        description:
          "Le bon pattern dépend du domaine. Une plateforme e-commerce n'a pas les mêmes besoins qu'un SI financier ou qu'un produit SaaS multi-tenant. On commence par les flux business.",
      },
      {
        phase: '02',
        title: "Visualiser l'existant honnêtement",
        description:
          "C4 model, event storming si pertinent. Mettre les couplages cachés sur la table. Identifier ce qui freine l'équipe au quotidien.",
      },
      {
        phase: '03',
        title: 'Concevoir le minimum viable architectural',
        description:
          "Pas de sur-ingénierie. Le bon nombre de services, le bon niveau d'abstraction. Un MVP architectural qui peut évoluer, pas une cathédrale figée.",
      },
      {
        phase: '04',
        title: 'Documenter pour décider plus tard',
        description:
          "ADR (Architectural Decision Records), schémas vivants, contrats d'API. La doc est un asset stratégique, pas une corvée.",
      },
    ],
    faqs: [
      {
        question: 'Microservices ou monolithe modulaire ?',
        answer:
          "Pour la grande majorité des équipes (< 30-40 développeurs), un monolithe modulaire bien découpé est plus productif. Les microservices apportent une isolation forte (équipes indépendantes, scaling séparé) au prix d'une complexité opérationnelle élevée. La règle : ne passer aux microservices que quand la douleur du monolithe dépasse celle de la distribution.",
      },
      {
        question: 'Quels patterns event-driven recommander ?',
        answer:
          "Sur AWS : EventBridge pour la routage de domain events (haute simplicité), SQS pour les jobs asynchrones, SNS pour le fan-out. Step Functions pour les workflows métiers complexes. Kinesis pour les streams haute volumétrie. Le choix dépend de la latence, du volume et du besoin d'ordre.",
      },
      {
        question: 'À partir de quand intégrer un architecte solution ?',
        answer:
          "Idéalement, avant le premier choix structurant (greenfield), ou dès qu'une refonte est envisagée (legacy). Mais aussi très utile en simple sparring partner, ponctuel, pour challenger une décision critique avant qu'elle ne soit gravée dans le code.",
      },
    ],
    primaryKeyword: 'consultant solution architect',
    longTailKeywords: [
      'consultant architecture microservices',
      'consultant architecture event-driven',
      'audit architecture si',
      'architecte logiciel freelance',
      'consultant architecture saas multi-tenant',
      'mission solution architect remote',
    ],
    serviceType: 'Solution Architecture Consulting',
    ctaPrimary: { label: 'Cadrer votre architecture', href: '/contact' },
    ctaSecondary: {
      label: 'Réserver un appel · 30 min',
      href: 'https://calendly.com/cedric-blkhole/30min',
    },
  },
  {
    slug: 'cloud-aws-terraform',
    pillar: 'cloud',
    navOrder: 3,
    title: 'Cloud AWS, Infrastructure as Code & FinOps',
    navLabel: 'Cloud & DevOps',
    metaTitle: 'Consultant AWS, Terraform & FinOps freelance | Black Hole Consulting',
    metaDescription:
      'Migrations AWS, IaC Terraform, audits FinOps, CI/CD production-ready. Architecture cloud-native pour scale-ups et grands comptes. France entière, remote.',
    heroEyebrow: 'AWS · Terraform · FinOps · CI/CD',
    heroIntro:
      "Votre infrastructure cloud devrait être un avantage concurrentiel, pas un poste de coût qui dérape. J'accompagne les équipes tech sur la conception, la migration et l'optimisation d'architectures AWS — avec une obsession : un setup que votre équipe peut comprendre, opérer et faire évoluer sans dépendre de moi.",
    heroIcon: '☁️',
    heroAccent: 'from-cyan-500 to-blue-500',
    whoFor: [
      'Scale-up dont la facture AWS dérive plus vite que le revenu',
      'Équipe qui veut sortir du Pulumi/CDK/Cloudformation maison pour passer à Terraform',
      'CTO qui prépare une migration on-prem → AWS et veut éviter les pièges classiques',
      'DPO/RSSI qui veut un audit indépendant de la posture sécurité cloud',
    ],
    outcomes: [
      'Une infrastructure 100 % décrite en code (Terraform), versionnée et testée',
      'Une CI/CD reproductible, prévisible, qui ne casse pas le vendredi soir',
      "Un audit FinOps avec leviers d'économies chiffrés et hiérarchisés",
      'Une équipe formée aux modules réutilisables et aux bonnes pratiques',
    ],
    offerings: [
      {
        name: 'Audit FinOps AWS',
        duration: '3 à 5 jours',
        description:
          'Analyse de la facture AWS, identification des leviers (Reserved Instances, Savings Plans, optimisations EC2/RDS, S3 lifecycle, NAT Gateway, observabilité). Économies typiques : 15-40 % sans dégrader le service.',
        deliverables: [
          'Rapport priorisé des leviers (effort/gain)',
          'Plan de bascule étalé sur 3 mois',
          'Tableau de bord coût par service / par produit',
        ],
      },
      {
        name: 'Mise en place Terraform & CI/CD',
        duration: '4 à 10 semaines',
        description:
          "Modules Terraform réutilisables, structure multi-comptes (Organizations + landing zone), pipeline GitHub Actions / GitLab CI, gestion d'état distant et locking. Migration depuis l'existant si besoin.",
        deliverables: [
          'Modules Terraform documentés',
          'Pipeline CI/CD avec plan & apply automatisés',
          'Politique de gestion des environnements (dev/staging/prod)',
        ],
      },
      {
        name: 'Migration on-prem → AWS',
        duration: '3 à 9 mois',
        description:
          'Cadrage, choix des stratégies (lift-and-shift, replatform, refactor), pilotage technique, accompagnement des équipes. Migration progressive avec coexistence le temps de la transition.',
      },
      {
        name: 'Audit Well-Architected Framework',
        duration: '5 jours',
        description:
          "Revue de la posture cloud sur les 6 piliers AWS : opérationnel, sécurité, fiabilité, performance, coût, durabilité. Plan d'action priorisé.",
      },
    ],
    method: [
      {
        phase: '01',
        title: 'Mesurer avant de toucher',
        description:
          "Cost Explorer, AWS Trusted Advisor, observabilité existante. Comprendre où va l'argent et où ça fait mal avant de proposer un plan.",
      },
      {
        phase: '02',
        title: 'Tout en code, dès le début',
        description:
          'Terraform, modules versionnés. Aucun clic-clic dans la console pour créer des ressources de production. Reviews de PR comme pour le code applicatif.',
      },
      {
        phase: '03',
        title: 'Automatiser la livraison',
        description:
          'CI/CD avec plan & apply, environnement de PR éphémère si pertinent, déploiements canary. La prod doit être un non-événement.',
      },
      {
        phase: '04',
        title: 'Optimiser dans la durée',
        description:
          "Revue mensuelle des coûts, ajustement des Savings Plans, identification des ressources orphelines, alertes de dépassement. La FinOps n'est pas un one-shot.",
      },
    ],
    faqs: [
      {
        question: 'Terraform vs Pulumi vs CDK : que choisir ?',
        answer:
          'Terraform reste mon choix par défaut pour la plupart des équipes : écosystème massif, multi-cloud par design, doc abondante, recrutement plus simple. Pulumi est intéressant si l\'équipe est très typée "code" et veut tout en TypeScript/Python. CDK est pertinent si vous êtes 100 % AWS et voulez profiter des constructs L3 — au prix d\'un fort lock-in.',
      },
      {
        question: "Combien d'économies attendre d'un audit FinOps ?",
        answer:
          "Sur des environnements jamais audités, on observe couramment 20-40 % d'économies sans dégrader le service. Sur des plateformes déjà optimisées : 5-15 %. Les principaux leviers : RI/Savings Plans, NAT Gateway endpoints, S3 lifecycle, RDS sizing, environnements non-prod éteints la nuit.",
      },
      {
        question: 'Faut-il une landing zone AWS dès le début ?',
        answer:
          "Non, c'est souvent prématuré. Pour < 3 comptes AWS et < 20 développeurs, une organisation simple suffit. La landing zone (AWS Control Tower ou maison) devient pertinente dès qu'on a plusieurs équipes / produits avec des besoins d'isolation forts.",
      },
      {
        question: 'Vous travaillez aussi sur GCP ou Azure ?',
        answer:
          "Mon expertise principale est AWS (10+ ans, deep). J'ai des bases GCP et Azure suffisantes pour comprendre une plateforme multi-cloud, mais pour une mission GCP/Azure pure, je préfère vous orienter vers un partenaire spécialisé.",
      },
    ],
    primaryKeyword: 'consultant aws freelance',
    longTailKeywords: [
      'expert terraform aws freelance',
      'audit finops aws',
      'migration cloud aws consultant',
      'consultant infrastructure as code',
      'audit well-architected aws',
      'terraform modules réutilisables aws',
    ],
    serviceType: 'Cloud & DevOps Consulting',
    ctaPrimary: { label: 'Discuter de votre infra', href: '/contact' },
    ctaSecondary: {
      label: 'Réserver un appel · 30 min',
      href: 'https://calendly.com/cedric-blkhole/30min',
    },
  },
  {
    slug: 'developpement-web',
    pillar: 'web',
    navOrder: 4,
    title: 'Développement web React & Next.js',
    navLabel: 'Développement Web',
    metaTitle: 'Développeur React/Next.js senior freelance | Black Hole Consulting',
    metaDescription:
      "Applications web React/Next.js production-grade, refontes legacy, optimisation Core Web Vitals. 17+ ans d'expérience, TypeScript, Tailwind, perf-first.",
    heroEyebrow: 'React · Next.js · TypeScript · Performance',
    heroIntro:
      "Quand l'équipe de devs interne a besoin d'un renfort senior, ou quand un projet web mérite mieux qu'un studio standardisé, j'apporte 17 ans de code en production : architecture frontend solide, accessibilité prise au sérieux, performances mesurées.",
    heroIcon: '💻',
    heroAccent: 'from-emerald-500 to-cyan-500',
    whoFor: [
      'Équipe produit qui doit livrer une feature critique avec un dev senior renfort',
      'Startup qui veut rebâtir son frontend legacy sans tout casser',
      'Agence/studio qui sous-traite des chantiers complexes (perf, a11y, SEO technique)',
      "Founder solo qui a besoin d'un fullstack senior pour amorcer un MVP",
    ],
    outcomes: [
      'Une app React/Next.js typée, testée, accessible et performante',
      'Des Core Web Vitals dans le vert sur mobile (LCP < 2.5s, CLS < 0.1, INP < 200ms)',
      'Une CI qui bloque les régressions visuelles, perf et a11y',
      'Une base de code que votre équipe peut reprendre sans douleur',
    ],
    offerings: [
      {
        name: 'Mission renfort senior (3-12 mois)',
        description:
          'Intégration en équipe, contribution sur les chantiers structurants : architecture frontend, performances, refactor de modules complexes, mentoring junior, code reviews exigeantes.',
      },
      {
        name: 'Refonte ou amorçage Next.js',
        duration: '4 à 12 semaines',
        description:
          "Cadrage technique, architecture (App Router, RSC, data fetching, caching), mise en place CI/CD avec Lighthouse + a11y bloquants, livraison de l'app v1.",
      },
      {
        name: 'Audit performance & Core Web Vitals',
        duration: '3 à 5 jours',
        description:
          "Mesure en lab + en réel (CrUX), identification des goulots (JS bundles, images, LCP), plan d'action chiffré.",
      },
    ],
    method: [
      {
        phase: '01',
        title: 'Comprendre le produit avant le framework',
        description:
          "Quels parcours utilisateurs ? Quels appareils ? Quelle audience ? Le bon framework dépend de ces réponses, pas l'inverse.",
      },
      {
        phase: '02',
        title: 'Stack pragmatique, pas branché',
        description:
          "Next.js si SSR + SEO comptent. Astro si c'est un site de contenu majoritaire. SPA si c'est une app interne. TypeScript par défaut, Tailwind par défaut. Pas de over-engineering.",
      },
      {
        phase: '03',
        title: 'Performance & a11y dès le code',
        description:
          'Budgets perf en CI, Lighthouse-CI bloquant, axe-core dans les tests. Plus tard ça coûte 10x.',
      },
      {
        phase: '04',
        title: 'Tests et observabilité',
        description:
          'Vitest + Playwright pour les parcours critiques. Sentry / OpenTelemetry pour la prod. Pas de tests à 100 % : les tests qui comptent.',
      },
    ],
    faqs: [
      {
        question: 'Pourquoi Next.js plutôt que Remix ou SvelteKit ?',
        answer:
          "Next.js a la communauté, les exemples, l'écosystème de doc et le recrutement les plus mûrs. Remix est très bien pour des apps form-heavy mais sa fusion dans React Router brouille la roadmap. SvelteKit est élégant mais reste de niche en B2B. À chaque mission je discute du choix selon le contexte.",
      },
      {
        question: 'Pouvez-vous travailler en équipe existante ou seul ?',
        answer:
          "Les deux. En équipe je m'aligne sur les standards en place, j'apporte de la review et du mentoring. Seul je peux livrer un MVP de bout en bout, mais je préfère toujours qu'il y ait au moins une personne côté client pour reprendre la main rapidement.",
      },
      {
        question: 'Et le SEO technique ?',
        answer:
          "C'est un de mes domaines. SSG/SSR/ISR, schema.org, Core Web Vitals, sitemap, robots, hreflang : tout ça compte. Le site sur lequel vous lisez cette page est un bon exemple de stack SEO-friendly (Astro + Tailwind + JSON-LD complet + Cache-Control optimisé).",
      },
    ],
    primaryKeyword: 'développeur react senior freelance',
    longTailKeywords: [
      'expert next.js app router freelance',
      'consultant performance web core web vitals',
      'mission développeur fullstack typescript',
      'refonte application react legacy',
    ],
    serviceType: 'Web Development Consulting',
    ctaPrimary: { label: 'Parlons de votre projet web', href: '/contact' },
    ctaSecondary: {
      label: 'Réserver un appel · 30 min',
      href: 'https://calendly.com/cedric-blkhole/30min',
    },
  },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const sortedServices = [...services].sort((a, b) => a.navOrder - b.navOrder);
