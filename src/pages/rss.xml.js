import rss from '@astrojs/rss';

export function GET(context) {
  return rss({
    title: 'Black Hole Consulting',
    description:
      "Actualités et articles sur l'architecture solutions, GenAI, Cloud et développement web",
    site: context.site,
    items: [],
    customData: `<language>fr-fr</language>`,
  });
}
