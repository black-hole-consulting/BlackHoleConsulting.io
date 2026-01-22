// Partners data - Replace with your real network

export interface Badge {
  type: 'years' | 'projects' | 'mutual' | 'expertise';
  label: string;
  value?: number;
}

export interface Partner {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar: string;
  description: string;
  skills: string[];
  badges: Badge[];
  links: {
    linkedin?: string;
    website?: string;
    github?: string;
  };
  color: string; // For network graph node color
}

export const partners: Partner[] = [
  {
    id: 'alex-devops',
    name: 'Alexandre Martin',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=alex',
    description:
      'Expert Kubernetes et CI/CD. On a monté ensemble des pipelines qui déploient plus vite que leur ombre.',
    skills: ['Kubernetes', 'Terraform', 'GitLab CI', 'AWS'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 5 },
      { type: 'projects', label: 'projets ensemble', value: 12 },
      { type: 'mutual', label: 'Recommandation mutuelle' },
    ],
    links: {
      linkedin: 'https://linkedin.com/in/',
    },
    color: '#6366f1',
  },
  {
    id: 'sophie-data',
    name: 'Sophie Dubois',
    title: 'Data Scientist',
    company: 'DataMind',
    avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=sophie',
    description:
      'Magicienne des données et des modèles ML. Ensemble, on transforme la data en décisions.',
    skills: ['Python', 'TensorFlow', 'MLOps', 'BigQuery'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 3 },
      { type: 'projects', label: 'projets ensemble', value: 8 },
      { type: 'expertise', label: 'Expert IA' },
    ],
    links: {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
    },
    color: '#ec4899',
  },
  {
    id: 'marc-archi',
    name: 'Marc Lefebvre',
    title: 'Solution Architect',
    company: 'TechVision',
    avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=marc',
    description:
      'Architecte visionnaire. Nos sessions de whiteboarding sont légendaires (et productives).',
    skills: ['Architecture', 'AWS', 'Microservices', 'Event-Driven'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 7 },
      { type: 'projects', label: 'projets ensemble', value: 15 },
      { type: 'mutual', label: 'Recommandation mutuelle' },
    ],
    links: {
      linkedin: 'https://linkedin.com/in/',
      website: 'https://example.com',
    },
    color: '#f59e0b',
  },
  {
    id: 'julie-front',
    name: 'Julie Chen',
    title: 'Frontend Lead',
    company: 'PixelPerfect',
    avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=julie',
    description:
      'Artiste du pixel et du composant React. Nos interfaces sont belles ET performantes.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Figma'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 4 },
      { type: 'projects', label: 'projets ensemble', value: 10 },
      { type: 'expertise', label: 'Expert UX' },
    ],
    links: {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
    },
    color: '#10b981',
  },
  {
    id: 'thomas-security',
    name: 'Thomas Bernard',
    title: 'Security Consultant',
    company: 'SecureOps',
    avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=thomas',
    description:
      'Gardien de la forteresse. Il trouve les failles avant les hackers (et parfois avant les devs).',
    skills: ['Pentesting', 'OWASP', 'IAM', 'Compliance'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 6 },
      { type: 'projects', label: 'audits ensemble', value: 20 },
      { type: 'mutual', label: 'Recommandation mutuelle' },
    ],
    links: {
      linkedin: 'https://linkedin.com/in/',
    },
    color: '#ef4444',
  },
  {
    id: 'emma-product',
    name: 'Emma Rodriguez',
    title: 'Product Manager',
    company: 'ProductLab',
    avatar: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=emma',
    description: "Traductrice parfaite entre business et tech. Ses specs sont des oeuvres d'art.",
    skills: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 4 },
      { type: 'projects', label: 'produits lancés', value: 6 },
      { type: 'expertise', label: 'Expert Produit' },
    ],
    links: {
      linkedin: 'https://linkedin.com/in/',
      website: 'https://example.com',
    },
    color: '#8b5cf6',
  },
];

// Stats for the hero section
export const networkStats = {
  totalPartners: partners.length,
  totalYears: Math.max(
    ...partners.map((p) => p.badges.find((b) => b.type === 'years')?.value || 0)
  ),
  totalProjects: partners.reduce(
    (acc, p) => acc + (p.badges.find((b) => b.type === 'projects')?.value || 0),
    0
  ),
};
