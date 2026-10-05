---
title: "A Category-Theory Label Is Not a Category-Theory Measurement"
date: 2026-10-03
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>This post examines whether the category-theory track's labels match the checks behind its results, while keeping its different specification gaps separate.</dd>
  <dt>Synthesis</dt>
  <dd>This post brings together a frozen campaign archive, a static scan of a clean-source comparator, and a line-level implementation audit.</dd>
  <dt>Prose</dt>
  <dd>Compiler-authored reconciliation of two separately labeled candidate drafts, checked against the archived evidence & source audit. No new campaign run was performed.</dd>
  <dt>Certainty</dt>
  <dd>High for recorded counts and the inspected source files. More limited for claims about the executed code: the campaign recorded a dirty repository, & the clean source is only a comparator.</dd>
  <dt>Importance</dt>
  <dd>Practical: a reminder to read the check that produced a verdict before treating a task name as a capability measurement.</dd>
</dl>

[`rl_eval_generator`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5) is an environment generator, not a benchmark. One campaign analysis row groups generated code-repair environments under [`category_theoretic_compositional`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo), a label that invites a story about [compositions](https://en.wikipedia.org/wiki/Function_composition), [functors](https://en.wikipedia.org/wiki/Functoriality), perhaps a law checked through [commutative diagrams](https://en.wikipedia.org/wiki/Commutative_diagram). But labels do not touch submitted code; judges do. If an environment name suggests a mathematical property and its visible tests or judge check something narrower, the name cannot make the result stronger.

The relevant question is which side of that gap this track occupies. The answer is not uniform. In a few inspected tasks, the prompt, tests, and judge disagree in different ways; elsewhere the main problem is that an advertised configuration axis has no direct reference in the clean templates. The archive records real code-repair outcomes, but it does not turn them into one measurement of category-theoretic ability.

There is an important source boundary. The archive records the source tree as dirty. The selected configuration hashes match a clean snapshot, but that does not prove that every task file, visible test, judge, or helper in the execution workspaces matched it byte for byte. The source-level observations below are about that comparator, not a guarantee about every executed environment. The archive also has one selected seed per case and no within-cell reruns. A row in each nominal condition is not a replicated response curve.

## The headline has two kinds of pass

The category-theory track contains 85 recorded rows. One [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/sheaf/sheaf_physical_constraints) row has a final note attributing its terminal failure to a provider transient after bounded retries. I exclude it from the performance denominator, but retain it as a recorded failure in the raw archive.

| Row set | Rows | What it includes |
|---|---:|---|
| Raw archive | 85 | Includes the provider-transient failure |
| Performance-eligible set | 84 | 57 passes and 27 failures |

That count mixes two different judging guarantees:

| Judge mode | Eligible cases | Pass | Fail | What a pass establishes |
|---|---:|---:|---:|---|
| `behavioral_reference` | 5 | 4 | 1 | The output was checked against a reference behavior |
| `compile_only` | 79 | 53 | 26 | The submission built and cleared the available checks; the campaign calls this exploratory |

### The cases behind the counts

The radar summarizes eligible pass shares by environment. It is a within-track map, not a common scale across unlike tasks. The heatmap restores all 85 recorded cases, including their judge modes, terminal labels, and the provider-transient row excluded from the performance denominator. Each heatmap cell is one selected seed, not a replicate.

![Radar chart of performance-eligible pass shares across the category-theoretic and compositional environments; each spoke is one environment, so the values are descriptive within this track.]({{ '/assets/figures/family-maps/category-radar.svg' | relative_url }})

![Case heatmap of the category-theoretic and compositional track, showing each environment, judge mode, outcome, terminal label, and the provider-transient exclusion among all 85 raw rows.]({{ '/assets/figures/family-maps/category-heatmap.svg' | relative_url }})

All five behavioral-reference cases are in [`categorical_lenses`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/categorical_lenses). The other 79 are compile-only. The campaign report explicitly treats compile-only outcomes as exploratory, not as a validated behavioral aggregate. So 57 of 84 is not a category-theory score: it is a count across different tasks and different guarantees, most of them preliminary.

The one-seed design puts another limit on the number. Even if a set of easy, medium, and hard cells appears to trace a curve, there is no within-cell replication here from which to estimate variation. & because the axes refer to different things in different tasks, their labels do not put those cells on one calibrated difficulty scale.

## Associativity named; shape checked

In the clean comparator, [`compositional_optimizer`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/compositional_optimizer) promises strict associativity under nested composition, with numerical correctness carried across multiple training steps. [Associativity](https://en.wikipedia.org/wiki/Associative_property) means that changing parentheses does not change the result:

$$(f \circ g) \circ h = f \circ (g \circ h)$$

The judge in the comparator checks output shape and a state-isolation chain for two modules. Its visible test checks shape after a single step. Those checks can catch useful implementation errors, but they do not compare both groupings of three composed operations over multiple updates. A submission could therefore pass the inspected checks without establishing the property the prompt names.

This is not a claim that the executed task definitely used that exact judge: the dirty-repository record leaves that unresolved. It is a precise statement about what the clean comparator checks. Under that comparator, a pass is evidence about shape and state isolation, not a test of multi-step associativity.

## A lens law is not the whole lens contract

[`categorical_lenses`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/categorical_lenses) is the only environment in this track with behavioral-reference judging. Its prompt describes a lens whose view is coordinate zero. In the comparator, the hidden judge checks the three lens laws—get-put, put-get, and put-put—but does not itself assert that coordinate-zero convention. A visible test does assert it. The intended behavior is therefore split across the prompt, visible test, and hidden judge; the hidden judge alone does not encode the whole specification.

The five recorded outcomes are four passes & one failure, and the failure mode changes how to read them. Its final note records a syntax error: the submitted file had an unindented block after a function definition. That tells us the code did not pass source validation. It does not tell us that the model failed to understand lenses. Nor do the four passes, by themselves, show broad command of lens theory; they show success under this environment's stated checks.

The same comparator also declares a `STRICT_LAWS` axis, but that setting has no direct reference in the inspected environment templates. The judge checks all three laws regardless. That is a second question, distinct from the partial mismatch between the prompt & judge: did the advertised setting fuckingly change anything the agent or judge could see?

## Zero out of four is four different records

The comparator's [`sheaf_physical_constraints`](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/cat_theo/sheaf/sheaf_physical_constraints) task asks for capacity-safe routing. Its hidden judge enforces a 5:3 ratio on a fixed high-demand vector; the prompt does not state that ratio, and the visible test checks output keys and shape rather than the ratio. A model can miss an unstated numerical target without that result being a clean test of sheaf reasoning. Conversely, a pass says that this implementation's checks were met, not that a general mathematical concept was mastered.

The four eligible rows all fail, but not in the same way:

| `naming` / `symptom_mask` | Recorded mode | What the record shows |
|---|---|---|
| easy / hard | `underfit` | The code ran and earned partial credit, below the hidden target |
| medium / easy | `underfit` | The code ran and earned partial credit, below the hidden target |
| easy / medium | `patch_invalid` | The patch file was empty |
| hard / easy | `invalid_action` | The harness could not parse a valid JSON action |

The fifth recorded cell is the provider-transient case excluded from the performance denominator. Among the four eligible failures, only the two underfit rows reached the judge and earned partial scores. An empty patch is a submission event; an unparseable action is a format or harness event. The task prompt also omits a judge-side numerical constraint. Calling all four outcomes “the model failed at sheaves” would erase distinctions the records fuckingly preserve.

These three examples are not instances of one generic defect. The optimizer prompt names a property its inspected judge does not test. The lens environment distributes parts of its specification across visible and hidden checks. The sheaf prompt leaves a numerical target unstated in the comparator. Those gaps call for different fixes: a better judge, a clearer prompt, and a better submission interface.

## Some advertised axes have no direct reference

There is a configuration issue underneath the task-level mismatches. `compositional_optimizer` advertises `MODEL_CLASS` and `LR_VAL` as variables, but the inspected starter, visible test, and judge use `MomentumStep` directly; those two configuration variables have no direct reference in the clean environment templates. The five archived outcomes—three passes and two failures—cannot, on that source snapshot, be read as a response to optimizer-class or learning-rate changes.

A static scan finds ten advertised control or variable axes with no direct reference across nine category-track environments. `STRICT_LAWS` in `categorical_lenses` is one example. This is a finding about the comparator's templates, not proof that the execution workspaces were identical: the dirty-repository record prevents that conclusion, and a static scan does not execute task generation or compare every rendered bundle. The careful claim is that those settings have no direct reference in the inspected files, so the comparator does not show how they could change the task or its grading.

This limits the experimental interpretation. A nominal level change is not necessarily an intervention. If the setting does not reach anything visible to the agent or the judge, its easy-to-hard contrast cannot support a claim about sensitivity to that variable. With only one selected seed per cell, the observed pattern cannot show whether a real intervention would change the outcome.

## Failure labels are not explanations

The same caution applies to the campaign's `failure_mode` column. Across the full 192-case eligible campaign set—not just this category track—the archive records 61 failures: 24 `patch_invalid` cases, all empty patches; 20 `underfit`; 10 `source_invalid`; 3 `runtime_error`; 2 `invalid_action`; and 2 labeled `overfit_visible_tests`.

The last two carry trusted scores of 1.0 and notes about missing required companion files. That does not fit the ordinary reading of “overfit the visible tests.” It is a reason to treat the label as a campaign-and-judge tag, not a validated account of what went wrong inside a model. The other categories also describe different stages: an empty patch never presents code to grade; a source-validation rejection stops before execution; a runtime failure occurs later; an underfit score records code that ran but did not meet the judged target. These are not interchangeable observations about mathematical understanding.

This does not make the archive useless. It makes the raw outcome more informative when the event leading to it is kept attached. The empty patches and syntax errors can guide work on the submission and validation pipeline. The partial scores point to behavior under a particular target. A behavioral-reference pass carries a different guarantee from a compile-only pass. None should be flattened into a single story about capability.

## What would make the name earn its keep?

Formal properties can be tested through code. Associativity, lens laws, and consistency constraints are all candidates for executable checks. An evaluation intended to test a formal property needs an explicit contract between five pieces: the mathematical property, the prompt, the visible tests, the hidden judge, and the reference implementation. For each task, the authors should say exactly what property is under test, include counterexamples and valid alternatives, and check that an independent oracle distinguishes implementations that satisfy the property from plausible code that merely compiles.

The configuration needs its own contract. A build-time check could require every advertised axis to alter at least one agent-visible or judge-visible artifact. If it changes none, the build should fail rather than silently count that setting as a new condition. And if the question is about robustness or difficulty, the design needs repeated cases and a calibrated comparison—not one selected seed per level across tasks with different semantics.

This is not a novelty claim. [HELM](https://arxiv.org/abs/2211.09110) is a precedent for evaluating across scenarios and metrics; [VarBench](https://aclanthology.org/2024.findings-emnlp.946/) is relevant to dynamic variable perturbation. Neither validates this campaign. Their relevance is methodological: a test suite should make clear what it varies and what it measures.

The narrow result is still useful. On these selected code-repair tasks, under the recorded mix of judges and checks, <span class="icon-atria">Atria Dawn Preview</span> produced a mixed set of passing and failing submissions. The archive points to concrete work: align prompts with judges, make advertised controls observable, keep source identity auditable, and separate submission failures from behavioral misses.

It does not establish a general category-theory score or a broad compositional-reasoning capability. It also does not show that the model cannot understand those ideas. A check that never compares the two sides of an associativity law cannot support either conclusion about that law. An environment label is a hypothesis about what its prompts and checks measure; the source and recorded results determine whether that hypothesis held up.
