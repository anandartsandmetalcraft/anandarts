import dynamic from "next/dynamic";
import { getProductById, getProducts } from "@/actions/products";
import ProductDetails from "../../../components/product/ProductDetails";
import { notFound } from "next/navigation";
import Schema from "@/components/shared/Schema";
import { Metadata } from "next";

const RelatedProducts = dynamic(() => import("../../../components/product/RelatedProducts"));
const RecentlyViewed = dynamic(() => import("../../../components/product/RecentlyViewed"));
const FinishingComparison = dynamic(() => import("@/components/home/FinishingComparison"));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description || `Handcrafted ${product.name} from Anand Arts. ${product.material} craftsmanship at its finest.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.img],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedResult = await getProducts({
    category: product.category,
    page: 1,
    limit: 8,
  } as any);
  let relatedProducts = (relatedResult.products || [])
    .filter((item: any) => item.id !== product.id)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    const fallbackResult = await getProducts({ page: 1, limit: 8 } as any);
    relatedProducts = (fallbackResult.products || [])
      .filter((item: any) => item.id !== product.id)
      .slice(0, 4);
  }

  // Schema for AI Search Engines (GEO/AEO)
  const productSchema = {
    name: product.name,
    image: product.img,
    description: product.description || `${product.name} handcrafted from ${product.material}.`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      "name": "Anand Arts"
    },
    material: product.material,
    offers: {
      "@type": "Offer",
      "url": `https://anandarts.in/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price / 100,
      "availability": product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="pt-32 pb-24 bg-[var(--color-brand-cream)]">
      <Schema type="Product" data={productSchema} />
      <ProductDetails product={product} />
      <FinishingComparison />
      <RelatedProducts currentCategory={product.category} currentId={product.id} relatedProducts={relatedProducts} />
      <RecentlyViewed currentId={product.id} />
    </main>
  );
}
