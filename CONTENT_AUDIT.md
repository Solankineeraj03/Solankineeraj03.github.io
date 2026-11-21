# Content audit

Reviewed 2026-10-08. The newest local resume is `Neeraj_Solanki_Resumei.pdf` (modified 2026-10-06), copied unchanged to `public/resume/Neeraj_Solanki_Resume.pdf`.

- The resume calls the MS period Aug 2024–May 2026 while the brief calls Neeraj a current candidate. Public copy lists the degree and dates without claiming current candidate status.
- The resume says "HPCA 2025" for ATM-Net. [UIC RUIC Lab](https://ruic.lab.uic.edu/news-2025-present/) identifies acceptance to the EMC² workshop co-located with HPCA 2025. The site uses that venue and the title on [arXiv](https://arxiv.org/abs/2502.09822).
- InferScope's published [README](https://github.com/Solankineeraj03/llm-serving-determinism) says 8,020 records and 105 tests. Its [CSV results](https://github.com/Solankineeraj03/llm-serving-determinism/tree/main/results/week1) supply chart values. BF16 was measured; the AWQ INT4 arm was pending in the reviewed source. The site does not claim quantized benchmark outcomes.
- CHAI and FLARE case studies describe their public repositories. FLARE's README reports outcome metrics, but its experimental validation was not independently reproduced for this build, so the site omits those numbers.
- Publication names, authors, venues and DOIs were checked against arXiv, Crossref records, and the UIC lab page. Google Scholar returned HTTP 429 during review; its profile is linked but not used as an exclusive factual source.
- The existing portfolio supplied the headshot. It was converted to WebP and reused. Earlier portfolio performance claims that conflict with the newest resume were excluded.
- The latest resume includes a radiology platform without a public repository. It is not included among the featured open-source case studies. The brief's suggested fog-computing paper is also omitted to keep the research selection focused.

## 2026-11-16: project areas and additional repositories

- Projects are now grouped into six areas (`categories` in `src/data/content.ts`), each with a page at `/work/<area>/`.
- Added case studies for Cartograph, PC Diagnostics, Edge Mental Health Agent, Converso, ChurnGuard, Cross-Impact OFI, SmartPay, and Chat App. Every claim and number comes from that repository's public README as of this date. Nothing was rerun for this build.
- PC Diagnostics is now public, which replaces the earlier note about a radiology platform with no public repository. Its copy keeps the README's limits: RadGraph and F1 scores measure automated agreement, not clinical accuracy, and the project is not for clinical use.
- Not included: forks (vllm, pytorch-copy, albumy, MLIP_Lab6, mlip-api-lab), coursework (HW-Submission), empty repositories (Epileptic-Seizure-Detection-CNN, WNN, Multi-Precision-Multi-Termination-Neural-Networks), the previous portfolio, the profile README, and a personal site.
- The hero animation is a simulation drawn in the browser and is labeled as one. Its counters are not measurements.

## 2026-11-20 AI accelerator design

- The case study and public benchmark exports use results from AI chip design commit `d2d33c6`. Cycle counts come from Verilator RTL simulation, timing and area from mapped pre-layout Nangate45 netlists, and network latency from matched BookSim replays.
- The reported perplexity is from the held-out WikiText-2 evaluation of the selected INT4 cache format. Each figure links to its measurement data.

## 2026-11-21 SocialAgent

- The description follows the SocialAgent README at commit `fefb072` and the captioned walkthrough of its fictional café. The recording uses the real workspace, CPU-rendered media, and simulated delivery receipts.
- Published assets are the reviewed walkthrough, its poster, English captions, and transcript.
