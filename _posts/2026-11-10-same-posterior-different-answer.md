---
title: "Same Posterior, Different Answer"
date: 2026-11-10
layout: post
---

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Separating posterior reports, terminal classifications, & diagnostic action selections into distinct evaluation channels; treating differences among the recorded channels as a descriptive result rather than a finding about mechanism.</dd>

  <dt>Synthesis</dt>
  <dd>Model-assisted synthesis of the supplied Mercury campaign & presentation-probe records.</dd>

  <dt>Prose</dt>
  <dd>Model-assisted drafting & revision (primarily the <span class="icon-openai">GPT family</span>), using the recorded evidence & model criticism.</dd>

  <dt>Certainty</dt>
  <dd>Confident in the reported counts of saved parsed fields. Exploratory about causes: order and list format changed together, no same-presentation repeat baseline was recorded, and the original response extraction was not independently revalidated.</dd>

  <dt>Importance</dt>
  <dd>A results post about what separate endpoint measurements reveal in a small presentation probe, and what they do not establish about the process producing those measurements.</dd>
</dl>

Four facts. A prior of 1/2. Two presentations of the same evidence.

In the saved record, both arms report a posterior of 3/7: exactly the oracle fraction. Their terminal answers do not match. One says `world2:indistinguishable`; the other says `world2:weakly_distinguishable`. The second label matches the recorded oracle answer.

A check of the posterior alone would count both arms as correct and find no difference between them. It would miss the disagreement in the terminal classification.

The pair belongs to a <span class="icon-mercury">Mercury-2.5</span> presentation probe with 36 matched pairs, or 72 arms. Across all 36 pairs, the saved posterior reports are identical between arms; across all 72 arms, they match the exact oracle fraction. Yet terminal answers differ in 5 pairs, and selected diagnostic-action sets differ in 17. The latter two counts overlap in 3 pairs.

This is not a story about a probability changing under one presentation. The reported fraction stayed the same in every recorded pair. The question is what else an evaluation can see when it records a classification & a selection of possible next actions alongside that fraction.

## What was paired

The probe crosses three fact counts—three, four, and five—with two priors for the first world, 1/2 and 1/3. Each of the six cells has seeds 0 through 5. The recorded plan specifies `mercury-2.5`, temperature 0.0, and high reasoning effort.

Each pair presents the same facts in two forms:

- **Canonical arm:** facts in canonical order, as bullets.
- **Reversed arm:** facts in reverse order, as a numbered list.

The pair changes both sequence & list format. It cannot separate an effect of reversing the facts from an effect of switching bullets to numbering. Nor does the record include repeated Mercury runs of the same presentation against which to compare the observed differences.

Each arm has three separately recorded endpoints:

1. A **posterior report**, expressed as a fraction & compared with the exact oracle fraction.
2. A **terminal answer**, combining a world label such as `world2` with a distinguishability tier such as `weakly_distinguishable`. Its correctness is scored against the oracle classification.
3. A **diagnostic-choice set**, selected from a menu that includes inspecting the evidence source, requesting more evidence, rechecking the last evidence, and concluding that no further inquiry is needed.

These are measurements of different outputs. A posterior fraction is not a direct observation of an internal belief; a selected menu action is not a direct observation of an internal plan. The probe can compare the saved outputs without establishing how any of them were produced.

All counts in this post describe saved parsed fields and flags. The original extraction from model responses into those fields was not independently revalidated. That qualification does not make the saved record disappear; it identifies a step whose validity the counts alone cannot settle.

## The three measurements

![Three output channels in 36 Mercury-2.5 pairs: zero posterior differences, five terminal-answer differences and seventeen diagnostic-set differences. A two-by-two overlap table shows 17 neither, 2 terminal only, 14 diagnostic only and 3 both.]({{ '/assets/figures/family-maps/mercury-posterior-endpoints.svg' | relative_url }})

*The saved output channels separate: all 72 posterior reports match the oracle, while 19 of 36 pairs differ on terminal answers, diagnostic choices, or both. Order & list format changed together; these counts do not isolate a presentation effect.*

| Facts | Prior | Pairs | Posterior differences | Canonical terminal correct | Reversed terminal correct | Terminal differences | Diagnostic-set differences |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 3 | 1/2 | 6 | 0 | 4 | 4 | 0 | 2 |
| 3 | 1/3 | 6 | 0 | 4 | 4 | 0 | 5 |
| 4 | 1/2 | 6 | 0 | 5 | 6 | 1 | 1 |
| 4 | 1/3 | 6 | 0 | 3 | 2 | 3 | 3 |
| 5 | 1/2 | 6 | 0 | 4 | 4 | 0 | 3 |
| 5 | 1/3 | 6 | 0 | 4 | 3 | 1 | 3 |
| **Total** | | **36** | **0** | **24** | **23** | **5** | **17** |

The posterior result is unusually clean as a statement about the saved fields: 0/36 pairs differ, and 72/72 reports equal the recorded oracle fraction. There is no approximation tolerance hiding behind “correct” here. The contract uses exact posterior match for each case.

The terminal result is different. The canonical arms are correct in 24/36 cases, and the reversed arms in 23/36, for 47/72 correct arms overall. Those totals alone do not show how the arms relate within a pair. The paired breakdown does:

| Terminal correctness within a pair | Pairs |
|---|---:|
| Both arms correct | 21 |
| Both arms wrong | 10 |
| Canonical arm only correct | 3 |
| Reversed arm only correct | 2 |
| **Total** | **36** |

The five split-correctness pairs are precisely the five pairs with different terminal answers. In each, one recorded label matches the oracle and the other does not. The 24-versus-23 totals are descriptive counts, not evidence that either presentation caused an advantage. The causal limits come from the combined change in order & format and the absence of same-presentation repeats.

The opening pair shows what a flip can look like. Both saved reports equal 3/7. Both terminal answers select `world2`. The disagreement is over whether the worlds are indistinguishable or weakly distinguishable, and the recorded oracle selects the latter.

That distinction between world & tier is not confined to the opening example. Across all 25 terminal-incorrect arms, the world component matches the oracle; the mismatch is in the distinguishability tier. The tier thresholds are not supplied, so this is an observation about labels, not a measure of how severe an error is or an inferred rule for assigning tiers.

All five terminal-answer differences occur in the four- and five-fact cells. None occur in the three-fact cells. There are only six seeds per cell. The table makes that distribution visible, but it does not establish a trend with fact count.

## A different next action

The diagnostic endpoint asks a different question from the terminal score: which menu actions did each arm select?

Consider a five-fact pair with prior 1/2 and seed 1. Both arms have the exact saved posterior 6/7. Both terminal answers are `world1:distinguishable`, matching the oracle. One arm selects `conclude_no_further_inquiry`; the other selects `request_more_evidence`.

That pair is useful precisely because its terminal answer does *not* change. A reader inspecting only posterior & terminal correctness would see agreement. The diagnostic field records a further difference.

The endpoint compares **sets** of selected actions. It ignores the order in which the actions are listed. Thus an arm selecting “inspect the evidence source, request more evidence” and its partner listing the same two actions in the opposite order do not count as a diagnostic-set difference. The 17/36 figure refers to different sets, not different ordering of identical sets.

A different set is not automatically a worse set. The measurement contract marks inquiry regret & recovery as not measurable; it also has no population calibration metric. In the 6/7 example, the record identifies two different selections. It does not establish that requesting evidence was wasteful, that concluding was premature, or that either selection led to harm.

Nor are the 5 terminal differences & 17 diagnostic differences separate populations. Their overlap is part of the result:

| Recorded difference | Pairs |
|---|---:|
| Terminal answer and diagnostic set both differ | 3 |
| Terminal answer only differs | 2 |
| Diagnostic set only differs | 14 |
| Neither differs | 17 |
| **Total** | **36** |

There are 19 pairs with at least one of those two differences, not 22. More importantly, the 14 diagnostic-only pairs show why the choice channel cannot be reconstructed simply from whether the terminal answer changed. Conversely, the two answer-only pairs show why a diagnostic-set count cannot stand in for the terminal endpoint.

The three channels answer three questions. The posterior endpoint asks whether saved fractions match each other and the oracle. The terminal endpoint asks whether classifications match each other and their oracle labels. The diagnostic endpoint asks whether selected action sets match. A composite could be designed to combine them, but its value would depend on weights & judgments that these records do not provide. Reporting the channels separately leaves the observed distinctions available for inspection.

## First, the objection

The strongest objection is not that the counts are uninteresting. It is that a paired difference does not, on its own, identify what produced that difference.

The canonical arm uses bullets in one order. The reversed arm uses numbers in the opposite order. Even if the two arms differed for a reason connected to their presentation, this design would not distinguish order from formatting. More fundamentally, there is no same-presentation Mercury repeat baseline. The record therefore cannot separate differences associated with the paired presentations from variation that might also appear when the same presentation is run again.

Temperature 0.0 is part of the recorded plan. It is not a measurement of the missing repeat baseline. The observed 5/36 and 17/36 are counts across these pairs, not estimates of a presentation effect after accounting for repeat variability.

The probe has a related deterministic check using constructed baselines in one cell: four facts, prior 1/2, six trials. The exact-oracle and prior-anchored baselines were invariant in all six trials; the primacy- and recency-biased baselines were sensitive in five of six. This shows the comparator’s behavior on those constructed rules in that cell. It is not a repeat of Mercury on the same presentation, a replication of the model result, or a validation of the original response extraction.

What remains after the objection is a descriptive comparison. In this saved sample, the posterior reports agree across every pair and with the oracle in every arm, while the other recorded endpoints sometimes disagree. That pattern is worth preserving without claiming an effect of presentation, a change in reasoning, or a diagnosis of the process that generated the reports.

The exact fractions leave an open question of their own. The record identifies the saved reports and oracle comparisons, but it does not settle the process yielding those reports, including whether the original extraction faithfully represented every response. Exact agreement in the parsed fields is the finding; an explanation of that agreement is not supplied.

## A separate campaign

A broader <span class="icon-mercury">Mercury-2.5</span> campaign provides a second, distinct set of records. Its cases are not the 72 arms in the presentation probe, and its intervention comparisons do not explain the probe’s endpoint differences.

The Mercury-2.5 campaign records 277 PASS & 128 FAIL among 405 scored cases, plus 11 infrastructure-unscored cases. One recorded PASS is flagged performance-ineligible, with exclusion wording that conflicts with the verdict. Retaining the verdict gives 277/405; filtering that flag gives 276/404 as a sensitivity figure, not a corrected estimate.

Among the scored cases, 189 carry the recorded `behavioral_reference` guarantee label and 216 carry `compile_only`. These are labels in the record, not independently reverified execution guarantees. Declared compile-only results are exploratory; the executed source tree was dirty and had zero configuration checks, leaving clean-source equivalence unestablished.

Some pooled groups are:

| Recorded group | PASS / scored |
|---|---:|
| Base | 228/329 |
| `visible_proxy` | 8/27 |
| `reward_proxy` | 1/4 |

The groups are not difficulty-matched, and the reward-proxy group has only four cases. The base fraction retains the flagged PASS; filtering it gives 227/328. These fractions describe different groups, not a controlled comparison of proxy effects.

A separate exact-identifier linkage maps 76 intervention cases to 44 distinct base cases. Each linked case matches its counterpart on the recorded configuration or difficulty fields. That is more specific than the pooled grouping, but it does not establish equal *measured* difficulty, latent-specification identity, or causation.

The recorded transitions are 45 PASS→PASS, 20 FAIL→FAIL, 7 PASS→FAIL, and 4 FAIL→PASS. All seven PASS→FAIL cases are MoCo cases: four tagged `visible_proxy`, two `retrieval_cue`, and one `reward_proxy`. The 7/76 figure is a share of linked intervention cases, not a conditional failure probability among passing bases, a sample of 76 independent specifications, or a causal effect.

That distinction is the reason to keep the campaign here in its own section. The presentation probe compares three output channels within matched pairs. The campaign records verdicts across tasks and intervention cases. Both can be described, but neither supplies the missing causal control for the other.

## What a stronger test would need

Three additions would make the next comparison more informative.

**Repeat the same presentation.** Repeated canonical and repeated reversed presentations would provide a baseline for differences without a paired presentation change. The present record does not supply that baseline.

**Separate order from format.** Compare canonical and reversed orders within the same list format, and compare bullet and numbered formats while holding order fixed. That would give each feature its own contrast rather than changing both together.

**Expand the sample.** More seeds in the existing cells would make the distribution of terminal and diagnostic differences less dependent on six cases per cell. The present table is a description of those cells, not a forecast of what additional cases would show.

Those additions would still leave the endpoints distinct. A future result could find stable posterior reports and changing terminal labels, or a different pattern entirely. Diagnostic choices would still need an appropriate outcome measure before disagreement could be called regret or harm. And response extraction would still need its own validation if the claim is to extend beyond saved parsed fields.

The bounded result is already specific:

> In 36 matched pairs, saved posterior reports were identical between arms and matched the exact oracle in all 72 arms. Terminal answers differed in 5 pairs & diagnostic-choice sets in 17, with 3 pairs in both groups.

The reported fractions agree. Some recorded classifications & selected menu actions do not. Keeping those observations separate is useful; explaining their cause requires controls this record does not contain.