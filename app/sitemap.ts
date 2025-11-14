import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.kurdforest.xyz',
      lastModified: new Date(),
    },
    {
      url: 'https://www.kurdforest.xyz/movies',
      lastModified: new Date(),
    },
    {
      url: 'https://www.kurdforest.xyz/tvshows',
      lastModified: new Date(),
    },
    {
      url: 'https://www.kurdforest.xyz/watch',
      lastModified: new Date(),
    },
    {
      url: 'https://www.kurdforest.xyz/details',
      lastModified: new Date(),
    },
    // Add more pages if needed
  ];
}