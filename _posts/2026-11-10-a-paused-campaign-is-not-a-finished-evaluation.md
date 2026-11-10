---
title: "A Paused Campaign Is Not a Finished Evaluation"
date: 2026-11-10
layout: post
---

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Distinguishing manifest completion from the composition of the results used in a denominator.</dd>

  <dt>Synthesis</dt>
  <dd>Model-assisted synthesis of the campaign records & source-table checks.</dd>

  <dt>Prose</dt>
  <dd>Model-assisted drafting & revision (primarily the <span class="icon-openai">GPT family</span>), grounded in the recorded evidence.</dd>

  <dt>Certainty</dt>
  <dd>Confident in the checked table counts & cautious about their interpretation. The campaign was not rerun, and the executed code was not verified against a clean revision.</dd>

  <dt>Importance</dt>
  <dd>A reading of what one paused campaign can establish, and what must remain open when reporting its results.</dd>
</dl>

One case in the <span class="icon-atria">Atria-Dawn-Preview</span> campaign manifest has no recorded outcome.

It is the reflective `ts_trajectory` seed-0 case. The campaign report records a pause at the total-token limit: 415 completed entries against a manifest of 416. The stored snapshot is flagged non-resumable. That flag describes the snapshot, not every possible future execution of the tasks.

The missing outcome is neither a PASS nor a FAIL. The report gives a reason for the campaign’s pause, not a reason why this particular case is absent. I cannot infer its result from the other cases in its environment, or from the fact that the budget ran out.

The gap raises a small numerical question and a larger interpretive one. How much can one absent result change the total? And what kind of result is already inside that total?

The first answer is reassuring: one case is a small fraction of 416. The second takes more work. The 415 entries include successful submissions, scored failures, rejections & unscored failures, under two recorded judge guarantees. They are valuable observations of this attempt, but they are not 415 interchangeable measurements of the same behavior.

## The fraction & its contents

The campaign used <span class="icon-atria">Atria-Dawn-Preview</span> with recorded high reasoning effort, with one selected seed-0 case per cell. This is one campaign snapshot, not a set of independent replications.

Its overall tally is 290 PASS & 125 FAIL: **290 of 415, or 69.9%**. That is a *recorded-verdict fraction*: the proportion of completed entries whose final verdict says PASS. It is not an unqualified estimate of behavioral performance.

The distinction appears as soon as the rows are split by disposition:

| Disposition | Rows | Final verdicts |
|---|---:|---|
| Scored | 335 | 290 PASS, 45 FAIL |
| Rejected | 62 | 62 FAIL |
| Unscored | 18 | 18 FAIL |

![Atria's 416-case manifest separates into 415 recorded outcomes and one absent outcome. The recorded entries contain 290 scored PASS, 45 scored FAIL, 62 rejected FAIL and 18 unscored FAIL. A separate box shows 80 exclusions outside the manifest.]({{ '/assets/figures/family-maps/atria-paused-denominators.svg' | relative_url }})

*Completion is one question; denominator composition is another. All 415 recorded entries contribute to the verdict fraction. The absent case & the 80 external exclusions have no assigned outcomes.*

All 290 passing entries are in the scored group. The unscored FAILs comprise 11 labelled `training_failed`, six `invalid_action`, and one `runtime_error`. A separate status field says `scored` for all 415 rows, including those with rejected or unscored dispositions. The archive does not resolve that difference by giving us a single, settled meaning of “scored.”

This is not a reason to erase the FAILs. A repair submission can be unsuccessful end to end without producing behavior that a judge compares against a reference. Failure to get through an evaluation is itself an outcome of an attempt. It is simply a different observation from a completed behavioral comparison.

The 62 rejected rows make the difference concrete. Forty-five carry the label `patch_invalid` and 17 `source_invalid`; all 62 record behavioral evaluation as *not reached*. The archive does not define `rejected` in a way that lets us infer one common mechanism for all of them. A rejected attempt is not a successful repair, but neither does its verdict show how repaired code behaved when tested.

The unscored group requires a distinction of its own. Across all 125 final FAILs, the behavioral-evaluation field says `not_reached` on 74 rows and `unknown` on six. Those six are the invalid-action rows. Unknown is not a synonym for not reached: it records that the stage has not been determined in that field.

That leaves 45 final FAILs with an outcome in the behavioral-evaluation field. Forty-four say `scored_fail`; one says `scored_pass`. They span the two guarantee groups, so they should not be described wholesale as independently validated behavioral failures. The component field tells us something about the stored result; it does not, by itself, establish the implementation of the judge or the rule combining components into the final verdict.

There is a useful example among those 45. One exploratory `compile_only` case has a behavioral-evaluation component labelled `scored_pass` and a final FAIL. Its record also says required artifacts failed and notes a missing required file. Those fields can coexist; the full aggregation rule is not established. The example warns against treating a component label as the whole verdict, not against trusting the tally or as proof of why that final FAIL was assigned.

## Two guarantees, not one comparison

The overall fraction combines two groups. Their recorded PASS fractions are close: 131 of 189, or 69.3%, under `behavioral_reference`; and 159 of 226, or 70.4%, under `compile_only`. The campaign report explicitly calls the latter exploratory. These are the guarantees recorded in the archive, not independently verified descriptions of the code that executed.

The same disposition split is visible inside each denominator:

| Recorded guarantee | Scored PASS | Scored FAIL | Rejected FAIL | Unscored FAIL |
|---|---:|---:|---:|---:|
| behavioral_reference | 131 | 12 | 33 | 13 |
| compile_only | 159 | 33 | 29 | 5 |

The table is more informative than the two percentages alone. In the first group, 46 of 58 FAILs are rejected or unscored. In the second, 34 of 67 are. That does not make either group’s failures unreal. It means the same final word covers different mixtures of stages.

Nor does the similarity of the percentages tell us that the two guarantees agree. The environment cross-check assigns exactly one guarantee to each environment with recorded cases: 11 appear under `behavioral_reference`, 27 under `compile_only`, and none under both.

A comparison of the two fractions therefore changes the environment pool along with the guarantee. It cannot isolate an effect of judge mode, establish agreement between judges, or show that the guarantees are equivalent. A within-environment comparison would be needed for those questions; this snapshot does not contain one. A `scored_pass` component on a `compile_only` row does not turn that row into a behavioral-reference result.

This is a general denominator problem in a concrete form. A fraction answers a question about the rows included in it. It does not automatically answer the question one wishes had produced those rows.

## The weight of an environment

Even within the recorded pool, environments contribute very different numbers of cases. The range is three to 55. A pooled fraction gives a 55-row environment more influence than a three-row environment because it counts cases, not environments.

The distribution is uneven. Eighteen environments have all PASS, covering 174 rows. Six have no PASS, covering 58 rows. The remaining 14 have mixed verdicts across 183 rows: 116 PASS and 67 FAIL. This describes the snapshot; it is not a sampled population from which to infer a general capability score.

Two environments show why the detail is useful. Under `behavioral_reference`, `glyph` has 24 recorded rows, all FAIL. `moco` has 55, of which 30 are PASS and 25 FAIL. Together they account for 49 of that group’s 58 FAILs.

That concentration is a reason to inspect those records, not a reason to remove them. Excluding difficult-looking environments after seeing their outcomes would answer a different question about a narrower pool. It would not reveal the score that the original pool “really” had. Equally, the all-PASS environments contribute their rows to the total; their weight is part of the descriptive tally, not evidence that every environment behaves like them.

A different analysis might choose to weight environments equally, or define subgroups before computing their fractions. Those can be legitimate questions when the populations & weights are explicit. They are not substitutes for saying what the 415-row fraction counts.

## A missing case is not an excluded case

There are two coverage boundaries here, and they should not be flattened into one.

The first is the manifest gap: one of 416 cases has no recorded outcome. The second concerns exclusions outside that manifest. There are 80 such rows without recorded scores: 56 intervention-twin omissions, 14 known-gate or calibration omissions, and ten unsupported-modality omissions.

Those 80 exclusions are not extra FAILs, extra PASSes, or missing entries within the 415-row result table. They sit outside the 416-case manifest and outside the reported result denominators. Their number happens to equal 62 rejected plus 18 unscored rows. That is a coincidence between two distinct sets: the latter are recorded entries with final FAILs; the former are exclusions without recorded scores.

The pilot lists 39 environments, of which 38 have recorded cases. The environment called `rope` has none; it has 15 exclusion rows, ten for unsupported modality and five for known gates. Thus a reader needs both the manifest & the coverage information. “415 of 416” describes completion against the manifest; it does not say that all 39 pilot environments contributed results.

The distinction also prevents an attractive but invalid repair to the arithmetic. Adding exclusions to the denominator as though they were failures would assign them outcomes they do not have. Adding them as successes would do the same. The absence of a score is a coverage fact, not a verdict waiting for a convenient sign.

## What was checked

The arithmetic in the source tables was checked. That supports the counts & fractions quoted here; it is not an experimental replication.

The recorded generator revision was marked dirty, with the dirty files unidentified. The reconstruction selected 38 configuration paths and checked none against a clean comparator. The executed task, judge & validator code has not been verified against the clean revision. Consequently, the archive labels are useful evidence about what was recorded, but I cannot claim clean-source equivalence or fill in implementation details from a remembered version of the code.

One row shows why even a seemingly specific explanatory label needs care. A `compile_only` FAIL in `sheaf_schema_sync` carries `performance_eligible=False`. The selected final record says the patch was empty; an exclusion reason attributes the terminal failure to a provider transient, and archived attempts include provider errors. Those facts do not establish that a provider transient caused the selected failure. The verdict remains a recorded FAIL, and the eligibility explanation remains a disputed archive label.

This is not a claim that the archive is unreliable as a whole. It is a limit on what these particular records establish. Checking the counts can tell us how many rows carry a label. It cannot, without further evidence, verify the code that assigned it or turn the label into a causal diagnosis.

## The objection: one case is tiny

The strongest objection is straightforward: 415 of 416 is nearly complete. One missing verdict cannot move the overall fraction very far. Why not disclose the gap, report the result, and proceed?

I agree with that much. The one-case gap does not make 415 entries disappear. If the missing outcome were PASS, the fraction over all 416 manifest cases would be about 70.0%; if FAIL, about 69.7%. Those are illustrations, not observations. Either way, the possible numerical movement is small.

What the objection misses is that the missing case & the disposition mix are different questions. The hypothetical last verdict would affect the numerator or denominator by one entry. It would not change the fact that the existing total combines scored, rejected & unscored dispositions, or that its two guarantee groups cover different environments. Closing the manifest would answer a completion question; it would not automatically make the resulting fraction a behavioral measurement.

Nor does the small gap establish that the omission can be ignored for every purpose. The report identifies a total-token limit, but it does not establish why this specific cell lacks an outcome or whether its absence is independent of the outcome it might have received. There is no need to invent a reason in either direction. The right conclusion is narrower: the aggregate effect of one missing verdict is bounded, while the verdict & the case-specific circumstances remain unknown.

The opposite objection is also possible: because the campaign is incomplete and the source provenance is limited, none of the data should be used. That discards too much. The archive supports statements about its recorded rows. It tells us, for example, that all 62 rejected rows say behavioral evaluation was not reached, and it shows where the final verdicts are concentrated. Those are substantive facts about the attempt, even though they do not settle general model performance.

## What completion would add

A finished account would resolve the manifest gap with an outcome, or document a decision to exclude the case and explain how that changes the scope. It would also keep verdicts & dispositions separate in any retally, and clarify the relation between the blanket status field and the more granular disposition field. Verification of the executed code against an identified source state would support stronger claims about what the checks enforced.

Those are requests for additional evidence, not corrections that prose can supply. A later execution would have its own conditions and would need to be reported as such. It would not retroactively make this snapshot a complete run.

For now, a concise summary is possible: this paused campaign recorded 290 PASS among 415 completed entries out of a 416-case manifest. Its rows include 335 scored, 62 rejected and 18 unscored dispositions; the two recorded guarantee groups use disjoint environment pools. One manifest outcome is absent, and a separate set of exclusions has no recorded scores.

That summary is less compressed than “69.9% performance.” It is also more useful. It preserves what happened without pretending that a missing outcome, a rejected submission and a scored behavioral comparison are the same kind of thing.

A paused campaign is not a finished evaluation. It can still be evidence. The task is to report the finished entries for what they record, keep the absent case open, and let the denominator carry its real composition rather than a stronger claim.