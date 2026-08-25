export const person = {
  name: "Josep Mampel Marqués",
  short: "Josep Mampel",
  handle: "Mampiz",
  role: "Software engineer",
  location: "Barcelona",
  email: "josepmampel20@gmail.com",
  github: "https://github.com/Mampiz",
  linkedin: "https://linkedin.com/in/josep-mampel-marques",
  tagline: "Some Go, some Kubernetes, one bird detector.",
  summary:
    "A Kubernetes operator, an internal developer platform, a computer vision pipeline and a concurrent Go gateway.",
} as const;

export type Metric = { value: string; label: string };

export type MediaItem = {
  /** File under /public/media, without the base path. */
  src: string;
  /** Static frame shown until the card is hovered or focused. */
  poster?: string;
  alt: string;
  caption?: string;
};

/**
 * What a project shows on the landing panels. Two of the four projects ship no
 * screenshots, and four near-identical terminal captures in a row read as
 * filler anyway, so those get their headline figure instead.
 */
export type Cover =
  | { kind: "image"; src: string }
  | { kind: "figure"; figure: string; caption: string };

export type Project = {
  slug: string;
  index: string;
  name: string;
  kicker: string;
  headline: string;
  year: string;
  status?: string;
  body: string[];
  metrics: Metric[];
  stack: string[];
  media: MediaItem[];
  cover: Cover;
  /** Inline diagram id, used when a project ships no screenshots. */
  diagram?: "birdvision" | "gateway";
  repo?: string;
  demo?: string;
  demoLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "webapp-operator",
    index: "01",
    name: "webapp-operator",
    kicker: "Kubernetes operator",
    headline: "One resource in. A whole workload out, and kept that way.",
    year: "2026",
    body: [
      "You write a small `WebApp` resource: an image, a port, how many replicas. The controller reconciles it into a Deployment, a Service, a HorizontalPodAutoscaler and a PodDisruptionBudget, then keeps them matching the spec forever. Edit a child by hand and the next reconcile puts it back.",
      "The interesting part is the parts that refuse. An admission webhook rejects `:latest` and untagged images, because an operator that forbids mutable tags for its operands should hold itself to the same rule. Status conditions report what is actually true, including `Available=False` when the image does not exist. Two API versions are served through a conversion webhook that completes inconsistent stored data instead of rejecting it.",
    ],
    metrics: [
      { value: "p95 50ms", label: "reconcile at 250 objects" },
      { value: "81 / 100%", label: "controller / webhook coverage" },
      { value: "41 MB", label: "RSS under full load" },
      { value: "2", label: "API versions, converted" },
    ],
    stack: [
      "Go",
      "controller-runtime",
      "kubebuilder",
      "envtest",
      "Helm",
      "Prometheus",
      "Grafana",
      "Trivy",
      "govulncheck",
    ],
    media: [
      {
        src: "operator-demo.gif",
        alt: "Terminal recording: a WebApp resource is applied and the operator creates a Deployment, Service and HPA",
        caption: "apply one resource, get the whole stack",
      },
      {
        src: "operator-autoscaling.gif",
        alt: "Terminal recording: CPU climbs past the target and the HPA scales the deployment from two to four replicas",
        caption: "real load, real autoscaling",
      },
      {
        src: "operator-grafana.png",
        alt: "Grafana dashboard with five panels of operator metrics",
        caption: "metrics that ship with the operator",
      },
    ],
    cover: { kind: "image", src: "operator-grafana.png" },
    repo: "https://github.com/Mampiz/webapp-operator",
  },
  {
    slug: "idp-backstage",
    index: "02",
    name: "idp-backstage",
    kicker: "Internal developer platform",
    headline:
      "Fill in a form. The repository and the running service are already there.",
    year: "2026",
    body: [
      "One step produces a GitHub repository with CI, a container build and health endpoints, plus a live workload in Kubernetes. No manifest to copy, no second tool, no ticket to the platform team. The catalog entry gets a tab showing the real state of the cluster.",
      "Underneath, the scaffolder writes a `WebApp` custom resource and hands it to my own operator, so the two projects are one system: the portal is the front door, the controller does the reconciling. The part of the README I care about most is the one on what happens when it half-fails, when a repository is created but the cluster apply is rejected. That is where the engineering actually is.",
    ],
    metrics: [
      { value: "~75 s", label: "cold bootstrap to ready cluster" },
      { value: "1 form", label: "to repo + CI + live pods" },
      { value: "3", label: "CI suites, e2e included" },
    ],
    stack: [
      "Backstage",
      "Go",
      "Argo CD",
      "Kubernetes",
      "GitHub Actions",
      "PostgreSQL",
      "TypeScript",
      "kind",
    ],
    media: [
      {
        src: "idp-demo.gif",
        poster: "idp-template-form.png",
        alt: "Screen recording: filling the Backstage template form creates a repository and a running Kubernetes workload",
        caption: "form to running service, uncut",
      },
      {
        src: "idp-webapp-tab.png",
        alt: "Backstage catalog entry with a WebApp tab showing live cluster state",
        caption: "live cluster state inside the catalog",
      },
      {
        src: "idp-catalog.png",
        alt: "The Backstage software catalog listing scaffolded services",
        caption: "every scaffolded service, catalogued",
      },
      {
        src: "idp-techdocs.png",
        alt: "TechDocs documentation rendered inside Backstage",
        caption: "docs shipped with the template",
      },
    ],
    cover: { kind: "image", src: "idp-webapp-tab.png" },
    repo: "https://github.com/Mampiz/idp-backstage",
  },
  {
    slug: "birdvision",
    index: "03",
    name: "BirdVision",
    kicker: "Computer vision platform · Final degree project",
    headline: "Point a camera at a drinking trough. Get species, place and time.",
    year: "2025–2026",
    body: [
      "My final degree project at EPSEVG · UPC, built with the environmental association Alytes for outreach and education. It is a whole platform rather than a model: dataset preparation, two-stage YOLO12 training, a GPU-aware FastAPI inference service, asynchronous video jobs, and an RTMP→HLS pipeline that draws boxes on a live stream.",
      "Four modes share one backend: image upload, async video analysis, the browser webcam, and published RTMP cameras. Video jobs are content-addressed (`SHA-256(file : conf : stride)`), so re-uploading the same clip returns instantly, even for a different user, and any job still queued survives a backend restart. Every stage is bounded: worker pools, semaphores, a sliding-window rate limiter and hard timeouts on both inference and FFmpeg.",
    ],
    metrics: [
      { value: "101", label: "bird species detected" },
      { value: "0.910", label: "mAP@0.5, own validation split" },
      { value: "4", label: "operating modes, one backend" },
      { value: "20 min", label: "max async video, cached by hash" },
    ],
    stack: [
      "Python",
      "PyTorch",
      "YOLO12",
      "FastAPI",
      "OpenCV",
      "FFmpeg",
      "React",
      "PostgreSQL",
      "Docker",
      "AWS",
      "NGINX-RTMP",
    ],
    media: [],
    cover: {
      kind: "figure",
      figure: "0.910",
      caption: "mAP@0.5 across 101 species",
    },
    diagram: "birdvision",
    repo: "https://github.com/Mampiz/birdvision",
    demo: "https://automatic-bird-identification-syste.vercel.app",
    demoLabel: "Live demo",
  },
  {
    slug: "llm-gateway",
    index: "04",
    name: "llm-gateway",
    kicker: "Concurrent Go proxy",
    headline: "One OpenAI-shaped endpoint, several providers behind it.",
    year: "2026",
    status: "In progress",
    body: [
      "A gateway in front of multiple model providers: prefix routing, automatic failover, distributed rate limiting, response caching, streaming and metrics, all behind a single OpenAI-compatible `/v1/chat/completions`.",
      "Every vendor speaks its own dialect, so each provider package owns the translation to and from the gateway's canonical schema and no vendor vocabulary leaks past it. Fields the gateway does not model are forwarded rather than dropped. It exists mostly as an excuse to write concurrent Go that is harder than a worker-pool tutorial: goroutines and channels for SSE streaming, a Redis token bucket that holds across instances, backoff and a circuit breaker.",
    ],
    metrics: [
      { value: "1 API", label: "for every provider" },
      { value: "SSE", label: "token-by-token streaming" },
      { value: "Redis", label: "rate limiting across instances" },
      { value: "6", label: "CI workflows, CodeQL included" },
    ],
    stack: [
      "Go",
      "Concurrency",
      "Redis",
      "SSE",
      "Prometheus",
      "Docker",
      "GitHub Actions",
    ],
    media: [],
    cover: {
      kind: "figure",
      figure: "SSE",
      caption: "token by token, whichever provider answers",
    },
    diagram: "gateway",
    repo: "https://github.com/Mampiz/llm-gateway",
  },
];

export const toolbox = [
  {
    title: "Every day, happily",
    items: ["Go", "Kubernetes", "Docker", "Linux", "Git", "Bash"],
  },
  {
    title: "Also comfortable with",
    items: [
      "Python",
      "C++",
      "TypeScript",
      "React",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "FastAPI",
      "NGINX",
      "AWS",
      "Prometheus",
      "Grafana",
      "GitHub Actions",
    ],
  },
  { title: "Currently learning", items: ["Terraform"] },
];

/**
 * A team project from the degree. Listed separately from the solo work and
 * described by what I actually merged, which is the only honest way to put a
 * shared repository on a portfolio.
 */
export const teamwork = {
  name: "Neby",
  kicker: "Community services platform · Team project",
  year: "2024",
  badge: "Contributor",
  headline:
    "Neighbours trade services with each other, paid in a currency that only exists inside the app.",
  body: [
    "Built by a team of eight during the degree. Neighbours publish the services they offer or need, pay each other in the platform's own currency, rate the result, and collect achievements along the way. Three repositories make one product: a C++20 REST API on Crow, a TypeScript frontend, and a devops repository holding the Compose files, the NGINX configuration and the database seeds for every environment.",
    "It is the only C++ backend I have worked on, and the one place where I learned what a code review actually costs when six people are touching the same controllers.",
  ],
  did: [
    "The user endpoints: fetch a user, delete a user by id, and delete your own account, each with its own authorisation rule.",
    "Registration validation, so a duplicate account is rejected in the auth controller instead of blowing up on a database constraint.",
    "A shared error helper the other controllers reused, so the API stopped inventing a new error shape per route.",
    "The GoogleTest suite for user deletion: seven cases over three fixtures, covering admin versus neighbour, invalid and missing ids, and a delete attempted across community boundaries.",
    "The claim-achievement endpoint in the gamification system.",
    "Reviewing and merging teammates' pull requests, including the ratings and notification work.",
  ],
  metrics: [
    { value: "10", label: "pull requests merged" },
    { value: "8", label: "people on the team" },
    { value: "7", label: "test cases on one endpoint" },
    { value: "3", label: "repos, one product" },
  ],
  stack: [
    "C++20",
    "Crow",
    "libpqxx",
    "PostgreSQL",
    "JWT",
    "GoogleTest",
    "CMake",
    "Docker",
    "NGINX",
  ],
  links: [
    { label: "backend", url: "https://github.com/Neby-Services/backend" },
    { label: "devops", url: "https://github.com/Neby-Services/devops" },
  ],
};

export const archive = [
  {
    name: "idp-demo-service",
    note: "A Go service scaffolded end to end by the portal, proof that the pipeline produces something real.",
    lang: "Go",
    year: "2026",
    url: "https://github.com/Mampiz/idp-demo-service",
  },
  {
    name: "multichannelchat",
    note: "A multi-channel chat server and client: sockets, channels, commands.",
    lang: "Python",
    year: "2024",
    url: "https://github.com/Mampiz/multichannelchat",
  },
  {
    name: "xgram",
    note: "",
    lang: "TypeScript",
    year: "2024",
    url: "https://github.com/Mampiz/xgram",
  },
  {
    name: "Robocode",
    note: "",
    lang: "Java",
    year: "2024",
    url: "https://github.com/Mampiz/Robocode",
  },
];

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#team", label: "Team" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];
