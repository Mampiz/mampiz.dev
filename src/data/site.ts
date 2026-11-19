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
  cardLine: "A software engineer who builds the parts nobody notices until they fail.",
  summary:
    "A Kubernetes operator, an internal developer platform, admission control tied to build provenance, a concurrent Go gateway and a computer vision pipeline.",
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
 * What a project shows on the landing panels: either a real screenshot or, for
 * variety in a row of five, its headline figure.
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
  /** Illustrated cover for the project index, under public/covers. */
  art?: string;
  repo?: string;
  demo?: string;
  diagram?: string;
  demoLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "webapp-operator",
    art: "covers/webapp-operator.svg",
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
    art: "covers/idp-backstage.svg",
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
    slug: "provenance-gate",
    art: "covers/provenance-gate.svg",
    index: "03",
    name: "provenance-gate",
    kicker: "Admission control · Supply chain",
    headline:
      "A signed image is not enough. The question is who signed it, and whether they were supposed to.",
    year: "2026",
    body: [
      "Admission control that ties a Kubernetes workload to the build that produced it. Not `this image is signed`, but *this image was built by the workflow that belongs to this service*, checked against a trust root the workload itself cannot write. The demo runs three admissions against images the repository really publishes: its own build is admitted, an unsigned image is refused, and an image built by a different workflow of the same trusted builder is refused as well. The third one is the whole point, because it is not a forgery.",
      "The project began from a claim that turned out to be false, and correcting it is more interesting than the claim was. I argued that Kyverno could not express a per-resource provenance check, then tested it against Kyverno 1.19 before writing a line of the webhook. It can, in nine lines of CEL. So the boundary moved: Kyverno stays the enforcement engine and nothing here reimplements it, but it can only *read* a trust root, not create one, keep it in step, or control who writes it. That registry is what this builds, with RBAC bound to the platform's ServiceAccount and to nobody else. The design record saying the earlier one was wrong is kept next to it, unedited.",
    ],
    metrics: [
      { value: "0.6 ms", label: "admission p50, cache warm" },
      { value: "SLSA L3", label: "the builder signs, not the repo" },
      { value: "10", label: "design records, one retracting another" },
    ],
    stack: [
      "Go",
      "Kubernetes",
      "controller-runtime",
      "Admission webhooks",
      "Sigstore",
      "cosign",
      "SLSA",
      "Kyverno",
      "kind",
      "GitHub Actions",
    ],
    media: [
      {
        src: "gate-verify-f3.gif",
        alt: "Terminal recording: three admissions, where an unsigned image and a genuinely signed image built by the wrong workflow are both refused",
        caption: "three admissions, one refused despite a real signature",
      },
      {
        src: "gate-verify-f4.gif",
        alt: "Terminal recording: a WebApp is admitted and reconciled into pods, then the same WebApp on an untrusted image is refused",
        caption: "the whole path, operator included",
      },
    ],
    cover: {
      kind: "figure",
      figure: "0.6 ms",
      caption: "admission p50, cache warm",
    },
    repo: "https://github.com/Mampiz/provenance-gate",
  },
  {
    slug: "llm-gateway",
    art: "covers/llm-gateway.svg",
    index: "04",
    name: "llm-gateway",
    kicker: "Concurrent Go proxy",
    headline: "One OpenAI-shaped endpoint, every provider behind it.",
    year: "2026",
    status: "v1.0.0",
    body: [
      "An application that talks to OpenAI directly is married to OpenAI: its key sits in that application's config, its retries are that application's problem, and nobody can say what it costs. Six applications means six of each. The gateway takes it over. One endpoint, one set of revocable keys, and the messy parts written once: routing by model prefix, streaming, failover, a rate limiter shared across replicas, caching and metrics. Any OpenAI client works unchanged by pointing its base URL at it.",
      "Each vendor speaks its own dialect, so every provider package owns its translation and none of that vocabulary escapes it, a rule Go turns into a compile error rather than a convention. The parts worth arguing about are the failure paths: only retryable errors fail over, backoff is jittered so a thousand clients do not retry in unison, a circuit breaker pulls a bad provider out and lets exactly one probe decide when it is back, and identical concurrent requests collapse into a single upstream call. It builds and tests itself offline against a fake upstream that speaks both dialects and misbehaves on request.",
    ],
    metrics: [
      { value: "v1.0.0", label: "released, with SBOM and provenance" },
      { value: "49", label: "smoke checks, no API key needed" },
      { value: "scratch", label: "base image: no shell, no libc" },
    ],
    stack: [
      "Go",
      "Concurrency",
      "SSE",
      "Redis",
      "Prometheus",
      "Grafana",
      "Helm",
      "Docker",
      "GitHub Actions",
    ],
    media: [
      {
        src: "gateway-streaming.gif",
        alt: "Terminal recording: tokens from a Claude model arriving one by one in OpenAI's wire format",
        caption: "a Claude model, in OpenAI's wire format",
      },
      {
        src: "gateway-fallback.gif",
        alt: "Terminal recording: OpenAI fails, the answer comes back from Anthropic, and the circuit opens",
        caption: "OpenAI is down, Anthropic answers, the circuit opens",
      },
      {
        src: "gateway-smoke.gif",
        alt: "Terminal recording: make smoke running forty-nine checks against a live gateway",
        caption: "49 checks against a live gateway",
      },
      {
        src: "gateway-bootstrap.gif",
        alt: "Terminal recording: one script builds, tests and verifies the gateway, then prints a working API key",
        caption: "one script: build, test, verify, print a key",
      },
    ],
    cover: { kind: "image", src: "gateway-streaming.gif" },
    repo: "https://github.com/Mampiz/llm-gateway",
    diagram: "diagrams/llm-gateway-architecture.html",
  },
  {
    slug: "birdvision",
    art: "covers/birdvision.svg",
    index: "05",
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
    media: [
      {
        src: "bird-livecams-demo.gif",
        poster: "bird-livecams-focus.jpg",
        alt: "A live camera stream of a drinking trough with detection boxes and species names drawn over the playing video",
        caption: "a live camera, boxes drawn on the stream",
      },
      {
        src: "bird-image-detection.jpg",
        alt: "An uploaded photo with two birds boxed and named, at 95 and 84 percent confidence",
        caption: "two species named on an uploaded photo",
      },
      {
        src: "bird-video-annotated.jpg",
        alt: "An analysed video with annotations and a per-species breakdown",
        caption: "an analysed video, annotated and downloadable",
      },
      {
        src: "bird-feed.jpg",
        alt: "The shared public feed of analysed videos",
        caption: "analysed videos published to a shared feed",
      },
    ],
    cover: { kind: "image", src: "bird-livecams-focus.jpg" },
    repo: "https://github.com/Mampiz/birdvision",
    demo: "https://automatic-bird-identification-syste.vercel.app",
    demoLabel: "Live demo",
  },
];

/** The figure strip under the headline. Every value comes from a project's own benchmark. */
export const heroStats = [
  { value: "50ms", label: "p95 reconcile, 250 objects" },
  { value: "0.6ms", label: "admission check, p50" },
  { value: "0.910", label: "mAP on 101 bird species" },
];

/**
 * Pull requests merged into other people's projects. Only merged ones are
 * listed: an open pull request is a request, not a contribution.
 */
export const upstream = {
  blurb: "Two merged. The maintainers did not have to say yes.",
  items: [
    {
      project: "kubebuilder",
      org: "kubernetes-sigs",
      number: 6198,
      title: "CronJob tutorial tests use a fixed clock",
      note: "The book's controller tests depended on the wall clock and failed now and then in `make test-book`. A fixed clock removed the flake.",
      url: "https://github.com/kubernetes-sigs/kubebuilder/pull/6198",
      date: "Nov 2026",
    },
    {
      project: "terraform-provider-azurerm",
      org: "hashicorp",
      number: 33891,
      title: "AKS docs: service_mesh_profile.revisions and net_ipv4_tcp_tw_reuse",
      note: "The documentation for two arguments of `azurerm_kubernetes_cluster` disagreed with the provider. The fix closed two open issues.",
      url: "https://github.com/hashicorp/terraform-provider-azurerm/pull/33891",
      date: "Nov 2026",
    },
  ],
};

/** Work history, as on the CV. Only facts that are already public there. */
export const experience = [
  {
    company: "NXP Semiconductors",
    role: "Software Engineer, automotive",
    dates: "Apr 2025 - Present",
    text: "A low-latency message broker in C and C++ between an AUTOSAR ECU stack and Embedded Linux, more than ten services on a 10 ms cycle. Also the diagnostics and logging subsystem for 16 others, and artifact signing inside a secure boot chain.",
  },
  {
    company: "TTTech Auto",
    role: "Software Engineer, intern",
    dates: "Sep 2024 - Mar 2025",
    text: "VIN generation and end-to-end sync between AUTOSAR components and the flash bootloader, which cut misalignment incidents in test flashing by 95%. Thirty AUTOSAR defects fixed with root cause analysis on test benches.",
  },
  {
    company: "EPSEVG, UPC",
    role: "Computer Engineering degree",
    dates: "2021 - 2026",
    text: "Finished with BirdVision, a bird detection platform built with a local environmental association. Before that, a team of eight on Neby.",
  },
];

/** The tools grid: logo, name and what it is for. Logos are Simple Icons (CC0). */
export const tools = [
  { name: "Go", note: "What I write", icon: "go", color: "#00ADD8" },
  { name: "Kubernetes", note: "What it runs on", icon: "kubernetes", color: "#326CE5" },
  { name: "Docker", note: "How it ships", icon: "docker", color: "#2496ED" },
  { name: "Helm", note: "How it installs", icon: "helm", color: "#0F1689" },
  { name: "Prometheus", note: "How I know it works", icon: "prometheus", color: "#E6522C" },
  { name: "Grafana", note: "How I show it", icon: "grafana", color: "#F46800" },
  { name: "GitHub Actions", note: "Every push, every repo", icon: "githubactions", color: "#2088FF" },
  { name: "Terraform", note: "Learning it now", icon: "terraform", color: "#844FBA" },
];

/**
 * The day job, kept short and limited to what the public CV already says.
 * Same habit as the projects, one layer further down the stack.
 */
export const dayJob = {
  company: "NXP Semiconductors",
  role: "Software Engineer, automotive",
  since: "Apr 2025",
  place: "Barcelona",
  lead: "By day I work close to the metal, on the software that sits between a car's ECU and the Linux side of the same vehicle.",
  points: [
    "A low-latency message broker in C and C++ between an AUTOSAR ECU stack and Embedded Linux: more than ten concurrent services on a 10 ms cycle.",
    "A diagnostics, intrusion detection and logging subsystem collecting faults from 16 subsystems, which cut incident triage time by 40%.",
    "Certificate and artifact signing with a hardware security engine, as part of a secure boot chain of trust.",
  ],
  stack: ["C", "C++", "AUTOSAR", "PXROS-HR", "Embedded Linux", "CAN", "UDS"],
  before: "Before that, an internship at TTTech Auto (2024 to 2025) on AUTOSAR components and vehicle diagnostics.",
};

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
      "Helm",
      "Kyverno",
      "Sigstore",
    ],
  },
  {
    title: "At work",
    items: ["C", "C++", "AUTOSAR", "Embedded Linux", "CAN", "UDS"],
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
    "It is the only C++ web backend I have worked on, and the one place where I learned what a code review actually costs when six people are touching the same controllers.",
  ],
  did: [
    "The user endpoints: fetch a user, delete a user by id, and delete your own account, each with its own authorisation rule.",
    "Registration validation, so a duplicate account is rejected in the auth controller instead of blowing up on a database constraint.",
    "A shared error helper the other controllers reused, so the API stopped inventing a new error shape per route.",
    "The GoogleTest suite for user deletion: seven cases over three fixtures, covering admin versus neighbour, invalid and missing ids, and a delete attempted across community boundaries.",
    "The claim-achievement endpoint in the gamification system.",
    "The frontend side of the same features: the achievements page, user ratings and the rate-a-neighbour flow.",
    "Reviewing teammates' pull requests.",
  ],
  metrics: [
    { value: "16", label: "pull requests merged" },
    { value: "8", label: "people on the team" },
  ],
  stack: [
    "C++20",
    "TypeScript",
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
  { href: "#top", label: "Home", icon: "home" },
  { href: "#work", label: "Work", icon: "work" },
  { href: "#experience", label: "Experience", icon: "briefcase" },
  { href: "#tools", label: "Tools", icon: "wrench" },
  { href: "#contact", label: "Contact", icon: "mail" },
];
