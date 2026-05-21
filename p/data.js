/**
 * Portfolio Data Configuration
 * Update the details in this file to modify the content of the portfolio.
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "RACHAMALLA NIHARSHITH",
    shortName: "Niharshith",
    tagline: "Open to Software Engineering Roles · 2025",
    sub: "I build efficient, scalable software solutions with strong foundations in computer science, problem-solving, and real-world development.",
    location: "Warangal, Telangana",
    timeZone: "India · IST (UTC+5:30)",
    workStatus: "Available for remote or on-site roles"
  },
  stats: {
    leetcode: 100,
    projects: 5,
    cgpa: "7.5"
  },
  focus: [
    "DSA practice on LeetCode",
    "Java application development",
    "Exploring AI & Machine Learning",
    "Full-stack web fundamentals"
  ],
  education: [
    {
      degree: "Bachelor of Technology",
      major: "Computer Science Engineering",
      institution: "SR University",
      location: "Warangal, Telangana, India",
      duration: "Aug 2023 – Apr 2027",
      courses: ["Data Structures", "Algorithms", "OOPs", "DBMS", "AI & Coding"],
      cgpa: 7.5
    },
    {
      degree: "Pre-University Education",
      major: "Intermediate (MPC)",
      institution: "Shivani Jr College",
      location: "Warangal, India",
      duration: "Oct 2021 – Apr 2023",
      grade: "94.3"
    }
  ],
  experience: [
    {
      role: "AI-ML Virtual Internship",
      organization: "EduSkills Foundation × Google Developers",
      duration: "Jul – Sep 2024",
      meta: "10 Weeks · Virtual · Grade A",
      points: [
        "Completed a 10-week virtual internship focused on Artificial Intelligence and Machine Learning concepts and applications.",
        "Gained hands-on experience in building, training, and deploying AI-ML models supported by the Google for Developers program.",
        "Developed solid foundations in data analysis, model evaluation, and modern machine learning practices."
      ]
    },
    {
      role: "Java Full Stack Developer Virtual Internship",
      organization: "EduSkills Academy",
      duration: "Oct – Dec 2024",
      meta: "10 Weeks · Virtual · Grade C",
      points: [
        "Completed a 10-week intensive virtual internship focused on end-to-end Java Full Stack development technologies.",
        "Gained practical knowledge in enterprise application architecture, relational databases, backend routing, and dynamic UI styling.",
        "Developed web components and backend controllers using Java, demonstrating solid understanding of Full Stack development lifecycle."
      ]
    }
  ],
  journey: [
    {
      year: "The Beginning",
      title: "Sparked by curiosity",
      desc: "Discovered a deep interest in programming and problem-solving. Fascinated by how logic could create systems from scratch."
    },
    {
      year: "Core Foundations",
      title: "Mastering Java & OOP",
      desc: "Committed to learning Java with a focus on strong object-oriented principles — encapsulation, inheritance, polymorphism, abstraction."
    },
    {
      year: "Competitive Practice",
      title: "100+ LeetCode problems solved",
      desc: "Consistent daily practice on LeetCode. Built discipline and pattern recognition across arrays, trees, graphs, and dynamic programming."
    },
    {
      year: "Real-World Building",
      title: "First Java applications",
      desc: "Built the Library Management System and Student Result Management System — applying OOP and SQL in real, modular applications."
    },
    {
      year: "Expanding Horizons",
      title: "Android + Web Internship",
      desc: "Completed a 10-week Google-powered Android internship. Simultaneously deepened HTML, CSS, JavaScript skills for web projects."
    },
    {
      year: "Azure & AI",
      title: "Microsoft Azure AI Fundamentals",
      desc: "Earned the Microsoft Certified: Azure AI Fundamentals certification, demonstrating solid knowledge of machine learning and AI workloads on Azure (Credential: FkDN-XMpE)."
    },
    {
      year: "Now",
      title: "Ready for software engineering roles",
      desc: "Actively seeking full-time or internship opportunities where I can contribute, grow, and build things that matter."
    }
  ],
  skills: {
    categories: [
      {
        title: "Programming Languages",
        items: [
          { name: "Java", level: 85 },
          { name: "Python (Basics)", level: 45 }
        ]
      },
      {
        title: "Web Technologies",
        items: [
          { name: "HTML", level: 80 },
          { name: "CSS", level: 75 },
          { name: "JavaScript", level: 65 },
          { name: "React (Basics)", level: 40 }
        ]
      },
      {
        title: "Core CS Concepts",
        items: [
          { name: "Data Structures & Algorithms", level: 80 },
          { name: "Object-Oriented Programming", level: 85 },
          { name: "AI / Machine Learning", level: 75 }
        ]
      },
      {
        title: "Databases",
        items: [
          { name: "SQL", level: 70 },
          { name: "PL/SQL", level: 55 }
        ]
      }
    ],
    tools: [
      "Git",
      "GitHub",
      "VS Code",
      "Azure Cloud",
      "AI-ML Models"
    ],
    soft: [
      "Problem Solving",
      "Logical Thinking",
      "Consistency",
      "Self-Learning",
      "Time Management",
      "Ownership Mindset"
    ]
  },
  projects: [
    {
      num: "01",
      title: "SmartLib AI — Enterprise Library Analytics",
      desc: "A next-generation, multi-language enterprise library analytics hub. Combines a thread-safe high-concurrency Java Backend Core (priority waitlists, repository, services) with a Python AI Intelligence Layer (User-Based Collaborative Filtering, NLP Review Lexical Sentiment Analysis, Predictive Demand Forecasting) and a sleek slate-blue glassmorphic responsive frontend dashboard.",
      tech: ["Java", "Python", "JavaScript", "NLP & AI"],
      link: "java/lyb/dashboard/index.html"
    },
    {
      num: "02",
      title: "Library Management System",
      desc: "A Java-based system designed with object-oriented principles to manage books, users, and transactions. Features book/user management, issue & return tracking, and a clean modular OOP architecture.",
      tech: ["Java", "OOP", "Data Structures"],
      link: "https://github.com/NiharshithRachamalla"
    },
    {
      num: "03",
      title: "Student Result Management System",
      desc: "A system to manage student academic records and results with structured data handling. Efficiently stores and retrieves student performance data using SQL-backed Java operations.",
      tech: ["Java", "SQL", "JDBC"],
      link: "https://github.com/NiharshithRachamalla"
    },
    {
      num: "04",
      title: "Product Pricing Card UI",
      desc: "A responsive product pricing card interface with clean UI components for pricing plans, cost breakdown, and CTAs. Applied responsive design for mobile, tablet, and desktop compatibility.",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/NiharshithRachamalla"
    },
    {
      num: "05",
      title: "Personal Portfolio Website",
      desc: "This very site — a responsive portfolio showcasing skills, projects, and achievements. Built with clean HTML, CSS, and JavaScript with smooth animations and recruiter-first UX.",
      tech: ["HTML", "CSS", "JavaScript"],
      isCurrentSite: true
    }
  ],
  achievements: [
    {
      type: "leetcode",
      num: 100,
      label: "LeetCode problems solved consistently, building strong algorithmic thinking",
      link: "https://leetcode.com/u/Niharshith/",
      linkText: "View LeetCode Profile →"
    },
    {
      type: "certification",
      num: "Azure",
      boldLabel: "Microsoft Certified",
      label: "Azure AI Fundamentals — Aug 30, 2025"
    },
    {
      type: "internship",
      num: "10wk",
      boldLabel: "Google Developer Internship",
      label: "EduSkills · AI-ML · Jul–Sep 2024 · Grade A"
    },
    {
      type: "internship",
      num: "10wk",
      boldLabel: "Java Full Stack Internship",
      label: "EduSkills Academy · Oct–Dec 2024 · Grade C"
    }
  ],
  contact: {
    email: "niharshith.r59@gmail.com",
    phone: "+91 8897231359",
    phoneLink: "tel:+918897231359",
    linkedin: "https://www.linkedin.com/in/rachamalla-niharshith-a3170a2a2",
    github: "https://github.com/NiharshithRachamalla"
  }
};
