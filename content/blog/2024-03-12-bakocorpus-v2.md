---
title: "BākoCorpus 2.0 Is Here: 5 Billion Tokens of Open Bengali Text"
date: "2024-03-12"
category: "Dataset Release"
excerpt: "The largest open Bengali text corpus ever published. In this post, we walk through the data pipeline and quality filtering decisions."
image: ""
---

After two years of crawling, cleaning, and de-duplicating, we are releasing **BākoCorpus 2.0** — the largest open Bengali text corpus ever published. In this post, we walk through the data pipeline, discuss quality filtering decisions, and explain what this means for Bengali NLP research.

## The Numbers

| Metric           | BākoCorpus 1.0 (2022) | BākoCorpus 2.0 (2024)             |
| ---------------- | --------------------- | --------------------------------- |
| Total tokens     | 1.2 billion           | 5.3 billion                       |
| Domains          | 8                     | 18                                |
| Sources          | ~15,000 websites      | ~62,000 websites                  |
| Deduplication    | Document-level        | Paragraph-level                   |
| Dialects covered | Standard only         | Standard + Sylheti + Chittagonian |

## The Pipeline

### Stage 1: Crawling

We crawled the Bengali web using a custom crawler built on top of Common Crawl and supplementary focused crawls. Our crawler targets `.bd` and `.in` TLDs, Bengali-language social media, and curated lists of Bengali news, literary, and educational websites.

Total raw crawl: approximately 28 billion tokens of text that *might* be Bengali.

### Stage 2: Language Identification

Not everything from a Bengali website is actually Bengali. We built a fastText-based language identifier that distinguishes Bengali from English, Hindi, Assamese, and Sylheti at the paragraph level. After filtering, we retained approximately 12 billion tokens of confirmed Bengali text.

### Stage 3: Quality Filtering

This is where most of the data gets cut. We applied filters for:

- **Repetition**: Removing pages with excessive repeated phrases (common in SEO spam)
- **Porn/hate speech**: Classifier-based filtering using a model trained on manually labeled Bengali data
- **Machine-generated text**: Removing obvious MT output and template-generated content
- **Length**: Removing documents shorter than 100 tokens (usually navigation fragments)
- **Encoding errors**: Removing text with mojibake or mixed-encoding artifacts

After quality filtering: 7.1 billion tokens.

### Stage 4: Deduplication

BākoCorpus 1.0 used document-level deduplication (MinHash). For 2.0, we moved to **paragraph-level deduplication** using a combination of MinHash and exact substring matching. This is more aggressive but removes the enormous amount of duplicated content across Bengali news websites, which frequently syndicate the same stories verbatim.

After deduplication: **5.3 billion tokens** — our final corpus.

### Stage 5: Domain Tagging

Every document in BākoCorpus 2.0 is tagged with one of 18 domain categories: news, literature, government, education, health, science, technology, sports, entertainment, religion, law, business, agriculture, social media, forum, blog, reference, and other.

This tagging enables domain-specific model training and analysis of domain imbalances in Bengali web content.

## What's New in 2.0

Beyond the raw scale increase, BākoCorpus 2.0 includes three features absent from 1.0:

1. **Dialectal content**: We specifically crawled Sylheti and Chittagonian web content, including transliterated dialectal text. This represents approximately 3% of the corpus.

2. **Metadata**: Every document includes source URL, crawl date, domain tag, paragraph count, and a quality score.

3. **Datasheets**: We publish a full datasheet (Gebru et al., 2018) documenting the corpus's composition, intended uses, limitations, and ethical considerations.

## Download

BākoCorpus 2.0 is released under **CC BY 4.0** and is available for download on HuggingFace. No account required. No access request. Just download and use.

We believe Bengali NLP research should not be gated by data access. This corpus is our contribution to that principle.

---

*BākoCorpus 2.0 was built by Nusrat Islam, Dr. Karim Ahmed, Tanvir Hossain, and Imran Ghosh at Bāk Institute, with annotation support from our Dhaka community team.*
