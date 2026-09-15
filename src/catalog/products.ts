export interface Product {
  id: string;
  name: string;
  maker: string;
  category: string;
  price: string;
  rating: number;
  badge?: string;
  description: string;
  image: string;
  accent: string;
}

export const products: Product[] = [
  {
    id: 'field-notebook',
    name: 'Field Notes System',
    maker: 'Northline Studio',
    category: 'Workspaces',
    price: '$42',
    rating: 4.9,
    badge: 'Staff pick',
    description: 'A modular analog workspace for ideas, plans, and the small details worth keeping.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=85',
    accent: '#d7e7e2'
  },
  {
    id: 'arc-lamp',
    name: 'Arc Task Lamp',
    maker: 'Kindred Objects',
    category: 'Home',
    price: '$168',
    rating: 4.8,
    badge: 'New',
    description: 'Focused light with a warm, sculptural profile made for long evenings and clear thinking.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    accent: '#f0dfc6'
  },
  {
    id: 'trail-pack',
    name: 'Daybreak Trail Pack',
    maker: 'Roam Goods',
    category: 'Outdoors',
    price: '$128',
    rating: 4.7,
    badge: 'Best seller',
    description: 'A compact, weather-ready carry for the commute that turns into a day outside.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
    accent: '#dce2d3'
  },
  {
    id: 'ceramic-set',
    name: 'Sunday Ceramic Set',
    maker: 'Morrow Clay',
    category: 'Home',
    price: '$96',
    rating: 4.9,
    description: 'Hand-finished forms that make everyday rituals feel a little more intentional.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
    accent: '#eadbd6'
  },
  {
    id: 'studio-headphones',
    name: 'Studio One Headphones',
    maker: 'Aster Audio',
    category: 'Tech',
    price: '$249',
    rating: 4.6,
    badge: 'Quiet favorite',
    description: 'Balanced, detailed sound and all-day comfort for deep work without the noise.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
    accent: '#d8ddea'
  },
  {
    id: 'linen-overshirt',
    name: 'Everyday Linen Overshirt',
    maker: 'Common Thread',
    category: 'Wear',
    price: '$118',
    rating: 4.8,
    description: 'A relaxed layer with a precise cut, made to be worn often and kept for years.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    accent: '#e6ddd1'
  }
];
