export type CategoryId =
  'inference' | 'llm-systems' | 'edge-ai' | 'healthcare' | 'applied-ml' | 'full-stack';

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    id: 'inference',
    name: 'Inference & Serving',
    blurb:
      'Serving engines, throughput and latency measurement, caching, quantization, and the behavior of models under real load.',
  },
  {
    id: 'llm-systems',
    name: 'LLM Systems & Agents',
    blurb:
      'Retrieval, fine-tuning, verification, and agent loops that turn language and vision models into dependable products.',
  },
  {
    id: 'edge-ai',
    name: 'Edge & Hardware-aware AI',
    blurb:
      'Learning and inference on constrained, intermittently powered, or on-device hardware, where memory and energy set the rules.',
  },
  {
    id: 'healthcare',
    name: 'Healthcare AI',
    blurb:
      'Research prototypes for medical imaging and wellbeing, built with explicit safety limits and honest evaluation.',
  },
  {
    id: 'applied-ml',
    name: 'Applied ML & Data',
    blurb:
      'End-to-end predictive modeling, explainability, monitoring, and quantitative analysis on tabular and market data.',
  },
  {
    id: 'full-stack',
    name: 'Full-stack Apps',
    blurb: 'Product engineering across real-time web clients, APIs, databases, and containers.',
  },
];

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  status: string;
  categories: CategoryId[];
  stack: string[];
  github: string;
  link?: string;
  linkLabel?: string;
  featured?: boolean;
  highlight?: { value: string; label: string };
  visual: 'chart' | 'network' | 'flow';
  flow?: { label: string; nodes?: [string, string][] };
};

export const links = {
  github: 'https://github.com/Solankineeraj03',
  linkedin: 'https://www.linkedin.com/in/neeraj-solanki-8266211a6',
  scholar: 'https://scholar.google.com/citations?user=Z1kAqRIAAAAJ&hl=en',
  email: 'mailto:nsola5@uic.edu',
  resume: '/resume/Neeraj_Solanki_Resume.pdf',
};

export const projects: Project[] = [
  {
    slug: 'inferscope',
    name: 'InferScope',
    kicker: 'Reproducible LLM serving research',
    summary:
      'A measurement harness for output parity and performance under real serving conditions.',
    problem:
      'A fixed prompt with greedy decoding can change output as concurrent requests change the serving path. A simple divergence rate hides how varied those outputs become.',
    approach:
      'YAML-defined workloads, per-request token traces, declared isolated references, GPU clock and throttle telemetry, and automated reporting. Invalid hardware measurements are excluded from latency and throughput analysis while parity evidence is retained.',
    result:
      'On Qwen2.5-7B-Instruct BF16 with vLLM 0.19.1 and one RTX 3090, throughput rose from 34.8 to 181.7 output tokens/s across concurrency 0–8. One fixed prompt produced 1 to 20 distinct outputs. The repository reports 8,020 benchmark records and 105 automated tests.',
    status: 'Open source · ongoing research',
    categories: ['inference'],
    stack: ['Python', 'vLLM', 'PyTorch', 'GPU telemetry', 'Docker', 'CI'],
    github: 'https://github.com/Solankineeraj03/llm-serving-determinism',
    featured: true,
    highlight: {
      value: '1→20',
      label: 'distinct outputs from one fixed greedy prompt as concurrency rose from 0 to 8',
    },
    visual: 'chart',
  },
  {
    slug: 'cartograph',
    name: 'Cartograph',
    kicker: 'Grounded product discovery',
    summary:
      'A shopping assistant that retrieves, reasons, and verifies every answer, backed by an evidence-first ML platform.',
    problem:
      'A language model asked for "a keyboard and mouse bundle under $100, in stock" can invent products, miss the budget, or pick unavailable items. Answers need to be checked, not trusted.',
    approach:
      'Hybrid BM25 plus a fine-tuned encoder retrieves candidates, a Ray Data → Iceberg → Feast → Redis feature platform serves point-in-time price and stock, and a fine-tuned Qwen2.5-1.5B picks a bundle. A verifier checks real IDs, stock, categories, exact totals, and budget; unverifiable answers are never shown. GRPO and DPO alignment runs are reported, including the ones that did not help.',
    result:
      'Hybrid retrieval reached NDCG@10 0.353 vs 0.302 for BM25 on 8,956 ESCI queries. On 500 held-out synthetic bundle tasks, fine-tuning lifted the base model from 0.00 to 0.69, and 0.75 with verify-and-retry. On one RTX 3090, vLLM served 2,869 vs 54 output tokens/s for Transformers; prefix caching cut TTFT 3.6×. All 3,481 adversarial answers were rejected.',
    status: 'Open source · technical report',
    categories: ['llm-systems', 'inference'],
    stack: ['Python', 'Qwen2.5', 'vLLM', 'Ray', 'Feast', 'Redis', 'GRPO / DPO'],
    github: 'https://github.com/Solankineeraj03/cartograph',
    link: 'https://solankineeraj03.github.io/cartograph/',
    linkLabel: 'Project site',
    featured: true,
    highlight: {
      value: '0.353',
      label: 'NDCG@10 for hybrid retrieval vs 0.302 for BM25 on 8,956 ESCI queries',
    },
    visual: 'flow',
    flow: {
      label: 'RETRIEVE → DECIDE → VERIFY',
      nodes: [
        ['Hybrid retrieval', 'BM25 · ENCODER'],
        ['Fine-tuned LLM', 'QWEN2.5-1.5B'],
        ['Verifier', 'STOCK · BUDGET'],
      ],
    },
  },
  {
    slug: 'pc-diagnostics',
    name: 'PC Diagnostics',
    kicker: 'AI-assisted radiology drafts',
    summary:
      'A scan-to-report workspace where a vision model drafts chest X-ray findings for radiologist review.',
    problem:
      'Draft reports can save radiologists time, but a vision-language model must run privately, fail loudly instead of faking output, and be measured honestly against an established baseline.',
    approach:
      'A full-stack app sends uploaded chest X-ray pixels to a private GPU running MedGemma through Ollama, extracts Findings and Impression into an editable draft, and blocks clinical sign-off on real scans. Other modalities are intake-only, enforced in both API and UI. A separate evaluation compares against MAIRA-2 on IU/Open-i cohorts.',
    result:
      'On 200 IU/Open-i studies, direct reporting completed 200/200 with RadGraph F1 29.30/100 [95% CI 27.69–30.80]. These are automated agreement scores, not clinical accuracy; it is a research prototype and not for clinical use.',
    status: 'Research prototype · not for clinical use',
    categories: ['healthcare', 'inference', 'llm-systems'],
    stack: ['Python', 'Node.js', 'MedGemma', 'Ollama', 'MAIRA-2', 'Docker'],
    github: 'https://github.com/Solankineeraj03/pc-diagnostics',
    featured: true,
    highlight: {
      value: '200/200',
      label:
        'IU/Open-i studies reported end-to-end on a private GPU (agreement, not clinical accuracy)',
    },
    visual: 'flow',
    flow: {
      label: 'SCAN → DRAFT → REVIEW',
      nodes: [
        ['Upload', 'DE-IDENTIFIED X-RAY'],
        ['Vision model', 'MEDGEMMA · GPU'],
        ['Radiologist', 'EDIT · SIGN-OFF'],
      ],
    },
  },
  {
    slug: 'chai',
    name: 'CHAI',
    kicker: 'Hardware-aware approximation',
    summary:
      'A constraint-guided workflow for approximating embedded C programs under intermittent power.',
    problem:
      'An approximation that looks promising in isolation may be infeasible on a device with limited memory, arithmetic support, or power availability.',
    approach:
      'Hardware profiles filter candidate techniques before code generation. Generated variants pass compilation and constraint checks, then Bayesian optimization tunes them against energy traces and an intermittent-computing simulator.',
    result:
      'The repository includes hardware profiles, a validation pipeline, simulator integration, documentation, and integration tests. Public documentation does not establish a single comparable headline speedup, so this case study focuses on the method.',
    status: 'Research code',
    categories: ['edge-ai'],
    stack: ['C', 'Python', 'Hardware profiles', 'Bayesian optimization', 'Docker'],
    github: 'https://github.com/Solankineeraj03/CHAI',
    featured: true,
    visual: 'flow',
    flow: {
      label: 'CONSTRAINT-GUIDED SEARCH',
      nodes: [
        ['Hardware profile', 'RAM · ISA · POWER'],
        ['Candidate code', 'GENERATE · VALIDATE'],
        ['Energy trace', 'TUNE · MEASURE'],
      ],
    },
  },
  {
    slug: 'flare',
    name: 'FLARE',
    kicker: 'Intermittent federated learning',
    summary: 'Adaptive sampling and federated coordination for energy-harvesting edge devices.',
    problem:
      'Battery-free clients cannot assume uninterrupted compute, reliable communication, or a large labeled dataset.',
    approach:
      'A task-aware active-learning sampler, reactive intermittent execution, and federated model updates combine to reduce the work demanded of each client.',
    result:
      'The repository documents experiments on CIFAR-10, CIFAR-100, and Tiny ImageNet, with code for the client and sampling workflow. Results are presented in the project README.',
    status: 'Research prototype',
    categories: ['edge-ai'],
    stack: ['Python', 'Federated learning', 'Active learning', 'IoT'],
    github: 'https://github.com/Solankineeraj03/FLARE',
    featured: true,
    visual: 'network',
    flow: { label: 'INTERMITTENT FEDERATED LEARNING' },
  },
  {
    slug: 'edge-mental-health-agent',
    name: 'Edge Mental Health Agent',
    kicker: 'On-device wellbeing assistant',
    summary:
      'An end-to-end recipe for a small, quantized LLM agent that runs on a phone and reasons over wearable signals.',
    problem:
      'A supportive assistant that uses sleep, activity, and phone-usage signals should keep that data on the device, which rules out large cloud models.',
    approach:
      'Continued pretraining on a domain corpus, supervised fine-tuning with counterfactual robustness, a sensor-to-prompt encoder that fuses wearable logs with mood check-ins, q4f16 block quantization with an MLC-LLM build for Android and iOS, and a perceive → decide → act loop with safety prompts.',
    result:
      'The repository is a starter implementation of the full pipeline: data preparation, training scripts, the agent runtime, quantized export, and a React Native shell. It is explicitly not a medical device and does not give diagnoses or medication advice.',
    status: 'Starter implementation',
    categories: ['edge-ai', 'llm-systems', 'healthcare'],
    stack: ['Python', 'PyTorch', 'MLC-LLM', 'q4f16 quantization', 'React Native'],
    github: 'https://github.com/Solankineeraj03/edge-mental-health-agent',
    visual: 'flow',
    flow: {
      label: 'SENSE → REASON → ACT, ON DEVICE',
      nodes: [
        ['Sensor window', 'SLEEP · STEPS · EMA'],
        ['Quantized LLM', 'Q4F16 · MLC'],
        ['Agent step', 'SAFETY PROMPTS'],
      ],
    },
  },
  {
    slug: 'converso',
    name: 'Converso',
    kicker: 'Retrieval-augmented chatbot',
    summary:
      'A production-style RAG chatbot with a persistent vector index, ingestion API, and container deployment.',
    problem:
      'A chatbot that answers from your own documents needs ingestion, a persistent index, and an API that other services can call.',
    approach:
      'LangChain with OpenAI models and a FAISS index, exposed through FastAPI with /chat (history, temperature, top-k) and /ingest (txt, md, pdf) endpoints. Configuration lives in environment variables, with structured logging and Docker packaging.',
    result:
      'A working service that ingests new documents into a persistent FAISS index and answers with retrieved context through a REST API.',
    status: 'Open source',
    categories: ['llm-systems'],
    stack: ['Python', 'LangChain', 'FAISS', 'FastAPI', 'Docker'],
    github: 'https://github.com/Solankineeraj03/Converso-LLM-Chatbot',
    visual: 'flow',
    flow: {
      label: 'INGEST → RETRIEVE → ANSWER',
      nodes: [
        ['Ingest', 'TXT · MD · PDF'],
        ['FAISS index', 'TOP-K RETRIEVAL'],
        ['LLM answer', 'FASTAPI /CHAT'],
      ],
    },
  },
  {
    slug: 'churnguard',
    name: 'ChurnGuard',
    kicker: 'Explainable churn prediction',
    summary:
      'An end-to-end churn prediction service with per-request explanations, monitoring, and experiment tracking.',
    problem:
      'A churn score is only useful if teams can see why a customer is at risk and trust that the model in production is healthy.',
    approach:
      'XGBoost trained on engagement features, served by FastAPI (/train, /predict) with SHAP attributions for every prediction, Prometheus metrics and Grafana dashboards for latency and usage, MLflow for experiment tracking, Pytest coverage, and Docker packaging.',
    result:
      'A complete training-to-serving pipeline on a sample synthetic dataset, with explainability and monitoring built in rather than added later.',
    status: 'Open source',
    categories: ['applied-ml'],
    stack: ['Python', 'XGBoost', 'SHAP', 'FastAPI', 'MLflow', 'Prometheus', 'Grafana'],
    github: 'https://github.com/Solankineeraj03/ChurnGuard-SaaS-Prediction',
    visual: 'flow',
    flow: {
      label: 'TRAIN → SERVE → MONITOR',
      nodes: [
        ['XGBoost', 'MLFLOW TRACKED'],
        ['FastAPI', 'SHAP PER REQUEST'],
        ['Monitoring', 'PROMETHEUS · GRAFANA'],
      ],
    },
  },
  {
    slug: 'cross-impact-analysis',
    name: 'Cross-Impact OFI',
    kicker: 'Market microstructure analysis',
    summary:
      'Computing order flow imbalance and measuring how it moves prices across related equities.',
    problem:
      'Order flow imbalance explains short-term price moves for a single stock, but related stocks may also respond to each other’s order flow.',
    approach:
      'Modular Python scripts and notebooks compute OFI metrics from order-book data, analyze cross-asset impact, and fit predictive models for short-term price changes.',
    result:
      'The repository contains the OFI computation, cross-impact analysis notebooks, and result figures and tables.',
    status: 'Analysis project',
    categories: ['applied-ml'],
    stack: ['Python', 'pandas', 'Jupyter', 'Regression modeling'],
    github: 'https://github.com/Solankineeraj03/cross-impact-analysis',
    visual: 'network',
    flow: { label: 'CROSS-ASSET ORDER FLOW' },
  },
  {
    slug: 'smartpay',
    name: 'SmartPay',
    kicker: 'Digital wallet',
    summary: 'A digital wallet for adding money and sending instant payments, built as a monorepo.',
    problem:
      'Wallet top-ups and peer-to-peer transfers need a responsive interface, consistent balances, and clear transaction status.',
    approach:
      'Next.js front end with Express API servers, PostgreSQL through Prisma, Tailwind CSS, Turborepo for the monorepo, and Docker for packaging, all in TypeScript.',
    result:
      'A working wallet flow covering balance management, money transfers between users, and transaction history.',
    status: 'Open source',
    categories: ['full-stack'],
    stack: ['TypeScript', 'Next.js', 'Express', 'PostgreSQL', 'Prisma', 'Turborepo'],
    github: 'https://github.com/Solankineeraj03/SmartPayApp',
    visual: 'flow',
    flow: {
      label: 'CLIENT → API → LEDGER',
      nodes: [
        ['Next.js app', 'WALLET UI'],
        ['Express API', 'TRANSFERS'],
        ['PostgreSQL', 'PRISMA ORM'],
      ],
    },
  },
  {
    slug: 'chat-app',
    name: 'Chat App',
    kicker: 'Real-time messaging',
    summary: 'A MERN-stack chat application with real-time delivery over WebSockets.',
    problem:
      'Messaging needs instant delivery, authenticated users, and history that survives a reload.',
    approach:
      'React front end, Node.js and Express back end, Socket.IO for real-time events, and MongoDB for users and chat history.',
    result:
      'A working chat app with sign-up and login, real-time messaging, and persistent history.',
    status: 'Open source',
    categories: ['full-stack'],
    stack: ['JavaScript', 'React', 'Node.js', 'Express', 'Socket.IO', 'MongoDB'],
    github: 'https://github.com/Solankineeraj03/Chat-App',
    visual: 'network',
    flow: { label: 'REAL-TIME SOCKET EVENTS' },
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;

export const projectsIn = (id: CategoryId) => projects.filter((p) => p.categories.includes(id));

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  summary: string;
  topics: string[];
  url: string;
  doi?: string;
};

export const publications: Publication[] = [
  {
    title:
      'ATM-Net: Adaptive Termination and Multi-Precision Neural Networks for Energy-Harvested Edge Intelligence',
    authors: 'Neeraj Solanki, Sepehr Tabrizchi, Samin Sohrabi, Jason Schmidt, Arman Roohi',
    venue: 'EMC² workshop, co-located with HPCA',
    year: 2025,
    summary:
      'Adapts network depth and numerical precision to available energy for constrained edge inference.',
    topics: ['Adaptive inference', 'Edge AI'],
    url: 'https://arxiv.org/abs/2502.09822',
    doi: 'https://doi.org/10.48550/arXiv.2502.09822',
  },
  {
    title: 'SenGuard: A Novel Processing In-Sensor Method for Privacy-Enhanced Smart Imaging',
    authors:
      'Neeraj Solanki, Sepehr Tabrizchi, Ali Shafiee Sarvestani, Shaahin Angizi, Arman Roohi',
    venue: 'ACM Great Lakes Symposium on VLSI',
    year: 2025,
    summary: 'Explores in-sensor processing for privacy-aware smart imaging.',
    topics: ['In-sensor computing', 'Privacy'],
    url: 'https://doi.org/10.1145/3716368.3735263',
    doi: 'https://doi.org/10.1145/3716368.3735263',
  },
  {
    title: 'OrganoSense: Neural Biosignal Processing in the Sensor Using Organic Devices',
    authors:
      'Sepehr Tabrizchi, Neeraj Solanki, Ali Shafiee Sarvestani, Shaahin Angizi, Arman Roohi',
    venue: 'IEEE MWSCAS',
    year: 2025,
    summary:
      'Combines organic electronics and weightless neural networks for low-power biosignal processing.',
    topics: ['Biosignals', 'Hardware-aware AI'],
    url: 'https://doi.org/10.1109/MWSCAS53549.2025.11244480',
    doi: 'https://doi.org/10.1109/MWSCAS53549.2025.11244480',
  },
  {
    title: 'ARISE: Adaptive Resource-Aware Intelligent SEnsing Enabling Intermittent Learning',
    authors:
      'Sepehr Tabrizchi, Rebati Gaire, Neeraj Solanki, Shayan Gerami, Ali Shafiee Sarvestani, David Z. Pan, Arman Roohi',
    venue: 'IEEE Transactions on Circuits and Systems for Artificial Intelligence',
    year: 2026,
    summary: 'Studies resource-aware sensing and learning for intermittently powered devices.',
    topics: ['Intermittent learning', 'Edge AI'],
    url: 'https://doi.org/10.1109/TCASAI.2026.3653699',
    doi: 'https://doi.org/10.1109/TCASAI.2026.3653699',
  },
];

export const experience = [
  {
    organization: 'Qualcomm · Cloud AI Division',
    title: 'AI/ML Research Intern',
    dates: 'May–Aug 2026',
    location: 'Santa Clara, California',
    bullets: [
      'Built reusable onboarding and benchmarking workflows for GPT-2, MiniVLA, and custom-attention models on Cloud AI 100 Ultra. Model onboarding took 41–52% less time; accelerator throughput improved by up to 7.05× while preserving numerical accuracy.',
      'Trained and evaluated a 547.6M-parameter text-to-video diffusion transformer on four NVIDIA H100 GPUs. A controlled optical-flow, FVD, and reconstruction protocol measured 19.9% better motion consistency and 12.3% average FVD improvement against baseline attention.',
    ],
    stack: ['Cloud AI 100 Ultra', 'NVIDIA H100', 'PyTorch', 'Benchmarking'],
  },
  {
    organization: 'University of Illinois Chicago',
    title: 'Machine Learning Research Assistant',
    dates: 'Aug 2024–present',
    location: 'Chicago, Illinois',
    bullets: [
      'Designed early-exit and precision-aware adaptive inference, reaching 2× throughput while preserving perceptual accuracy under compute constraints.',
      'Built lightweight signal-classification architectures with a 100× smaller memory footprint, and scaled multimodal experiments across 30+ distributed clients with 80% less communication overhead.',
    ],
    stack: ['Adaptive inference', 'Multimodal learning', 'Edge AI'],
  },
  {
    organization: 'Deloitte USI',
    title: 'Machine Learning Engineer',
    dates: 'Jul 2022–Jul 2024',
    location: 'Mumbai, India',
    bullets: [
      'Built production ML pipelines from preprocessing through model serving and runtime optimization, reducing inference processing latency by 40%.',
      'Trained sequence-aware models on 5M+ monthly data streams; evaluation and objective refinements improved anomaly-detection precision by 20%.',
    ],
    stack: ['Python', 'ML pipelines', 'Model serving', 'Evaluation'],
  },
] as const;

export const expertise = [
  {
    heading: 'Inference & serving',
    details:
      'vLLM, OpenAI-compatible serving, continuous batching, KV and prefix caching, TTFT/TPOT/p95 analysis',
  },
  {
    heading: 'Model optimization',
    details:
      'Adaptive termination, early exit, quantization (AWQ and 32/8/4-bit), precision-aware execution',
  },
  {
    heading: 'Multimodal research',
    details:
      'Video diffusion transformers, vision-language-action workloads, temporal biosignals, distributed experiments',
  },
  {
    heading: 'Hardware & measurement',
    details:
      'Qualcomm Cloud AI 100 Ultra, NVIDIA H100, RTX 3090, GPU telemetry, numerical validation',
  },
  {
    heading: 'Engineering',
    details: 'Python, C++, Java, SQL, PyTorch, Docker, Linux, GitHub Actions, AWS, GCP',
  },
  {
    heading: 'Research practice',
    details:
      'Controlled comparisons, ablations, confound isolation, benchmark design, regression gates',
  },
] as const;

export const benchmark = {
  concurrency: [0, 1, 4, 8],
  distinctOutputs: [1, 14, 18, 20],
  throughput: [34.8, 60.7, 123.1, 181.7],
  source: 'https://github.com/Solankineeraj03/llm-serving-determinism/tree/main/results/week1',
};
