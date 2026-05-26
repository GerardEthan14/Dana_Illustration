import { defineField, defineType } from 'sanity';

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio (book PDF)',
  type: 'document',
  fields: [
    defineField({
      name: 'pdf',
      title: 'Fichier PDF',
      type: 'file',
      description:
        "Glisse-dépose ici ton portfolio exporté depuis Canva (format PDF). C'est ce fichier qui s'affichera sur la page /portfolio du site.",
      options: { accept: 'application/pdf' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture (optionnel)',
      type: 'image',
      description:
        "Image affichée comme aperçu en haut de la page. Si vide, on tente d'extraire la première page du PDF.",
      options: { hotspot: true },
    }),
    defineField({
      name: 'titleFr',
      title: 'Titre (FR)',
      type: 'string',
      initialValue: 'Mon portfolio',
    }),
    defineField({
      name: 'titleNl',
      title: 'Titel (NL)',
      type: 'string',
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
    }),
    defineField({
      name: 'descriptionFr',
      title: 'Texte d\'introduction (FR)',
      type: 'text',
      rows: 3,
      description: 'Court texte affiché au-dessus du PDF, en français.',
    }),
    defineField({
      name: 'descriptionNl',
      title: 'Inleidende tekst (NL)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Intro text (EN)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Dernière mise à jour',
      type: 'datetime',
      description: "Indique aux visiteurs quand le book a été mis à jour. Met à jour automatiquement à chaque publication.",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'titleFr',
      media: 'coverImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Portfolio',
        subtitle: 'Book PDF · ouvre pour gérer',
        media,
      };
    },
  },
});
