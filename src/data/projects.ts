export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  responsibilities: string[];
  technologies: string[];
  category: 'software' | 'art' | 'music' | 'game';
  image: string;
  liveDemo?: string;
  github?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'seimbang-in',
    title: 'SEIMBANG.IN',
    description: 'A mobile financial management app designed to improve financial literacy in Indonesia. It features OCR receipt scanning for automatic expense tracking and an AI advisor that provides personalized financial tips.',
    role: 'Lead Backend & Cloud Engineer',
    responsibilities: [
      'Designing and building the entire server-side application from scratch using TypeScript and Express.js',
      'Developing core REST APIs for user authentication, transaction management, and processing data from the OCR service',
      'Deploying and managing the application\'s infrastructure on Google Cloud Platform (GCP), ensuring it was scalable and reliable'
    ],
    technologies: ['TypeScript', 'Express.js', 'Google Cloud Platform', 'OCR', 'REST API'],
    category: 'software',
    image: '/projects/seimbang-in.png',
    github: 'https://github.com/seimbang-in'
  },
  {
    id: 'kagami-project',
    title: 'KAGAMI PROJECT',
    description: 'A personal AI project designed to act as a \'mirror\' (Kagami) rather than a typical assistant. It provides brutally honest feedback and challenges assumptions, serving as a critical sparring partner to break through creative or logical blocks.',
    role: 'Solo Full-Stack Developer & Architect',
    responsibilities: [
      'Designing and building the full-stack application from the ground up using TypeScript and ElysiaJS for the core REST API',
      'Architecting the memory and data persistence layer using Pinecone for vector search and PostgreSQL as the source of truth',
      'Implementing RabbitMQ for asynchronous processing to ensure data consistency and handle long-running tasks',
      'Engineering the AI\'s core persona through advanced prompt design to create a cold, analytical, and brutally honest conversational partner'
    ],
    technologies: ['TypeScript', 'ElysiaJS', 'PostgreSQL', 'Pinecone', 'RabbitMQ', 'Vector Search'],
    category: 'software',
    image: '/projects/kagami.jpg',
    github: 'https://github.com/hansfigo/kagami'
  },
  {
    id: 'creature',
    title: 'CREATURE',
    description: 'A web platform built from the ground up to solve a key problem for 3D artists: static portfolios. It allows artists to showcase their work in a fully interactive 3D viewer, making their portfolios more engaging and accessible to clients and recruiters.',
    role: 'Solo Developer',
    responsibilities: [
      'Built the complete monolithic application using SvelteKit, handling everything from user authentication and customizable profiles to the file upload system for 3D models',
      'Implemented a high-performance 3D model viewer using Three.js and WebGL. This core feature allows users to rotate, zoom, and interact with GLTF/GLB models directly in the browser, complete with animation support'
    ],
    technologies: ['SvelteKit', 'Three.js', 'WebGL', 'GLTF/GLB', 'TypeScript'],
    category: 'software',
    image: '/projects/creature.jpg',
    liveDemo: 'https://creature-v1.vercel.app/',
    github: 'https://github.com/hansfigo/creature'
  }
];

export const categories = [
  { id: 'all', name: 'All', count: projects.length },
  { id: 'software', name: 'Software', count: projects.filter(p => p.category === 'software').length },
  { id: 'art', name: 'Art', count: projects.filter(p => p.category === 'art').length },
  { id: 'music', name: 'Music', count: projects.filter(p => p.category === 'music').length },
  { id: 'game', name: 'Game', count: projects.filter(p => p.category === 'game').length }
];
