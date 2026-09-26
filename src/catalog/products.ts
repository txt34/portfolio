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
    id: 'aivana-ai',
    name: 'Aivana-1 AI Analysis Suite',
    maker: 'Devin Holmes',
    category: 'Tech',
    price: 'Python / Streamlit',
    rating: 5.0,
    badge: 'AI & UI',
    description: 'Developed AI response evaluation dashboard using Python and Streamlit with modular user interfacing, loading screens for offloading, and responsive layout design.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266cf10?auto=format&fit=crop&w=1200&q=85',
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
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    accent: '#e6ddd1'
  }
];
