---
title: "Thirty-Four Characters Out of Thirty-Two"
date: 2026-10-03
layout: post
---

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>A local contrast between regex results under different task labels, and a close look at what one run can and cannot tell us about it.</dd>
  <dt>Synthesis</dt>
  <dd>Recorded outcomes from six code tasks, the checks used to grade them, and a comparison with a clean source snapshot.</dd>
  <dt>Prose</dt>
  <dd>This essay organizes the saved sweep results and analysis. No additional cases were run.</dd>
  <dt>Certainty</dt>
  <dd>High for the recorded outcomes and notes. Lower for details inferred from the clean source snapshot, because the campaign's working files were not all recorded as clean.</dd>
  <dt>Importance</dt>
  <dd>A useful local example of how benchmark labels and task design affect interpretation; not a general capability ranking or a measure of reasoning ability.</dd>
</dl>

A small code task received a 32-character string. One submitted program returned a 34-character string; another returned a 66-character string. The evaluator marked both as failures because the output length did not match the input.

The immediate story is tempting: perhaps the familiar-looking version invited the right code pattern, while the altered labels did not. These numbers come from a code-repair campaign: an AI system was given variations of small programming tasks, and a saved results table records the verdict and score for each selected setup. I will call that run-through the sweep. In it, the easy-surface version passed at three input lengths, while two versions with altered surface labels failed at the shortest one. The table gives me an unusual pattern, not its cause.

The task belongs to a family described as [“weird-machine” tests](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine) in the clean source comparison. Here that phrase is a name for code challenges where the wording or labels may not make the underlying operation obvious. “Surface” means those names and hints. The task's “hidden depth” setting changes input size; in the regex challenge, it is the length of a string. Neither label measures ability. They describe how the test was configured.

## Five settings, and a sharp contrast

The regex task asks for a regular expression—a pattern for finding and transforming text—to perform one update of a simple cellular-automaton rule, which changes a line of cells according to a fixed pattern. The table shows five selected settings, each pairing a task label with an input length. “Score” is copied from the saved results; the checker note is the more direct explanation of the two failures.

| Surface label | Input length | Result | Recorded score | Checker note |
|---|---:|---|---:|---|
| easy | 32 | PASS | 1.0 | — |
| easy | 128 | PASS | 1.0 | — |
| easy | 512 | PASS | 1.0 | — |
| medium | 32 | FAIL | 0.208333 | Length mismatch: input 32, output 34 |
| hard | 32 | FAIL | 0.208333 | Length mismatch: input 32, output 66 |

The graph below compares input and output lengths; its inset enlarges the three settings at input length 32. It shows the mismatches, not their cause.

![Scatterplot of regex input length versus output length, with an inset for length 32. Easy-surface results match at 32, 128, and 512; at input 32, the medium output is 34 and the hard output is 66.]({{ '/assets/figures/family-maps/post05-regex-length-comparison.svg' | relative_url }})

A PASS means the submitted code satisfied this task's recorded checks. It does not show that the program works for every possible input or that the update would continue to work after any number of repetitions. In the clean source copy I inspected, the judge—a checker that compares a solution with task-specific expected behavior—looks for a regex-based solution rather than explicit character-by-character loops, a known example, preservation of string length, and exact output on a small set of prepared input strings. The judge's record is not a proof that every possible input was checked. This is a bounded test of one operation. It does not show Turing-complete computation—the ability to carry out arbitrary computations through repetition.

The easy-surface row passed at lengths 32, 128, and 512. That is worth reporting, but there is one selected seed per setting: seed 0, the fixed value used to set the run's random choices. Each setting was run once; there are no repeats to show whether those passes would recur. An identical rerun could help reveal ordinary run-to-run variation, while more than one input at each size could show whether a result depends on a particular string. This archive contains neither comparison. Three checked examples do not establish that the approach is reliable for strings of any size. The two failures at length 32 do not tell us why their outputs grew.

## What changed with the labels?

At the shortest input length, the surface label changes from easy to medium or hard. In the clean source copy, those labels also select different class names. The hard version adds a comment about implementation performance. The comparison therefore does not change one isolated clue: the name changes, and in the hard case the instruction gains another hint.

A name can matter without changing the computation. A familiar class name might suggest a code pattern; an unfamiliar one might not. But an additional performance hint changes the prompt itself. If the two altered versions fail, the archive cannot separate those possibilities from each other—or from ordinary run-to-run variation. There is only one run for each setting.

One hypothesis is that a changed name, or the extra hard-level hint, mattered more in these two cases than the length of the input string. That is plausible, but not tested. It would be a mistake to infer a cause from the 34- and 66-character outputs. The saved notes record the lengths, not how they came about.

I also need to be precise about the comparison copy. The campaign archive marks the source repository as dirty: some working files had changes not captured by the saved code version. All 33 selected task-configuration files match a clean source snapshot, but that does not prove that every prompt, task file, test, or checker used in the campaign was identical to the snapshot. When I describe the names and extra hint, I am describing the clean copy used for comparison—not a verified record of every file that ran.

## Five failures are not five behavioral mistakes

The sweep covers six small code tasks: a [regex update](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine/regex_state_machine); a [CSS selector](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine/css_state_machine) (CSS is used to style web pages) that checks whether a count of bits is even or odd; an [SQL fixed-point chain](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine/sql_fixed_point) (SQL is used to request information from databases); a [spreadsheet calculation](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine/spreadsheet_dataflow); a [dependency graph for a build-and-test workflow](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine/ci_dependency_graph); and a [small program that interprets template instructions](https://github.com/StrangeTcy/rl_eval_generator/tree/d7357092493f311f649a0742889b301d796911b5/envs/weird_machine/template_interpreter). A fixed point is a result that stops changing when a rule is applied again; a spreadsheet dataflow task checks how values pass through cells; a dependency graph checks which build steps must come before others. These are different programs, not six versions of the same puzzle. There are five selected cases in each task, for 30 in total. All 30 were graded against task-specific expected behavior, rather than by a build-only check. Twenty-five passed and five failed.

That total mixes different programs and different checks. The five failures show why a PASS/FAIL column is not a diagnosis. Two are the regex length mismatches above. A CSS case received a partial score of 0.416667 at three bits. Another CSS case was rejected before its behavior was tested because the submitted code imported a library the source checker disallowed. The SQL task's middle chain-length case was also rejected before behavior was tested: its code had an unterminated triple-quoted string.

Those last two are source-check failures. A source checker is a gate that reads proposed code before running it; it can reject a syntax error or an import that is not allowed. These records say the submitted text did not get through that gate. They do not show whether valid CSS and SQL solutions would have passed their behavior checks. The saved results also do not settle how clearly the import restriction was stated. By contrast, the regex and partial-credit CSS cases did reach task-specific behavior checks and fell short there. This distinction matters: otherwise a summary number quietly treats malformed code and wrong behavior as the same kind of evidence.

The task totals are uneven. The spreadsheet, build-dependency, and template tasks each passed all five selected cases; SQL passed four, while CSS and regex passed three each. Those counts describe this sweep. They do not establish stable strengths or weaknesses across spreadsheet and regex tasks. The code, checks, and inputs differ from one task to the next.

The bars make the tally easy to scan, while keeping the six task results separate. They are counts for different programs and checks, not a shared difficulty score.

![Horizontal bars show pass and fail counts for the six tasks: five of five in the build-dependency, spreadsheet, and template tasks; four of five in SQL; and three of five in CSS and regex. Each row is a different program and checker.]({{ '/assets/figures/family-maps/post05-task-outcomes.svg' | relative_url }})

“Task-specific expected behavior” is stronger than checking only that code loads, but it is still bounded by what each judge tests. A judge can miss behaviors its authors did not include. The label tells me the kind of evidence used; it does not make six different test suites equivalent or exhaustive.

## “Depth” is not one ruler

The label “hidden depth” sounds like a common scale from easy to hard. It is not. In the regex task it changes a string's length. In CSS it changes how many bits feed a parity selector. In SQL it changes the length of a chain. In the spreadsheet task it changes the grid size. A string with 512 characters, five bits, a 25-step chain, and a larger spreadsheet are not equivalent units of work.

The outcomes are not even monotone within each task—that is, they do not steadily improve or worsen as the task's size setting increases. The regex easy-surface cases pass at all three string lengths. In CSS, the easy-surface results go from a partial behavioral score at three bits, to a source-check rejection at four, to a pass at five. The surface-label comparison at three bits goes the other way from regex: easy fails while medium and hard pass. SQL passes at chain lengths six and 25, but its case at 12 is rejected for a syntax problem. These are small, local patterns with different failure stages, not points on a shared difficulty curve.

The 25/30 total is a simple count: 25 of the 30 selected cases passed their own checks. But pooling them does not create a single test of “hidden depth.” The cases ask different things, change different quantities, and use different task-specific judges. A larger input may be more work in one program and a different kind of work in another. The campaign did not calibrate the tasks onto a common easy-to-hard scale.

## A pilot can suggest the next test

The design problem is tractable. First, separate the two surface changes: keep the class name fixed while varying the performance hint, then vary the name while keeping the hint fixed. That would make it possible to tell which prompt feature is associated with a different outcome, rather than changing both together.

Then create multiple equivalent versions at each input length, randomize their order, and run each setting with several random seeds. Repeating a single prompt would help measure run-to-run variation; using equivalent instances would also show whether a result depends on one particular string or setup. The saved results have neither kind of repetition, so I cannot estimate how stable this five-setting pattern is.

Before running a new version, compare what the system will actually receive: the rendered prompt, starter code, visible tests, and the checker. If a setting called “depth” changes none of those in a meaningful way, it should not be counted as a distinct experimental change. During scoring, record separate stages: whether a code change was produced, whether its source passed basic checks, whether it ran, and whether its behavior matched the task. That would preserve the distinction between a gate failure and a behavioral failure.

Prior work gives useful context, not validation of this sweep. [VarBench](https://aclanthology.org/2024.findings-emnlp.946/) varies task variables and samples five random seeds in its variable-based experiments. [HELM](https://arxiv.org/abs/2211.09110) covers evaluations across 42 scenarios and multiple measures. Those projects are precedents for perturbing conditions and broadening evaluation; they do not verify the source files or explain the outputs in this campaign. I am not claiming that the local pattern is a new evaluation principle.

The useful result here is smaller. In one recorded sweep, the easy-surface regex version passed the three tested lengths, while the medium- and hard-surface versions failed at length 32 with outputs that were too long. The hard prompt and class names changed along with the surface label, and each setting was run once. I can say what happened in those cases and what a better comparison should separate. I cannot say that changing a label caused a failure, that input length did not matter, or that the 25/30 total measures a general ability to recognize a computational machine.