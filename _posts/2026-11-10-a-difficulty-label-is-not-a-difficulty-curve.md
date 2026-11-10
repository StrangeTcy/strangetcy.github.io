---
title: "A Difficulty Label Is Not a Difficulty Curve"
date: 2026-11-10
layout: post
---

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Distinguishing a generator’s named difficulty settings from a measured performance curve, using the recorded CSS, SQL and MoCo cases to specify what a controlled comparison would require.</dd>
  <dt>Synthesis</dt>
  <dd>Model-assisted synthesis of recorded campaign results and the methodological argument.</dd>
  <dt>Prose</dt>
  <dd>Model-assisted drafting and revision. No completed human final edit is represented here.</dd>
  <dt>Certainty</dt>
  <dd>Confident about the recorded verdicts and difficulty tuples described below. Uncertain whether the named settings produce a consistent performance ordering across independently generated cases.</dd>
  <dt>Importance</dt>
  <dd>A measurement question for evaluation generators: a configuration can be labeled before its empirical difficulty has been established.</dd>
</dl>

A CSS case labeled easy on both of its difficulty axes passed. So did a case labeled hard on both. In fact, every recorded CSS case passed.

That sounds like an answer to a difficulty question until one asks which question it answers. The records tell us what happened at nine named configurations. They do not tell us whether those names mark equal steps in complexity, whether another generated instance at the same setting would pass, or whether moving from easy to hard changes the probability of success.

An evaluation generator needs names for its settings. `easy`, `medium` and `hard` are useful names: they let a case be constructed, grouped and inspected. But an ordered vocabulary can make a table look like a measurement it has not yet become.

> A difficulty label identifies a configuration. A difficulty curve describes how performance changes under a controlled change in configuration.

The distinction is easy to lose when a table already has rows called easy, medium and hard. The three families below make it visible in different ways. CSS supplies an all-pass grid. SQL supplies one failure in a nine-cell grid. MoCo supplies many more cases, but varies several named axes together. None of those patterns, by itself, estimates a curve.

## What is being counted

The campaign contains 416 recorded cases. Of these, 405 received scored verdicts: 277 PASS and 128 FAIL. Eleven were infrastructure-unscored and are outside the scored denominator. One scored PASS is also marked performance-ineligible; removing that row would give 276 PASS among 404 scored cases. That second fraction is a sensitivity to the recorded flag, not a corrected estimate of what the campaign would otherwise have produced. The conflicting flag does not turn the PASS into a failure or establish its cause.

Those totals give scale, but they are not a difficulty analysis. The relevant unit here is the *difficulty tuple*: the set of categorical values attached to a case. CSS and SQL each have two fields, `surface_deceptiveness` and `hidden_depth`. MoCo has six. Counting outcomes at a tuple tells us the observed fraction among the rows assigned that tuple; it does not automatically give us repeated independent measurements of the configuration.

That distinction is especially important in this campaign. All 416 recorded rows carry seed 0. The table contains no replication across independently varied seeds. A seed field also does not tell us how many execution attempts or retries a row may represent. Several cases at one tuple can therefore be linked variants rather than fresh draws from a distribution. I will give the base-and-variant composition beside each comparison, where it changes what the denominator means.

The CSS, SQL and MoCo rows discussed here are all labeled `behavioral_reference`. That provides a more specific judging context for these slices than for the wider campaign, which also includes compile-only judgments. It does not solve the sampling and comparison problems: a behavioral verdict is still a verdict on the recorded case, not an estimate over unobserved seeds.

## CSS: nine settings, eighteen passes

The CSS state-machine cases form a complete three-by-three grid. Each cell below shows PASS verdicts over scored cases.

| `hidden_depth` \ `surface_deceptiveness` | easy | medium | hard |
|---|---:|---:|---:|
| easy | 2/2 | 2/2 | 2/2 |
| medium | 2/2 | 2/2 | 2/2 |
| hard | 2/2 | 2/2 | 2/2 |

That is **18/18 PASS** across nine tuples, with every row judged `behavioral_reference`. The two cases in each cell are one base case and one terminology variant, both recorded at seed 0. They are not two independently seeded replications. Matching a variant to its base by case identifier and recorded difficulty fields does not, on its own, certify that the two are identical latent specifications.

There is still a clear observation: every case in this CSS slice passed. The observation just has less reach than the grid’s ordered headings might suggest. It does not show a decline from easy to hard. It also cannot establish that there is *no* decline. With all nine cells at the observed ceiling, these cases do not distinguish a genuinely flat response from a response whose differences are too small for this sample to expose. They cannot say what happens at other generated instances assigned the same labels.

The temptation is to call the hard/hard cell a demonstration of mastery. But “hard/hard” is a pair of configuration names, not an independently measured quantity of difficulty. A pass there establishes success on the recorded base and terminology variant. It does not measure the size of a challenge overcome relative to easy/easy.

Even the geometry of the table is a convenience. Its rows and columns place easy, medium and hard in an apparent order, but the records supplied here do not verify a mapping from those words to physical bit counts, graph lengths or another common unit. Nor do they establish that a move from easy to medium has the same size or meaning as a move from medium to hard. The grid is an effective way to show the categorical observations. It is not a graph with calibrated axes.

So the CSS result is neither an observed reversal nor proof of monotonicity. It is an all-pass sample at nine named settings, one recorded seed, with a linked variant beside each base.

## SQL: one failure does not make a slope

The SQL fixed-point cases use the same two difficulty-field names. Here each cell contains one base case at seed 0, with no variants in this slice.

| `hidden_depth` \ `surface_deceptiveness` | easy | medium | hard |
|---|---:|---:|---:|
| easy | 1/1 | 1/1 | 1/1 |
| medium | 1/1 | 1/1 | 1/1 |
| hard | 0/1 | 1/1 | 1/1 |

SQL records **8/9 PASS**. Its sole FAIL sits at easy surface deceptiveness and hard hidden depth. The case received score **0.208333** and the normalized label `underfit`. All nine cases are labeled `behavioral_reference`.

The failure has useful process detail, though that detail needs careful reading. Patch validation, required-artifact checks, source validation and judge execution are recorded as passed. Behavioral evaluation is recorded as `scored_fail`. The record also marks provider transport `completed_with_errors`, response parsing `recovered` and runtime execution `unknown`.

Thus the failed case was **not** recorded as a source-validation rejection. Equally, the `underfit` label is an outcome category, not a diagnosis of why this particular verdict occurred. The transport and parsing fields do not establish a competing cause; the unknown runtime field does not resolve one. The defensible statement is that this case passed the listed validation stages and received a failing behavioral score, with those additional process statuses recorded alongside it.

The position of the failure invites a second over-reading. At easy surface deceptiveness, the easy- and medium-depth cases passed while the hard-depth case failed. Perhaps increasing hidden depth made this case harder. But there is only one case in each cell. At hard hidden depth, the medium- and hard-surface cases passed. Perhaps the interaction between axes changes the task; perhaps individual generated instances differ; perhaps the observed pattern would change at another seed. This grid cannot choose among those explanations.

It would be inconsistent to refuse a monotonicity claim from CSS’s uniformly passing cells and then declare a difficulty effect from SQL’s single failing cell. One observation can identify a setting worth testing again without estimating how success changes across settings. The difference between locating a failure and measuring a slope is the central difficulty here.

## MoCo: more cases, but not an isolated axis

MoCo appears to offer a richer comparison. It records **36 PASS and 19 FAIL among 55 scored cases**, across **15 difficulty tuples**. The six fields are `distractors`, `naming`, `queue_math`, `symptom_mask`, `temperature` and `visible_tests`. All 55 cases are labeled `behavioral_reference`.

More rows do not necessarily mean a cleaner comparison. Consider three of the fifteen tuples. They share easy `distractors` and easy `naming`:

| `queue_math` | `symptom_mask` | `temperature` | `visible_tests` | Recorded PASS |
|---|---|---|---|---:|
| easy | easy | easy | easy | 4/6 |
| hard | medium | hard | medium | 2/3 |
| medium | hard | medium | hard | 3/3 |

Reading only the `visible_tests` column creates an easy-to-medium-to-hard sequence. Reading across each row shows the problem: queue math, symptom mask and temperature move too. The change in observed PASS fractions cannot be assigned to visible tests while those other recorded fields vary. Across all fifteen recorded tuples, no pair isolates `visible_tests` with the other five difficulty fields held fixed. The records therefore do not establish a fixed-controls visible-test sweep.

The denominators add another complication. The 55 MoCo cases comprise **15 base cases and 40 intervention variants**, all at recorded seed 0. A fraction such as 4/6 describes the outcomes of rows assigned one tuple; it is not six independently seeded trials of one unchanged specification. Variants can be linked to base cases by exact case-identifier matching, and their recorded difficulty fields match their counterparts. That linkage does not certify latent-spec equivalence, and the pooled rows should not be treated as independent specifications.

The overall 36/55 is consequently a valid descriptive fraction for this recorded MoCo slice, not a measured response to raising any one difficulty field. Neither a favorable fraction at a tuple labeled hard nor an unfavorable fraction at another tuple identifies which axis, variant or instance feature accounts for the difference.

This also prevents a shortcut through the wider campaign’s intervention groups. Base, visible-proxy and reward-proxy groups are not difficulty-matched. Differences between their pooled PASS fractions would be diagnostic differences between recorded groups, not difficulty-controlled estimates of an intervention’s effect. A linked change in verdict can be observed without establishing a causal effect, just as a failure label can be recorded without establishing a failure mechanism.

## The strongest case for taking the labels seriously

There is a substantial objection to this caution. Generator settings are not arbitrary words pasted onto cases afterward. The labels are intended to select different kinds of instances. The CSS and SQL grids deliberately enumerate combinations of two fields; MoCo records six fields rather than one undifferentiated “difficulty” score. Why not accept easy, medium and hard as at least an approximate ordering, then use these tables as noisy evidence about it?

The intention deserves to be taken seriously. Labels can guide construction and make hypotheses testable. An approximate ordering may eventually prove useful. But there are two claims hidden inside the objection: that the settings were intended to differ, and that the executed cases differ in a verified way that produces an ordered change in measured performance. The first does not demonstrate the second.

For these records, no verified executed-configuration mapping connects the categorical names to physical bit counts or graph lengths. The executed source tree was recorded as dirty, and no configuration checks were reported. That does not prove the intended settings were ineffective. It prevents using an assumed clean-source configuration as independent verification of what each label physically selected.

Even a verified mapping would be only part of the answer. A larger physical parameter can change more than one feature relevant to a solver. Conversely, a design change intended to make a case harder might make its operative structure easier to recognize. The empirical question is how verdicts vary when a specified feature changes and the comparison is otherwise controlled.

The present cases do not supply that test. CSS has a base and linked terminology variant per cell, not independent seeds. SQL has one base per cell. MoCo has multiple changing axes and pooled variants. These limitations do not make the observations worthless; they define what the observations can support. They supply candidate contrasts and a record of outcomes. They do not supply an uncertainty estimate across newly generated instances, an isolated MoCo visible-test effect, or an ordinal performance scale certified by the labels.

## What would earn the word “curve”

A suitable follow-up would begin by stating the ordering hypothesis. For example: with the other five MoCo difficulty fields fixed at named settings, moving `visible_tests` from easy through medium to hard is predicted to change the PASS probability in a specified direction. That is a proposed experiment, not a result of this campaign.

The cases would then need multiple independently varied seeds at each level, with attempts logged separately from seed identifiers. Bases and intervention variants would need separate reporting, or an analysis that explicitly preserves their linkage. The evaluated configuration would need to be checked so that any proposed physical interpretation of the axis is tied to what was executed. A common behavioral judging guarantee would keep a difference in evaluation procedure from being mistaken for a difference in task difficulty.

Those choices would not guarantee a smooth curve. They would make a curve—or evidence against the predicted ordering—something the data could address. A flat result might be a real flat region, a ceiling at the tested settings, or an imprecise estimate; replication and controlled comparisons would help distinguish them. A reversal would likewise need to recur under a specified contrast before it became a finding about difficulty rather than an arrangement of individual verdicts.

For now the bounded account is simpler. CSS passed all 18 recorded cases across its nine labeled tuples. SQL passed eight of nine, with one behavioral failure at easy surface and hard depth after recorded source validation passed. MoCo passed 36 of 55 across fifteen six-field tuples that do not isolate a visible-test change. Every recorded case uses seed 0, and the CSS and MoCo denominators include linked variants rather than independent seed replications.

The labels are useful coordinates for finding those observations. The curve remains an empirical question.
