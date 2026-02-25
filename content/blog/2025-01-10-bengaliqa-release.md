---
title: "BengaliQA: 50,000 Questions to Challenge Your Bengali LLM"
date: "2025-01-10"
category: "Dataset Release"
excerpt: "We release BengaliQA alongside our ACL 2025 paper. Here we discuss what makes QA in Bengali hard."
image: ""
---

We release BengaliQA alongside our ACL 2025 paper. Here we discuss what makes QA in Bengali hard — entity ambiguity, cultural knowledge, and the absence of a Standard Simplified Bengali norm.

## Why Bengali QA Is Hard

Question answering might seem like a solved problem in English. Systems like GPT-4, Claude, and Gemini can answer complex factual questions with impressive accuracy. But try the same questions in Bengali, and you'll see a very different picture.

We built BengaliQA to measure exactly how large this gap is — and to give the research community a benchmark to close it.

### The Scale

BengaliQA contains **50,000 question-answer pairs** across 12 domains: science, law, culture, history, literature, geography, politics, religion, everyday knowledge, technology, sports, and health. Each question was written by native Bengali speakers and verified by at least two annotators.

### What Makes It Different

Unlike translated benchmarks (which dominate Bengali NLP evaluation), BengaliQA is **natively Bengali**. This matters because:

1. **Cultural specificity**: Many questions reference Bengali-specific knowledge — Rabindranath Tagore's lesser-known works, Bangladeshi constitutional law, regional festivals, or Kolkata street food. These are not the kind of questions you get by translating English benchmarks.

2. **Orthographic variation**: Bengali has no single standard orthography. The same word can be spelled differently in Bangladesh and West Bengal, and both are "correct." Our benchmark includes questions in both orthographic traditions.

3. **Entity ambiguity**: Bengali names are highly ambiguous. "রহমান" (Rahman) could refer to dozens of prominent figures. Our questions are designed to test whether models can disambiguate from context.

## Benchmark Results

We evaluated five systems on BengaliQA:

| Model             | Exact Match | F1 Score |
| ----------------- | ----------- | -------- |
| GPT-4 (Bengali)   | 31.2%       | 42.8%    |
| mBERT Fine-tuned  | 28.7%       | 38.4%    |
| XLM-R Fine-tuned  | 33.1%       | 44.2%    |
| BākoLM 7B         | 36.8%       | 48.1%    |
| Human Performance | 82.4%       | 91.3%    |

The gap between the best model **(36.8% exact match)** and human performance **(82.4%)** is enormous. For comparison, the equivalent gap on English SQuAD was closed years ago.

## Download and Use

BengaliQA is released under **CC BY 4.0** — completely free to use, modify, and redistribute.

- **HuggingFace**: Available for direct download with train/dev/test splits
- **Leaderboard**: We host a public leaderboard where you can submit your model's predictions
- **Paper**: Accepted at ACL 2025 main conference

We hope BengaliQA becomes the standard evaluation benchmark for Bengali language understanding. If your model scores well on it, you're building something that genuinely serves Bengali speakers.

---

*This work was led by Dr. Karim Ahmed (University of Toronto) and Nusrat Islam (Bāk Institute), with annotation support from our community annotation team in Dhaka.*
