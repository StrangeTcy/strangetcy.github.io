---
title: "What Does a Failed Code Repair Tell Us?"
date: 2026-10-03
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>The main frame—that a PASS/FAIL mark hides where an attempt stopped—is an interpretation of these campaign results, not a new experiment.</dd>
  <dt>Synthesis</dt>
  <dd>This post brings together scored results, the checks used to grade them, final notes, a clean code snapshot for comparison, & run logs that don't fully agree.</dd>
  <dt>Prose</dt>
  <dd>This essay organizes the saved campaign results and analysis. No additional cases were run.</dd>
  <dt>Certainty</dt>
  <dd>High for saved counts, labels, scores, and notes. Lower for code details: the record says files had uncommitted changes, so the clean snapshot may not match every file used. The results often do not establish why a particular repair failed.</dd>
  <dt>Importance</dt>
  <dd>A way to describe one evaluation run, not a general model score: one model and one provider were tested, and each task setting appears only once.</dd>
</dl>

A code-repair evaluation can end with a simple label: **PASS** or **FAIL**. But that label does not say whether the model returned an unusable answer, proposed an empty code change, wrote code that was rejected before it ran, or reached a judge—the evaluator’s test-and-scoring software—that marked it short.

This campaign asked a model called <span class="icon-atria">Atria Dawn Preview</span> to repair code in a set of tasks prepared for evaluation. Its saved result table contains **194 scored cases**. A case is one particular task setup in the final table—not every retry or saved run folder. Each row records a PASS or FAIL, the kind of check used, and sometimes a note describing the final event. I call that table and its attached case notes the campaign record.

Two rows in the record carry the label `overfit_visible_tests`. The phrase suggests that a repair matched tests shown with the task but failed another check. That is only what the label suggests; it does not prove what the model did. In both rows, the final note says a required file is missing. One row reports the missing `train.py`; the other, `moco_model.py`. Why does the record show a testing-related label beside a missing-file note? I start by separating what was scored from what was not.

## Which cases count?

The saved results include **194 scored cases: 131 PASS and 63 FAIL**. The campaign separately lists **24 cases that were not scored**. Seventeen tasks in an environment named `rope` could not be sent because the provider—the service returning the model’s answer—did not support their input format. Seven more were stopped by pre-run calibration checks—checks meant to confirm the setup—before the provider was called. Those 24 cases have no model verdict; they are neither passes nor failures.

There is also a disagreement about two scored failures. The campaign’s summary counts one provider outage. But the final notes on two rows say a temporary provider failure continued after retries. The rows remain in the saved results with the raw label `invalid_action`, which normally indicates an answer-format problem. Their notes point to the provider instead. I show three ways to count them rather than silently choosing one:

| View | Cases excluded | PASS / FAIL | What the count means |
|---|---|---|---|
| Raw campaign results | None | 131 / 63 of 194 | The official scored total, including the two cases whose notes blame the provider service |
| Remove one summary-listed outage | The one outage named by the campaign summary | 131 / 62 of 193 | Follows the summary’s single-outage count |
| Remove both cases with service-error notes | Both rows whose final notes blame the provider | 131 / 61 of 192 | Excludes both provider-service cases from the performance comparison |

I use the **192-case comparison** to discuss performance, but that is my choice, not a correction to the campaign’s official 194-case result. The two excluded rows remain visible in the raw record with their original labels and notes. The 24 unscored cases stay separate from all three views.

There is a source-code limit too. The campaign record marks its working copy as “dirty”: some files had changes not represented by the recorded commit. The settings for all **33** selected tasks match those in a clean code snapshot. That agreement covers the settings, not every task instruction, test, grading rule, or helper file. When I describe the implementation below, I mean the clean snapshot used for comparison—not a verified copy of the exact code that ran.

## What can sit behind a FAIL?

Before a code change can pass, several things have to happen: the model service must return an answer; the answer must be in a format the system can read; a code patch must be present; the patch must pass basic checks; the code must run; and the task’s judge must accept the result. A single FAIL mark compresses those different events into one label.

The diagram is a reader’s map of the recorded labels, not a trace of every case moving through each stage. Its cards describe what the saved notes and labels say; they do not identify who caused a stop.

![Plain-language map of a code-repair evaluation: provider-service failures, empty patches and malformed actions, code rejected before running, execution errors, and judge or record conflicts. The two provider-service cases are outside the 192-case comparison; 24 unscored cases are shown separately.]({{ '/assets/figures/family-maps/post04-failure-pipeline.svg' | relative_url }})

In the 192-case comparison, **61 rows are marked FAIL**. The short codes in the record refer to different events. A *patch* is the proposed code change. `patch_invalid` means the saved patch file was empty. `invalid_action` means the submitted action could not be read. `source_invalid` means a basic code check rejected the submission before it ran. `runtime_error` means the code failed during execution. `underfit` is the judge’s label for a result that fell short of its passing bar. None of those labels, on its own, explains the model’s reasoning.

The table keeps the grading method alongside the failure labels. A **behavioral-reference** check compares the submitted repair with expected behavior for that particular task. A **compile-only** check asks whether the code builds and clears the checks available for it, without the same case-specific behavior reference. The campaign report calls compile-only results *exploratory*: those cases were not checked against the same task-specific expected behavior, so I do not treat them as a validated measure of behavioral success.

| Recorded label | Cases | Behavioral-reference / compile-only | What the saved record says |
|---|---:|---:|---|
| `patch_invalid` | 24 | 9 / 15 | Every final note says the patch file is empty |
| `underfit` | 20 | 3 / 17 | The judge records a below-pass result |
| `source_invalid` | 10 | 3 / 7 | Code was rejected before execution, for syntax or import-policy reasons |
| `runtime_error` | 3 | 0 / 3 | The program failed while running |
| `invalid_action` | 2 | 0 / 2 | The submitted action was not in an accepted format |
| `overfit_visible_tests` | 2 | 1 / 1 | The label conflicts with a trusted-score field and missing-file notes |

The bars below repeat those counts in a form that makes the two grading methods visible. Bar length means number of cases, not success rate. The compile-only portion remains exploratory under the campaign report.

![Horizontal stacked bars showing the 61 failures by plain-language category and grading method: reference-behavior checks versus build and available checks.]({{ '/assets/figures/family-maps/post04-failure-taxonomy.svg' | relative_url }})

The table is a record of what the evaluator wrote down, not a diagnosis of thought. For example, an empty patch might mean the model produced no code, or that something was lost before the result was saved. These records do not settle which happened. A syntax error plausibly reflects broken submitted code; a disallowed import also reflects a validator rule, and the record does not tell me how clearly that rule was disclosed. The safest reading is to keep the event and its cause separate.

One detail changes how I read the 72 cases checked against reference behavior. Sixteen of them failed: nine had empty patch files, three were rejected before execution, one carried the `overfit_visible_tests` label, and three were labeled `underfit`. Those last three are the only failures in that group where the reference judge scored a submitted patch below its passing bar. I am not saying the other cases are blameless. I'm saying the saved labels don't let me assign every stop to the model.

## When the label & the note disagree

Here are the two `overfit_visible_tests` rows. The overall verdict, `score`, and `trusted_score` are separate fields in the saved results; I report all of them rather than treating one as a replacement for the others.

| Environment | Check used | Verdict | Failure label | Score | `trusted_score` | Final note |
|---|---|---|---|---:|---:|---|
| [`batchnorm_ema`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/batchnorm_ema) | Compile-only | FAIL | `overfit_visible_tests` | 0.95 | 1.0 | Required `train.py` file missing |
| [`moco`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/moco) | Behavioral reference | FAIL | `overfit_visible_tests` | 0.95 | 1.0 | Required `moco_model.py` file missing; note also includes the unexplained `temperature_cancelled` flag |

Both rows are marked FAIL with a `score` of 0.95, while the separate `trusted_score` field is 1.0. Their final notes name missing files. The label suggests test overfitting, but the other fields point toward a missing-file problem. This is a conflict in the saved record, not enough evidence to decide whether the model failed to package its work, the evaluator required an unexpected file, or the two parts disagreed.

The two cases with provider-service notes create the reverse problem. Their saved label is also `invalid_action`, but their final notes attribute the stop to a temporary service failure after retries. They are excluded from the 192-case comparison. The **other two** `invalid_action` rows remain in that comparison and have notes about malformed output. The same label is attached to different events, so counting the label alone would merge them.

## A pass depends on what was checked

The 192-case comparison combines **72 behavioral-reference cases**—56 PASS and 16 FAIL—with **120 compile-only cases**—75 PASS & 45 FAIL. In the raw 194, the compile-only total is 122, with 75 PASS and 47 FAIL; both cases with provider-service notes used that check mode.

That means **131/192 is a bookkeeping total, not a uniform accuracy estimate**. The campaign report says compile-only results are exploratory. A pass under compile-only checking does not establish the same thing as passing a task-specific behavior reference.

The clean comparison copy gives two examples of why the exact tests matter. In [`compositional_optimizer`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/compositional_optimizer), the prompt says regrouping nested operations should leave the answer unchanged. The inspected judge checks the size and layout of the numeric output, plus one test that separate runs do not reuse each other’s saved state. In [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/sheaf/sheaf_physical_constraints), the judge enforces a five-to-three ratio that the prompt does not state. These examples come from the clean comparison copy only. Because the campaign’s working copy was dirty, they do not prove that the exact same task and judge files were used in the run.

The general testing problem appears elsewhere too. An [empirical study of SWE-bench Verified](https://dl.acm.org/doi/10.1145/3744916.3764576) reported that 7.8% of plausible patches counted correct by benchmark validation failed the full developer-written test suite in that study. That is a result from a different setting, not a rate for this campaign. It is a reminder that a PASS means “passed these checks,” not “proved correct in every relevant sense.”

## A task can be filed under the wrong heading

The saved results also group cases into broad tracks. All seven [`epistemic_games`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/epistemic_games) cases appear under the `ml_debugging` heading. In the clean comparison copy, this task gives the model a table of speaker behaviors and asks it to update a probability. It is not debugging machine-learning code. The same limit applies here: this reading comes from the clean comparison copy, which may not match every file used during the run.

The original track label remains **37 cases: 16 PASS and 21 FAIL**. As a separate analysis, I can split out the seven inference cases: the remaining 30 machine-learning-debugging cases have 9 PASS and 21 FAIL, while the inference cases have 7 PASS and 0 FAIL. This split helps describe the tasks; it does not rewrite the campaign’s saved labels or show that the model is generally good at probability problems. Each case has one selected seed—a randomization setting—and the same task setting was not run again as a repeat trial.

## The run logs do not answer every question

The saved run folders include earlier attempts that were later replaced, not just the final cases. There are **268 saved folders**. The list attached to final results counts **3,869** attempts, while the campaign progress log reports **6,412**. Those summaries do not reconcile into one reliable retry total.

There is another mismatch in the saved settings and usage logs. A configuration field says `reasoning_enabled=false`, while the usage summary lists **325,785** units labeled reasoning tokens and **2,710** response rows with a field named `reasoning_content`. These conflicting entries do not reveal what happened inside the model, and I do not reproduce or interpret any reasoning text. The export has no spending field, so it cannot support a cost estimate either.

## What a single number can and cannot say

A useful results table should let a reader answer ordinary questions: What task was attempted? What check decided PASS or FAIL? Was a code change fuckingly saved? Did it pass the pre-run checks? Did it run? What did the final note say? If a case was omitted, why? Keeping these facts beside the verdict makes a later comparison possible without pretending that all failures have the same cause.

[HELM](https://arxiv.org/abs/2211.09110) is a model-evaluation project that reports results across many scenarios and measures instead of one score. It is a format precedent, not evidence about this campaign. A code-repair report still needs to show which checks ran and what each one could establish.

In this campaign, 131/192 means that 131 of the rows in one chosen comparison passed under their recorded checks. It does **not** mean the model solved 131 out of every 192 possible coding problems. **This benchmark does not establish a general capability ranking, a common difficulty scale, or a causal effect of any task axis.** In plain terms, it cannot tell us which model is broadly better, put unlike tasks on one easy-to-hard scale, or prove that changing a task setting caused an outcome. It covers one model, one provider, and one configuration; each task setting appears only once, with no repeat trials. The saved record notes uncommitted changes to the code, so we cannot confirm every exact file used. The 192-case comparison combines two grading methods, one of which the campaign calls exploratory.

The most I can claim is a descriptive map of these saved cases: where the recorded attempts stopped, what their judges checked, and which labels conflict with their own notes. A better report keeps that trail attached to every PASS or FAIL instead of asking one bit to carry the whole story.
