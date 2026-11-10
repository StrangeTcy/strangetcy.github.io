---
title: "What a 68.4% Pass Rate Hides: Mercury-2.5 Across 38 Environments"
date: 2026-11-10
layout: post
---

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt><dd>A retrospective reading of one archived Mercury-2.5 campaign: what a pooled pass rate compresses once its cases are regrouped by environment & by difficulty tuple. No new runs.</dd>
  <dt>Synthesis</dt><dd>Records for 416 selected cases in 38 environments, an 80-case omission record, and a 340-row environment × difficulty-tuple matrix, read against the conflicts the records themselves carry.</dd>
  <dt>Prose</dt><dd>Model-assisted drafting & revision (primarily the <span class="icon-openai">GPT family</span>) from the archived records. No independent human verification or replication of the campaign is claimed.</dd>
  <dt>Certainty</dt><dd>High for the counts, which are arithmetic on recorded rows. Low for anything causal: one seed, a source tree recorded as dirty, eleven unscored cases, judge guarantees fixed by environment, and places where the records disagree with each other.</dd>
  <dt>Importance</dt><dd>A pooled benchmark number is easy to read as a description of its parts. This one is not, and the records show both how uneven the parts are and how little they can settle.</dd>
</dl>

In the archived <span class="icon-mercury">Mercury-2.5</span> campaign, the pooled pass rate is 68.4%, but most individual environments look nothing like it. Twenty-four of the 36 environments with scored cases are at an endpoint: every scored case passed, or none did. Only two lie within five percentage points of the pooled rate. The environment-level mean is 69.2%, and the median is 88.9%.

The pooled number is a precise answer to one question, and it is a value the environments almost never take. The two environments within five percentage points are `moco` at 36/55 (65.5%) and `tensor_functor` at 6/9 (66.7%).

Three limits govern everything below, so I state them once. These are verdicts the campaign's judges assigned to selected cases, not repeated measurements of a general ability, and an environment name is not a difficulty rating. Every selected record carries seed 0, and no second seed is recorded. And each environment was judged under exactly one of two guarantees, `behavioral_reference` or `compile_only`, which do not establish the same thing when they say PASS.

**The thesis is narrow: 277/405 = 68.4% is the exact answer to one counting question, and the records beneath it support a map of where judged outcomes fell, not a difficulty ranking, a mechanism, or a stability estimate.**

## Counting the judged cases & the frame around them

The <span class="icon-mercury">Mercury-2.5</span> campaign selected **416 cases in 38 environments**. Of these, 405 received a verdict: 277 PASS & 128 FAIL. The other 11 carry the recorded status `infrastructure_unscored`; the records state no cause, and I do not supply one.

So 277/405 = 68.4% is the share of *scored* cases with a PASS. The fraction 277/416 = 66.6% answers a different question, the share of all *selected* cases with an observed PASS, and must not be presented as a pass rate, because that would quietly book eleven unknown outcomes as failures.

![Three stacked bars: 496 recorded case IDs split into 416 selected and 80 omitted; 416 split into 405 scored and 11 unscored; 405 split into 277 PASS & 128 FAIL]({{ '/assets/figures/family-maps/mercury-overview-selection.svg' | relative_url }})
*Figure 1. The bars share a case-count scale: 496 recorded case identifiers divide into 416 selected & 80 omitted; 416 divide into 405 scored & 11 infrastructure-unscored; 405 divide into 277 PASS & 128 FAIL. Omitted cases enter no pass rate. Nine scored FAILs whose disposition field conflicts with their status are not drawn separately. The 68.4% scored pass rate & 66.6% selected-case observed PASS share answer different questions.*

The 416 are themselves a selection. The 80 omitted cases fall in four environments:

| Environment | Intervention-twin | Known-gate | Input modality | Total |
|---|---:|---:|---:|---:|
| `moco` | 35 | — | — | 35 |
| `glyph` | 12 | 9 | — | 21 |
| `rope` | — | 5 | 10 | 15 |
| `epistemic_games` | 9 | — | — | 9 |
| **Total** | **56** | **14** | **10** | **80** |

`rope` never reached scoring and has no row in the 38-environment tables. One disagreement sits here: the campaign's provenance summary gives 24 known-gate omissions where the detailed rows give 14. I report both; nothing in the records says which was intended, and the coincidence that 14 plus the 10 modality cases equals 24 is not a reconciliation. The records explain these exclusions but do not establish a general sampling scheme, so I infer neither random nor targeted sampling. What the table does show is that omissions concentrate in `moco` & `glyph`, two environments that weigh heavily on the pooled figure.

## An endpoint-heavy map

| Environment outcome | Environments | PASS / scored | Share of scored | Unscored |
|---|---:|---:|---:|---:|
| Every scored case passed | 17 | 172/172 | 42.5% | 0 |
| No scored case passed | 7 | 0/68 | 16.8% | 0 |
| Some passed, some failed | 12 | 105/165 | 40.7% | 1 |
| No scored case | 2 | — | — | 10 |
| **Total** | **38** | **277/405** | **100%** | **11** |

Twenty-four of the 36 scored environments are at an endpoint. I call the map endpoint-heavy and stop there: an endpoint on four cases and one on 24 are both single-seed observations, and the table cannot say how either would hold under other cases or seeds.

![Dot plot of pass fraction by environment with 95% Wilson intervals and a dotted line at the pooled 68.4%]({{ '/assets/figures/family-maps/mercury-overview-environments.svg' | relative_url }})
*Figure 2. One dot per environment with scored cases (36; the two environments with no scored case are not drawn), placed at PASS/scored and labelled k/n. Bars are 95% Wilson intervals under a binomial sampling convention; they are not measured seed-to-seed variation, and selection & possible dependence among cases limit what they mean. The dotted line is the pooled 277/405. Colours mark no scored pass (7), mixed (12), and all scored passed (17).*

The 17 all-pass environments are nine at 9/9 (`architecture_naturality`, `categorical_lenses`, `ci_dependency_graph`, `neuro_symbolic_parser`, `semiring_unification`, `spreadsheet_dataflow`, `stochastic_monad`, `template_interpreter`, `tokenizer_adjunction`), plus `epistemic_games` 23/23, `css_state_machine` 18/18, `rd_gradient_credit` & `rd_state_carry` 15/15, `epistemic_announcements` & `epistemic_nested_knowledge` 6/6, `epistemic_fragmented_observation` & `ts_parse_only` 4/4. One of the four `ts_parse_only` PASSes is marked performance-ineligible: its recorded exclusion field attributes a terminal failure to a provider transient after bounded retries, while the verdict reads PASS. The two fields conflict; I keep the case among the 277 and alter nothing.

The seven zero-pass environments are `functorial_augmentation`, `monadic_reward`, `sheaf_invariant_gluing` & `sheaf_physical_constraints` at 0/9, `ts_one_step` & `ts_trajectory` at 0/4, and `glyph` at 0/24. Eight of the nine `monadic_reward` FAILs also carry the disposition `rejected`, a term the records do not define, so its 0/9 may not mean what the other zeros mean.

The mixed twelve:

| Environment | PASS / scored | Recorded flags |
|---|---:|---|
| `sheaf_schema_sync` | 8/9 | |
| `sql_fixed_point` | 8/9 | |
| `transformer_ssm_lift` | 8/9 | lone FAIL has disposition `rejected` |
| `compositional_optimizer` | 7/9 | |
| `equivariant_diagram` | 7/9 | |
| `tensor_functor` | 6/9 | |
| `moco` | 36/55 | three FAILs have disposition `unscored` |
| `rd_adaptive_halting` | 8/14 | plus one `infrastructure_unscored` case |
| `gnn_message_passing` | 5/9 | |
| `regex_state_machine` | 5/9 | one FAIL has disposition `unscored` |
| `ssm_parallel_scan` | 5/9 | |
| `batchnorm_ema` | 2/15 | one FAIL `rejected`, one disposition `unscored` |

These hold 165 of the 405 scored cases, 40.7%, and run from 2/15 to 8/9. Averaging the 36 environment fractions without weighting gives about 69.2%; the median is 8/9. Each answers a different question; neither recovers the shape.

## Names & density

Prefixes invite a shortcut: read `ts_*` or `sheaf_*` as a family, expect a family outcome. The records refuse it. `ts_parse_only` is 4/4; `ts_one_step` & `ts_trajectory` are 0/4. `sheaf_schema_sync` is 8/9; `sheaf_invariant_gluing` & `sheaf_physical_constraints` are 0/9. `categorical_lenses` is 9/9, `functorial_augmentation` 0/9, `tensor_functor` 6/9. These are outcomes attached to distinct environment labels, not positions on a shared scale.

Density pulls the other way. `glyph` (0/24), `moco` (36/55) and `batchnorm_ema` (2/15) supply 94 of the 405 scored cases and 56 of the 128 FAILs. That is where the pooled rate gets its weight, and arithmetic on the recorded rows shows how much:

| Arithmetic on recorded rows | Rate |
|---|---:|
| All scored cases | 277/405 = 68.4% |
| Without `moco` | 241/350 = 68.9% |
| Without `glyph` | 277/381 = 72.7% |
| Without both | 241/326 = 73.9% |

These illustrate sensitivity to selected case density. They are not alternative results, and they say nothing about why those environments failed or whether they share a mechanism.

## Beneath the environments: 340 rows

Each environment's cases sit on difficulty tuples, and the records hold one row per environment × tuple: 340 rows, 4 to 15 per environment, six environments above ten. This is a different object from the 496 case-ID frame.

![Grid of 340 squares, one per environment × difficulty-tuple row, coloured by pass rate]({{ '/assets/figures/family-maps/mercury-overview-tuples.svg' | relative_url }})
*Figure 3. One square per row, grouped by environment. Colour is the row's pass rate: red 0, amber fractional, green 1. Grey marks the 11 rows with no scored case: ten in the two entirely unscored environments and the one unscored `rd_adaptive_halting` row. Numbers mark the 44 rows holding more than one case. The nine amber rows are all in `moco`. Tuples are environment-specific, so columns are not comparable across environments.*

Four facts:

- **296 of 340 rows hold one case** (285 scored, 11 unscored). The 44 multi-case rows sit in four environments: `moco` (15 rows, 55 cases), `glyph` (12, 24), `css_state_machine` (9, 18), `epistemic_games` (8, 23).
- **329 rows carry a pass rate, and 320 of them (97.3%) are exactly 0 or 1.** A scored single-case row can be nothing else, so the matrix repeats the endpoint pattern one level down largely by construction. The nine fractional rows are all in `moco`.
- **204 rows lie in environments whose scored outcome is uniform**: 148 in all-pass and 56 in zero-pass environments. Ten more lie in the two environments with no scored outcome. The figure 214 is reachable only by grouping that shared absence with the observed outcomes, and I do not describe those ten rows as outcomes.
- **98 tuples have zero passes, across 19 environments**, including all 12 mixed ones. That is a different count from the seven zero-pass environments and does not reduce to it.

The matrix uses 34 distinct difficulty keys in total, but each environment uses its own small set. There is no common scale, so I do not pool, rank, or regress tuples across environments, and nothing in this layer is read as a difficulty effect.

A note on units. The records define no sampling "cell", and I do not infer one from the arithmetic: 340 rows hold 416 cases, 44 rows hold more than one, all at seed 0. The 405 scored cases are not 405 distinct tuples, and the records neither establish independence among cases in a row nor estimate dependence. A unanimous multi-case row shows agreement, not repeatability.

`moco` is the only environment with fractional pass rates within tuple rows. Six of its 15 rows are at 0 or 1; the other nine are fractional (2/3 four times, 5/6, 3/4, 2/5, 1/3, 1/6), summing with the rest to 36/55. Every row has a recorded tuple key, so a descriptive map is possible. The 1/6 row, for instance, is `distractors=hard, naming=easy, queue_math=easy, symptom_mask=hard, temperature=hard, visible_tests=easy`: six cases, five labelled `overfit_visible_tests`. The keys permit description only; under one seed, with six-key tuples and two to six cases per row, they establish no isolated dimension effect and no trend.

The single unscored `rd_adaptive_halting` case sits at the row where all five keys read `easy`. That is a recorded field, not an explanation; it does not turn a missing verdict into a failure.

## What the labels & guarantees record

![Horizontal bar chart of recorded failure labels for all 128 FAIL outcomes combined]({{ '/assets/figures/family-maps/mercury-overview-failure-labels.svg' | relative_url }})
*Figure 4. Recorded failure labels across all 128 FAILs: underfit 51, overfit_visible_tests 49, runtime_error 11, source_invalid 9, invalid_action 5, training_failed 3. The 11-case runtime bar consolidates nine cases recorded as `RUNTIME_ERROR` and two as `runtime_error`, an analysis convention. The image has no environment split; the table below supplies it.*

The labels are recorded classifications; their names do not establish an internal reasoning mechanism. By environment:

| Environment | Recorded FAIL labels |
|---|---|
| `glyph` | overfit_visible_tests 22, underfit 1, invalid_action 1 |
| `moco` | overfit_visible_tests 16, training_failed 2, invalid_action 1 |
| `batchnorm_ema` | overfit_visible_tests 11, training_failed 1, invalid_action 1 |
| `functorial_augmentation` | underfit 6, RUNTIME_ERROR 3 |
| `monadic_reward` | source_invalid 8, invalid_action 1 |
| `sheaf_invariant_gluing` | underfit 9 |
| `sheaf_physical_constraints` | underfit 9 |
| `rd_adaptive_halting` | RUNTIME_ERROR 5, underfit 1 |
| `gnn_message_passing` | underfit 4 |
| `ssm_parallel_scan` | underfit 4 |
| `regex_state_machine` | underfit 3, invalid_action 1 |
| `ts_one_step` | underfit 3, runtime_error 1 |
| `ts_trajectory` | underfit 3, runtime_error 1 |
| `tensor_functor` | underfit 3 |
| `compositional_optimizer` | underfit 2 |
| `equivariant_diagram` | underfit 1, RUNTIME_ERROR 1 |
| `sheaf_schema_sync` | underfit 1 |
| `sql_fixed_point` | underfit 1 |
| `transformer_ssm_lift` | source_invalid 1 |

The rows sum to 128. The two lowercase runtime labels belong to cases whose disposition is `unscored`; all nine uppercase ones belong to cases whose disposition is `scored`. I record that alignment and offer no account of it.

Two disposition groups need to stay visible. Ten scored FAILs carry the disposition `rejected`: eight in `monadic_reward` and one in `transformer_ssm_lift`, all labelled `source_invalid`, plus one `training_failed` in `batchnorm_ema`. Nine other scored FAILs carry the disposition `unscored`: three in `moco` and one each in `batchnorm_ema`, `glyph`, `monadic_reward`, `regex_state_machine`, `ts_one_step` & `ts_trajectory`, labelled five `invalid_action`, two `training_failed`, two `runtime_error`. That disposition is a different field from the status `infrastructure_unscored`, and the records define neither term. All 19 stay in the 128.

Then the guarantees. Each environment was judged under exactly one:

| Judge guarantee | Environments | PASS / scored | Unscored |
|---|---:|---:|---:|
| `behavioral_reference` | 11 | 141/189 = 74.6% | 0 |
| `compile_only` | 27 | 136/216 = 63.0% | 11 |

The two rates differ, and the difference cannot be read as a judge effect, because guarantee and environment are confounded: no environment was judged both ways. Nor does the guarantee sort the endpoints on its own; `epistemic_games` (23/23) and `glyph` (0/24) are both `behavioral_reference`. Of the nine 9/9 environments, four are behavioral-reference and five compile-only. A compile-only PASS records that a compile check succeeded; it is not behavioral validation. A behavioral-reference PASS records what that judge checked and no more. For `epistemic_games`, the bounded reading is that the task asks for Bayesian inference over stipulated policies; a 23/23 there is not evidence of recursive reasoning about other minds.

## Limits & unresolved questions

**Uniform observed outcomes.** All 18 `css_state_machine` cases passed; each of its nine tuple rows is 2/2. No outcome reversal appears in those verdicts.

**Open, not findings.** Apparent non-monotonic patterns in `moco` remain a question. The single `sql_fixed_point` FAIL sits at `hidden_depth=hard, surface_deceptiveness=easy`; one observation under one seed establishes no difficulty trend, and I have not computed how often such patterns would arise by chance in a mostly binary matrix.

**Where the records disagree with themselves.** An earlier project overview counts 10 environments at zero and "~12" at 1.0; the rows give 7 and 17, and the 19 environments containing a zero-pass tuple do not reproduce the 10 either. The provenance summary's 24 known-gate omissions stand against 14 detailed rows. The ineligible `ts_parse_only` PASS carries exclusion wording that contradicts its verdict. The dispositions `rejected` and `unscored` are undefined. I leave each as stated.

## What this supports

On this archived selection, <span class="icon-mercury">Mercury-2.5</span> received 277 PASS verdicts among 405 scored cases: all-pass in 17 environments, all-fail in 7, mixed in 12, no verdict in 2. Only two environments sit near the pooled rate. Beneath them, 320 of 329 rated tuple rows are binary, mostly because they hold one case; the only fractional rows are in `moco`. Closely named environments landed far apart.

What it does not support: a common difficulty scale, so no ranking of environments and no claim that environment identity outweighs difficulty; a mechanism behind `glyph`, `moco`, or `batchnorm_ema`; how an endpoint would hold under a second seed; or what a uniform judge would show. Reproduction is bounded too. The source repository was recorded as dirty at run time, and the supplied records contain no clean configuration-hash comparison, so the exact working-tree state is needed to reproduce the run.

The next useful evidence is the kind this record cannot give: repeated seeds within environments, and guarantees varied within an environment rather than fixed by it. Repeated seeds would test how stable the endpoints are. Judging matched cases under both guarantees would help separate guarantee effects from environment differences.

Until then, 68.4% keeps its one precise job, the share of scored, selected cases with a PASS, and the map beside it does the rest.
