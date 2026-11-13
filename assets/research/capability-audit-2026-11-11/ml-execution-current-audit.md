# Current ML and execution environment audit

Read-only audit on 2026-11-11 of `C:/Users/hatgu/rl_eval_generator`, HEAD `42295b3aece5d24109a20d08e4a39a19bdba47e9`. Covers Glyph, BatchNorm EMA, MoCo, RoPE, all three recurrent-depth environments, and all three trajectory-semantics solver environments. Findings are static source findings unless an archived submission/result is explicitly named. Proposed counterexamples were not run. No fixes were applied.

## P1: one-step payload contract contradicts its judge

`envs/trajectory_semantics/one_step/files/prompt.md:8` asks for the labels appearing in the supplied specification and says payload is integer for canonical cases. The relabeled specification uses red/blue. `files/judge.py:26` maps those labels to canonical 0/1, and `judge.py:74`–76 creates every relabeled starting state with integer payloads. A solver returning blue for a constant-blue transition follows the natural reading of the task but is rejected.

This is not merely hypothetical. Reasoning Atria's `ts_one_step__witness_status=valid_representation=reflective__seed-0` passes six checks and fails only the relabeled broken-witness case. The submitted helper returns the literal token; the read_file observation confirms the archived prompt has the same conflicting wording. Choose one contract, document both input and output encoding, and use an independent reference implementing it. A semantic-preserving renaming should rename the representation consistently, not silently change the boundary conventions.

## P1: MoCo's temperature test accepts the wrong temperature law

`envs/moco/files/judge.py:49`–73 runs two snapshots at tau and twice tau and accepts any finite logit change. It never requires the intended inverse scaling or unit-normalized keys. This accepts applying 1/tau to both normalized q and k, which gives a 1/tau² positive similarity and puts scaled keys into the queue.

Observed reasoning-Atria PASS: `moco__naming=easy_distractors=hard_queue_math=easy_temperature=hard_visible_tests=easy_symptom_mask=hard__seed-0`. Observed Mercury PASS with the same pattern: `moco__naming=hard_distractors=hard_queue_math=easy_temperature=easy_visible_tests=medium_symptom_mask=medium__seed-0`. The report is not claiming all other passes have been audited for this error.

Corrective validation should compare logits to a mathematical reference under fixed embeddings/queue, test the inverse-temperature ratio, and check key norms and queue contents. Keep the existing mutation-isolated snapshots; that part is well designed. Add a negative control that divides both embeddings by temperature and must fail.

## P1: RoPE's hidden judge can accept the wrong positional construction

`envs/rope/files/judge.py:48`–58 names a check `rope_pairing` but only tests norm preservation. `judge.py:60`–75 tests that offset and explicit positions agree and that changing offset has an effect. `judge.py:95`–129 tests chunk/full consistency. None compares the rotations to the required interleaved RoPE reference or its frequency schedule.

A position-dependent orthogonal rotation using a wrong frequency schedule can preserve norms, respect absolute positions, and be identical in full/chunked execution. The smoke trainer (`files/train.py:7`–16) optimizes a generic q/k loss without comparing against reference RoPE. Such a construction can satisfy the stated checks while failing the paper's mathematics. This is a static sufficiency argument, not a executed exploit.

The local agent tools contain stronger reference implementations than the hidden judge: `files/run_eval.py:15` and `files/run_train.py:19`. Move the mathematical reference behind the judge boundary, test multiple dimensions/positions/bases against it, and include a norm-preserving but wrongly paired/frequency-scaled negative control. A `behavioral_reference` guarantee elsewhere in the generator would not establish that this particular judge rules out all these alternatives.

## P1: solution-diagnosing BUG comments survive the hardest recurrent configurations

The following are fixed starter text, not placeholders controlled by clue difficulty:

- `envs/recurrent_depth/state_carry/files/recurrent_block.py:18`: “BUG: this ignores the state produced by the preceding transition.”
- `envs/recurrent_depth/gradient_credit/files/recurrent_block.py:16`: “BUG: detaching here destroys recurrent credit assignment.”
- `envs/recurrent_depth/adaptive_halting/files/halting.py:18`: “BUG: every row runs for the batch maximum instead of its own count.”

Each file is explicitly placed in the agent workspace by its configuration. The hard clue and implementation-note levels remove other hints but leave these comments. For example state-carry `config.yaml:15`–23 changes CLUE; `config.yaml:52`–59 changes IMPLEMENTATION_NOTE; `config.yaml:83` exposes the source. The adaptive equivalent places a direct mask prescription in the easy implementation note, then empties only that placeholder on hard (`config.yaml:59`–63).

The archive confirms exposure in both easy and hard sampled state/gradient tasks. Both models make the advertised one-line fixes and score 15/15. Remove diagnostic prose from every agent-readable artifact in the uncued condition, including docstrings, filenames, tests, tool text, and local helper sources. Preserve explicitly labeled tutorial/easy conditions as a different measurement. Otherwise the claimed clue-clarity contrast is contaminated by an invariant answer cue.

## P1/P2: MoCo and RoPE expose diagnoses and, for RoPE, executable reference answers

MoCo's `envs/moco/files/queue_ops.py:10`–11 unconditionally names the exact queue boundary defect and says to wrap the tail. The config varies the temperature cue but not this queue docstring. The comment also misdescribes the starter's likely runtime behavior: assigning the full keys transpose to a truncated tensor slice normally raises a shape mismatch rather than silently dropping tail keys. That runtime detail was not reproduced here.

RoPE source contains precise diagnoses in `files/attention.py:30`, `files/cache.py:8` and `:12`, and `files/rope.py:18`. The config's BUG_COMMENT variation (`config.yaml:33`–45) controls only another comment. `config.yaml:179`–181 puts these files in the workspace, `:184` exposes visible tests, and `:188`–189 puts the reference-bearing train/eval helpers in agent tools. `visible_tests.py:7`, `run_eval.py:15`, and `run_train.py:19` contain full correct rotation routines. The workspace visible-test reference alone is sufficient to make paper derivation unnecessary; the exact readability of all `/tools` paths through every action API is not needed for that conclusion.

For a paper-to-code measurement this is answer leakage. For a deliberate reference-guided repair task it is legitimate assistance, but the capability claim must say so. Keep expected-value generation in a judge-owned process and give the agent observations/diagnostics whose content follows the chosen difficulty setting.

## P2: RoPE's hidden offset axis is dead in the judge

`envs/rope/config.yaml:98`, `:101`, and `:104` vary HIDDEN_OFFSET across 32, 257, and 1027. `files/judge.py:21` declares the substituted value, but the probe hard-codes offset 5 and only receives seed and long-sequence length (`judge.py:163`–167). A source search finds no other use of HIDDEN_OFFSET in that judge. Consequently this component of the advertised hidden-context severity does not reach the scoring probe. Pass the configured offset through and check that generated cases differ in an executed test, not only a manifest value.

## P1/P2: file-touch requirements reject behaviorally sufficient repairs

BatchNorm `files/judge.py:104` and Glyph `files/judge.py:38` require both model and trainer files to change. MoCo similarly requires its model file plus queue helper (`files/judge.py:123`). This is valid only if modifying both files is itself an explicit measured objective. It is a poor substitute for proving both cross-context semantics have been fixed. BatchNorm's current prompt explicitly says “The grader scores behavior, not a specific patch shape” (`files/prompt.md:20`), so its file-touch rule directly contradicts the advertised contract.

Observed BatchNorm all-easy Mercury: correct evaluation diagnostics, accuracy 1.0, only missing model.py, FAIL/0.95. A second Mercury BatchNorm example reaches 0.984 with the same file-only failure. The Glyph reasoning-Atria hard/medium/hard/medium/hard/medium example reaches 0.819 and passes optimization/consistency diagnostics, but also falls below the 0.85 accuracy threshold; it is not a file-only false negative. Full IDs appear in the analysis file. A caller can configure modules at runtime without editing their definition file. Conversely a whitespace/comment edit can satisfy a file-touch condition without repairing semantics. Score behavior separately from a declared workflow requirement and assign an accurate failure stage, not “overfit visible tests.”

## P2: the one-step format-invariance score compares pass/fail booleans

`envs/trajectory_semantics/one_step/files/judge.py:105`–106 defines `same_result_under_format_noise` as equality of two calls to `check_case`. Each call returns whether every state is correct. If canonical and noisy versions both fail—possibly with different wrong outputs—the equality is true. A structurally valid but semantically broken solver can get this point plus tuple-shape credit and report 2/7.

Compare paired outputs for each corresponding state, and decide whether invariance should count only when those outputs are correct. Keep correctness, representation validity, and invariance separate in the report. The parse-only judge also awards answer-string and format-consistency points to some consistently wrong outputs (`parse_only/files/judge.py:67`–71); that is a design choice about partial credit, but it should not be described as semantic correctness.

## P2: adaptive halting uses exact float equality against one batching strategy

`envs/recurrent_depth/adaptive_halting/files/judge.py:24`–30 computes every row on every step and freezes inactive rows. `judge.py:51`, `:54`, `:61`, and `:67` use exact tensor equality. A mathematically valid implementation can compute only active rows, which changes matrix-operation shape and may change floating-point accumulation. Exact equality would then prefer the reference's batching strategy rather than the semantic contract.

Mercury's medium/hard/medium/hard/easy case computes active subsets on cloned state and scores 0.8: only per-example reference equality fails; other checks, including gradients and off-by-one, pass. This is suggestive archived evidence, not a proved numerical reproduction. Re-evaluate that patch with a declared tolerance and inspect maximum errors before categorizing it as a semantic failure. The five separate leaf-mutation runtime failures are unambiguous and must remain separate.

## P2/P3: conspicuous “misleading” and “irrelevant” annotations compromise distractor conditions

Glyph `config.yaml:99` generates a docstring saying an augmentation bug is “irrelevant”; the associated probability 1.1 means every training sample is inverted, so irrelevance is not established by that annotation. Its hard visible test says “MISLEADING: passes even with the buggy model on some seeds” (`:135`); the proxy intervention says “MISLEADING PROXY” (`:263`). MoCo's hard visible test is similarly labeled as misleading. These comments tell the model which evidence to distrust and disclose the intended experimental role of a test or component.

Some easy cues are deliberate and should not all be called accidents: BatchNorm `config.yaml:7`–11 gives a direct momentum prescription only in the easy optimizer-hint level; Glyph `config.yaml:8` asks about flattening only in its easy architecture level; MoCo's easy temperature hint explicitly gives the normalization identity. The glaring defect is claiming an uncued/distractor test while retaining labels that resolve the intended distinction.

## P3: finite public trajectory corpus makes generic-parsing claims too strong

Each trajectory `task.py` ships all variants the judge later scores. One-step and trajectory contain canonical, noisy, relabeled, witness-sibling, and sibling-relabeled strings (`files/task.py:5`–9); parse-only contains all three strings in CASES (`parse_only/files/task.py:6`–10). Config layouts expose these files. No hidden renaming, ordering, alternate transition graph, or additional payload universe is generated by the local judge.

This is suitable for a tiny specified solver exercise, but not strong evidence of a general interpreter. The Mercury valid/reflective parse-only PASS illustrates the gap: it searches for template C, then defaults to “same,” which also happens to be the expected answer for the relabeled valid specification. Hold out independently generated syntactic and semantic variants, including broken/valid siblings within every query family, and add a negative control that hard-codes the exposed structure.

## Diagnostic terminology worth fixing

Glyph's `spatial_prediction_agreement` is within-class modal prediction agreement (`envs/glyph/files/judge.py:78`–99); it is not an intervention on position alone. Its `optimizer_pathology_unfixed` note is assigned from class coverage and entropy, which can fail for causes other than an optimizer defect. BatchNorm's `bn_momentum_unscaled` note is assigned from nonfinite/negative/exploded running statistics rather than directly testing the accumulation decay law. Keep these as symptoms or narrower descriptive names. The archive's raw label is evidence of the judge's classification, not a ground-truth causal explanation.

## Prioritized repair order

First align the one-step payload contract and strengthen MoCo/RoPE mathematical checks. Next remove invariant solution cues from conditions intended to require diagnosis, including the public RoPE reference. Then separate behavioral acceptance from file-touch policy and fix partial-credit definitions. Finally validate that each difficulty axis changes an executed test or model observation and add clean negative controls. The current audit has identified concrete defects and candidate false negatives; it has not changed or re-run the environments.
