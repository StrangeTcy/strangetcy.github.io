---
title: "Mercury & Atria: Reasoning, Repairs & Broken Programs"
date: 2026-11-11
layout: post
description: "A qualitative tour of ML repair, computational substrates, and finite epistemic reasoning."
---

{% include mathjax.html %}

{% raw %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original question</dt>
  <dd>Which mathematical and programming demands can these models meet, where do they fail, & what experiments would explain the differences?</dd>
  <dt>Synthesis</dt>
  <dd>Qualitative analysis of archived prompts, observed starter code, final patches & judge diagnostics. Three campaign cohorts are tabulated; two form the primary comparison.</dd>
  <dt>Prose</dt>
  <dd>Model-assisted drafting & revision (primarily the <span class="icon-openai">GPT family</span>). No completed human final edit is represented here.</dd>
  <dt>Certainty</dt>
  <dd>Recomputed recorded counts; source-backed diagnoses of specific submissions; provisional explanations of broader patterns. No new model campaign or repaired-environment rerun is included.</dd>
</dl>

**Mercury is a useful implementer of explicit recurrences, formula graphs and local code repairs in this archive. Reasoning Atria is stronger at differentiable per-row halting. Both demonstrate small finite epistemic reasoning. Their failures often occur after they have chosen a sensible mathematical construction, while translating it into executable code.**

Those judgments come from different evidence. Mercury’s recursive SQL query fails once because a column name is ambiguous, despite containing the needed fixed-point construction. Atria repeatedly writes a regex lookahead as though replacing a zero-width match consumed the original text. In MoCo, Atria can put temperature in the correct formula and simultaneously remove the queue snapshot that backpropagation requires. In public-announcement games, both models update the world set and then the knowledge partitions correctly. These are specific strengths and weaknesses we can use to design the next tasks.

This is the companion to [the category/compositional analysis](https://strangetcy.github.io/2026/11/11/what-mercury-and-atria-can-do-with-compositional-mathematics.html). It covers every remaining environment with primary-campaign records, and explains why RoPE has no scored result. The aim is an assessment of the models’ work, with each judgment tied to a submitted construction or a concrete failure.

## The campaign & the unit of evidence

The primary comparison is <span class="icon-mercury">Mercury-2.5</span> against <span class="icon-atria">Atria-Dawn-Preview</span> with high reasoning effort, called **reasoning Atria** below. Ordinary Atria means the earlier run of the same named model with reasoning disabled. Its smaller cohort and different configuration revisions make it historical context, not a controlled experiment on the reasoning switch.

Across the complete archives, Mercury has 416 recorded cases: 277 PASS, 128 FAIL and 11 infrastructure-unscored. Reasoning Atria has 415: 290 PASS and 125 FAIL. The campaigns share 415 case IDs and configuration hashes; one Atria trajectory case is missing. Among the 404 paired cases with verdicts on both sides, 239 pass for both, 38 only for Mercury, 41 only for Atria, and 86 for neither. That near tie in exclusive successes coexists with large differences on particular mechanisms. The archived worktrees were dirty and used different base commits, so equal configuration hashes do not certify byte-identical executed code.

**A correction to the earlier posts:** the archive label `compile_only` describes reference calibration. It means no behavioral reference was certified for that exact generated instance. It does **not** mean that the submitted program was merely compiled: many such judges run algebraic, behavioral or numerical tests. Those observed tests are evidence, and this analysis uses them. Treating their PASSes as mere syntax checks understates what was demonstrated.

A final program, a correct mathematical explanation and a valid tool submission are different achievements. I separate them where the traces permit it. A model can deliver a correct algorithm with a syntax error, a runnable program with the wrong operation, or a correct final answer with a false proof. The end-to-end score remains useful as a reliability measure, but it does not identify which of those things happened.

![Selected recorded outcomes across ML repair, regex, CSS and finite epistemic tasks.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/selected-outcomes.svg)

*This is a descriptive scorecard, not a corrected ranking. Partial success, protocol failures and judge defects are resolved case by case below.*

## ML & execution inventory

| Environment | Mercury recorded passes / scored cases | Reasoning Atria | What is being repaired |
|---|---:|---:|---|
| batchnorm_ema | 2/15 | 3/15 | BatchNorm running statistics under gradient accumulation and eval behavior |
| glyph | 0/24 | 0/24 | Train a shape-composition classifier robust to spatial variation |
| moco | 36/55 | 30/55 | Contrastive temperature, queue wraparound, and sometimes EMA updates |
| rd_adaptive_halting | 8/14, plus one unscored | 14/15 | Different recurrence counts within one batch |
| rd_gradient_credit | 15/15 | 15/15 | Preserve the gradient graph through tied recurrent transitions |
| rd_state_carry | 15/15 | 15/15 | Feed the preceding recurrent state into the next transition |
| ts_parse_only | 4/4 recorded | 1/4 | Extract the third relay rule's payload operation |
| ts_one_step | 0/4 | 0/4 | Parse a small DSL and execute one transition |
| ts_trajectory | 0/4 | 0/3 recorded | Execute the parsed relay for specified horizons |
| rope | No scored cases | No scored cases | Paper/code alignment, absolute offsets, cache state |


MoCo has 15 base rows and 40 intervention rows per primary campaign; Mercury passes 11/15 and 25/40, Atria 9/15 and 21/40. Glyph has 12 base and 12 intervention rows per model. These are variants of a small set of designs. Mercury’s parse-only 4/4 includes one recorded PASS marked performance-ineligible after a provider outage; the eligible subset is 3/3. One reasoning-Atria trajectory case is absent.

## MoCo: algebra, queue state & autograd

![Correct inverse-temperature scaling and an accepted inverse-square alternative differ despite both being temperature-sensitive.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/moco-temperature.svg)

*The curves normalize both laws at τ₀. Changing with temperature is insufficient: the logits must obey the intended inverse-temperature law.*

The domain demand is concrete. Unit-normalize query and key representations; compute positive and negative similarities; divide the resulting logits by temperature. Maintain the circular queue when a batch crosses its end. Where the symptom manipulation corrupts the momentum update, restore the positive EMA update as well. Those requirements combine algebra, data-structure bookkeeping, and autograd mutation discipline.

The all-easy case is `moco__naming=easy_distractors=easy_queue_math=easy_temperature=easy_visible_tests=easy_symptom_mask=easy__seed-0`. Mercury removes temperature from both normalization inputs, divides returned logits by tau, and splits queue writes across the boundary. The submission passes, with held-out probe accuracy 1.0. This is a faithful implementation of the intended local changes.

Reasoning Atria's same case also unit-normalizes the representations and divides each positive/negative similarity by tau. Its own added prose correctly explains that the logits should be scaled after normalization. However, it also replaces the queue's detached clone with the queue itself in the negative-similarity computation. The following enqueue mutates a tensor retained for backward. `final.json` records a tensor version mismatch and `training_failed`. Thus the negative conclusion is about preserving the computation graph while changing stateful ML code, not failure to know where temperature belongs.

That is not an isolated final-note pattern: ten of reasoning Atria's eleven MoCo training failures mention tensors modified in place. The remaining training failure says the loss has no gradient function. Nine other MoCo cases have empty patches; one fails source validation; one fails action parsing. These delivery and execution failures account for most of the 25 nonpasses. The inspected all-easy patch establishes the concrete clone-removal mechanism in one case; the matching error text alone does not establish that exact edit in all ten.

Mercury's failures are more often incomplete fixes that run. Sixteen are labeled `overfit_visible_tests`: thirteen mention temperature cancellation only, two queue wraparound only, and one both. In the all-hard case, Mercury fixes the corrupt subtractive momentum update and the queue boundary, but leaves the hidden-helper temperature cancellation intact. Atria's all-hard patch repairs only the queue. Both final results mention `temperature_cancelled`; Mercury still has held-out feature-probe accuracy 1.0. Usable features on this synthetic downstream task are consequently insufficient evidence that the contrastive construction was repaired.

The all-hard identifier is `moco__naming=hard_distractors=hard_queue_math=hard_temperature=hard_visible_tests=hard_symptom_mask=hard__seed-0`. A discriminating companion is `moco__naming=easy_distractors=hard_queue_math=easy_temperature=hard_visible_tests=easy_symptom_mask=hard__seed-0`. Mercury fixes the queue but not the temperature and fails. Atria changes the helper from normalization of x/tau to normalization of x followed by division by tau, and passes.

The latter PASS is not full mathematical correctness. The helper is applied to both q and k, so the positive dot product scales as 1/tau² instead of 1/tau. Enqueued keys cease to have unit norm. The current judge's temperature probe asks only whether doubling tau changes logits, and accepts this response. Mercury has the same wrong-scaling construction in its PASS at `moco__naming=hard_distractors=hard_queue_math=easy_temperature=easy_visible_tests=medium_symptom_mask=medium__seed-0`. These are two specific examples, not a count of all incorrectly accepted MoCo submissions.

The best qualitative assessment is: **Mercury is relatively effective at local contrastive-learning repair in this scaffold; Atria's mathematical diagnosis can be good while its edits are operationally fragile. Neither model's PASS tally certifies correct MoCo temperature geometry.** A useful next experiment holds code semantics fixed, removes solution comments, compares explicit formulas against renamed helper implementations, and checks the exact inverse-temperature law alongside gradients and queue state.

## BatchNorm: few recorded passes conceal successful narrow repairs

The intended problem couples repeated forward passes under gradient accumulation to BatchNorm's running-statistic EMA, then requires stable inference behavior. A reasonable repair can change per-microbatch momentum, change the update schedule, or recalibrate running statistics. A successful downstream classifier alone does not identify which explanation the model used, so the patch and the BN diagnostics should be read together.

In the all-easy case, Mercury scales each BN module's momentum by the accumulation count in `train.py`. The archived evaluation reports accuracy 1.0, ten predicted classes, frozen eval BN buffers, batch-independent predictions, and sensible running statistics. Nevertheless the verdict is FAIL with score 0.95, solely because the patch does not touch `model.py`. The current judge still mandates edits to both `model.py` and `train.py`. This is an acceptance constraint, not evidence of failed BatchNorm understanding.

Case: `batchnorm_ema__optimizer_hint=easy_red_herring=easy_visible_tests=easy_data_complexity=easy_symptom_mask=easy__seed-0`. Atria's same case performs the momentum change in model construction and updates the trainer import, but also introduces a large accidental indentation before an unrelated synthetic-data assignment. Source validation rejects it. The intended BN change is visible; no executable model result is established.

At `batchnorm_ema__optimizer_hint=easy_red_herring=easy_visible_tests=hard_data_complexity=hard_symptom_mask=medium__seed-0`, Mercury again changes only the trainer, reaches accuracy 0.984, and fails the file-touch requirement. Atria adds an explicit BN configuration helper and post-training running-statistic recalibration, touches both required files, reaches 0.9905, and passes. Its patch engages with the intended statistical mechanism, although this one result does not separate the contributions of the two repairs.

At `batchnorm_ema__optimizer_hint=hard_red_herring=hard_visible_tests=medium_data_complexity=medium_symptom_mask=easy__seed-0`, Mercury instead changes the model/trainer interface so only the final microbatch updates running statistics, and passes at accuracy 1.0. Atria's final patch is empty. That is stronger evidence for Mercury's ability to implement an alternative BN update strategy than the 2/15 summary suggests.

Mercury's 13 nonpasses comprise eleven `overfit_visible_tests`, one action error, and one training failure. Reasoning Atria's twelve comprise ten empty-patch validation failures, one source error, and one `overfit_visible_tests`. The resulting 2/15 versus 3/15 comparison gives almost no useful ordering of BN skill without examining these stages.

A further mathematical nuance: scaling m by 1/n approximates the per-step EMA decay correction; the exact equal-decay coefficient is 1-(1-m)^(1/n). With m=0.1 and n=4, the suggested 0.025 produces effective momentum about 0.09631, while exact matching requires about 0.02600. This distinction concerns the mathematical description of the repair, not a claim that the approximate solution is unusable.

## Glyph: unsuccessful end-to-end training, with one substantial Atria partial success

The intended domain is recognizing shape types/counts despite changing spatial placement, with model-head and optimization traps and, in some cells, distracting augmentation defects. The easy starter asks whether flattening is appropriate for a permutation-invariant problem. Thus an edit from a spatially indexed classifier head to pooling is an explicitly cued architecture repair rather than independent discovery of an invariant representation.

Mercury's all-easy patch adds adaptive average pooling, changes the dense layer to accept pooled channels, raises the SGD learning rate from 1e-5 to 1e-2, and makes sample generation deterministic by index. The downstream result predicts a single class: accuracy 0.103, entropy zero. This supports “attempted the intended invariance/optimization repair but failed to train a useful classifier,” not “did not identify invariance.” Atria supplies an empty patch in this case.

Case: `glyph__architecture=easy_optimizer=easy_red_herring=easy_visible_tests=easy_data_clue=easy_symptom_mask=easy__seed-0`.

The matched case `glyph__architecture=hard_optimizer=medium_red_herring=hard_visible_tests=medium_data_clue=hard_symptom_mask=medium__seed-0` is more informative. Both models repair the inversion probability, which is initialized to 1.1, and change the training setup. Mercury raises SGD learning rate and reaches 0.24 accuracy, eight predicted classes, and spatial agreement 0.588442. Atria uses Adam, reduces augmentation strength, seeds training, and reaches 0.819 accuracy, all ten classes, entropy 2.284856, and spatial agreement 0.818687. It passes the optimization and prediction-consistency diagnostics, but remains below the 0.85 accuracy requirement. Its sole note is the missing `model.py` edit; the stage record separately reports behavioral failure. This is a substantial partial success, not a file-touch-only false negative.

Atria's 24 nonpasses contain 21 empty-patch validation failures and three `overfit_visible_tests`; Mercury's contain 22 `overfit_visible_tests`, one `underfit`, and one action error. There is more usable outcome evidence about Mercury's training attempts, while Atria's aggregate is dominated by delivery failures. The visible partial repair shows that a zero full-pass count conceals substantial variation in trained-model quality.

The current diagnostic called spatial invariance uses agreement with a class's modal prediction across independently generated images. Many factors vary across those images besides position. A constant classifier gets agreement 1.0; separate coverage/entropy checks prevent that trivial model from full credit. Interpret the number as prediction consistency within class, not a causal test that spatial invariance was learned.

## Recurrent depth: perfect local repairs, a useful halting split

State carry and gradient credit are unusually small repairs. In state carry, the starter explicitly says that the code ignores the previous transition's state and then feeds x into every transition. Both models' easy and hard submissions replace this with recurrent state propagation; Atria's hard submission uses x on the first step and state thereafter. Both achieve 15/15, with archived depth-one, configured-depth, hidden-depth, parameter-sharing, and batch-independence checks passing.

In gradient credit, the starter explicitly says that detaching destroys recurrent credit assignment. Both models remove the detach operation in the easy and hard examples. The archived tests check input and parameter gradients, finite gradients at larger depth, optimization improvement, and absence of duplicated depth-specific parameters; both achieve 15/15.

The result is real but narrow: **both models can implement explicitly diagnosed state threading and preserve recurrent gradient flow in this code scaffold.** It does not test whether the model independently recognizes when a problem needs recurrence, nor whether inference inside the model uses recurrence. Increasing the recurrence depth in a loop does not increase the number of conceptual choices in a one-token state-carry repair.

Adaptive halting is more revealing because the state update must be selective by batch row. In the all-hard case both models use a per-row active mask and a functional selection between candidate state and preserved state; both pass all five diagnostics. At the all-medium case, Mercury uses in-place assignment into `state`, initially aliased to the grad-requiring input. The archived exception says “a leaf Variable that requires grad is being used in an in-place operation.” Reasoning Atria uses `torch.where` and passes.

All five Mercury adaptive-halting runtime failures have that same exception. This is direct evidence of a recurring implementation weakness at the interaction of masking, aliasing, and autograd. It is more precise than “bad at recurrence.” Reasoning Atria passes 14/15 and is markedly more reliable on that conjunction.

One additional Mercury nonpass deserves a separate label. At `rd_adaptive_halting__recurrence_depth=medium_clue_clarity=hard_visible_tests=medium_implementation_obfuscation=hard_batching_complexity=easy__seed-0`, it clones the state, computes the transition on active rows, writes those rows to the clone, and passes four of five tests. Only `per_example_halting` fails. The current reference always computes the transition on the full batch and uses exact tensor equality. A different matrix-operation batch shape can change floating-point rounding despite mathematical equivalence. A tolerance-based rerun is needed before treating this 0.8 result as a semantic halting failure; no rerun was performed.

The one Atria adaptive-halting nonpass scores 0.6 at `rd_adaptive_halting__recurrence_depth=easy_clue_clarity=hard_visible_tests=easy_implementation_obfuscation=hard_batching_complexity=easy__seed-0`, failing per-example and off-by-one checks while passing permutation, cross-example, and gradient tests. The patch for this exception has not been diagnosed here, so the check names are not expanded into an invented mechanism.

## Trajectory semantics: parsing, state representation, and execution must be separated

These environments explicitly describe themselves as solver-writing/debugging tasks, separate from the direct-answer benchmark. They ask for a program that parses a three-template relay, applies identity/flip/constant payload operations, and either extracts a rule, executes one step, or advances to a horizon. Their results cannot directly establish the model's internal recurrent computation.

Mercury's four recorded parse-only passes include short, purpose-specific extractors. The broken/flat program finds the third template and extracts its RHS argument. The broken/reflective program reads the last emitted source. Those are effective on the provided corpus. The valid/reflective program hard-codes template C and otherwise defaults to “same”; because the relabeled valid case also expects “same,” that fallback passes. This specific PASS does not establish relabeling-robust parsing. Atria's successful broken/flat parser is more elaborate, but its valid/reflective submission has an unterminated quote and its broken/reflective patch is empty. More code did not reliably produce a better delivered parser.

Mercury's `ts_one_step__witness_status=broken_representation=flat__seed-0` supplies a concrete semantic-parser bug. It extracts the RHS argument with a trailing-parenthesis strip that removes every closing parenthesis. For C(flip(payload)), the argument becomes `flip(payload`; the code then tries to convert this malformed expression to an integer. The recorded exception quotes that string. Several other Mercury one-step submissions also parse nested calls with patterns that stop at the first closing parenthesis, or return string digits where the judge expects integer payloads. The shared zero full-pass score therefore includes ordinary parser/representation errors, not a demonstrated inability to apply a transition after correct parsing.

Reasoning Atria's `ts_one_step__witness_status=valid_representation=reflective__seed-0` passes six of seven checks: canonical, noisy, relabeled identity/flip, and canonical witness sibling all succeed. Only the relabeled witness sibling fails. Its patch returns the literal payload token “blue” from the emitted Kestrel(blue). The prompt, preserved in the archive's read_file observation, requests “using the labels appearing in the supplied specification,” saying only that payload is integer for canonical cases. Yet the judge maps red/blue to 0/1 and supplies integer starting payloads to relabeled cases. This is a confirmed task/evaluator contract mismatch, so the remaining failure is not clean evidence against the model.

Atria's `ts_trajectory__witness_status=broken_representation=flat__seed-0` similarly passes six of seven checks. It parses nested calls and uses cycle detection to skip repeated states. It passes canonical/noisy cases, the valid sibling and its relabeling, long matched horizons, and zero horizon. It fails relabeling of the broken witness by returning the literal constant “blue.” Here the prompt specifies `payload_int`, so converting payload labels to canonical values is a requirement the patch misses. The result is evidence of an almost-working transition interpreter with a representation-boundary error, not an inability to follow long trajectories.

Mercury's trajectory submissions mostly fail before a useful distinction between short- and long-horizon execution can be made. The inspected broken/flat patch tries to parse and iterate the transition system but receives only the identity-at-zero-horizon point. The valid/flat run has a runtime error. Atria's other recorded trajectory runs fail on a disallowed `json` import and a malformed write_file action. Those cannot be converted into long-horizon reasoning scores.

The current one-step judge also gives a “same result under format noise” point when both complete-case checks return false: it compares correctness booleans, not solver outputs. This can contribute to a 2/7 score alongside tuple shape while every complete semantic case fails. The generated evidence JSON preserves check dictionaries so the post can show this difference visually.

## RoPE: an unmeasured capability in these campaigns

Neither model has a scored RoPE case in the compared archives. For each campaign, the exclusion table lists five calibration-gated cases and ten omitted for unsupported provider input modality. It would be wrong to turn their omission into either success or failure at rotary position embeddings.

The current environment aims to test absolute offsets, cached-state position advancement and paper/code alignment. Its visible tooling contains a complete reference RoPE implementation, while comments name the missing offset and cache-advance defects. The present audit also finds that a pairing probe checks norm preservation, which does not by itself distinguish the intended pairing convention, and an advertised hidden offset is unused. Those are useful repairs before a new experiment; they are not retroactive observations about Mercury or Atria.

## Computational substrates & epistemic inventory

The next six programming environments give a computational rule and require it in an unusual substrate: workflow dependencies, CSS selectors, regex, spreadsheet formulas, SQL or templates. The epistemic environments then ask for answers in finite models whose semantics are explicitly supplied.

| Environment | Mercury | Reasoning Atria | Campaign guarantee |
|---|---:|---:|---|
| ci_dependency_graph | 9/9 PASS | 8/9 PASS | behavioral_reference |
| css_state_machine | 18/18 | 15/18 | behavioral_reference |
| regex_state_machine | 5/9 | 5/9 | behavioral_reference |
| spreadsheet_dataflow | 9/9 | 9/9 | behavioral_reference |
| sql_fixed_point | 8/9 | 9/9 | behavioral_reference |
| template_interpreter | 9/9 | 8/9 | behavioral_reference |
| epistemic_games | 23/23 | 23/23 | behavioral_reference |
| epistemic_announcements | 6/6 | 6/6 | compile_only |
| epistemic_fragmented_observation | 4/4 | 4/4 | compile_only |
| epistemic_nested_knowledge | 6/6 | 6/6 | compile_only |
| epistemic_silence | 6 infrastructure-unscored | 6/6 | compile_only |
| epistemic_type_games | 4 infrastructure-unscored | 3/4 | compile_only |


## CI dependency graphs: getting the graph right versus finishing the algorithm

The task is to emit each job's prerequisites and its longest dependency depth: roots have layer 0; every other job has one plus the maximum layer of its parents. This is a DAG dynamic program. The prompt provides that recurrence and asks for arbitrary DAG structures. It is not a hidden test of whether the model notices that a CI file can compute something.

Mercury's easy and hard submissions use recursive memoization. Its hard/hard final patch computes each parent's layer before the child, caches results, and constructs the expected needs and environment fields. It is a coherent implementation of the specified graph computation; all nine cases pass. Reasoning Atria's hard/hard submission also uses a recursive layer function, with a visiting set to detect cycles, and passes. That is direct evidence that both can implement this dependency recurrence.

The informative exception is reasoning Atria's surface_deceptiveness=hard, hidden_depth=medium case. Its final patch names Kahn's algorithm and removes dependencies as jobs are processed. It initializes every layer to zero, however, and never updates a valid job's layer during that processing. The only layer-update code is reserved for unresolved jobs after the sort. In an ordinary valid DAG, that set is empty. Even the chain root → child is left with two zero layers. This is a concrete algorithm-completion failure: the model supplied the topological-sort skeleton without connecting it to the value being computed.

A provisional judgment is that Mercury was more reliable at completing this particular graph dynamic program in these nine runs. The sample also shows reasoning Atria can solve it at the largest configured depth; the failed medium case is not evidence of a monotone depth limit. A useful follow-up would compare compact recurrence-driven implementations with elaborate normalization and sorting scaffolds. Does extra scaffolding increase omitted-update failures?

Current test coverage limits the generality of both successes. Every generated DAG has parents with smaller numeric IDs, and the basic examples have the same ordering. An implementation that assumes numeric IDs are topological could pass without handling arbitrary labels. The inspected successful recursive submissions do not rely on that shortcut, but the score alone cannot distinguish them from one that does.

## CSS parity: both models find the truth-table construction

This task asks for CSS selector rules computing parity over a fixed number of checkboxes. The intended construction expresses each input assignment as a conjunction of checked or unchecked literals; multiple rules provide the disjunction. The difficulty changes the checkbox count and surface naming, with a terminology intervention accounting for the 18 cases.

Mercury's submitted hard/hard solution enumerates all assignments, chooses the even or odd output by bit count, emits one selector condition for each checkbox, and appends the correct display rule. Its terminology variant uses the same construction. Reasoning Atria's hard/hard submissions do likewise and explicitly describe disjunctive normal form. These are not lucky outputs for one input state: the generated rules cover the full truth table checked by the judge.

Mercury passes all 18. Reasoning Atria's three failures need separate readings. The medium/easy terminology case has an empty final patch; medium/hard has a provider/action failure. In hard/easy terminology, the final patch builds the right minterm rules but omits the return statement. The missing return makes the function deliver no rule collection, even though the construction inside it is recognizable and appropriate. Calling that a failure to understand parity would discard the most useful evidence in the patch.

The supported distinction is stronger artifact reliability for Mercury on this sample, alongside shared ability to synthesize a finite Boolean function as selector rules. The result says little about practical CSS expertise because the judge is a custom matcher rather than a browser; it ignores selector-order and specificity behavior. Nor does exponential truth-table enumeration establish an efficient circuit construction for larger parity tasks. A harder, more diagnostic version could constrain output size or ask for a compositional parity architecture.

## Regex: equal scores conceal unequal mechanisms

![Zero-width regex replacement inserts successor bits while preserving the original input.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/regex-insertion.svg)

*For input 010, Rule 110 should produce 110. A direct zero-width substitution into the padded string produces 10100100 instead.*

The task gives the complete Rule 110 table and asks for one synchronous update of a binary string with virtual zero boundary cells. The difficult part is implementing overlapping neighborhoods in a regex transformation without accidentally consuming too much, preserving too much, or shifting the boundaries.

Reasoning Atria's easy/easy final patch uses lookahead to collect all three-character windows, concatenates them, then uses a second regular-expression substitution to map each disjoint triple to one successor bit. The padding expression reduces to one zero on either side. This passes and is a sensible way to separate neighborhood extraction from output construction.

Three Atria failures instead pass a zero-width lookahead directly to substitution and return its output. A zero-width match consumes zero input characters. Replacing it therefore inserts a successor bit before the existing text; it does not replace the three captured characters. With N cells, the padded input has N+2 characters and the lookahead contributes N new characters, yielding 2N+2. The archived hard/hard and easy/hard diagnostics report 512 → 1026; medium/easy reports 32 → 66. The final patch even claims that a zero-width substitution produces exactly the original length. This is a specific false operational model of the regex API, not a wrong transition table.

The hard/medium Atria patch has the same insertion error and then slices the first N characters. That restores length but mixes original and successor bits. The judge records failed transitions across all eight neighborhoods and a right-boundary failure. The additional slice hides one symptom without repairing the operation.

Mercury's hard/hard success is particularly useful as a contrast. Its first regex inserts a marker X followed by the successor bit at each overlapping neighborhood. A second regex extracts only the marker-prefixed new bits, discarding the preserved original input. It therefore treats zero-width insertion as insertion and explicitly performs the required separation. This is a concrete case where Mercury gets a substrate-specific operation right that reasoning Atria repeatedly mishandles.

Mercury's other failures should not be collapsed into that story. Its medium/easy final patch substitutes over the entire padded string and unconditionally reads a right neighbor in the callback. At the final padding character that neighbor is out of range. That is a real boundary error. Its hard/medium record is invalid_action with no landed patch. Its hard/easy and medium/hard records have trusted_score/raw_accuracy 0.75: the final code computes neighborhoods through direct indexing of state_str, and the AST restriction rejects that input indexing while the behavioral checks account for the other three quarters. The archived submit observations explicitly show regex_used=false, basic_step=true, length_preservation=true and randomized_accuracy=true in both cases.

That last restriction is itself poorly specified. The current prompt forbids explicit character-by-character for/while loops, but does not explicitly forbid indexing. The guard rejects indexing of the step argument by name, while accepting the same operation through a padded alias. Mercury's easy/easy and medium/medium PASS submissions perform host indexing on such an alias. The difference between passing and failing here can be a variable binding, not an ability difference. The nominal 5/9 tie therefore combines different behavioral and enforcement outcomes.

A testable hypothesis is that reasoning Atria's failure comes from conflating the declarative idea of an overlapping capture with the operational effect of replacement. Test it with the same automaton in three forms: fixed lookahead extraction, consuming center-character substitution, and zero-width insertion with an explicit output extraction stage. A performance reversal across these forms would favor an API-semantics account over a general automata or reasoning deficit.

## Spreadsheets: strong specification-to-formula translation

Both models pass all nine cases. Their final hard/hard patches produce B1=A1, B2=A2+B1, and each later Bi=Ai+MIN(B(i−1),B(i−2)). This is precisely the recurrence given by the task. Mercury and Atria both preserve cell references rather than evaluating the numeric answer in host code, so the output really is a reusable formula graph.

This is evidence of reliable formula generation and recurrence translation. It is weak evidence for discovering dynamic programming, because the recurrence and example formulas are already explicit. The environment varies the length of a very regular graph without introducing a new dependency pattern. An appropriate follow-up would specify a path-cost problem in domain terms and ask the model to choose the recurrence, then separately ask it to compile a supplied recurrence to formulas. The difference would locate failures in mathematical modeling versus representation.

The current judge translates formula references into numbers and evaluates a Python expression with min and max, rather than using a spreadsheet engine or a closed formula grammar. That broadens the accepted substrate beyond the named task. It does not invalidate these inspected conventional formulas, but weakens conclusions drawn from PASS without inspecting the emitted formulas.

## SQL fixed points: both understand recursive reachability

The intended domain is transitive closure in SQL: derive reachability through a recursive common table expression, terminate on cycles by deduplication, and return requested reachable pairs. Both models' hard/hard final patches use a base edge relation, a recursive join, UNION, and a qualified final join against queries. Mercury passes 8/9 and reasoning Atria 9/9.

Mercury's sole failure, easy surface/hard depth, already contains the recursive CTE. Its final projection selects unqualified start and target after joining reach to queries, which exposes columns with the same names. The judge reports an ambiguous start column. It would be misleading to diagnose this as failure to recognize fixed-point reachability: the structural idea is present. The failure is reliable SQL expression of the chosen algorithm.

Within this campaign, reasoning Atria is slightly more reliable at delivering the complete SQL query. Both appear competent at the specified recursive closure construction. More informative variants would require a new reachability relation, differently named columns, or an explanation of why UNION versus UNION ALL changes termination on cyclic inputs. The current task already says recursion and fixed points are relevant.

## Templates: understood interpretation, incomplete packaging

The template task supplies a sequence of operations with a symbol, repetition count and skip flag. The template must iterate over operations, omit skipped ones and emit repeated symbols without separators. Mercury's hard/hard patch uses a Jinja loop over operations, a skip conditional and a nested range loop, with whitespace-control delimiters. Reasoning Atria's passing hard/hard patch uses the same three-level control structure in adjacent string literals.

Mercury passes 9/9 and reasoning Atria 8/9. Atria's failed easy/hard final patch includes the same plausible template fragments but leaves the outer return parenthesis unclosed. The archived source-validation error agrees. The evidence is that it knows how to express the interpreter yet sometimes fails to deliver syntactically complete source. This belongs with the omitted CSS return and CI update as a possible completion-reliability pattern. It is not enough evidence to attribute the pattern to a model architecture.

## Bayesian transcript games: distinguish evidence from prior preference

Both models pass all 23 epistemic_games cases, including framing and evidence/prior interventions. The archived easy examples are useful because the answer requires separating two concepts that are often conflated: which world is more probable, and whether the transcript distinguishes the worlds.

In the bare-table prior intervention, both worlds assign the observed denial likelihood 1, while world1 has prior 0.6. Mercury and reasoning Atria both answer posterior 0.6, verdict indistinguishable, and most_supported world1. Their justifications preserve the prior because the likelihood ratio is one. That is the right distinction: a favored hypothesis need not have received diagnostic evidence.

In the paired evidence intervention, the observed vague answer has likelihoods 0.05 and 0.70 with equal priors. Mercury calculates posterior 1/15, evidence ratio 14 and world2 as most supported. Atria returns the same correct relation in its final answer. These examples support a positive capability claim about applying Bayes and distinguishing strength from direction under supplied policies.

They do not test learning the policy from observations. The prompt prints the policies and, in the inspected bare-table example, the observed likelihoods themselves. Calling success a rich model of the speaker would exceed what the task asks the model to construct. The useful future test is transfer from known tables to inferred policy classes, with observationally equivalent speakers requiring an explicit underdetermined answer.

## Public announcements: both models perform the model update

![Two truthful announcements remove w3 then w1; both models restrict the surviving accessibility cells correctly.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/epistemic-restriction.svg)

*This is a submitted semantic calculation, not an inference from PASS alone.*

Both models pass 6/6. In the four-world chained nested case, the first truthful announcement is that Bek knows the radio check-in happened. Both final explanations remove w3, then apply the second announcement that the cache was not moved, removing w1. The surviving model is {w2,w4}. They then restrict Bek's cells to singletons and Anders's cell to {w2,w4}, showing Anders knows that Bek knows the radio fact.

This is a sequence of semantic operations: evaluating an announcement, restricting the domain and accessibility cells, then evaluating nested knowledge in the new model. It is stronger evidence than merely recognizing the term public announcement. The limitation is scale and explicitness: three or four worlds, one or two announcements, full partitions and definitions in the prompt. The result supports competence with these finite exercises, without establishing robust dynamic epistemic reasoning in open-ended dialogue.

## Fragmented observations: pooling without inventing communication

Both models pass 4/4. In the four-world asymmetric case at w2, Mercury's final answer intersects Anders's {w2,w3,w4} with Bek's {w1,w2,w3}, obtaining {w2,w3}. The cache-moved fact holds only at w4. Pooling therefore rules out that the cache was moved: D(cache) is false, while D(not cache) is true. Both models correctly answer the asked outer-negated question, ¬D(cache). Atria's corresponding final answer makes the same intersection argument. In the symmetric six-world case, both recognize that {w3,w4} still contains a counterexample, so pooling does not settle the radio fact.

This supports the ability to manipulate information partitions and keep a negation outside a knowledge claim in the right place. The prompt explicitly warns that pooling does not establish individual or common knowledge. Success therefore demonstrates following that distinction under instruction; it does not show the model independently inventing or discovering distributed-knowledge semantics.

## Nested knowledge: real counterexample reasoning at small depth

Both models pass 6/6 through third order. The four-world third-order positive case has singleton cells at the evaluated world; both correctly propagate the true radio fact through the nested knowledge operators. This is easy despite the third-order label.

The six-world third-order negative case is more diagnostic. At w4, Alice considers {w1,w4} possible. Bob at w4 considers {w4,w5}, and Alice at w5 knows only w5, where the ledger fact is false. Mercury follows that counterexample chain back outward to conclude that Alice does not know that Bob knows that Alice knows the fact. Reasoning Atria explicitly computes the worlds where each inner knowledge statement holds and arrives at the same result. The submitted explanations are mathematically appropriate.

A useful hypothesis is that small-world nested epistemic reasoning is a shared strength when the representation is transparent. To test the boundary, vary the world count and branching separately from nesting depth. Merely increasing the word-level nesting while leaving singleton cells does not increase the inference burden much.

## Silence: reasoning Atria conditions on the right event

Reasoning Atria passes all six scored cases. Mercury's six corresponding records are infrastructure-unscored and have no submitted answer to compare.

In the paired-agent skewed-prior silence case, both agents announce only in w2. Atria correctly takes silence as the event {w1,w3}, renormalizes weights 1/2 and 1/4, and obtains posterior 2/3 for w1. In the single-agent uniform-prior case, the agent announces in w1 and w3; silence therefore leaves only w2 and gives w1 posterior zero. These explanations distinguish silence as an event determined by an announcement policy rather than treating it as an absence of evidence by default.

The positive judgment is that reasoning Atria handles these explicit deterministic communication protocols. There is no basis here for ranking Mercury on silence, nor for claiming Atria can infer why a human chose not to speak without a known policy.

## Bayesian type games: correct equilibrium, flawed proof

Reasoning Atria has three accepted equilibria and one invalid-action case with an empty patch. Mercury's four rows are infrastructure-unscored. The large games have three types for player A, two for B and two actions, so the pure strategy search has 32 profiles. Atria's large/sharp explanation says it enumerated those profiles and returns the accepted unique equilibrium.

The large/mild case demonstrates why submitted explanations need checking even when the answer is accepted. The final strategy is A=(X,X,Y), B=(X,X), and the judge accepts it. The explanation claims A's type t2 has a strict dominance argument for X. The archived payoff table contradicts that claim. Conditional on A=t2, B's type weights are 2/5 and 3/5. If B chose Y at both types, A=t2 would get −1 from X, whereas Y would give 0×2/5 + (−1)×3/5 = −3/5. Y is better under that opponent strategy, so X is not dominant. X can still be the best response in the reported equilibrium, where B chooses X.

The correct assessment is that Atria found accepted equilibria on these three small games, while at least one proof in its delivered prose misstates the strategic argument. The judge checks the action map and only enforces formatting/length on the justification. This is a concrete instance of a correct answer outrunning the quality of its explanation. It is not evidence that every claimed enumeration or every proof step in the archive is reliable.

## What the earlier ordinary-Atria run adds

The 194-case ordinary-Atria archive used reasoning disabled and different configuration revisions. Its ML/execution results were BatchNorm 0/11, Glyph 0/8, MoCo 9/11, adaptive halting 9/11, gradient credit 11/11, state carry 11/11, parse-only 2/3, one-step 0/3 and trajectory 0/3. In the remaining families it recorded CI 5/5, CSS 3/5, regex 3/5, spreadsheet 5/5, SQL 4/5, templates 5/5 and epistemic games 7/7.

The other five archived epistemic families are absent from this baseline. Its regex hard/easy final patch has the same zero-width-substitution insertion error seen in reasoning Atria. Its medium/easy regex patch consumes the center character correctly but returns the unchanged outer zero padding too, producing two extra characters. Its failed SQL patch introduces the right recursive-CTE idea but ends halfway through the query string. These examples reinforce the distinction between recognizing the intended construction and delivering its exact operational implementation. They do not show whether enabling reasoning improved or worsened the model, because the cohorts and configurations differ.

## Provisional model profiles

For **Mercury**, the strongest positive evidence is reliable translation of supplied rules: dependency depth, spreadsheet recurrences, template control flow, recursive SQL closure and small epistemic updates. It also delivers more accepted MoCo repairs than reasoning Atria in this scaffold. The recurrent negative pattern is failure to preserve a second condition while repairing the most obvious one: autograd when updating a masked state, temperature when fixing a queue, or tensor layout when applying a projection. Its shorter patches are often sufficient, but a locally plausible edit is not always a complete repair.

For **reasoning Atria**, the best positive contrasts are functional per-row state updates, the affine scans and NaN guards discussed in the companion post, and several substantial near-complete trajectory interpreters. Its finite epistemic work is also strong at the sampled scale. The main risks are operational semantics and completion: zero-width substitution, the queue mutation retained for backward, absent returns or value updates, incomplete source and prohibited imports. Its explanations sometimes overstate what its code or proof establishes. More articulated prose is not a substitute for executing the final artifact or checking a mathematical witness.

These profiles are provisional descriptions of this setup. They do not imply that Atria always makes large edits, that Mercury cannot reason abstractly, or that enabling reasoning caused the observed differences. The earlier cohort supplies examples of the same failure mechanisms without a matched intervention.

## Hypotheses & experiments that would discriminate them

**First: much of the cross-domain variation comes from operational semantics.** Atria’s repeated regex error is about what replacement consumes; Mercury’s SQL failure is about column binding; its halting failures are about aliasing under autograd. Give the same construction in several substrates while preserving the mathematical rule. A difference tied to one operation would support this explanation. A uniform collapse across representations would shift attention back to the underlying reasoning task.

**Second: delivered-artifact completion is a measurable skill of its own.** A missing CSS return, a CI algorithm without layer propagation and a template with an unclosed parenthesis coexist with appropriate intended constructions. Compare final artifacts before and after a fixed compiler/test-feedback budget. Preserve the proposed source before patch transport so tool-format failures can be distinguished from intended-code errors. Do not silently exclude failed deliveries from an end-to-end reliability score.

**Third: Mercury’s halting gap is primarily differentiable tensor programming.** Hold the per-row recurrence fixed and implement it with integer arrays, tensors without gradients, and tensors with gradients. The five matching leaf-mutation errors predict that much of the gap will concentrate in the third condition. That prediction is narrower and more falsifiable than a claim about recurrence in general.

**Fourth: the trajectory results are bottlenecked by parsing and representation.** Compare raw DSL input with a parsed syntax tree and an explicit transition table. Keep the same transition system and horizons. Resolve the one-step string-versus-integer payload contract first. A sharp improvement with parsed input would show that the original zero did not isolate trajectory execution.

**Fifth: transparent finite epistemic reasoning is a shared strength with an unknown scaling boundary.** Vary world count, accessibility branching and update count independently. Include singleton-cell controls, genuine third-order counterexamples, unknown policies and observationally equivalent alternatives. Ask for a witness or an underdetermination certificate, not simply a plausible story about the speaker. This builds on demonstrated semantic operations instead of dismissing them because the worlds are small.

**Sixth: the scoring system can either hide or manufacture a domain gap.** Fix the proven contract mismatches, add negative controls such as wrong MoCo temperature powers, and remove diagnosis leakage in a separate unassisted condition. Re-score preserved submissions where technically possible, then run a new versioned campaign. A corrected judge could improve one model’s apparent result and reduce another’s without either model changing. That would be a discovery about the instrument, with direct consequences for the model comparison.

The useful next result is therefore a set of replicated, mechanism-specific judgments: which model localizes a fault, selects the correct construction, preserves its representation and invariants, and delivers a working artifact. The present archive already answers parts of that question. It gives Mercury and Atria credit for real finite reasoning and successful implementations, while locating several failures precisely enough to challenge in the next experiment.

## Evidence & reproduction

The accompanying [comparison table](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/campaign-comparison.md) covers all 38 environments with main-campaign records and the earlier 194-case ordinary-Atria cohort. The latter shares 131 case IDs with each later campaign, but none of those pairs has the same configuration hash. Snapshot 56 and snapshot 62 are not counted as separate ordinary-Atria campaigns.

Archived evidence comes from `mercury-pairwise-state-38873207827.zip`, `reasoning-atria-pairwise-state-39028365163.zip`, and `atria-campaign-state-62.zip`. Their SHA-256 values are recorded in [archive-hashes.json](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/archive-hashes.json). Each detailed evidence record retains the case ID and the archive member path for the final patch, final judge output, and available observations of the task/source. Counts concern final recorded verdicts; partial successes and protocol failures are explained in the text without silently rewriting those verdicts. No confidence interval here treats template variants as independent samples of mathematical competence.

The current-environment inspection used repository commit [42295b3](https://github.com/StrangeTcy/rl_eval_generator/tree/42295b3aece5d24109a20d08e4a39a19bdba47e9), with [exact inspected source hashes](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/current-source-hashes.json). Current source is used for the separately identified audit, not substituted for historical task observations. The [current environment audit](https://strangetcy.github.io/2026/11/11/current-environment-audit-50-configured-tasks-and-9-interactive-families.html) lists confirmed defects, static candidates and the inspection coverage.

Detailed evidence: [ML and execution cases](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/ml-execution-evidence.json), [ML episode observations for Mercury](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/mercury-ml-archive.json), [ML episode observations for Atria](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/reasoning_atria-ml-archive.json), and [epistemic/substrate cases, final patches and observations](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/epistemic-substrate-evidence.json). The [ML audit](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/ml-execution-current-audit.md) and [epistemic/substrate audit](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/epistemic-substrate-current-audit.md) provide source locations and repair proposals.

{% endraw %}
