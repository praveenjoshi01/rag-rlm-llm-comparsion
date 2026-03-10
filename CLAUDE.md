# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

POC comparing **DSPy Reasoning Language Model (RLM)** against **traditional RAG** and **full-context LLM** for structured extraction from long-form financial documents (Microsoft earnings call transcripts). The project tests the hypothesis that RLM achieves higher recall at the cost of higher latency/cost, and whether retrieval is even necessary when the document fits in the context window.

## Architecture

Three pipelines extract structured data from the same ~11K-token MSFT earnings call transcript and return a single JSON object containing all 5 sections:

- **RAG Pipeline**: IBM Granite local embeddings → FAISS (in-memory) → GPT-4o-mini generation. Retrieves top-k chunks for all 5 section queries, deduplicates, and makes a single LLM call to produce one JSON response. Includes regex pattern analysis table on retrieved chunks.
- **LLM Pipeline**: Full transcript → GPT-4o-mini. A single LLM call with the entire transcript context, returning one JSON object with all 5 sections. Tests whether retrieval is necessary when the document fits in the context window.
- **RLM Pipeline**: DSPy `dspy.RLM` with GPT-4o-mini (root + sub). The LLM writes Python code to iteratively explore the transcript in a Deno sandbox (max 15 iterations, 40 LLM calls). Includes regex pattern capture table from generated REPL code.

All pipelines produce the same 5-section JSON output schema: `executive_summary`, `revenue_by_segment`, `forward_guidance`, `risk_factors`, `analyst_qa_themes`.

Evaluation uses `ground_truth.json` scored via regex matching in `score_output()`.

## Experiment Versions

- **v1** (`Experiment/v1/`): Claude Sonnet-based POC using Anthropic SDK. 2-way RAG vs RLM. Uses `uv` for package management.
- **v2** (`Experiment/v2/`): GPT-4o-based POC using OpenAI SDK. 2-way RAG vs RLM with 5 separate LLM calls per pipeline. Uses `venv` + `pip`. Ground truth: 45 items.
- **v3** (`Experiment/v3/`): GPT-4o-mini-based POC. 3-way RAG vs LLM vs RLM. Each pipeline returns a single JSON object via one LLM call. Uses real transcript from local file. Ground truth: 101 items. Includes regex pattern tables for RAG and RLM.

## Setup & Run

### V3 (latest)
```bash
cd Experiment/v3
# Uses v2's virtual environment and .env
cd ../v2 && python -m venv venv && venv/Scripts/activate && pip install -r requirements.txt
cp .env.example .env     # Add your OPENAI_API_KEY
cd ../v3

# Execute notebook headless:
jupyter nbconvert --to notebook --execute \
  --ExecutePreprocessor.timeout=600 \
  --output executed.ipynb \
  rlm_vs_rag_vs_llm_poc.ipynb
```

### V2
```bash
cd Experiment/v2
python -m venv venv
venv/Scripts/activate    # Windows
pip install -r requirements.txt

cp .env.example .env     # Add your OPENAI_API_KEY

jupyter nbconvert --to notebook --execute \
  --ExecutePreprocessor.timeout=600 \
  --output executed_rlm_vs_rag_poc_gpt4.ipynb \
  rlm_vs_rag_poc_gpt4.ipynb
```

Requirements: Python 3.10+, OpenAI API key with GPT-4o-mini access, Deno runtime (for RLM sandbox). First run downloads ~500MB Granite embedding model.

## Key Dependencies

`openai`, `dspy-ai`, `faiss-cpu`, `sentence-transformers` (IBM Granite), `torch`, `beautifulsoup4`, `tiktoken`, `matplotlib`, `pandas`, `rich`

## Notebook Structure

### V3 (Sections 0–10)
Sections 0–10 run sequentially. The real MSFT Q2 FY2026 transcript is loaded from `data/msft_ec.txt`. Each of the 3 pipelines (RAG, LLM, RLM) runs independently and returns a single JSON object with all 5 sections. Results are scored against an expanded ground truth (101 items), compared via styled pandas tables, 3-panel matplotlib charts, and a 3-way HTML diff. Regex pattern tables are displayed for both RAG (chunk content analysis) and RLM (REPL code introspection). Final outputs are persisted to `poc_results.json`.

### V1/V2 (Sections 0–8)
Sections 0–8 run sequentially. The transcript is fetched from MSFT investor relations (with a synthetic fallback if the page is gated). Each pipeline runs independently with 5 separate LLM calls, then results are scored against ground truth and compared via styled tables and matplotlib charts. Final outputs are persisted to `poc_results.json`.

## Key Code Patterns

- `MetricsTracker` dataclass tracks tokens, cost, latency, and recall per pipeline. Cost is computed from per-model pricing constants in the `PRICES` dict (V3: GPT-4o-mini at $0.15/$0.60 per 1M tokens).
- `score_output()` matches pipeline output against `GROUND_TRUTH` using regex number extraction — it counts hallucinations by finding claimed figures not present in the source text.
- V3 uses `response_format={"type": "json_object"}` for structured JSON output from RAG and LLM pipelines.
- RAG regex pattern table: applies 16 regex patterns across 5 categories to retrieved chunks and displays match counts with sample matches.
- RLM regex pattern table: extracts regex patterns from the RLM's generated REPL code trajectory, auto-classifies their purpose, and validates them against the transcript.
- FAISS uses inner-product similarity with L2-normalized vectors (`IndexFlatIP`).

## Commit Guidelines

- **Never** add `Co-Authored-By` lines referencing Claude or any AI assistant in commit messages.
- Commits must only attribute human contributors.
