---
title: "A Red Square Is Not One Result"
date: 2026-10-03
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>The central frame—that a colored cell compresses several different facts into one mark—is an interpretation of the archive, not a new experiment.</dd>
  <dt>Synthesis</dt>
  <dd>The observations come from one Atria Dawn Preview campaign and a clean-source comparator review. The recorded working tree was dirty; the comparator does not establish the exact source files used during the campaign.</dd>
  <dt>Prose</dt>
  <dd>This essay organizes archived results and analysis. No additional cases were run.</dd>
  <dt>Certainty</dt>
  <dd>High for the recorded counts, judge-mode splits, and terminal notes; low for causal readings of the task axes or exact identity between the clean comparator and the campaign's recorded working tree.</dd>
  <dt>Importance</dt>
  <dd>A practical guide to reading this result set, not a general score for models.</dd>
</dl>

I ran a campaign with **Atria Dawn Preview** against a matrix of environments built in [my `rl_eval_generator`](https://github.com/StrangeTcy/rl_eval_generator). The archive records scored results from 33 registered environments. It also lists 24 cases that never became scored results: 17 were omitted because the provider could not accept their input modality, and seven were stopped before provider access because known calibration checks had failed. Those 24 cases are neither passes nor failures. They show where the campaign could not ask its intended question.

The scored rows cover very different work: category and compositional code, Bayesian inference over stipulated policies, ML debugging, recurrent computation, trajectory and synthesis tasks, and small programs whose operative behavior is hidden behind an unfamiliar surface. The judges differ too. Some compare a submission with an instance-specific behavioral reference; others only check a compile-and-test contract the campaign report calls exploratory. A green square or red square hides those distinctions before anyone starts comparing families.

Here is the campaign at a glance. These are the raw checkpoint counts, before applying the row-level accounting described below:

| What the archive records | Count | How to read it |
|---|---:|---|
| Environment coverage | 33 registered environments contributed scored cases | A broad matrix, but not every registered environment contributed scored cases |
| Raw checkpoint | 194 scored: 131 PASS, 63 FAIL | Includes both special `FAIL` rows discussed below |
| Cases never scored | 24: 17 unsupported input modality; 7 calibration gates | No score was recorded, so these are neither passes nor failures |
| Judge guarantees in the raw rows | 72 behavioral-reference; 122 compile-only | Compile-only verdicts are exploratory, not a validated behavioral aggregate |

The matrix spans category and compositional code, Bayesian inference over stipulated policies, ML debugging, recurrent computation, trajectory and synthesis tasks, and programs whose operative behavior is hidden behind an unfamiliar surface. The completed work in this analysis reconstructs the selected rows, checks judge guarantees and final failure notes, and compares the recorded configurations with a clean source snapshot. Proposed generator changes—explicit case dispositions, task/judge contract checks, and checks that each advertised axis changes the rendered task—remain proposals. Replicated-seed tests are future experiments; none were run for this post. Here I narrow the broader project to one claim: **a colored cell is not a complete result until the information behind its color travels with it.** We need to know what changed in the task, what the judge could check, where the attempt stopped, and which rows the denominator includes.

## The denominator depends on the question

The checkpoint records 194 scored rows: 131 PASS and 63 FAIL. The evidence identifies two compile-only rows marked `FAIL`/`invalid_action`, each with an empty final-metrics object and a final note saying “provider transient failure after bounded retries.” I separate the rows by what the archive says about them instead of treating every red mark as a task miss.

First is the [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/cat_theo/sheaf/sheaf_physical_constraints) case with easy naming and an easy symptom mask. It is not named in the campaign report’s outage counter. Because the row has no task metrics, I treat it as an incomplete compile-only execution record. Removing this row alone gives one 193-row view. The other is the [`ts_trajectory`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/trajectory_semantics/trajectory) case with a broken witness and reflective representation. It is the case named in the report’s provider-outage counter. Removing it alone gives a different 193-row view; removing it after the Sheaf row gives the 192-row performance set. The two 193-row views have identical PASS/FAIL totals but contain different cases.

| View | PASS / total | FAIL | What changed |
|---|---:|---:|---|
| Raw checkpoint | 131 / 194 | 63 | All scored rows, including both rows described above |
| Incomplete-record sensitivity | 131 / 193 | 62 | Removes only the [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/cat_theo/sheaf/sheaf_physical_constraints) row; keeps the report-listed [`ts_trajectory`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/trajectory_semantics/trajectory) row |
| Report-listed outage sensitivity | 131 / 193 | 62 | Removes only the [`ts_trajectory`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/trajectory_semantics/trajectory) row; keeps the [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/cat_theo/sheaf/sheaf_physical_constraints) row |
| Primary performance set | 131 / 192 | 61 | Removes both rows described above |

The passes stay at 131 because every removed row is recorded as a failure. The 192-row set is the primary performance denominator; 194 remains the raw checkpoint count, and either 193-row view is a sensitivity with a different excluded case. The 24 pre-scoring omissions stay outside all these views because no score was recorded.

## Two judges, one color

The 192-case performance set contains 72 cases with an instance-specific behavioral reference: 56 PASS and 16 FAIL. The other 120 are compile-only: 75 PASS and 45 FAIL. The campaign report calls compile-only verdicts exploratory and excludes them from a validated behavioral aggregate.

A behavioral-reference verdict checks a submission against the expected behavior for that particular instance. A compile-only verdict asks a narrower question: did the submission build and clear the checks available to that task, without an instance-specific behavioral reference? A green cell in the first pool and a green cell in the second do not certify the same thing. Reporting the two counts side by side preserves that distinction; averaging them would make the result sound more uniform than the judges were.

The archive also records a passing public Bayesian-oracle preflight for the [epistemic-games environment](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/epistemic_games). That is an environment-level setup check, not a behavioral reference for every scored instance. It cannot upgrade the compile-only pool into instance-level behavioral evaluation.

The source audit has a boundary of its own. The campaign archive records a dirty working tree. All 33 selected configuration hashes match a clean comparator of the recorded commit, which establishes a match for those configurations. It does not prove that the task templates, visible tests, judge code, or helper files used during the campaign were byte-identical to the comparator. When I describe what an axis does, I am describing the inspected comparator—not a verified transcript of the executed source tree. The environment links below point to the repository’s current `main` tree for navigation; they do not identify the exact files used in the archived campaign.

## Family radar charts and case heatmaps

The heatmaps below show every selected case in these families: exact configuration labels, judge mode, verdict, terminal label, and whether the row enters the performance denominator. `EXCL` stays visible in raw case accounting but is omitted from the radar rate. The family grouping follows the semantic analysis labels, so [epistemic games](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/epistemic_games) is shown separately from the campaign’s recorded ML-debugging track label. Each radar summarizes PASS share within its family; environment spokes are used for [category/compositional](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/cat_theo), [weird-machine](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/weird_machine), and ML-debugging tasks, while [epistemic games](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/epistemic_games) uses one spoke per case configuration because it has one environment. These are descriptive summaries, not cross-family capability profiles.

`Easy`, `medium`, and `hard` are the source configuration values—not a calibrated scale shared by tasks. The epistemic-games chart instead shows its categorical scenario, evidence, prior, presentation, and framing values. Each point is a one-seed observation; the plots do not establish causal effects.

### [Category-theoretic and compositional tasks](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/cat_theo)

![Within-family radar of eligible pass shares across category-theoretic and compositional environments; numbered spokes match the heatmap rows and marker shape identifies judge mode.]({{ '/assets/figures/family-maps/category-radar.svg' | relative_url }})

*The radar is an environment-level summary; the matrix preserves the exact naming and symptom-mask settings for each selected case.*

![Case heatmap for all category-theoretic and compositional environments, with judge mode, outcome, terminal label, and excluded raw row visible.]({{ '/assets/figures/family-maps/category-heatmap.svg' | relative_url }})

### [Weird machines](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/weird_machine)

![Within-family radar of eligible pass shares across weird-machine environments; numbered spokes match the heatmap rows.]({{ '/assets/figures/family-maps/weird-machines-radar.svg' | relative_url }})

*The heatmap records the hidden-depth and surface-deceptiveness settings separately; these task axes do not share a physical unit.*

![Case heatmap for every selected weird-machine configuration, including each easy, medium, and hard setting.]({{ '/assets/figures/family-maps/weird-machines-heatmap.svg' | relative_url }})

### ML debugging

![Within-family radar of eligible pass shares for the ML-debugging environments; marker shape distinguishes compile-only from behavioral-reference judging.]({{ '/assets/figures/family-maps/ml-debugging-radar.svg' | relative_url }})

*The heatmap labels every changed factor and level for [`batchnorm_ema`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/batchnorm_ema), [`glyph`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/glyph), and [`MoCo`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/moco); the all-easy configuration is shown as the baseline.*

![Case heatmap for every selected ML-debugging configuration, with judge mode and terminal failure label.]({{ '/assets/figures/family-maps/ml-debugging-heatmap.svg' | relative_url }})

### [Epistemic games](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/epistemic_games)

![Within-family radar with one spoke per selected epistemic-games case configuration; each point is a single case, not a replicate.]({{ '/assets/figures/family-maps/epistemic-games-radar.svg' | relative_url }})

*The categorical matrix shows scenario, evidence, prior, presentation, and framing for each selected case; it does not force these factors onto an easy-medium-hard scale.*

![Case heatmap for every selected epistemic-games configuration, including each categorical condition and behavioral-reference outcome.]({{ '/assets/figures/family-maps/epistemic-games-heatmap.svg' | relative_url }})

## “Easy” and “hard” name different things in different tasks

Consider the [regex state-machine environment](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/weird_machine/regex_state_machine). Its “hidden depth” axis is input-string length: 32, 128, or 512 characters. At the easy surface label, the selected run passes all three lengths. Hold the input at 32 characters and sweep the surface label, though, and the medium and hard cases fail: the recorded outputs have 34 and 66 characters rather than 32. That is a sharp contrast in these selected cases, not evidence for a general surface effect. In the clean comparator, the surface labels also change class names, and the hard prompt adds a performance hint. The dirty-tree record means those comparator details do not establish exactly what the campaign used; the sweep also has one selected seed per cell.

The [CSS state-machine environment](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/weird_machine/css_state_machine) gives “depth” another meaning: a bit count. At easy surface, the selected cases over 3, 4, and 5 bits yield a partial score of 0.416667, a source-validation rejection because the submission imported a disallowed `re`, and a pass. At fixed three-bit input, the surface-label sweep produces a failure followed by two passes. Its 3/5 environment total therefore combines partial credit, a validator stop, and behavioral outcomes.

The [SQL fixed-point environment](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/weird_machine/sql_fixed_point) uses graph-chain length instead. At easy surface, lengths 6 and 25 pass; the 12-node case stops at source validation because of an unterminated triple-quoted string. A validator rejection is not the same observation as code that ran and failed a behavioral reference. These examples do not establish one shared unit called “difficulty”: length, bit count, and graph size are different quantities, some labels bundle names or hints with size changes, and each contrast comes from one selected seed.

## A red cell can stop at several layers

The 61 FAIL rows in the 192-case analysis set separate into terminal labels. The raw 194 also contains the incomplete [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/cat_theo/sheaf/sheaf_physical_constraints) compile-only record and the report-listed [`ts_trajectory`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/trajectory_semantics/trajectory) provider-outage record. Both stay visible in the raw count, but neither enters the task-failure taxonomy below because each has empty final metrics:

| Terminal label | Count | Behavioral-reference / compile-only |
|---|---:|---:|
| `patch_invalid` (empty patch) | 24 | 9 / 15 |
| `underfit` | 20 | 3 / 17 |
| `source_invalid` | 10 | 3 / 7 |
| `runtime_error` | 3 | 0 / 3 |
| `invalid_action` | 2 | 0 / 2 |
| `overfit_visible_tests` | 2 | 1 / 1 |

An empty patch is a non-answer. A rejected import or syntax error stops before behavior is tested; a runtime crash is different again. The 20 rows labeled `underfit` are closer to the familiar picture of a solution missing a score threshold, but the judge split is still relevant: 17 of those rows are compile-only and only three carry a behavioral reference. Calling all 20 proven behavioral misses would claim more than the judge could establish.

The labels need scrutiny too. Both rows labeled `overfit_visible_tests` have a trusted score of 1.0 and notes about a missing required file; the [`MoCo` record](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/moco) names `moco_model.py`. That conflicts with the applied label, but the archive does not establish whether the cause belongs to the submission, the task, or the judging pipeline. The careful claim is that the archived score and terminal note do not support a straightforward diagnosis of behavioral overfitting. A grid that paints an empty file, rejected source, crash, missing companion file, and judged miss the same red is hiding information, not summarizing it.

## Family totals are descriptions, not a ranking

The [recurrent-depth family](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/recurrent_depth) records 31 passes in 33 eligible cases; [trajectory/synthesis](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/trajectory_semantics) records 2 in 8. The gap is striking, but the totals do not compare calibrated versions of one construct. Recurrent depth itself mixes [`rd_state_carry`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/recurrent_depth/state_carry) at 11/11 under behavioral reference, [`rd_gradient_credit`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/recurrent_depth/gradient_credit) at 11/11 under compile-only, and [`rd_adaptive_halting`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/recurrent_depth/adaptive_halting) at 9/11 under compile-only. The last environment's misses include an unexpected-indentation syntax error and a runtime error. A large share of the family's passes therefore comes from the exploratory judge, and not every failure is a behavioral miss.

The three ML-debugging environments show another split: [`batchnorm_ema`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/batchnorm_ema) is 0/11 under compile-only, [`glyph`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/glyph) is 0/8 under behavioral reference, and [`MoCo`](https://github.com/StrangeTcy/rl_eval_generator/tree/main/envs/moco) is 9/11 under behavioral reference, including the missing-file row. Those labels cover different tasks, sizes, tests, and judge modes. The family counts describe the selected campaign; they do not rank general reasoning ability. A large ratio is a lead for an audit, not a level on a capability scale.

A static scan of the clean comparator also found ten advertised control or variable axes across nine category environments with no implementation reference in those templates. That scan is evidence about the comparator, not proof that the campaign used the same placeholders. It is an engineering question for a follow-up audit, not a demonstrated flaw in the executed campaign artifacts.

## Keep the map; do not turn it into a ladder

A useful report would let a reader recover at least four facts from each cell: the input change that actually rendered, the judge mode and availability of an instance-specific reference, the terminal layer, and the displayed verdict. The “easy” or “hard” label alone cannot carry that information. A cell could be accompanied by a compact record:

| Record | Question it answers |
|---|---|
| Rendered input change | What changed in the task, beyond its surface label? |
| Judge mode and reference | What could the judge verify on this instance? |
| Terminal layer | Did the attempt reach behavioral evaluation? |
| Verdict and scope | Which result is counted, under which denominator? |

This is a reporting principle, not a new one. [HELM](https://arxiv.org/abs/2211.09110) is a precedent for broad scenario coverage with multiple metrics; [VarBench](https://aclanthology.org/2024.findings-emnlp.946/) perturbs variables dynamically and repeats its variable-based experiments across five sampled seeds. Neither validates this campaign. Both help explain why a score should say what it measured and why an observed contrast should be repeated before it is called an effect.

A stronger follow-up would first verify that each rendered axis changes the task. It would separate labels from class names and performance hints, use multiple instances and seeds, and report outcomes split by judge guarantee and stopping layer. Until then, this grid is best read as an index of cases and implementations worth inspecting—not a leaderboard of who is good at what.
