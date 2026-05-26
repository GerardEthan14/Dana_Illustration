import { groq } from 'next-sanity';

// We expect a single portfolio document. Order by `_updatedAt` so if Dana
// accidentally creates more than one, we still pick the most recent.
export const portfolioQuery = groq`
  *[_type == "portfolio"] | order(_updatedAt desc) [0] {
    _id,
    "pdfUrl": pdf.asset->url,
    "pdfSize": pdf.asset->size,
    "pdfFilename": pdf.asset->originalFilename,
    coverImage,
    titleFr,
    titleNl,
    titleEn,
    descriptionFr,
    descriptionNl,
    descriptionEn,
    updatedAt,
    _updatedAt
  }
`;
