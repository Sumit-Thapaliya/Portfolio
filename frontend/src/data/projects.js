/**
 * Pulled from github.com/Sumit-Thapaliya — six strongest builds, equal weight.
 * Keep descriptions to one line; the card is a teaser, the repo is the detail.
 */
const projects = [
  {
    id: 'repolens',
    title: 'RepoLens',
    tagline: 'AI codebase intelligence',
    description:
      'Paste any GitHub URL and get its architecture, workflows, API surface and dependency graph — parsed with tree-sitter, explained by AI.',
    tech: ['Python', 'TypeScript', 'tree-sitter', 'FastAPI', 'LLM'],
    year: '2026',
    codeUrl: 'https://github.com/Sumit-Thapaliya/RepoLens-AI-Powered-Codebase-Intelligence-Platform',
    liveUrl: 'https://repo-lens-ai-powered-codebase-intel.vercel.app',
  },
  {
    id: 'jobdev',
    title: 'JobDev',
    tagline: 'Resume → interview in 30s',
    description:
      'LinkedIn-style job platform: parses a résumé, auto-fills the profile and generates an ATS-tailored CV; recruiters get ranked, spam-filtered matches.',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Turborepo', 'shadcn/ui'],
    year: '2026',
    codeUrl: 'https://github.com/Sumit-Thapaliya/DEV',
    liveUrl: '',
  },
  {
    id: 'worldlens',
    title: 'WorldLens',
    tagline: 'On-device visual AI',
    description:
      'A camera app that detects, tracks, counts and narrates what it sees — fully offline, with the model running on the phone.',
    tech: ['React Native', 'Kotlin', 'TypeScript', 'On-device ML'],
    year: '2026',
    codeUrl: 'https://github.com/Sumit-Thapaliya/WorldLens-AI-Visual-Intelligence',
    liveUrl: '',
  },
  {
    id: 'subtext',
    title: 'Subtext',
    tagline: 'AI-text detector',
    description:
      'Scores writing sentence by sentence with a RoBERTa ChatGPT-vs-human detector — gauge verdict, heat rows and explainable stylometry.',
    tech: ['FastAPI', 'Hugging Face', 'React', 'Tailwind', 'Framer Motion'],
    year: '2026',
    codeUrl: 'https://github.com/Sumit-Thapaliya/AI-Detector',
    liveUrl: '',
  },
  {
    id: 'medbridge',
    title: 'MedBridge',
    tagline: 'Hospital medicine exchange',
    description:
      'Hospitals in Nepal track inventory, swap surplus stock with partners and get XGBoost demand forecasts plus an AI assistant over live data.',
    tech: ['React', 'Express', 'Prisma', 'PostgreSQL', 'XGBoost'],
    year: '2026',
    codeUrl: 'https://github.com/Sumit-Thapaliya/MedBridge',
    liveUrl: '',
  },
  {
    id: 'folio',
    title: 'Folio',
    tagline: 'In-browser design studio',
    description:
      'Canva-style editor for résumés, posters and slides — drag, snap, layers, undo/redo, PNG & multi-page PDF export, all client-side.',
    tech: ['TypeScript', 'Canvas', 'PDF export', 'localStorage'],
    year: '2026',
    codeUrl: 'https://github.com/Sumit-Thapaliya/Folio',
    liveUrl: '',
  },
];

export default projects;
