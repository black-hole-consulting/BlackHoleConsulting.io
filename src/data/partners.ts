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
    id: 'vincent-composieux',
    name: 'Vincent Composieux',
    title: 'Tech Lead & Architect',
    avatar: '/images/partners/vincent-composieux.jpg',
    description:
      'Crafting robust products from backend systems to scalable infrastructures. Une collaboration efficace et toujours un plaisir de travailler ensemble.',
    skills: ['Go', 'Architecture', 'Cloud'],
    badges: [
      { type: 'years', label: 'ans de collaboration', value: 2 },
      { type: 'projects', label: 'projet ensemble', value: 1 },
      { type: 'mutual', label: 'Recommandation mutuelle' },
      { type: 'expertise', label: 'Expert Architecture' },
    ],
    links: {
      linkedin: 'https://www.linkedin.com/in/vincentcomposieux/',
      github: 'https://github.com/eko',
    },
    color: '#6366f1',
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
