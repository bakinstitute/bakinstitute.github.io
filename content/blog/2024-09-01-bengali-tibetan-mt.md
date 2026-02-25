---
title: "Bengali↔Tibetan MT: Building a Bridge Between Two Ancient Languages"
date: "2024-09-01"
category: "Research"
excerpt: "How we constructed a 52,000-sentence parallel corpus for one of the world's most challenging language pairs."
image: ""
---

How we constructed a 52,000-sentence parallel corpus for one of the world's most challenging language pairs — and what it reveals about the limits of transfer learning from large multilingual models.

## The Challenge

Bengali and Tibetan are both ancient languages with rich literary traditions. They share a deep historical connection through Buddhism — many foundational Buddhist texts were translated from Sanskrit into both Tibetan and Bengali over a thousand years ago.

Yet in the modern NLP landscape, direct translation between Bengali and Tibetan is essentially non-existent. There are no commercial translation tools, no parallel corpora, and no published research on this language pair.

We set out to change that.

## Building the Corpus

### Sources

Our 52,000-sentence parallel corpus draws from four sources:

1. **Buddhist religious texts** (18,000 pairs): Classical texts available in both languages, aligned at the sentence level by bilingual scholars
2. **Government documents** (12,000 pairs): Official documents from international organizations published in both languages
3. **News articles** (14,000 pairs): Manually translated news stories covering topics relevant to both language communities
4. **Conversational data** (8,000 pairs): Translated dialogues covering everyday topics

### Quality Control

Every sentence pair was reviewed by at least one bilingual Bengali-Tibetan speaker. We recruited annotators from the Tibetan Buddhist community in Kolkata and the Bengali Buddhist community in Chittagong — two groups with genuine bilingual competence in both languages.

## Experiments and Results

We trained three MT systems:

1. **Baseline**: mBART fine-tuned on our parallel corpus
2. **Pivot**: Bengali→English→Tibetan using existing high-resource models
3. **Direct**: A transformer trained from scratch on our data

### BLEU Scores (Bengali→Tibetan)

| System              | Religious | News | Conversation |
| ------------------- | --------- | ---- | ------------ |
| mBART fine-tuned    | 24.3      | 18.7 | 15.2         |
| Pivot (via English) | 19.8      | 21.4 | 18.9         |
| Direct transformer  | 22.1      | 16.3 | 13.8         |

The pivot system wins on news and conversation, but the fine-tuned mBART wins on religious text — likely because mBART's pretraining includes some Buddhist content in both languages.

## What Transfer Learning Can't Do

The most interesting finding is what *doesn't* work. Large multilingual models like mBART and NLLB have seen both Bengali and Tibetan during pretraining. In theory, their shared representation space should enable some degree of zero-shot translation.

In practice, zero-shot Bengali↔Tibetan translation produces **completely unusable output** — BLEU scores below 2.0. The languages are too distant in every dimension: script, morphology, syntax, and vocabulary. The shared representation space simply doesn't bridge this gap without task-specific fine-tuning.

This is an important finding for the low-resource MT community: multilingual pretraining is necessary but not sufficient for distant language pairs.

---

*This research was conducted by Dr. Karim Ahmed, Riya Sen, and Imran Ghosh at Bāk Institute, in collaboration with the Central University of Tibetan Studies, Varanasi.*
