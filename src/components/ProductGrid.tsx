import type { Product } from '../types';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, empty }: { products: Product[]; empty?: string }) {
  if (!products.length) {
    return <p className="rounded-[28px] bg-ink-800 p-10 text-center text-steel">{empty ?? 'Nenhum produto encontrado.'}</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
