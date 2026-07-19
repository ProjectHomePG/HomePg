import pgService from '../../../services/pgService';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    const pg = await pgService.getBySlug(slug);
    
    return {
      title: `${pg.title}`,
      description: pg.description.substring(0, 160),
      openGraph: {
        title: pg.title,
        description: pg.description.substring(0, 160),
        images: pg.images?.length > 0 ? [{ url: pg.images[0].url }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'PG Not Found',
    };
  }
}

export default function PGLayout({ children }) {
  return <>{children}</>;
}
