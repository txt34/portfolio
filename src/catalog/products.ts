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
    id: 'webgl-vector-engine',
    name: 'High-Res WebGL & Vector Engine',
    maker: 'Devin Holmes',
    category: 'Architecture',
    price: 'Three.js / GSAP',
    rating: 5.0,
    badge: 'Graphics',
    description: 'Engineered high-performance graphics architecture utilizing Three.js for 3D WebGL environments, PixiJS for 2D particle systems, and GSAP with Lottie for scalable SVG vector micro-animations.',
    image: '/assets/images/products/studio-headphones.svg',
    accent: '#fde047'
  },
  {
    id: 'aivana-ai',
    name: 'Aivana-1 AI Analysis Suite',
    maker: 'Devin Holmes',
    category: 'Tech',
    price: 'Python / Streamlit',
    rating: 5.0,
    badge: 'AI & UI',
    description: 'Developed AI response evaluation dashboard using Python and Streamlit with modular user interfacing, loading screens for offloading, and responsive layout design.',
    image: '/assets/images/fred-falcon.svg',
    accent: '#d7e7e2'
  },
  {
    id: 'software-metrics',
    name: 'Software Metrics Analysis',
    maker: 'Apache POI Research',
    category: 'Architecture',
    price: '676k+ LOC',
    rating: 4.9,
    badge: 'Research',
    description: 'Analyzed the Apache POI Java repository (676,000+ lines of code), evaluating object-oriented maintainability, coupling, and architectural complexity.',
    image: '/assets/images/products/field-notebook.svg',
    accent: '#f0dfc6'
  },
  {
    id: 'stay-fit-app',
    name: '“Stay Fit” Web Application',
    maker: 'Secure Dev Team',
    category: 'Security',
    price: 'Award Winning',
    rating: 4.9,
    badge: 'Security',
    description: 'Award-winning web application featuring robust input sanitization, regex validations, and OWASP-aligned software security measures for safe user data handling.',
    image: '/assets/images/products/trail-pack.svg',
    accent: '#dce2d3'
  },
  {
    id: 'bgsu-education',
    name: 'B.A. Computer Science',
    maker: 'Bowling Green State University',
    category: 'Education',
    price: 'May 2026',
    rating: 4.9,
    badge: 'BGSU',
    description: 'Computer Science student with 150+ completed credit hours and minor in Science & Civilization. Focused on secure software engineering and algorithms.',
    image: '/assets/images/bgsu-crest.svg',
    accent: '#eadbd6'
  },
  {
    id: 'fordham-athletics',
    name: 'NCAA Division I Football',
    maker: 'Fordham University',
    category: 'Home',
    price: 'Student-Athlete',
    rating: 4.8,
    badge: 'Fordham',
    description: 'NCAA Division I student-athlete playing football at Fordham University, cultivating exceptional time management, teamwork, discipline, and high performance under pressure.',
    image: '/assets/images/fordham-ram.svg',
    accent: '#d8ddea'
  },
  {
    id: 'landscaping-business',
    name: 'Landscaping & Athletic Training',
    maker: 'Amherst, OH',
    category: 'Experience',
    price: '2018 - 2026',
    rating: 4.8,
    badge: 'Entrepreneur',
    description: 'Owner & operator delivering landscaping and athletic training services. Managed social media operations, client communications, and customer relationships.',
    image: '/assets/images/products/ceramic-set.svg',
    accent: '#e6ddd1'
  }
];
