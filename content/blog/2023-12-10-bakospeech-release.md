---
title: "BākoSpeech: Open-Sourcing 10,200 Hours of Bengali Audio"
date: "2023-12-10"
category: "Dataset Release"
excerpt: "The largest open Bengali speech corpus is now available on OpenSLR."
image: ""
---

The largest open Bengali speech corpus is now available on OpenSLR. We cover the data collection process, speaker demographics, transcription pipeline, and baseline ASR results that accompany the release.

## Why Another Speech Corpus?

Bengali has 230 million speakers but, until today, no large-scale open speech corpus. The largest previously available Bengali speech dataset contained approximately 200 hours — less than what English has had since the 1990s.

**BākoSpeech** changes this with **10,200 hours** of transcribed Bengali audio from **4,800 speakers**.

## The Data

### Speaker Demographics

Our speakers span:
- **Geography**: All 8 divisions of Bangladesh plus West Bengal, Tripura, and Assam in India
- **Age**: 16 to 84 years old
- **Gender**: 52% male, 47% female, 1% non-binary
- **Education**: From no formal education to PhD-level speakers
- **Dialect**: Primarily Standard Bengali, with approximately 15% dialectal speech

### Recording Conditions

The corpus includes four types of recordings:

1. **Read speech** (4,200 hours): Speakers reading from a balanced text set covering news, literature, and conversational scripts
2. **Spontaneous speech** (3,100 hours): Unscripted monologues on assigned topics
3. **Broadcast news** (1,800 hours): Professional news broadcasts from Bangladeshi television
4. **Telephone speech** (1,100 hours): Conversational speech recorded over telephone channels at 8kHz

### Transcription

All 10,200 hours are transcribed in Bengali script. Our transcription pipeline:

1. Initial ASR-generated transcription using a seed model
2. Human correction by native Bengali speakers (approximately 0.5x real-time effort)
3. Quality review by a second annotator (random 20% sample, targeting <5% word error rate)

Total human annotation effort: approximately 15,000 person-hours over 18 months.

## Baseline Results

We trained a baseline ASR system using the Whisper large-v3 architecture, fine-tuned on BākoSpeech:

| Test Set           | WER      |
| ------------------ | -------- |
| Read speech        | 5.1%     |
| Spontaneous speech | 11.2%    |
| Broadcast news     | 7.8%     |
| Telephone speech   | 14.3%    |
| **Overall**        | **8.3%** |

This is the current **state of the art** for open Bengali ASR. The model checkpoint is released alongside the data.

## Download

BākoSpeech is released under **CC BY 4.0** on OpenSLR:

- Audio files in FLAC format (approximately 2.1 TB total)
- JSON transcription files with timestamps
- Speaker metadata CSV
- Baseline model checkpoint (HuggingFace)

No registration required. No access request. Download and use.

## Acknowledgements

This corpus was made possible by hundreds of volunteer speakers, dozens of annotators, and generous compute support from our partners. Special thanks to Mozilla Common Voice for inspiration and technical guidance.

---

*BākoSpeech was led by Dr. Priya Das and Tanvir Hossain at Bāk Institute, with engineering support from Imran Ghosh.*
