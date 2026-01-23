---
description: Ajouter un nouveau partenaire sur la page réseau
---

# Ajouter un Partenaire

Ajoute un nouveau partenaire à la page `/partenaires`.

## Informations à Collecter

Utilise AskUserQuestion pour collecter les informations. Regroupe les questions par thème pour fluidifier l'échange.

### Étape 1 : Identité

Demande en une seule question :
- **Nom complet** (ex: "Vincent Composieux")
- **Titre professionnel** (ex: "Tech Lead & Architect", "DevOps Engineer")
- **Entreprise** (optionnel, peut être freelance)

Question suggérée :
```
"Quel est le nom, titre et entreprise du partenaire ?"
Options: Utilise "Autre" pour saisir les infos
```

### Étape 2 : Description et Compétences

Demande :
- **Description** (2-3 phrases sur la collaboration, ton amical)
- **Compétences** (3-5 skills techniques)

Questions suggérées :
```
"Comment décrirais-tu votre collaboration en 2-3 phrases ?"

"Quelles sont ses compétences principales ?"
Options: Go/Kubernetes/AWS, Python/ML/Data, React/TypeScript/Frontend, Architecture/Cloud/DevOps
```

### Étape 3 : Statistiques de Collaboration

Demande :
- **Années de collaboration** (nombre)
- **Nombre de projets ensemble** (nombre)
- **Recommandation mutuelle** (oui/non)
- **Badge expertise** (optionnel : "Expert IA", "Expert Architecture", etc.)

Questions suggérées :
```
"Combien d'années de collaboration et de projets ensemble ?"
Options: 1-2 ans, 3-5 ans, 5-10 ans, 10+ ans

"Avez-vous une recommandation mutuelle LinkedIn ?"
Options: Oui, Non

"Un badge d'expertise à afficher ?"
Options: Expert Architecture, Expert Cloud, Expert IA, Aucun
```

### Étape 4 : Liens

Demande :
- **LinkedIn** (obligatoire)
- **GitHub** (optionnel)
- **Site web** (optionnel)

Question suggérée :
```
"Quels sont ses profils LinkedIn, GitHub, site web ?"
```

### Étape 5 : Photo

Demande le chemin vers une photo. L'image sera :
- Redimensionnée à 200x200px
- Convertie en JPEG (sips sur macOS)
- Sauvegardée dans `public/images/partners/<id>.jpg`

Si pas de photo, utiliser DiceBear :
`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=<prenom>`

### Étape 6 : Couleur du Noeud

Demande la couleur pour le graphe réseau :
- Violet : #6366f1
- Rose : #ec4899
- Orange : #f59e0b
- Vert : #10b981
- Rouge : #ef4444
- Mauve : #8b5cf6
- Cyan : #06b6d4

## Traitement

1. **Générer l'ID** depuis le nom :
   - Minuscules
   - Espaces → tirets
   - Supprimer accents
   - Ex: "Jean-Pierre Müller" → "jean-pierre-muller"

2. **Traiter l'image** (si fournie) :
   ```bash
   mkdir -p public/images/partners
   sips -s format jpeg -z 200 200 <source> --out public/images/partners/<id>.jpg
   ```

3. **Ajouter dans** `src/data/partners.ts` :
   ```typescript
   {
     id: '<id>',
     name: '<nom>',
     title: '<titre>',
     company: '<entreprise>', // omettre si non fourni
     avatar: '/images/partners/<id>.jpg',
     description: '<description>',
     skills: ['<skill1>', '<skill2>', '<skill3>'],
     badges: [
       { type: 'years', label: 'ans de collaboration', value: <années> },
       { type: 'projects', label: 'projet(s) ensemble', value: <projets> },
       { type: 'mutual', label: 'Recommandation mutuelle' }, // si oui
       { type: 'expertise', label: '<badge>' }, // si fourni
     ],
     links: {
       linkedin: '<url-linkedin>',
       github: '<url-github>', // si fourni
       website: '<url-site>', // si fourni
     },
     color: '<couleur>',
   },
   ```

4. **Vérifier le build** : `npm run build`

5. **Afficher le résumé** du partenaire ajouté

## Exemple

```typescript
{
  id: 'vincent-composieux',
  name: 'Vincent Composieux',
  title: 'Tech Lead & Architect',
  avatar: '/images/partners/vincent-composieux.jpg',
  description: 'Crafting robust products from backend systems to scalable infrastructures. Une collaboration efficace.',
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
```
