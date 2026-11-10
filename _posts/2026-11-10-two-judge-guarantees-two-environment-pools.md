---
title: "Two Judge Guarantees, Two Environment Pools"
date: 2026-11-10
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>The structural observation that two close headline pass rates are drawn from disjoint environment pools, which blocks the inference from near-equality to judge-mode agreement; the four-way distinction between verdict, disposition, guarantee, and environment as the minimum vocabulary for reading these fractions.</dd>

  <dt>Synthesis</dt>
  <dd>Model-assisted synthesis of the archived campaign report, case table & checked tabulations. No campaign was rerun.</dd>

  <dt>Prose</dt>
  <dd>Model-assisted drafting & revision (primarily the <span class="icon-openai">GPT family</span>) from the archived evidence; no final human edit or independent replication is claimed.</dd>

  <dt>Certainty</dt>
  <dd>Confident in the recorded counts & the absence of any environment shared by the two guarantee groups in this table. Cautious about the semantics of some disposition labels, the unverified executed judge code, and any extrapolation beyond these recorded cases.</dd>

  <dt>Importance</dt>
  <dd>An interpretation of one campaign's headline numbers: why the two guarantee fractions must travel with their denominator composition & their environment pools.</dd>
</dl>

Two percentages about a point apart look like corroboration when printed side by side.

In one archived <span class="icon-atria">Atria-Dawn-Preview</span> repair campaign, cases carrying the guarantee label `behavioral_reference` ended in PASS 131 times out of 189 recorded cases: 69.3%. Cases carrying `compile_only` ended in PASS 159 times out of 226: 70.4%. The gap between the rounded figures is 1.1 points; the exact difference is closer to 1.04. The subtraction is arithmetically valid, and the layout invites a further inference — that the two judge standards nearly agree, or that the exploratory compile-only guarantee is a reasonable proxy for a behavioral reference. That inference requires a comparison the archive does not contain: the same applicable submissions assessed under both standards. Eleven environments supply the first fraction and a different twenty-seven supply the second. Not one of the 38 environments with recorded cases appears under both guarantee labels, so the declared guarantee & the environment pool change together.

Four different things are being counted, and keeping them separate is the technical move. A **verdict** is the final PASS or FAIL on a row. A **disposition** says what kind of row it is: scored, rejected, or unscored. A **guarantee** is the `judge_guarantee` label naming which judging standard the environment was recorded under. An **environment** is the task family the case came from. The two headline fractions differ in guarantee & in environment composition simultaneously, and the archive provides no way to separate those two changes.

![Two disjoint environment pools: behavioral_reference has 131 PASS in 189 recorded cases across 11 environments; compile_only has 159 PASS in 226 recorded cases across 27 different environments. No environment appears under both guarantees.]({{ '/assets/figures/family-maps/atria-judge-disjoint-pools.svg' | relative_url }})

*Similar headline fractions, different pools: 69.3% & 70.4% are case-weighted summaries, with zero shared environments. Each dot represents one environment; neither group provides a matched comparison under the other guarantee.*

## What sits inside the denominators

The campaign selected one seed-0 case per configuration cell, using <span class="icon-atria">Atria-Dawn-Preview</span> at recorded `reasoning_effort=high`. Its report records a pause at the total-token limit and marks the snapshot non-resumable. Of 416 manifest cases, 415 have recorded outcomes; one `ts_trajectory` case has no recorded result, and I assign it no PASS, no FAIL, and no explanation for its absence.

Across the 415 rows, 290 carry PASS & 125 carry FAIL, giving 290/415 = 69.9%. That is a recorded-verdict fraction, not an unqualified behavioral-performance estimate, because the rows mix three dispositions.

| Guarantee | Scored PASS | Scored FAIL | Rejected FAIL | Unscored FAIL | Recorded | Final PASS |
|---|---:|---:|---:|---:|---:|---:|
| `behavioral_reference` | 131 | 12 | 33 | 13 | 189 | 131/189 = 69.3% |
| `compile_only` | 159 | 33 | 29 | 5 | 226 | 159/226 = 70.4% |
| All recorded | 290 | 45 | 62 | 18 | 415 | 290/415 = 69.9% |

The fraction 131/189 is not "131 behavioral passes out of 189 behavioral evaluations." Of the 58 FAILs in that pool, 33 are rejected & 13 are unscored. All 62 rejected rows across both pools — 45 `patch_invalid` & 17 `source_invalid` — explicitly record behavioral evaluation not reached. They are unsuccessful end-to-end repair attempts, and they record a stage reached rather than a finding about how repaired code behaves. The 18 unscored FAILs comprise 11 `training_failed`, one `runtime_error`, and six `invalid_action` cases. The invalid-action rows carry `behavioral_evaluation=unknown`, which is a missing determination rather than a confirmed not-reached. A separate `status` field says `scored` on all 415 rows; the archive records both fields without resolving the divergence.

The disposition mix differs between the pools even though the final fractions nearly coincide. In the behavioral-reference group, 12 FAILs have scored disposition and 46 are rejected or unscored. In the compile-only group, the corresponding counts are 33 scored FAILs and 34 rejected or unscored. These figures do not explain why attempts failed, and they do not make one pool harder than the other. They show that similar totals can contain rather different paths to a final verdict.

![Stacked bars show each guarantee pool's recorded dispositions: behavioral_reference has 131 scored PASS, 12 scored FAIL, 33 rejected FAIL and 13 unscored FAIL; compile_only has 159, 33, 29 and 5 respectively.]({{ '/assets/figures/family-maps/atria-judge-denominators.svg' | relative_url }})

*The bar lengths show shares within each recorded pool; labels are counts. Similar PASS fractions conceal different disposition mixes. The single missing manifest result is outside both denominators, while rejected & unscored FAIL rows remain in the recorded-verdict tally.*

## A recorded guarantee is not a verified trace

`behavioral_reference` and `compile_only` are values of the `judge_guarantee` field. The campaign report explicitly calls `compile_only` exploratory. A PASS under that label should not be promoted to a behavioral-reference PASS just because both are spelled PASS.

At the same time, the labels are not an independently verified description of the executed judge code. The campaign's recorded generator revision is marked `dirty=true`, with the changed files unidentified, and executed code is unverified against the clean revision. I can report the declared guarantees and the outcomes attached to them; I cannot reconstruct exact judge behavior from a presumed clean implementation.

A guarantee is the label the archive declares for the case. A disposition & the component fields describe what the archived result records along the way. None substitutes for the others, and a component value of `behavioral_evaluation=scored_pass` on a compile-only row does not upgrade its declared guarantee.

## No shared environment, no contrast

The missing comparison is easiest to see at the environment level. Let $E_g$ be the set of environments with recorded cases under guarantee $g$, let $n_e$ be the number of recorded cases in environment $e$, and let $p_e$ be its number of final PASS verdicts. Each reported fraction is case-weighted:

$$
R_g = \frac{\sum_{e \in E_g} p_e}{\sum_{e \in E_g} n_e},
\qquad
E_{\mathrm{B}} \cap E_{\mathrm{C}} = \varnothing,
$$

where B and C denote the behavioral-reference and compile-only groups in this recorded table. No term in either sum tells us what the same environment would have yielded under the other guarantee.

Environment identity perfectly predicts the recorded guarantee: 11 environments have only `behavioral_reference` cases, and 27 have only `compile_only` cases. If I hold environment fixed, there is no guarantee variation left to compare. Additional precision on 69.3% and 70.4% does not supply the missing within-environment contrast.

The weighting also shapes the pooled numbers. Recorded case counts range from 3 to 55 per environment, so the fractions are not averages of equally weighted environment results. Across all 38 environments, eighteen have all PASS verdicts (174 rows), six have zero PASS (58 rows), and fourteen have mixed verdicts (183 rows, of which 116 PASS and 67 FAIL). This is a description of the archive's coverage, not a sampled distribution of capability.

Two environments show how much an aggregate can hide. `glyph` has 24 recorded cases, all FAIL, under `behavioral_reference`. `moco`, also under `behavioral_reference`, has 55 cases: 30 PASS and 25 FAIL. Together they contribute 49 of that group's 58 FAILs. Knowing where failures concentrate is useful for reading the table. Removing those environments to obtain a preferred fraction would answer a different question, and their names give no basis for predicting how either would fare under `compile_only`.

The coverage has an outer boundary. The pilot lists 39 environments, but only 38 have recorded cases; `rope` has none. Eighty separate exclusion rows sit outside the 416-case manifest — 56 intervention-twin omissions, 14 known-gate or calibration omissions, and 10 unsupported-modality omissions — none with a recorded score. That set happens to be the same size as the 62 rejected plus 18 unscored FAIL rows inside the manifest, but it is a different set of records. The two are never conflated, and exclusions are never added to a result denominator.

## When component fields & final verdicts diverge

One compact example illustrates why a guarantee label, a component field, and a final verdict can disagree without any of them being wrong. A `batchnorm_ema` case carries the `compile_only` guarantee and the failure label `overfit_visible_tests`. Its component fields include `behavioral_evaluation=scored_pass` and `required_artifacts=failed`; its final verdict is FAIL, with a missing-required-file note. Six other rows with the same failure label carry `behavioral_reference` and record `behavioral_evaluation=scored_fail`. All seven share failed required artifacts and final FAIL.

The compile-only component pass does not make the final verdict a PASS, and it does not establish that the guarantee was behavioral-reference after all. The full aggregation rule combining component fields into final verdicts is not established in this archive, so this row proves no gaming and establishes no judge rule. The narrower observation is sufficient: a component result, a required-artifact result, a final verdict, and a declared guarantee can differ without being interchangeable.

## Three objections

**Just compare the scored rows.** Restricting to scored-disposition rows removes the rejected and unscored FAILs, but it cannot create cross-guarantee environment overlap where none exists. The scored subset still draws from two disjoint environment pools, so it isolates neither the judge standard nor the environment mix. And presenting such a subset as a corrected performance rate would silently recode the rejected and unscored rows out of the record.

**The gap is noise.** This single campaign, with one selected case per cell, does not estimate run-to-run variability. The fractions are exact ratios of recorded counts, and the gap of about one point is a descriptive difference between two differently composed pools. Whether that gap would persist, widen, or reverse under different seeds or repeated runs is a question this table cannot answer.

**Keep both fractions as bookkeeping.** I agree. If the question is "of these selected cases, how many ended in PASS under the guarantee each environment was assigned?", then 131/189 and 159/226 are useful answers. Rejected submissions belong in an end-to-end verdict tally, and one missing manifest result is not grounds to discard 415 recorded observations. The near equality is an archive fact, not an arithmetic error. It is legitimate to say that each of these particular, case-weighted environment pools has a recorded final PASS fraction around seven in ten — provided the denominator composition and the exploratory status of `compile_only` travel with the numbers.

The stronger interpretation is where the evidence runs out. Separating judge standard from environment mix would require running the same environments under both guarantees, with the same cases & seeds. That is a different experiment from judging fixed submissions under two standards, and a different experiment again from measuring whether an agent would submit the same repair if its task or feedback changed. None of those paired observations is present in this snapshot.

## What this is not

It is not a claim that <span class="icon-atria">Atria-Dawn-Preview</span> handles one judge standard better than the other. It is not a claim that rejected submissions reveal anything about the model's reasoning — they record a stage reached, not a cognitive failure. It is not a cleaned or corrected performance rate, and it is not a claim that the exploratory pool validates the behavioral one, or vice versa.

The bounded claim I can stand behind is this:

> The two guarantee fractions are recorded verdicts over differently composed denominators drawn from disjoint environment pools, and they can only be read together with those facts attached.

The numbers were never two measurements of one thing. They were two ledgers, and the ledger columns are part of the result.