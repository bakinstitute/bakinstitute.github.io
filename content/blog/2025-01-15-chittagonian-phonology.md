---
title: "What Makes Chittagonian Unique: Tonal Phonology in the Bay of Bengal"
date: "2025-01-15"
category: "Research"
excerpt: "Prof. Priya Das explains why Chittagonian Bengali is phonologically unlike any other Bengali variety."
image: ""
---

Prof. Priya Das explains her 2025 *Journal of Phonetics* study in accessible language — why Chittagonian Bengali is phonologically unlike any other Bengali variety, and why that matters for speech technology.

## A Language Within a Language

Most Bengali speakers — and most NLP systems — treat "Bengali" as a single language. But Chittagonian, spoken by over 16 million people in the southeastern coastal region of Bangladesh, breaks nearly every phonological rule that Standard Bengali follows. It is not merely a dialect with different vocabulary; it is a fundamentally different phonological system.

Our study, published this month in the *Journal of Phonetics*, provides the first large-scale acoustic analysis of Chittagonian tonal phonology using data from Bāk Institute's **BengaliDialects Audio** corpus.

## What We Found

### Tone Is Real — and It Matters

Standard Bengali is not a tonal language. Chittagonian is. We identified **four distinct tonal patterns** that carry lexical meaning — changing the tone changes the word. This is typologically remarkable: Chittagonian is one of very few Indo-Aryan languages with productive lexical tone.

For example:
- **/tʰa/** with a high-falling tone means "to stay"
- **/tʰa/** with a low-rising tone means "pillar"

These are not just pitch accent patterns. They are fully contrastive tones in the East Asian typological sense.

### Vowel Inventory Expansion

Where Standard Bengali has 7 vowels, Chittagonian has **11**, including nasalized vowels and a set of centralized mid vowels not found anywhere else in the Bengali dialect continuum. These additional vowels interact with the tonal system in complex ways.

### Consonant Simplification, Vowel Complication

Chittagonian has *simplified* the Standard Bengali consonant inventory — merging several retroflex and aspirated stops — while *complicating* the vowel and tonal system. This is the opposite of what most Bengali dialectologists expected.

## Why This Matters for NLP and Speech Technology

Current Bengali ASR (automatic speech recognition) systems, including our own BengaliASR model, are trained almost entirely on Standard Bengali. When tested on Chittagonian speakers, word error rates **more than triple** — from 8.3% to over 28%.

This is not a minor accent problem. The tonal system means that Chittagonian speech requires **fundamentally different acoustic models**. A model that ignores tone will systematically confuse words that sound identical except for pitch.

### What We're Doing About It

We are currently training a **Chittagonian-specific ASR checkpoint** using the dialect data from BengaliDialects Audio. Early results suggest that a tone-aware acoustic model can reduce WER to approximately 14% — still higher than Standard Bengali, but a dramatic improvement.

We are also working with the Bangla Academy to develop **orthographic conventions for representing tone** in written Chittagonian — a necessary step before any text-to-speech system can be built.

## Read the Paper

The full paper is available open-access:

**Das, P. & Chakraborty, M.** (2025). "Tonal Variation in Chittagonian Bengali: Acoustic Evidence from the BengaliDialects Corpus." *Journal of Phonetics*, 108, 101–124.

You can also explore the underlying data in our [BengaliDialects Audio dataset](/datasets/).

---

*Prof. Priya Das is a Senior Research Fellow at Bāk Institute and Assistant Professor of Phonetics at Presidency University, Kolkata. Her research focuses on the acoustic phonetics of Bengali varieties.*
