import { useState } from "react";

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: "⬡",
  },
  {
    id: "lost-in-middle",
    label: "Lost in the Middle",
    icon: "◈",
  },
  {
    id: "attention-dilution",
    label: "Attention Dilution",
    icon: "◉",
  },
  {
    id: "distractor-interference",
    label: "Distractor Interference",
    icon: "◍",
  },
  {
    id: "semantic-ambiguity",
    label: "Semantic Ambiguity",
    icon: "◎",
  },
  {
    id: "model-behavior",
    label: "Model Behavior",
    icon: "◐",
  },
  {
    id: "mitigations",
    label: "Mitigations",
    icon: "◑",
  },
  {
    id: "references",
    label: "References",
    icon: "◒",
  },
];

const UShapeCurve = () => (
  <svg viewBox="0 0 400 200" className="w-full" style={{ maxHeight: 180 }}>
    <defs>
      <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
      <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Grid */}
    {[40, 80, 120, 160].map((y) => (
      <line key={y} x1="40" y1={y} x2="380" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
    ))}
    {/* Axes */}
    <line x1="40" y1="20" x2="40" y2="170" stroke="#475569" strokeWidth="1.5" />
    <line x1="40" y1="170" x2="390" y2="170" stroke="#475569" strokeWidth="1.5" />
    {/* U-shaped curve - filled */}
    <path
      d="M 50,40 C 80,38 100,50 130,100 C 160,140 180,155 210,157 C 240,155 260,140 290,100 C 320,50 340,38 370,40 L 370,170 L 50,170 Z"
      fill="url(#fillGrad)"
    />
    {/* U-shaped curve - stroke */}
    <path
      d="M 50,40 C 80,38 100,50 130,100 C 160,140 180,155 210,157 C 240,155 260,140 290,100 C 320,50 340,38 370,40"
      fill="none"
      stroke="url(#curveGrad)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Labels */}
    <text x="50" y="185" fill="#94a3b8" fontSize="11" textAnchor="middle">Start</text>
    <text x="210" y="185" fill="#94a3b8" fontSize="11" textAnchor="middle">Middle</text>
    <text x="370" y="185" fill="#94a3b8" fontSize="11" textAnchor="middle">End</text>
    <text x="25" y="45" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90,18,90)">Accuracy</text>
    <text x="22" y="44" fill="#22d3ee" fontSize="10">High</text>
    <text x="22" y="160" fill="#6366f1" fontSize="10">Low</text>
    {/* Annotations */}
    <circle cx="50" cy="40" r="5" fill="#22d3ee" />
    <circle cx="370" cy="40" r="5" fill="#22d3ee" />
    <circle cx="210" cy="157" r="5" fill="#f43f5e" />
    <text x="210" y="147" fill="#f43f5e" fontSize="10" textAnchor="middle">−30%+</text>
  </svg>
);

const PerformanceBars = () => {
  const models = [
    { name: "Claude 3.5", short: 92, long: 71, color: "#22d3ee" },
    { name: "GPT-4.1", short: 90, long: 65, color: "#a78bfa" },
    { name: "Gemini 2.5", short: 88, long: 60, color: "#34d399" },
    { name: "Qwen3", short: 85, long: 63, color: "#fb923c" },
  ];

  return (
    <div className="space-y-3 mt-2">
      {models.map((m) => (
        <div key={m.name}>
          <div className="flex justify-between mb-1">
            <span style={{ color: m.color, fontSize: 12, fontFamily: "monospace" }}>{m.name}</span>
            <span style={{ color: "#94a3b8", fontSize: 11 }}>Short: {m.short}% → Long: {m.long}%</span>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 4, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${m.short}%`, background: m.color, height: "100%", borderRadius: 4 }} />
          </div>
          <div style={{ background: "#1e293b", borderRadius: 4, height: 8, overflow: "hidden", marginTop: 3, opacity: 0.5 }}>
            <div style={{ width: `${m.long}%`, background: m.color, height: "100%", borderRadius: 4 }} />
          </div>
        </div>
      ))}
      <div style={{ color: "#475569", fontSize: 10, marginTop: 4 }}>Solid = short context | Faded = long context (approximate, based on Chroma 2025 research)</div>
    </div>
  );
};

const content = {
  overview: {
    title: "Context Rot",
    subtitle: "How LLM Performance Degrades as Input Length Grows",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          <span style={{ color: "#22d3ee", fontWeight: 700 }}>Context rot</span> is the systematic degradation in
          LLM performance that occurs as the input context window grows longer — even when the model's context
          limit is not exceeded. The term was coined in a June 2024 Hacker News thread and formalized by
          Chroma's landmark 2025 study testing 18 frontier models including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3.
        </p>
        <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#60a5fa", fontSize: 13, margin: 0 }}>
            📊 <strong>Key Finding:</strong> Every single one of the 18 frontier models tested exhibited performance
            degradation as input token count increased — even on simple, isolated tasks where difficulty was held constant.
          </p>
        </div>
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          The critical insight is that this is not merely a "context full" problem. Models degrade well before
          hitting their limits. The degradation is <em>non-uniform</em>, <em>task-sensitive</em>, and
          <em> model-specific</em> — making it unpredictable and hard to guard against without deliberate context engineering.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "18 Models", sub: "all showed degradation", color: "#22d3ee" },
            { label: "30%+ Drop", sub: "for middle-positioned info", color: "#f43f5e" },
            { label: "Non-Uniform", sub: "failure patterns per model", color: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0f172a", border: `1px solid ${s.color}33`, borderRadius: 8, padding: "0.75rem", textAlign: "center" }}>
              <div style={{ color: s.color, fontSize: 20, fontWeight: 800, fontFamily: "monospace" }}>{s.label}</div>
              <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "lost-in-middle": {
    title: "Lost in the Middle",
    subtitle: "Positional Bias & the U-Shaped Performance Curve",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          The most studied form of context rot is the <span style={{ color: "#22d3ee", fontWeight: 700 }}>"Lost in the Middle"</span> phenomenon,
          rigorously documented by Liu et al. (Stanford/TACL 2024). LLMs attend disproportionately to tokens at the
          <strong style={{ color: "#a78bfa" }}> beginning</strong> (primacy bias) and
          <strong style={{ color: "#a78bfa" }}> end</strong> (recency bias) of the context — while systematically neglecting
          information in the center.
        </p>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Performance curve by position of relevant information:</p>
          <UShapeCurve />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div style={{ background: "#0f172a", border: "1px solid #22d3ee33", borderRadius: 8, padding: "0.75rem" }}>
            <div style={{ color: "#22d3ee", fontWeight: 700, marginBottom: 4, fontSize: 13 }}>Primacy Bias</div>
            <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
              Models trained on autoregressive objectives develop strong preference for tokens near position 0.
              System prompts and opening context receive outsized attention weight.
            </p>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #a78bfa33", borderRadius: 8, padding: "0.75rem" }}>
            <div style={{ color: "#a78bfa", fontWeight: 700, marginBottom: 4, fontSize: 13 }}>Recency Bias</div>
            <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>
              Recent tokens in the sequence receive higher attention scores due to RoPE positional encoding's
              short-term decay properties — benefiting information placed just before the query.
            </p>
          </div>
        </div>
        <div style={{ background: "#1a0f2e", border: "1px solid #7c3aed55", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#c4b5fd", fontSize: 13, margin: 0 }}>
            <strong>Measured impact:</strong> Stanford study with 20 retrieved documents (~4,000 tokens) found accuracy
            drops from 70–75% for information at position 1 or 20, to just 55–60% when placed at position 10.
            A 15–20 percentage point penalty purely from <em>where</em> the fact sits, not its quality.
          </p>
        </div>
      </div>
    ),
  },
  "attention-dilution": {
    title: "Attention Dilution",
    subtitle: "Quadratic Scaling & the Computational Bottleneck",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          The Transformer attention mechanism is fundamentally <span style={{ color: "#f43f5e", fontWeight: 700 }}>quadratic</span> in
          sequence length: every token attends to every other token, creating O(n²) pairwise relationships.
          As context grows, the total attention "budget" must be distributed across exponentially more relationships —
          diluting the signal each token receives.
        </p>
        <div style={{ background: "#0f172a", borderRadius: 8, padding: "1rem", fontFamily: "monospace", fontSize: 13 }}>
          <div style={{ color: "#64748b", marginBottom: 8 }}>// Attention complexity growth:</div>
          {[
            { tokens: "1K tokens", ops: "~1M ops", color: "#22d3ee" },
            { tokens: "10K tokens", ops: "~100M ops", color: "#a78bfa" },
            { tokens: "100K tokens", ops: "~10B ops", color: "#fb923c" },
            { tokens: "1M tokens", ops: "~1T ops", color: "#f43f5e" },
          ].map((r) => (
            <div key={r.tokens} className="flex justify-between" style={{ marginBottom: 4, color: r.color }}>
              <span>{r.tokens}</span>
              <span>→ {r.ops}</span>
            </div>
          ))}
        </div>
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          Techniques like <strong style={{ color: "#22d3ee" }}>FlashAttention</strong> reduce the memory footprint of
          each attention operation, but they don't change the fundamental problem: the model must still compute
          more total relationships, and the finite parameter capacity means individual token relationships receive
          weaker, noisier representations.
        </p>
        <div style={{ background: "#0f172a", border: "1px solid #fb923c33", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#fdba74", fontSize: 13, margin: 0 }}>
            <strong>Attention sinks:</strong> Research (Xiao et al., ICLR 2024) shows models develop "attention sink" tokens —
            often special tokens like [BOS] — that absorb disproportionate attention weight as a numerical stability mechanism,
            further reducing capacity available for semantically meaningful tokens.
          </p>
        </div>
      </div>
    ),
  },
  "distractor-interference": {
    title: "Distractor Interference",
    subtitle: "Irrelevant Content That Actively Degrades Performance",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          Not all irrelevant context is equally harmful. Chroma's research reveals a critical finding: the
          <span style={{ color: "#f43f5e", fontWeight: 700 }}> type of irrelevant content</span> matters enormously.
          Certain "distractor" content actively interferes with reasoning, rather than merely adding noise.
        </p>
        <div className="space-y-3">
          {[
            {
              type: "Semantically Similar Distractors",
              impact: "Highest",
              color: "#f43f5e",
              desc: "Documents topically related to the answer but factually irrelevant. A query about a webhook handler surrounded by deprecated webhook code creates maximum confusion. The model cannot distinguish signal from plausible-but-wrong noise.",
            },
            {
              type: "Logically Cancelling Operations",
              impact: "High",
              color: "#fb923c",
              desc: "Chroma's experiments showed that list operations that locally cancel each other (e.g., add X, then remove X) degrade performance more than simple print statements. The model attempts to track state that ultimately leads nowhere.",
            },
            {
              type: "Structural Complexity",
              impact: "Medium",
              color: "#eab308",
              desc: "Context that increases task complexity alongside length (e.g., larger graph traversal problems) conflates two separate challenges, making it hard to isolate degradation from length alone.",
            },
            {
              type: "Random / Unrelated Content",
              impact: "Lower",
              color: "#22d3ee",
              desc: "Truly random, semantically unrelated content is less harmful than topically adjacent content. The model can more easily ignore what it cannot parse as relevant.",
            },
          ].map((d) => (
            <div key={d.type} style={{ background: "#0f172a", border: `1px solid ${d.color}33`, borderRadius: 8, padding: "0.75rem" }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: d.color, fontWeight: 700, fontSize: 13 }}>{d.type}</span>
                <span style={{ background: `${d.color}22`, color: d.color, fontSize: 10, padding: "2px 8px", borderRadius: 4 }}>
                  Impact: {d.impact}
                </span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  "semantic-ambiguity": {
    title: "Semantic Ambiguity Compounding",
    subtitle: "When Fuzzy Needles Meet Noisy Haystacks",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          Classic "needle in a haystack" benchmarks use exact lexical matches — the needle phrase appears verbatim
          in the answer. Real-world tasks rarely work this way. Chroma extended the NIAH benchmark to measure
          <span style={{ color: "#22d3ee", fontWeight: 700 }}> semantic similarity</span> between needle and question,
          revealing a compounding degradation effect.
        </p>
        <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#60a5fa", fontSize: 12, marginBottom: 8 }}>Semantic reasoning example (Adobe Research, Feb 2025):</p>
          <div style={{ background: "#0a0f1e", borderRadius: 6, padding: "0.75rem", fontFamily: "monospace", fontSize: 12 }}>
            <div style={{ color: "#34d399" }}>Needle: <span style={{ color: "#94a3b8" }}>"Yuki lives next to the Semper Opera House"</span></div>
            <div style={{ color: "#f59e0b", marginTop: 6 }}>Query: <span style={{ color: "#94a3b8" }}>"Which character has been to Dresden?"</span></div>
            <div style={{ color: "#f43f5e", marginTop: 6 }}>Requires: <span style={{ color: "#94a3b8" }}>knowing Semper Opera House → Dresden</span></div>
          </div>
          <p style={{ color: "#64748b", fontSize: 11, marginTop: 8, margin: "8px 0 0 0" }}>
            Two-hop semantic reasoning fails more severely as context grows — the model must bridge an inferential gap
            while also navigating a large, noisy context.
          </p>
        </div>
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          As <strong style={{ color: "#a78bfa" }}>cosine similarity between needle and question decreases</strong>, performance degrades
          more sharply with longer contexts. This means real-world agentic tasks — where users rarely specify
          exact keywords — are substantially more vulnerable to context rot than benchmark results suggest.
        </p>
        <div style={{ background: "#0f172a", border: "1px solid #6366f133", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#818cf8", fontSize: 13, margin: 0 }}>
            <strong>The compounding problem:</strong> Longer contexts + lower semantic similarity + semantically similar
            distractors = a multiplicative degradation. Each factor alone is manageable; together they produce
            catastrophic failures that do not appear on standard benchmarks.
          </p>
        </div>
      </div>
    ),
  },
  "model-behavior": {
    title: "Model-Specific Failure Patterns",
    subtitle: "How Different Model Families Rot Differently",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          Context rot is universal, but its <em>character</em> varies significantly across model families.
          Chroma's evaluation of 18 models reveals distinct failure signatures:
        </p>
        <PerformanceBars />
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            {
              model: "GPT Family",
              color: "#10b981",
              behavior: "Erratic & Confident",
              desc: "Tends toward confident hallucination. Produces wrong answers without uncertainty signals, making failures hard to detect in production.",
            },
            {
              model: "Claude Family",
              color: "#22d3ee",
              behavior: "Abstain-Heavy",
              desc: "Degrades slowest overall, but responds to long-context uncertainty with refusals or abstentions. Reliable for shorter tasks but conservative on longer ones.",
            },
            {
              model: "Gemini Family",
              color: "#a78bfa",
              behavior: "Early & Volatile",
              desc: "Begins degrading earlier than competitors. Exhibits high variance in outputs — the same input can yield very different results across runs at long context.",
            },
            {
              model: "Qwen Family",
              color: "#fb923c",
              behavior: "Steady Decline",
              desc: "Degrades steadily but predictably. Larger Qwen versions hold up better at scale, showing that parameter count partially mitigates — but does not eliminate — context rot.",
            },
          ].map((m) => (
            <div key={m.model} style={{ background: "#0f172a", border: `1px solid ${m.color}33`, borderRadius: 8, padding: "0.75rem" }}>
              <div style={{ color: m.color, fontWeight: 700, fontSize: 13 }}>{m.model}</div>
              <div style={{ color: "#64748b", fontSize: 10, marginBottom: 6 }}>{m.behavior}</div>
              <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#0f172a", border: "1px solid #f43f5e33", borderRadius: 8, padding: "1rem" }}>
          <p style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>
            <strong>Enterprise risk:</strong> Model drift — where the same model silently changes behavior between
            versions — compounds context rot. OpenAI's disclosures about their Deep Research API relying on
            model orchestration highlights how unpredictable behaviors cascade in agentic systems.
          </p>
        </div>
      </div>
    ),
  },
  mitigations: {
    title: "Mitigations & Context Engineering",
    subtitle: "Strategies to Combat Context Rot in Production",
    body: (
      <div className="space-y-4">
        <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
          <span style={{ color: "#22d3ee", fontWeight: 700 }}>Context engineering</span> — the discipline of curating
          optimal token sets during inference — is the primary defense against context rot. Unlike prompt engineering
          (single-input optimization), context engineering manages state across the full multi-turn interaction lifecycle.
        </p>
        <div className="space-y-3">
          {[
            {
              strategy: "Strategic Placement",
              icon: "📌",
              color: "#22d3ee",
              desc: "Place critical information at the beginning or end of context (exploiting primacy/recency bias). For RAG, always put the most relevant retrieved document first or last — never in the middle.",
            },
            {
              strategy: "Retrieval-Augmented Generation (RAG)",
              icon: "🔍",
              color: "#a78bfa",
              desc: "Instead of loading entire corpora into context, retrieve only the top-k semantically relevant chunks per query. Keeps context lean and semantically dense. Combined with re-ranking, this dramatically reduces distractor interference.",
            },
            {
              strategy: "Context Summarization & Compression",
              icon: "🗜",
              color: "#34d399",
              desc: "Periodically compress conversation history into concise summaries. Prompt compression techniques (e.g., LLMLingua) remove low-salience tokens while preserving semantic content, reducing token count without losing meaning.",
            },
            {
              strategy: "Isolated Sub-Agent Contexts",
              icon: "🤖",
              color: "#fb923c",
              desc: "For coding agents and multi-step workflows, spawn sub-agents with focused, scoped contexts. Tools like WarpGrep use RL-trained search subagents with their own isolated context windows for code retrieval.",
            },
            {
              strategy: "Recursive Language Models (RLMs)",
              icon: "♻",
              color: "#f43f5e",
              desc: "Emerging approach: LLMs that recursively call themselves or smaller models, treating the prompt as a variable to process programmatically. Zhang (2025) showed RLMs using GPT-5-mini outperform GPT-5 on hard long-context benchmarks at lower cost.",
            },
            {
              strategy: "Multi-Tier Memory Architecture",
              icon: "🧠",
              color: "#6366f1",
              desc: "Separate working memory (immediate context) from long-term memory (vector store). Use asynchronous consolidation and conflict-resolution algorithms to maintain a clean, current knowledge state across sessions.",
            },
          ].map((s) => (
            <div key={s.strategy} style={{ background: "#0f172a", border: `1px solid ${s.color}33`, borderRadius: 8, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.strategy}</div>
                <p style={{ color: "#94a3b8", fontSize: 12, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  references: {
    title: "References",
    subtitle: "Research Papers, Articles & Primary Sources",
    body: (
      <div className="space-y-3">
        {[
          {
            category: "Primary Research",
            color: "#22d3ee",
            refs: [
              {
                title: "Context Rot: How Increasing Input Tokens Impacts LLM Performance",
                authors: "Hong, K., Troynikov, A., Huber, J. — Chroma (July 2025)",
                url: "https://research.trychroma.com/context-rot",
              },
              {
                title: "Lost in the Middle: How Language Models Use Long Contexts",
                authors: "Liu, N.F., Lin, K., Hewitt, J., Paranjape, A., et al. — TACL / Stanford (2024)",
                url: "https://arxiv.org/abs/2307.03172",
              },
              {
                title: "Found in the Middle: Multi-scale Positional Encoding (Ms-PoE)",
                authors: "NeurIPS 2024 Poster — tackles lost-in-middle via RoPE rescaling",
                url: "https://openreview.net/forum?id=fPmScVB1Td",
              },
              {
                title: "Efficient Streaming Language Models with Attention Sinks",
                authors: "Xiao, G., Tian, Y., et al. — ICLR 2024",
                url: "https://openreview.net/forum?id=NG7sS51zVF",
              },
              {
                title: "Recursive Language Models (RLMs)",
                authors: "Zhang, A.L. — 2025",
                url: "https://alexzhang13.github.io/blog/2025/rlm/",
              },
            ],
          },
          {
            category: "Code & Datasets",
            color: "#a78bfa",
            refs: [
              {
                title: "chroma-core/context-rot — Replication Toolkit (GitHub)",
                authors: "Chroma Research",
                url: "https://github.com/chroma-core/context-rot",
              },
              {
                title: "nelson-liu/lost-in-the-middle — Code & Data (GitHub)",
                authors: "Nelson F. Liu, Stanford",
                url: "https://github.com/nelson-liu/lost-in-the-middle",
              },
              {
                title: "Lost in the Middle — ACL Anthology",
                authors: "TACL 2024, Vol. 12, pp. 157–173",
                url: "https://aclanthology.org/2024.tacl-1.9/",
              },
            ],
          },
          {
            category: "Analysis & Commentary",
            color: "#34d399",
            refs: [
              {
                title: "Context Rot: The Emerging Challenge That Could Hold Back LLM Progress",
                authors: "Understanding AI — Timothy B. Lee (Nov 2025)",
                url: "https://www.understandingai.org/p/context-rot-the-emerging-challenge",
              },
              {
                title: "What Is Context Rot? Why LLMs Degrade as Context Grows",
                authors: "Morph LLM",
                url: "https://www.morphllm.com/context-rot",
              },
              {
                title: "LLM Context Rot — LinkedIn / Substack Analysis",
                authors: "Cobus Greyling (July 2025)",
                url: "https://cobusgreyling.medium.com/llm-context-rot-28a6d0399655",
              },
              {
                title: "Context Rot Explained & How to Prevent It",
                authors: "Redis Engineering Blog (Jan 2026)",
                url: "https://redis.io/blog/context-rot/",
              },
              {
                title: "Context Rot: Why LLMs Are Getting Dumber",
                authors: "Nilesh Barla — Adaline Labs (Aug 2025)",
                url: "https://labs.adaline.ai/p/context-rot-why-llms-are-getting",
              },
              {
                title: "Why Language Models Are Lost in the Middle — Context Engineering",
                authors: "Towards AI (Nov 2025)",
                url: "https://pub.towardsai.net/why-language-models-are-lost-in-the-middle-629b20d86152",
              },
              {
                title: "Context Rot: When Long Context Fails — Maven Talk",
                authors: "Kelly Hong, Chroma Research",
                url: "https://maven.com/p/37bdf2/context-rot-when-long-context-fails",
              },
            ],
          },
        ].map((group) => (
          <div key={group.category}>
            <div style={{ color: group.color, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginTop: 12 }}>
              {group.category}
            </div>
            <div className="space-y-2">
              {group.refs.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", background: "#0f172a", border: `1px solid ${group.color}22`, borderRadius: 8, padding: "0.75rem", textDecoration: "none", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${group.color}88`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${group.color}22`)}
                >
                  <div style={{ color: group.color, fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                  <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{r.authors}</div>
                  <div style={{ color: "#334155", fontSize: 10, marginTop: 2, wordBreak: "break-all" }}>{r.url}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
};

export default function ContextRotAnalysis() {
  const [active, setActive] = useState("overview");
  const current = content[active];

  return (
    <div style={{ background: "#020817", minHeight: "100vh", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "1.5rem 2rem", background: "#020817" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #22d3ee, #6366f1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⬡</div>
          <div>
            <div style={{ color: "#22d3ee", fontWeight: 800, fontSize: 16, letterSpacing: "0.05em" }}>CONTEXT ROT ANALYSIS</div>
            <div style={{ color: "#475569", fontSize: 11 }}>LLM Long-Context Degradation · Research Synthesis 2025</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 73px)" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "#020817", borderRight: "1px solid #1e293b", padding: "1rem 0", flexShrink: 0, overflowY: "auto" }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                width: "100%", padding: "0.6rem 1rem", textAlign: "left",
                background: active === s.id ? "#0f172a" : "transparent",
                color: active === s.id ? "#22d3ee" : "#64748b",
                border: "none", borderLeft: active === s.id ? "2px solid #22d3ee" : "2px solid transparent",
                cursor: "pointer", fontSize: 12, transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
                {current.title}
              </h1>
              <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>{current.subtitle}</p>
              <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #22d3ee, #6366f1)", marginTop: 10, borderRadius: 2 }} />
            </div>
            {current.body}
          </div>
        </div>
      </div>
    </div>
  );
}
