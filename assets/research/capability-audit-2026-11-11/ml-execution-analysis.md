# ML repair, recurrent execution, and trajectory semantics: qualitative campaign analysis

Analysis date: 2026-11-11. Prepared for integration into the two long posts. Source archive evidence and current-source defects are deliberately distinguished below.

## What the evidence supports

Mercury is competent at several small, local ML repairs and delivered more accepted MoCo submissions than reasoning Atria in these campaigns. Reasoning Atria was much more reliable at implementing per-example adaptive halting without violating autograd. Neither statement reduces to an architecture-wide ranking. The submissions expose two different weaknesses: Mercury sometimes repairs the most visible component and leaves a second mathematical relationship untouched; Atria sometimes states or implements the correct mathematical relation and breaks an execution invariant in the same edit.

The sharpest example is MoCo. Atria's all-easy submission correctly moves temperature scaling onto similarity logits, then removes the detached clone of the queue. Updating that queue before backpropagation consequently triggers the recorded tensor-version error. Mercury's corresponding submission keeps the clone and passes. In another case, Atria passes with a mathematically wrong temperature scaling because the judge tests only temperature sensitivity. Reading the patches changes both positive and negative interpretations of the score table.

The trajectory tasks provide a second example. Mercury's one-step parser breaks nested parentheses. Atria has a six-of-seven submission whose remaining discrepancy is explained by a prompt/judge contract mismatch about whether relabeled payloads are strings or canonical integers. Calling both outcomes “cannot reason through one transition” would discard the most informative evidence.

## Cohorts and counts

Primary sources are `epistemic-compiler/campaign-02-analysis/evidence/generated/case_results.csv` plus `mercury-pairwise-state-38873207827.zip`, and the corresponding campaign-03 CSV plus `reasoning-atria-pairwise-state-39028365163.zip`. The local extracted records are `mercury-ml-archive.json` and `reasoning_atria-ml-archive.json` beside this report. Each record preserves the complete case row and exact ZIP paths for `environment-events.jsonl`, `submission.patch`, and `final.json`.

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

Mercury's `ts_parse_only__witness_status=broken_representation=flat__seed-0` is recorded PASS but marked performance-ineligible because the campaign report attributes a terminal failure to a provider outage. Report 4/4 as the recorded result, or 3/3 when using the eligible subset; do not silently merge the definitions. Atria's fourth trajectory case is absent, not a failure. Each primary campaign's RoPE exclusion table contains five known gate-blocked calibration cases and ten cases omitted for unsupported provider input modality.

MoCo's 55 rows comprise 15 base rows and 40 intervention rows, not 55 independent task designs. Mercury passes 11/15 base and 25/40 intervention rows; reasoning Atria passes 9/15 and 21/40. Glyph comprises 12 base and 12 intervention rows per model. Both remain 0/24.

The `compile_only` guarantee label on BatchNorm, adaptive halting, gradient credit, and trajectory tasks means the generator did not establish an exact-instance behavioral reference guarantee. It does **not** mean those judges merely compiled the submission. The archived judges report real behavior checks, and those checks are used below with their concrete scope.

Supplementary ordinary Atria data, from the earlier 194-case campaign with `reasoning_enabled=false`, are: BatchNorm 0/11, Glyph 0/8, MoCo 9/11, adaptive halting 9/11, gradient credit 11/11, state carry 11/11, parse-only 2/3, one-step 0/3, trajectory 0/3. This was a smaller covering cohort with different configuration revisions. It is useful background, not a controlled estimate of the effect of reasoning mode. No ordinary-Atria patch-level claims are made in this report.

## MoCo: two separable capabilities, two kinds of mistake

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

## Testable hypotheses worth pursuing

1. **Atria's expansive repair strategy creates avoidable integration errors.** Evidence: clone removal despite correct MoCo temperature logic; accidental BN indentation; large parser submissions failing syntax/action delivery. Test: hold tasks/model/settings fixed and compare minimal patch versus full rewrite instructions, measuring valid patch rate, semantic correctness, and changed-line count separately. A competing explanation is the action/patch transport format rather than the model's code-edit strategy; record intended source before transport to separate them.

2. **Mercury is stronger at local repair than at preserving a coupled set of invariants.** Evidence: successful simple state/gradient edits; MoCo queue/EMA changes that omit temperature; per-row masking that breaks autograd. Test independently cued and uncued versions of the same mathematical demand, with single-fault and multi-fault variants and invariant-specific checks. This predicts a larger drop when multiple coupled conditions must remain true than when only code length increases.

3. **Atria's adaptive-halting advantage concerns differentiable tensor programming.** Evidence: 14/15 versus 8/14, with all five Mercury runtime failures sharing leaf-tensor mutation errors. Test the same halting semantics in pure integer arrays, tensors without gradients, and tensors with gradients. A gap only in the last condition would support an autograd-specific explanation rather than a recurrence-general one.

4. **The trajectory deficit is partly a parser/representation bottleneck.** Evidence: Mercury's malformed nested expression; Atria's near-complete one-step/trajectory interpreters and symbol-index mismatch. Test three matched interfaces: raw DSL, parsed AST, and explicit transition table. Keep the transition problem and horizons unchanged. Also resolve the current one-step payload contract before rerunning.

5. **Some reported domain differences are produced by judge coverage and answer leakage.** Evidence: unconditional recurrent BUG comments; exact solution in local RoPE tooling; MoCo's acceptance of inverse-square temperature; file-touch-only nonpasses. Test reference-negative controls that preserve superficial invariants while violating the intended construction. Then rerun clean, versioned tasks. This hypothesis is about a measurable evaluation mechanism, not a reason to stop comparing models.

## Evidence reading map

Every case identifier above indexes both primary extraction files where recorded. Within each record, use `members[name=submission.patch]` for the submitted source change, `members[name=final.json]` for checks/notes, and `members[name=environment-events.jsonl]` for the exact task read by the model. The evidence file beside this report records the complete primary case rows and selected observed prompts/source, plus current-source references. Current source inspection used repository HEAD `42295b3aece5d24109a20d08e4a39a19bdba47e9`; it was read only. No paid evaluation calls, Python executions, or environment edits were made.
