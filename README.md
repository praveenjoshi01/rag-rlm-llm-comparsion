# RLM vs RAG POC \u2014 MSFT Earnings (GPT-4o)

This repository demonstrates a Proof of Concept (POC) comparing DSPy's ReAct Language Model (RLM) against traditional Retrieval-Augmented Generation (RAG) for long-form document summarization. 

## Case Study
The document used for this evaluation is the Microsoft Q2 FY2026 Earnings Call Transcript.
The objective is to accurately extract financial numbers, guidance statements, risk factors, and Q&A themes.

## Hypothesis
DSPy RLM achieves higher section recall and lower hallucination counts than vanilla RAG on long earnings call transcripts, at the cost of higher latency and token spend, making it better suited for **batch (non-real-time) pipelines**.

## Setup & Execution

### 1. Prerequisites
Ensure you have `uv` installed. You will also need an OpenAI API Key.

### 2. Environment Setup
```bash
git clone https://github.com/praveenjoshi01/rlm-vs-rag-poc.git
cd rlm-vs-rag-poc/Experiment/v2
uv venv
uv pip install -r requirements.txt
```

### 3. Configuration
Create a `.env` file from the provided `.env.example` and add your OpenAI API Key.
```bash
OPENAI_API_KEY="sk-..."
```

### 4. Running the Evaluation
To execute the POC, run the Jupyter Notebook:
```bash
source .venv/bin/activate  # Or .venv\\Scripts\\activate on Windows
jupyter nbconvert --to notebook --execute --inplace rlm_vs_rag_poc_gpt4.ipynb
```
*(The notebook contains code to automatically install Deno and missing dependencies if needed).*

## Results
The execution of the notebook tests the hypothesis by comparing:
- Granite-embedded FAISS RAG + GPT-4o
- DSPy RLM + GPT-4o / GPT-4o-mini

### Quantitative Summary (Latest Run)
| Metric | RAG (GPT-4o) | DSPy RLM (GPT-4o/mini) |
| :--- | :--- | :--- |
| **Section Recall (/5)** | 5 / 5 | 5 / 5 |
| **Revenue Recall (%)** | 100% | 23.1% |
| **Guidance Recall (%)** | 87.5% | 12.5% |
| **Hallucinations** | 0 | 13 |
| **Wall Clock Time** | 11.2s | 160.5s |
| **Estimated Cost** | $0.03 | $0.36 |

> [!NOTE]
> In this run, RAG outperformed RLM in accuracy and cost. This may vary based on the complexity of the document and the search strategies employed by the RLM agent. The RLM approach, however, shows the potential for deep document exploration without hitting context window limits.

Detailed results can be found in `poc_results.json` and visualised in `rag_vs_rlm_results.png`.

