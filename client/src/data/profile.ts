export const profile = {
  name: 'Shreyas Visweshwaran',
  handle: 'FirefoxSRV',
  email: 'shreyasvisweshwaran@gmail.com',
  emailAlt: 'sviswes@ncsu.edu',
  phone: '+1 (984) 742-8701',
  tagline: 'engineer · researcher · ml builder',
  location: 'Raleigh, NC',

  bio: [
    "I'm Shreyas — a CS grad student split between research labs and production systems.",
    "MS @ NC State, B.Tech from Amrita, incoming Goldman Sachs AWM in Summer '26.",
    "I build scalable backends, RAG systems, and low-latency pipelines — paranoid, fast, allergic to noise.",
  ].join(' '),

  schools: [
    {
      org: 'North Carolina State University',
      role: 'M.S. Computer Science',
      window: '2025 — 2027',
      blurb: 'Automated Learning & Data Analysis · Algorithm Design · Computer Networks.',
    },
    {
      org: 'Amrita Vishwa Vidyapeetham',
      role: 'B.Tech Computer Science',
      window: '2021 — 2025',
      blurb: 'Operating Systems · Algorithm Design · Machine Learning · Neural Networks.',
    },
  ],

  experience: [
    {
      id: 'gs-2026',
      org: 'Goldman Sachs',
      role: 'Software Engineer Intern — Asset & Wealth Management',
      window: 'Summer 2026',
      location: 'Richardson, TX',
      color: '#4F90D2',
      bullets: [
        'Incoming intern set to build scalable backend services and low-latency data pipelines supporting portfolio management workflows across a $3T+ AUS platform.',
        'Selected to develop ML-powered analytics tools delivering real-time investment insights for wealth management professionals and high-net-worth clients.',
        'Set to contribute to internal client reporting infrastructure using distributed systems, RESTful APIs, and optimized database queries for high-throughput financial data.',
      ],
    },
    {
      id: 'ncsu-gic',
      org: 'Generative Intelligent Computing Lab — NC State',
      role: 'Student Researcher',
      window: 'Aug 2025 — Feb 2026',
      location: 'Raleigh, NC',
      color: '#CC0000',
      bullets: [
        'Developed MerryQuery, a RAG-based educational assistant processing 300+ queries with containerized deployment, vectorized search, and 40% latency reduction.',
        'Built a VLM-powered urban analytics system integrating computer vision and NLP to study transit-induced gentrification using Google Street View imagery and business microdata.',
        'Engineered a data fusion pipeline merging household microdata, online reviews, and visual data across Yelp, Zillow, and Google for spatiotemporal analysis across 4 metro areas.',
      ],
    },
    {
      id: 'purplespot-2023',
      org: 'Purplespot Innovations Pvt. Ltd.',
      role: 'Software Development Engineer Intern',
      window: 'Sep 2023 — Feb 2024',
      location: 'Chennai, India',
      color: '#FF6B6B',
      bullets: [
        'Built an ML pipeline using Selenium, Mistral OpenOrca, and real-time analytics serving 500+ drivers.',
        'Deployed OpenOrca-7B with INT8 quantization, reducing memory 32% while maintaining 95%+ accuracy.',
        'Improved inference throughput 29% through batching, caching, and quantization optimizations.',
      ],
    },
  ],

  skills: {
    Languages: ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
    'ML / AI': ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Hugging Face', 'LangChain', 'RAG'],
    Systems: ['Distributed Systems', 'Low-Latency Infra', 'Docker', 'RESTful APIs'],
    Data: ['Pandas', 'NumPy', 'Real-Time Processing', 'Statistical Analysis', 'DB Optimization'],
    Development: ['Git', 'CI/CD', 'Benchmarking', 'Testing Frameworks'],
  } as Record<string, string[]>,

  projects: [
    {
      id: 'merryquery',
      name: 'MerryQuery',
      tagline: 'AI-powered educational assistant',
      stack: ['Python', 'RAG', 'Vector Search', 'Docker'],
      blurb:
        'RAG system at GIC Lab, NCSU. Processing 1,000+ queries with 92% accuracy; vectorization and optimized search cut latency by 40%.',
      link: 'https://github.com/FirefoxSRV',
    },
    {
      id: 'chatlearn',
      name: 'ChatLearn',
      tagline: 'interactive communication simulator',
      stack: ['Python', 'LLMs', 'Conversational AI'],
      blurb:
        'Conversational AI at Game2Learn Lab, NCSU. Simulates parent-child interactions with configurable agent profiles and real-time dialogue generation.',
      link: 'https://github.com/FirefoxSRV',
    },
    {
      id: 'glass-class',
      name: 'Glass Classification',
      tagline: 'published ML study — ICCIS 2023, Springer',
      stack: ['Python', 'Scikit-Learn', 'Statistical Analysis'],
      blurb:
        'Empirical study on ML models with the Glass Classification dataset. Published at ICCIS 2023 (Springer).',
      link: 'https://github.com/FirefoxSRV/GlassClassification',
    },
    {
      id: 'portfolio-2026',
      name: 'portfolio-2026',
      tagline: 'this site',
      stack: ['React', 'Three.js', 'GSAP', 'Node'],
      blurb:
        'Cinematic portfolio — NC State × Goldman Sachs energy. WebGL, particle systems, custom shaders.',
      link: 'https://github.com/FirefoxSRV',
    },
  ],

  publications: [
    {
      cite:
        'Visweshwaran, S., et al. (2024). “An Empirical Study on ML Models with Glass Classification Dataset.” ICCIS 2023, Springer.',
    },
  ],

  socials: [
    { label: 'GitHub', href: 'https://github.com/FirefoxSRV' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shreyas-visweshwaran-8b5b4aa4/' },
    { label: 'Email', href: 'mailto:shreyasvisweshwaran@gmail.com' },
  ],
} as const;

export type ExperienceItem = (typeof profile.experience)[number];
export type ProjectItem = (typeof profile.projects)[number];
