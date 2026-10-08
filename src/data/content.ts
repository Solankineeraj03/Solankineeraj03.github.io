export type Project = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  status: string;
  topics: string[];
  stack: string[];
  github: string;
  link?: string;
  visual: 'chart' | 'pipeline' | 'network';
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
    topics: ['Inference', 'Benchmarking'],
    stack: ['Python', 'vLLM', 'PyTorch', 'GPU telemetry', 'Docker', 'CI'],
    github: 'https://github.com/Solankineeraj03/llm-serving-determinism',
    visual: 'chart',
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
    topics: ['Edge AI', 'Benchmarking'],
    stack: ['C', 'Python', 'Hardware profiles', 'Bayesian optimization', 'Docker'],
    github: 'https://github.com/Solankineeraj03/CHAI',
    visual: 'pipeline',
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
    topics: ['Edge AI', 'Multimodal'],
    stack: ['Python', 'Federated learning', 'Active learning', 'IoT'],
    github: 'https://github.com/Solankineeraj03/FLARE',
    visual: 'network',
  },
];

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
