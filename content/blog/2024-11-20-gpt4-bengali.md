---
title: "Why GPT-4 Fails Bengali Speakers — And What We Plan to Do About It"
date: "2024-11-20"
category: "Commentary"
excerpt: "A frank look at benchmark scores for frontier models on Bengali tasks. Spoiler: the gap is larger than the labs admit."
image: ""
---

A frank look at benchmark scores for frontier models on Bengali tasks. Spoiler: the gap is larger than the labs admit. Dr. Karim Ahmed argues for a Bengali-first pretraining paradigm.

## The Promise and the Reality

Every major AI lab claims their models "support" Bengali. OpenAI lists Bengali among GPT-4's supported languages. Google says Gemini handles Bengali. Meta's LLaMA claims multilingual capability.

But what does "support" actually mean?

We tested GPT-4, Gemini Pro, Claude 3, and LLaMA-2 70B on a battery of Bengali language tasks. The results are sobering.

## The Tests

We evaluated each model on five tasks, all using natively Bengali data (not translations):

1. **Reading Comprehension**: Given a Bengali passage, answer questions about it
2. **Summarization**: Summarize a Bengali news article in Bengali
3. **Grammar Correction**: Correct errors in Bengali sentences
4. **Translation**: Translate between Bengali and English (both directions)
5. **Cultural QA**: Answer questions requiring Bengali cultural knowledge

## The Results

### Reading Comprehension

On our Bengali reading comprehension benchmark (derived from BengaliQA development data):

- **GPT-4**: 34% accuracy
- **Gemini Pro**: 29% accuracy
- **Human baseline**: 89% accuracy

For comparison, GPT-4 scores **86%** on English SQuAD. The gap is not 10 or 20 points — it is **55 points**.

### Where Models Fail Most

The failures are not random. They cluster around three patterns:

**1. Script confusion**: Models frequently confuse Bengali with Devanagari (Hindi) script, producing outputs that mix the two writing systems. This suggests insufficient Bengali-specific pretraining data.

**2. Cultural hallucination**: When asked about Bengali-specific topics — historical events, literary figures, regional customs — models confidently produce incorrect answers. GPT-4 attributed a Kazi Nazrul Islam poem to Rabindranath Tagore in 3 out of 5 attempts.

**3. Dialectal collapse**: All models treat Bengali as a monolithic language. They cannot distinguish between Bangladeshi and Indian Bengali conventions, often applying Hindi-influenced constructions that no Bengali speaker would use.

## Why This Happens

The root cause is simple: **data poverty**.

The Common Crawl — the primary pretraining source for most LLMs — contains roughly **0.3%** Bengali content. Bengali is the 7th most spoken language in the world, but it ranks approximately **35th** in web content volume.

This means that when GPT-4 "learns Bengali," it's learning from a tiny, unrepresentative sample of Bengali text — mostly news headlines, Wikipedia stubs, and government documents. The rich diversity of Bengali — literary prose, conversational registers, dialectal variation, technical writing — is almost entirely absent.

## The Solution: Bengali-First Pretraining

We believe that patching multilingual models with Bengali fine-tuning is not enough. The Bengali knowledge must be in the foundation.

This is why we are building **BākoLM** — a language model pretrained from scratch on Bengali data. With our BākoCorpus 2.0 (5.3 billion tokens) as the base, we can build a model that:

- Understands Bengali orthographic variation
- Handles code-mixing with English and Hindi naturally
- Has genuine cultural knowledge, not hallucinated approximations
- Respects dialectal differences between Standard Bengali, Sylheti, and Chittagonian

BākoLM 7B is currently in pretraining, funded by a Mozilla Technology Fund grant. We expect to release the base model weights in mid-2025.

## What You Can Do

If you're a researcher working on Bengali NLP, here are three concrete things:

1. **Stop evaluating on translated benchmarks.** Use natively Bengali evaluation data. Our BengaliQA and BengaliNER datasets are freely available.
2. **Contribute to BākoCorpus.** If you have Bengali text data that can be openly licensed, we want to include it.
3. **Test your models honestly.** Don't report numbers on the easy slice. Test on dialectal data, on informal registers, on domains outside news.

The Bengali AI gap will not close by itself. It requires intentional effort, dedicated resources, and honest evaluation.

---

*Dr. Karim Ahmed is Co-Principal Investigator at Bāk Institute and Assistant Professor of Computer Science at the University of Toronto. His research focuses on low-resource NLP and language model pretraining.*
