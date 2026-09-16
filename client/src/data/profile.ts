export const profile = {
  name: 'Shreyas Visweshwaran',
  handle: 'FirefoxSRV',
  email: 'shreyasvisweshwaran@gmail.com',
  emailAlt: 'sviswes@ncsu.edu',
  phone: '+1 (984) 742-8701',
  tagline: 'Software Development Engineer',
  location: 'Raleigh, NC',

  bio: [
    "I'm Shreyas, an MS Computer Science student at NC State, graduating June 2027.",
    'Summer 2026 I was a software engineering summer analyst at Goldman Sachs in Richardson, TX, shipping full-stack release tooling and an LLM-backed internal assistant.',
    "Before that, RAG and vision-language systems at NC State's GIC Lab, and inference optimization at Purplespot.",
    'I work in Java, Python, C++, and TypeScript across backends, distributed systems, and retrieval.',
  ].join(' '),

  schools: [
    {
      org: 'North Carolina State University',
      role: 'M.S. Computer Science',
      window: 'Aug 2025 - Jun 2027',
      blurb:
        'GPA 3.83/4.00. Data Structures, Algorithms, Object-Oriented Design, System Design, Operating Systems, Computer Networks, Machine Learning.',
    },
    {
      org: 'Amrita Vishwa Vidyapeetham',
      role: 'B.Tech Computer Science',
      window: 'Sep 2021 - May 2025',
      blurb: 'Operating Systems, Algorithm Design, Machine Learning, Neural Networks.',
    },
  ],

  experience: [
    {
      id: 'gs-2026',
      org: 'Goldman Sachs',
      role: 'Summer Analyst, Software Engineering',
      window: 'Jun 2026 - Aug 2026',
      location: 'Richardson, TX',
      color: '#4F90D2',
      bullets: [
        'Architected a JWT-authenticated conversational assistant on an internal LLM platform backed by a MongoDB tool-calling catalog, consolidating release, ticket, and infrastructure state into a single interface.',
        'Delivered a full-stack release reconciliation dashboard (React 18, TypeScript, Node.js, MongoDB) with integrated JIRA lookups, eliminating 2.5 hours of manual comparison work per release.',
        'Engineered Kerberos-authenticated REST services and a React admin console that validate release readiness against live service state, eliminating false-positive approvals.',
      ],
    },
    {
      id: 'ncsu-gic',
      org: 'Generative Intelligent Computing Lab, NC State',
      role: 'Student Researcher',
      window: 'Aug 2025 - Feb 2026',
      location: 'Raleigh, NC',
      color: '#CC0000',
      bullets: [
        'Designed and deployed MerryQuery, a Dockerized retrieval-augmented generation (RAG) system with vectorized search, serving 300+ production queries at 40% lower latency.',
        'Built a vision-language model (VLM) analytics pipeline fusing computer vision and NLP over Street View imagery and business microdata for large-scale urban analytics.',
        'Engineered a distributed ETL pipeline integrating microdata, review APIs, and imagery from Yelp, Zillow, and Google across 4 metro areas to enable cross-source geospatial analysis.',
      ],
    },
    {
      id: 'purplespot-2023',
      org: 'Purplespot Innovations Pvt. Ltd.',
      role: 'Software Engineer Intern',
      window: 'Sep 2023 - Feb 2024',
      location: 'Chennai, India',
      color: '#FF6B6B',
      bullets: [
        'Cut memory footprint 32% by deploying OpenOrca-7B with INT8 quantization on production infrastructure while preserving 95%+ model accuracy.',
        'Boosted inference throughput 29% on a real-time pipeline serving 500+ drivers by implementing request batching, response caching, and quantization tuning.',
      ],
    },
  ],

  skills: {
    Languages: ['Java', 'Python', 'C++', 'C', 'Scala', 'TypeScript', 'JavaScript', 'SQL', 'Kotlin'],
    'Backend & Data': [
      'Node.js',
      'Express.js',
      'Spring Boot',
      'REST APIs',
      'Microservices',
      'Distributed Systems',
      'Kafka',
      'Spark',
      'Flink',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'JWT / Kerberos Auth',
    ],
    Frontend: ['React', 'HTML', 'CSS', 'Flutter'],
    'Cloud & DevOps': [
      'AWS',
      'GCP',
      'Terraform',
      'Docker',
      'Linux / Unix',
      'Git',
      'CI/CD',
      'Unit Testing',
      'Agile',
    ],
    'AI / ML': [
      'PyTorch',
      'Scikit-Learn',
      'XGBoost',
      'Transformers',
      'RAG',
      'Vector Search',
      'Quantization',
      'LLM Tool-Calling',
    ],
  } as Record<string, string[]>,

  projects: [
    {
      id: 'merryquery',
      name: 'MerryQuery',
      tagline: 'AI-powered educational assistant',
      stack: ['Python', 'RAG', 'Vector Search', 'Docker'],
      blurb:
        'RAG assistant built at GIC Lab, NCSU with 92% retrieval accuracy, where vectorized search cut latency 40%. Dockerized and serving production queries.',
      link: 'https://github.com/benneigh/MerryQuery',
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
      tagline: 'published ML study, ICCIS 2023, Springer',
      stack: ['Python', 'Scikit-Learn', 'Statistical Analysis'],
      blurb:
        'Empirical study on ML models with the Glass Classification dataset. Published at ICCIS 2023 (Springer).',
      link: 'https://doi.org/10.1007/978-981-97-2079-8_30',
    },
    {
      id: 'portfolio-2026',
      name: 'portfolio-2026',
      tagline: 'this site',
      stack: ['React', 'Three.js', 'GSAP', 'Node'],
      blurb:
        'Cinematic portfolio with NC State × Goldman Sachs energy. WebGL, particle systems, custom shaders.',
      link: 'https://github.com/FirefoxSRV',
    },
  ],

  publications: [
    {
      cite:
        'Visweshwaran, S., et al. (2024). “An Empirical Study on ML Models with Glass Classification Dataset.” ICCIS 2023, Springer. doi.org/10.1007/978-981-97-2079-8_30',
    },
  ],

  socials: [
    { label: 'GitHub', href: 'https://github.com/FirefoxSRV' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shreyas-visweshwaran/' },
    { label: 'Email', href: 'mailto:shreyasvisweshwaran@gmail.com' },
  ],
} as const;

export type ExperienceItem = (typeof profile.experience)[number];
export type ProjectItem = (typeof profile.projects)[number];
