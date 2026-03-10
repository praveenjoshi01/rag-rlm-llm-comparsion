# RLM vs RAG vs LLM POC — MSFT Earnings Call Analysis

Proof of Concept comparing **DSPy Reasoning Language Model (RLM)** against **traditional Retrieval-Augmented Generation (RAG)** and **full-context LLM** for structured extraction from long-form financial documents.

## Hypothesis

> DSPy RLM achieves higher section recall and lower hallucination counts than vanilla RAG on long earnings call transcripts, at the cost of higher latency and token spend — making it better suited for **batch (non-real-time) pipelines**. A full-context LLM baseline tests whether retrieval is even necessary when the document fits in the context window.

## Architecture

| Component | RAG Pipeline | LLM Pipeline | RLM Pipeline |
|---|---|---|---|
| **LLM** | GPT-4o-mini | GPT-4o-mini | GPT-4o-mini (root + sub) |
| **Embedding** | IBM Granite `granite-embedding-125m-english` (local) | N/A | N/A |
| **Vector DB** | FAISS (in-memory) | N/A | N/A |
| **Framework** | OpenAI SDK + FAISS | OpenAI SDK | DSPy `dspy.RLM` |
| **API Calls** | 1 (combined context) | 1 (full transcript) | Multiple (REPL iterations) |
| **Response** | Single JSON (5 sections) | Single JSON (5 sections) | Single JSON (5 sections) |
| **Document** | MSFT Q2 FY2026 Earnings Call (~11K tokens) | Same | Same |

## Project Structure

```
RLMRAG/
├── Data/                          # Source documents
│   ├── TranscriptQandAFY26q2.docx # Original Q&A transcript
│   └── msft_ec.txt                # Earnings call data
├── Experiment/
│   ├── v1/                        # Initial Claude-based POC (2-way)
│   │   └── rlm_vs_rag_poc.ipynb
│   ├── v2/                        # GPT-4o POC (2-way)
│   │   ├── rlm_vs_rag_poc_gpt4.ipynb
│   │   ├── executed_rlm_vs_rag_poc_gpt4.ipynb
│   │   ├── requirements.txt
│   │   ├── .env.example
│   │   ├── poc_results.json
│   │   ├── ground_truth.json        # 45 items
│   │   ├── rag_vs_rlm_results.png
│   │   └── msft_q2_fy2026_transcript.txt
│   └── v3/                        # GPT-4o-mini POC (3-way, latest)
│       ├── rlm_vs_rag_vs_llm_poc.ipynb    # Source notebook
│       ├── executed.ipynb                 # Executed with outputs
│       ├── requirements.txt
│       ├── poc_results.json               # 3-way structured metrics
│       ├── rag_vs_llm_vs_rlm_results.png  # 3-way comparison charts
│       └── data/
│           ├── ground_truth.json          # 101 items (expanded)
│           └── msft_ec.txt                # Real transcript (~52KB)
├── Knowledge/                     # Research & presentations
│   ├── rag-vs-rlm-comparison.pptx
│   ├── context-rot-analysis.jsx
│   ├── context-rot.pptx
│   └── poc_rlm_vs_rag.docx
└── README.md
```

## Setup & Execution

### Prerequisites
- Python 3.10+
- OpenAI API key with GPT-4o-mini access
- Deno runtime (required for DSPy RLM sandbox)

### Installation
```bash
git clone https://github.com/praveenjoshi01/rlm-vs-rag-poc.git
cd rlm-vs-rag-poc/Experiment/v2

python -m venv venv
# Linux/Mac: source venv/bin/activate
# Windows:   venv\Scripts\activate
pip install -r requirements.txt
```

### Configuration
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### Run V3 (Latest — 3-Way Comparison)
```bash
cd Experiment/v3

jupyter nbconvert --to notebook --execute \
  --ExecutePreprocessor.timeout=600 \
  --output executed.ipynb \
  rlm_vs_rag_vs_llm_poc.ipynb
```

Or open `rlm_vs_rag_vs_llm_poc.ipynb` in Jupyter and run all cells interactively.

### Run V2 (2-Way Comparison)
```bash
cd Experiment/v2

jupyter nbconvert --to notebook --execute \
  --ExecutePreprocessor.timeout=600 \
  --output executed_rlm_vs_rag_poc_gpt4.ipynb \
  rlm_vs_rag_poc_gpt4.ipynb
```

## Experiments

### v3 — GPT-4o-mini 3-Way Comparison (Latest)

**3-way comparison: RAG vs LLM vs RLM** using `gpt-4o-mini` for all pipelines.

**Key changes from v2:**
- All pipelines use `gpt-4o-mini` (cheaper, faster)
- Each pipeline returns a **single JSON object** with all 5 sections via one LLM call
- **RAG**: Retrieves chunks for all 5 queries, deduplicates, makes one combined LLM call with `response_format={"type": "json_object"}`. Includes a **regex pattern analysis table** showing 16 patterns across 5 categories applied to retrieved chunks.
- **LLM**: Full-context baseline — passes the entire transcript in a single call. Tests whether retrieval adds value when the document fits in the context window.
- **RLM**: DSPy `dspy.RLM` with GPT-4o-mini for both root and sub calls. Includes a **regex pattern capture table** that extracts patterns from the RLM's generated REPL code, auto-classifies their purpose, and validates them against the transcript.
- **Expanded ground truth**: 101 items (31 revenue figures, 18 guidance statements, 9 risk factors, 8 analyst topics, 35 named entities)
- Uses **real MSFT Q2 FY2026 transcript** from local file (~52KB, 363 lines)

**Output schema** (all 3 pipelines):
```json
{
  "executive_summary": "...",
  "revenue_by_segment": "...",
  "forward_guidance": "...",
  "risk_factors": "...",
  "analyst_qa_themes": "..."
}
```

**Notebook sections (0–10):**
| Section | Purpose |
|---|---|
| 0 | Environment & shared clients (OpenAI, Granite, DSPy) |
| 1 | Document ingestion (real transcript from local file) |
| 2 | Ground truth loading (101 items from JSON) |
| 3 | Metrics infrastructure (`MetricsTracker`, `score_output()`) |
| 4 | FAISS index (shared for RAG) |
| 5 | RAG pipeline (retrieve all + single call + regex table) |
| 6 | LLM pipeline (full context + single call) |
| 7 | RLM pipeline (DSPy REPL + regex capture table) |
| 8 | 3-way comparison table (styled pandas DataFrame) |
| 9 | Charts + 3-way output diff (matplotlib + HTML) |
| 10 | Verdict, composite scoring & result persistence |

### v2 — GPT-4o 2-Way Comparison

2-way RAG vs RLM using `gpt-4o` for generation and `gpt-4o-mini` for RLM sub-calls. Each pipeline makes 5 separate LLM calls (one per section). Ground truth: 45 items.

**Results (v2):**

| Metric | RAG (Granite+FAISS+GPT-4o) | RLM (DSPy+GPT-4o) | Winner |
|:---|:---|:---|:---|
| **Section Recall (/5)** | 5/5 | 5/5 | Tie |
| **Revenue Figure Recall** | 23.1% | 7.7% | RAG |
| **Guidance Recall** | 25.0% | 0.0% | RAG |
| **Entity Recall** | 26.7% | 26.7% | Tie |
| **Hallucinations** | 0 | 0 | Tie |
| **Wall Clock Time** | 9.0s | 586.5s | RAG (65x faster) |
| **Estimated Cost** | $0.035 | $1.152 | RAG (33x cheaper) |

**v2 Verdict:** Hypothesis NOT confirmed. RAG outperformed RLM while being 65x faster and 33x cheaper. RLM's Deno sandbox had environment issues on Windows.

### v1 — Claude-based POC

Initial experiment using Claude Sonnet as the LLM backbone. See `Experiment/v1/`.

## Ground Truth

| Version | Revenue | Guidance | Risk | Analyst | Entities | Total |
|---|---|---|---|---|---|---|
| **v2** | 13 | 8 | 5 | 4 | 15 | **45** |
| **v3** | 31 | 18 | 9 | 8 | 35 | **101** |

## Pipeline Recommendations

| Use Case | Recommended Pipeline | Rationale |
|---|---|---|
| Real-time user Q&A | **RAG** | Lowest latency, cost-efficient |
| Single-doc analysis | **LLM** | Full context when doc fits in window |
| Multi-doc batch | **RLM** | Completeness-critical, complex reasoning |

## Visualization

The executed notebooks contain styled comparison tables and charts:

**V3 (3-way):**

![RAG vs LLM vs RLM Results](Experiment/v3/rag_vs_llm_vs_rlm_results.png)

**V2 (2-way):**

![RAG vs RLM Results](Experiment/v2/rag_vs_rlm_results.png)

## License

MIT
