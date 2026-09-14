import { getPortalData } from "@/lib/data";
import { HomePortal } from "@/components/home-portal";
import { categories, type CategoryId } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const query = await searchParams;
  const initialCategory = categories.some((category) => category.id === query.category) ? query.category as CategoryId : "all";
  return <HomePortal key={initialCategory} initialCategory={initialCategory} data={await getPortalData()} />;
}
