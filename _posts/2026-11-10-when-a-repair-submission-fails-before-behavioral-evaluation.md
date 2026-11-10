---
title: "When a Repair Submission Fails Before Behavioral Evaluation"
date: 2026-11-10
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Separating final verdict, case disposition, & recorded evaluation stage when reading repair-campaign records; preserving validation rejections as unsuccessful end-to-end attempts while withholding behavioral or cognitive diagnoses.</dd>

  <dt>Synthesis</dt>
  <dd>Model-assisted synthesis of the archived case table & source checks.</dd>

  <dt>Prose</dt>
  <dd>Model-assisted drafting & revision (primarily the <span class="icon-openai">GPT family</span>), grounded in the archived campaign records; counts follow source-table checks without rerunning the campaign. No claim of a completed final human edit, human approval, or an independent experiment.</dd>

  <dt>Certainty</dt>
  <dd>Confident about the recorded counts & field partitions in this non-resumable snapshot. Unresolved on why individual submissions were rejected, how component checks aggregate into final verdicts, and whether executed code matches a clean generator revision.</dd>

  <dt>Importance</dt>
  <dd>Establishes a reporting boundary for validation-stage failures so end-to-end failure tallies are neither dropped from denominators nor narrated as behavioral or reasoning findings.</dd>
</dl>

Two rows in an <span class="icon-atria">Atria-Dawn-Preview</span> repair-campaign table can carry the exact same final verdict: `FAIL`.

On one row, the record pairs final `FAIL` with `behavioral_evaluation=scored_fail`. On another row, the record pairs final `FAIL` with `behavioral_evaluation=not_reached` and `runtime_execution=not_reached`.

A true sentence—*both cases failed*—invites a false next sentence: *both cases tell us how the repaired code behaved.*

Those stage tokens do not say that nothing ran or that no check touched the submission. Validation checks may have executed before rejection, and `runtime_execution=not_reached` alongside `behavioral_evaluation=not_reached` are recorded stage values rather than a verified execution trace. What the record establishes is narrower: on the second row, the pipeline stopped before runtime execution or behavioral evaluation was reached, leaving zero observations of repaired-code behavior.

In this reasoning-Atria campaign snapshot (`Atria / Atria-Dawn-Preview`, recorded `reasoning_effort=high`, one selected `seed-0` case per cell—a single campaign, not independent replication), sixty-two final failures share that profile: forty-five carry `patch_invalid` & seventeen carry `source_invalid`. All sixty-two are recorded end-to-end failures, because the campaign evaluated whether an agent could deliver an accepted repair through the pipeline. Yet none supplies a behavioral observation of repaired code.

Out of `416` manifest cases in the snapshot, `415` have recorded outcomes (`290 PASS` & `125 FAIL`); one manifest case in `ts_trajectory` has no recorded outcome, and we neither assign it a verdict nor infer why it is absent. The campaign report records `status=paused`, `pause_reason=max_tokens_total`, and `resumable=false`, fixing the scope of this non-resumable snapshot without claiming anything about all possible future execution.

![The 125 final Atria FAILs split into five recorded stage profiles: 62 rejected with both stages not reached; 12 execution failures with behavioral evaluation not reached; six with unknown stages; 38 underfit rows with a scored-fail component; and seven overfit-visible-tests rows with six scored-fail components and one scored-pass component.]({{ '/assets/figures/family-maps/atria-failure-stages.svg' | relative_url }})

*One final verdict, several recorded stage profiles. The behavioral field has 74 `not_reached`, six `unknown`, & 45 component outcomes. These labels preserve the archive's distinctions; they do not establish causes or independently verify the executed checks.*

## Verdict, disposition, & stage

Across the `415` recorded cases, `290/415 = 69.9%` is a recorded-verdict fraction, not an unqualified estimate of behavioral performance. Treating that percentage as a behavioral pass rate collapses three distinct columns in the case table.

The first column is `verdict`, which answers a binary campaign question: did the recorded attempt pass as run? Across the snapshot, `290` rows record `PASS` and `125` record `FAIL`.

The second column is `case_disposition`, which records how the pipeline classified each submission: `335 scored`, `62 rejected`, & `18 unscored`. Every `rejected` and `unscored` row carries final `FAIL`, placing all `290` passes inside the `335 scored` group alongside `45` scored failures. Complicating that partition, a separate `status` column reads `scored` on all `415` recorded rows. That uniform `status` entry does not resolve the disposition ambiguity, and the archived records do not reconcile the two fields. Collapsing `case_disposition` into `status=scored` erases the recorded distinction between a scored evaluation and a rejected submission.

The third layer consists of the recorded stage columns, `runtime_execution` and `behavioral_evaluation`, which track how far an attempt progressed before stopping. Final `FAIL` does not imply that the behavioral judge evaluated a repair:

$$\text{verdict} = \text{FAIL} \;\not\Rightarrow\; \text{behavioral\_evaluation} \in \{\text{scored\_fail},\, \text{scored\_pass}\}.$$

On all `62` rows with `case_disposition=rejected`, both `runtime_execution` and `behavioral_evaluation` record `not_reached`. Those validation rejections make up `49.6%` of the `125` final `FAIL`s and `14.9%` of the `415` recorded cases. Because the archive never defines `rejected`, that token records a disposition paired with unreached execution and behavioral stages rather than an explanation of why a submission stopped.

## Two disjoint guarantee pools

The same disposition split persists when the `415` recorded cases are grouped by their recorded `judge_guarantee` label: `behavioral_reference` versus `compile_only`.

| Guarantee pool | Environments | Recorded rows | Scored PASS | Scored FAIL | Rejected FAIL | Unscored FAIL |
|---|---:|---:|---:|---:|---:|---:|
| `behavioral_reference` | 11 | 189 | 131 | 12 | 33 | 13 |
| `compile_only` (exploratory) | 27 | 226 | 159 | 33 | 29 | 5 |
| Total recorded | 38 | 415 | 290 | 45 | 62 | 18 |

In `behavioral_reference`, `131` of `189` recorded rows pass (`69.3%`), leaving `58` final `FAIL`s: `12` scored, `33` rejected, and `13` unscored. In `compile_only`, `159` of `226` recorded rows pass (`70.4%`), leaving `67` final `FAIL`s: `33` scored, `29` rejected, and `5` unscored.

Three constraints govern these two fractions. First, the campaign report marks `compile_only` as explicitly exploratory; a passing verdict or component field inside an exploratory tier does not turn it into `behavioral_reference`. Second, the `38` environments with recorded cases partition into `11 behavioral_reference` environments and `27 compile_only` environments, with zero overlap. Because no environment appears under both guarantees, `69.3%` and `70.4%` compare disjoint task pools rather than identifying a judge-mode effect, agreement, or equivalence. Third, validation rejections span both pools (`33` in `behavioral_reference` and `29` in `compile_only`), whereas scored final `FAIL`s concentrate more heavily in exploratory `compile_only` (`33` versus `12`). Across environments, recorded counts range from `3` to `55` cases (`18` environments have all `PASS` across `174` rows, `6` have zero `PASS` across `58` rows, and `14` have mixed verdicts across `183` rows with `116 PASS` and `67 FAIL`), with `glyph` (`24 FAIL` of `24`) and `moco` (`30 PASS`, `25 FAIL` of `55`) accounting for `49` of the `58` `behavioral_reference` failures—a descriptive concentration that does not justify removing them to obtain a preferred estimate.

## Seventy-four unreached, six unknown, & eighty outside

Equating an unreached behavioral judge with a validation rejection is nearly as misleading as collapsing every failure into one verdict. Partitioning all `125` final `FAIL`s alongside the `80` manifest exclusions separates four distinct recorded states.

| Set / Disposition | Failure labels | `runtime_execution` | `behavioral_evaluation` | Rows |
|---|---|---|---:|---:|
| `rejected` (`33` beh_ref / `29` comp_only) | `45 patch_invalid`, `17 source_invalid` | `not_reached` | `not_reached` | 62 |
| `unscored` (execution failure; in `13` / `5` split) | `11 training_failed`, `1 runtime_error` | `failed` | `not_reached` | 12 |
| `unscored` (missing determination; in `13` / `5` split) | `6 invalid_action` | `unknown` | `unknown` | 6 |
| `scored` (in `12` / `33` total scored FAIL split) | `38 underfit` | `unknown` | `scored_fail` | 38 |
| `scored` (`6` beh_ref / `1` comp_only) | `7 overfit_visible_tests` | `passed` | `6 scored_fail`, `1 scored_pass` | 7 |
| Manifest exclusions (outside `416` cases) | `56` twin, `14` gate/cal, `10` modality | — | No recorded score | 80 |

Three boundaries in this partition cannot be crossed without altering what the archive records.

First, `74` final `FAIL`s (`59.2%` of the `125` failures) record `behavioral_evaluation=not_reached`, not `62`. Alongside the `62 rejected` validation failures sit `12 unscored` execution failures: `11` labelled `training_failed` and `1` labelled `runtime_error`. Those twelve attempts cleared initial validation and entered execution, recording `runtime_execution=failed`, yet stopped before behavioral evaluation began. Sharing an unreached behavioral judge does not merge their upstream stages: `62` stopped before runtime execution (`runtime_execution=not_reached`), whereas `12` failed during execution (`runtime_execution=failed`).

Second, `unknown` is not a softer spelling of `not_reached`. The `6` unscored `invalid_action` rows record `unknown` in both `runtime_execution` and `behavioral_evaluation`. Here `unknown` marks a missing determination; recoding those six rows as `not_reached` to form eighty unreached behavioral checks would invent a stage transition the archive does not record. The same token does different work on the `38 underfit` rows, which pair `behavioral_evaluation=scored_fail` with `runtime_execution=unknown`. Preserving both fields records a behavioral miss without fabricating an execution trace. (The `12 behavioral_reference` and `33 compile_only` split belongs to all `45` scored final `FAIL`s combined; the `38 underfit` rows split `6` and `32`, respectively.)

Third, two unrelated sets in the campaign records happen to sum to `80`:

$$\text{not\_reached}\ (74) \;\neq\; \text{unknown}\ (6) \;\neq\; \text{manifest exclusions}\ (80).$$

Inside the `125` final `FAIL`s, the `62 rejected` rows and `18 unscored` rows form `80` non-scored failures, complementing the `45 scored` failures. Outside the `416`-case manifest sit `80` exclusion rows—`56` intervention-twin omissions, `14` known-gate or calibration omissions, and `10` unsupported-modality omissions (including `15` exclusions on `rope`, an environment with zero recorded cases). None of those `80` exclusions carries a recorded score. That both totals equal `80` is a coincidence of cardinality; exclusions are not recorded `FAIL`s and never enter any result denominator.

## Component outcomes & unverified diagnostics

Examining the `45 scored` final `FAIL`s sharpens what `not_reached` excludes. Across all `125` final `FAIL`s, only these `45` rows record an outcome in `behavioral_evaluation`: `44 scored_fail` (`38 underfit` plus `6 overfit_visible_tests`) and `1 scored_pass`.

All `7` rows labelled `overfit_visible_tests` share a distinct profile: `runtime_execution=passed`, `required_artifacts=failed`, final `verdict=FAIL`, and notes stating that the patch did not touch all required cross-context files. Six sit under `behavioral_reference` with `behavioral_evaluation=scored_fail`. The seventh sits under exploratory `compile_only` in `batchnorm_ema` and records `behavioral_evaluation=scored_pass`.

That `batchnorm_ema` row checks any temptation to treat component outcomes and final verdicts as synonyms. A component `scored_pass` need not contradict a final `FAIL` when `required_artifacts=failed`, and the full aggregation rule combining component checks into final verdicts is not established in this archive. Equally, those `45` rows cannot be called forty-five independently validated behavioral failures: one records `scored_pass`, thirty-three sit under exploratory `compile_only`, and the generator source is unverified. Nor do the seven `overfit_visible_tests` rows prove test gaming, show that missing required artifacts alone caused every `FAIL`, or turn one exploratory row into a general judge rule.

A parallel ceiling governs the diagnostic notes attached to the `62 rejected` rows. The recorded generator revision carries `dirty=true` with unidentified dirty files, and executed task, judge, & validator code has not been verified against a clean revision. Clean-source equivalence cannot be claimed, and missing validator implementation cannot be filled in from memory.

Within that boundary, the `17 source_invalid` rows carry notes citing import-allowlist violations and syntax errors (without subcounts splitting the two), showing that `source_invalid` groups distinct text-level checks rather than one established fault. Crucially, the validator's own note states: `"This validator is NOT a security sandbox."` That sentence travels directly beside the allowlist diagnostic; no security assessment is part of this essay, and an allowlist check on unverified code is not a sandbox boundary.

The `45 patch_invalid` rows and empty-patch notes are similarly underdetermined: empty-patch notes do not distinguish generation, formatting, capture, or another process. One `compile_only` final `FAIL` in `sheaf_schema_sync` carrying `performance_eligible=False` shows why a suggestive note cannot be promoted into a cause. Its selected final record notes an empty patch, an `exclusion_reason` attributes the terminal failure to a provider transient, and archived attempts contain provider errors. Yet logged provider errors across attempts do not establish provider causation for the selected failure. The `exclusion_reason` remains a disputed archive label—neither proof of provider causation on that case nor a blanket explanation for the `45 patch_invalid` rows—and we do not report optional sensitivities such as `290/414` or `159/225` as corrected performance rates.

## The strongest objection

The strongest objection against counting validation rejections as failures is statistical: if behavioral evaluation was `not_reached` on all `62` rejected rows, keeping them in the failure column folds pipeline gates—unverified validator checks, formatting, or capture—into a model evaluation. Under a clean estimator of repaired-code behavior, one should condition on reaching the behavioral judge and drop the `62` unevaluable rows from both numerator & denominator.

The objection is right about the behavioral inference it blocks. Those `62` rows supply zero observations of repaired-code behavior, and asking how submissions performed conditional on reaching the behavioral judge is a coherent statistical question—even though this archive supplies no validated conditional performance rate to answer it.

Where the objection overreaches is in treating an arrival-conditional behavioral rate as a substitute for the end-to-end campaign tally rather than a separate quantity. The campaign evaluated end-to-end repair attempts, and all `62` rejected rows carry final `FAIL`. Deleting them from the campaign denominator conceals the pipeline arrival rate, and a **hypothetical** mathematical comparison—offered solely as an illustrative denominator property, not an observed model strategy—shows why an arrival-conditional rate cannot stand alone.

Suppose a campaign records $N = E + R$ submissions, where $E = P + F_{\text{beh}}$ reach behavioral evaluation ($P$ passing, $F_{\text{beh}}$ failing behaviorally) and $R$ are rejected at validation. The end-to-end pass fraction is $\frac{P}{E + R}$, while the arrival-conditional fraction is $\frac{P}{E}$. If invalid submissions are simply **added**—increasing $R$ to $R + \Delta R$ while leaving $P$ and $E$ unchanged—the end-to-end rate drops to $\frac{P}{E + R + \Delta R}$, whereas the arrival-conditional rate $\frac{P}{E}$ stays unchanged because $R$ never enters it. By contrast, if would-be failed evaluable submissions are **replaced** by invalid ones—shifting $\Delta$ cases from $F_{\text{beh}}$ into $R$ while holding $P$ and $N$ fixed—the end-to-end rate $\frac{P}{N}$ stays constant while the arrival-conditional rate inflates from $\frac{P}{E}$ to $\frac{P}{E - \Delta}$ (for $P > 0$ and $\Delta > 0$).

Reporting all `62` rejected rows as end-to-end `FAIL`s while withholding behavioral interpretation preserves both the arrival record & the behavioral boundary without fabricating an unauthorized conditional rate. Equally, withholding behavioral inference does not license the opposite leap—treating syntax errors, allowlist notes, or undefined `rejected` tokens as indirect proof of internal reasoning, or attributing every rejection to infrastructure when the archive neither defines `rejected` nor isolates its causes.

## What the record supports

What leaves this snapshot is a reporting discipline rather than a capability score or a causal diagnosis. A single headline pass fraction (`290/415 = 69.9%`) merges states that the archive separates, so any summary needs four pieces together: the end-to-end verdict (`290 PASS` & `125 FAIL` of `415`, with one manifest `ts_trajectory` case absent), the disposition split (`335 scored`, `62 rejected`, & `18 unscored`, alongside the unresolved `status=scored` field), the recorded stage (`74 not_reached`, `6 unknown`, & `45` behavioral component outcomes), and the disjoint guarantee pools (`131/189` in `behavioral_reference` and `159/226` in exploratory `compile_only`), while keeping the `80` external exclusions outside every denominator.

Within those boundaries, the `62` validation-stage rejections are recorded end-to-end failures—`45 patch_invalid` and `17 source_invalid`—that stopped before runtime execution or behavioral evaluation was reached. They belong in the campaign's failure tally, and they support no claim about repaired-code behavior, internal reasoning, sandbox security, or clean-source execution. Where the recorded stage stops at `not_reached`, the behavioral claim stops with it.