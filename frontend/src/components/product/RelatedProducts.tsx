import React from "react";
import Link from "next/link";
import Image from "next/image";

type RelatedProduct = {
  id: string;
  name: string;
  material: string;
  price: number;
  img?: string;
  images?: { url: string }[];
};

export default function RelatedProducts({
  currentCategory,
  currentId,
  relatedProducts,
}: {
  currentCategory: string;
  currentId: string | number;
  relatedProducts: RelatedProduct[];
}) {
  const fallbackImage = "/placeholder.jpg";

  return (
    <section
      className="max-w-[1320px] mx-auto px-6 md:px-12 pt-24 border-t border-black/5 mt-24"
      data-category={currentCategory}
      data-current-id={currentId}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#8B8375] mb-2 block">Complete the Ritual</span>
          <h2 className="font-display text-3xl md:text-4xl text-[var(--color-brand-char)]">Recommended for You</h2>
        </div>
        <Link href="/collections" className="font-ui text-sm font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:text-[var(--color-brand-gold)] transition-colors">
          View All Collection →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {relatedProducts.slice(0, 4).map((product) => {
          const image = product.images?.[0]?.url ?? product.img ?? fallbackImage;
          return (
            <Link href={`/product/${product.id}`} key={product.id} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#E8E1D5] mb-4">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              </div>
              <h3 className="font-display text-lg text-[var(--color-brand-char)] group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="font-ui text-sm text-[#8B8375] mb-1">{product.material}</p>
              <p className="font-ui text-base font-bold text-[var(--color-brand-char)]">
                ₹{(product.price / 100).toLocaleString("en-IN")}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
