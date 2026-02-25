---
title: "Bāk Receives Mozilla Technology Fund Grant for Open Bengali AI"
date: "2024-10-15"
category: "News"
excerpt: "We are delighted to announce a Mozilla Technology Fund grant to build BākoLM — a fully open Bengali language model."
image: ""
---

We are delighted to announce a Mozilla Technology Fund grant to build **BākoLM** — a fully open Bengali language model trained from scratch on our BākoCorpus 2.0 dataset.

## The Grant

The Mozilla Technology Fund, part of Mozilla's broader commitment to building a healthier internet, has awarded Bāk Institute a grant to develop an open, Bengali-native large language model. The grant covers compute costs, researcher stipends, and evaluation infrastructure for 18 months.

This is the largest single grant Bāk Institute has received, and it comes at a critical moment. With the release of BākoCorpus 2.0 (5.3 billion tokens of high-quality Bengali text), we now have the data foundation necessary to pretrain a model from scratch — rather than fine-tuning an English-centric base model.

## What We're Building

**BākoLM 7B** will be a decoder-only transformer language model with 7 billion parameters, trained entirely on Bengali text. Key design decisions:

- **Tokenizer**: A new SentencePiece tokenizer trained from scratch on BākoCorpus, with a 64K vocabulary optimized for Bengali morphology. Our tests show this reduces token count by 40% compared to multilingual tokenizers like LLaMA's.
- **Architecture**: Standard transformer decoder with rotary positional embeddings and grouped-query attention.
- **Training data**: BākoCorpus 2.0 (5.3B tokens) plus curated Bengali books, academic papers, and conversational data — approximately 8B tokens total after mixing.
- **License**: Fully open — model weights, training code, tokenizer, and evaluation scripts will all be released under Apache 2.0.

## Timeline

| Milestone                       | Target Date   |
| ------------------------------- | ------------- |
| Tokenizer release               | December 2024 |
| Base model pretraining complete | April 2025    |
| Instruction-tuned version       | June 2025     |
| Public release                  | July 2025     |

## Why This Matters

Every major language model today is primarily an English model with some multilingual capability bolted on. Bengali speakers deserve a model that was *born* in Bengali — one that understands the language's morphological complexity, script variations, and cultural context natively.

We believe BākoLM can be that model. And by making it fully open, we ensure that any researcher, startup, or civil society organization can build on it without asking permission.

---

*For questions about the grant or partnership opportunities, contact Dr. Minhaj Rahman at minhaj@bakinstitute.org.*
