# Current category environment audit

Audited source root: `C:/Users/hatgu/rl_eval_generator`, parent-verified HEAD `42295b3aece5d24109a20d08e4a39a19bdba47e9` (9 November 2026). Read-only audit on 11 November 2026. No environment source was edited and no paid campaign was run.

Coverage: all 17 original category/compositional configurations, their exposed sources, prompts, and behavioral judges; all nine current recursive additions' prompt/solver/layout surfaces, with judge entry-point and oracle-boundary inspection. The latter is a bounded static review, not a proof of every oracle implementation. Archive findings are separately identified below.

## 1. Confirmed: every original category environment gives away its diagnosis

Each of these files is placed under `agent/workspace` by its configuration, not kept only in judge code. The archive also contains source reads or deleted patch lines showing the hints were present in historical observations, including hard/hard cases. Exact historical source-read events are indexed in `category-evidence.json`.

All paths below are relative to `C:/Users/hatgu/rl_eval_generator/envs/cat_theo/`.

| Environment | Exposed source and line | What the comment reveals |
|---|---|---|
| architecture_naturality | `architecture_naturality/files/converter.py:8` | Hard-coded temporal slice violates naturality |
| categorical_lenses | `categorical_lenses/files/lenses.py:6` | Setter destroys the untouched coordinate |
| compositional_optimizer | `compositional_optimizer/files/optimizer.py:4` | Class-level shared state collides across instances |
| equivariant_diagram | `equivariant_diagram/files/layers.py:7` | Zero-padding breaks cyclic translation equivariance |
| functorial_augmentation | `functorial_augmentation/files/dataset.py:6` | Affine shear/rotation breaks the 90-degree orbit |
| monadic_reward | `monadic_reward/files/agent_code.py:8` | Global mutation and unsafe evaluation, explicitly named |
| tensor_functor | `tensor_functor/files/model.py:12` | Coordinate loops/slices break batching and resizing |
| stochastic_monad | `stochastic_monad/files/monad.py:14` | Sampling is eager instead of lazy |
| tokenizer_adjunction | `tokenizer_adjunction/files/detokenizer.py:5` | Replace `Ġ` with a space |
| transformer_ssm_lift | `transformer_ssm_lift/files/lifter.py:10` | Temporal mean pooling loses correlations |
| semiring_unification | `semiring_unification/files/semirings.py:14` and `:28` | Incorrect identities; adjacent prose supplies expected values |
| gnn_message_passing | `semiring/gnn_message_passing/files/gnn.py:11` | Hard-coded coordinate bias; adjacent prose prescribes multiplication |
| neuro_symbolic_parser | `semiring/neuro_symbolic_parser/files/parser.py:10` | Detached hard minimum; adjacent prose supplies soft-min formula |
| ssm_parallel_scan | `semiring/ssm_parallel_scan/files/ssm.py:12` | Diagnoses composition order, although its associativity claim is false |
| sheaf_invariant_gluing | `sheaf/sheaf_invariant_gluing/files/pipeline.py:10` | Saturating `tanh` produces bucket 100 |
| sheaf_physical_constraints | `sheaf/sheaf_physical_constraints/files/route.py:13` | Missing shared-switch and backbone constraints |
| sheaf_schema_sync | `sheaf/sheaf_schema_sync/files/migration.py:37` | Circular immediate foreign-key problem |

Severity: high for any claim about autonomous diagnosis or recognition. These can be legitimate scaffolded repair exercises, but then that is the task description. Removing only the word `BUG` is insufficient: the explanatory sentence, supplied formula, and identifying names can carry the answer. Keep specification and API contracts, remove the diagnosis from an unassisted condition, and preserve a separately labelled hint condition. Run both the original baseline and a known-correct repair against each generated case before measuring a model.

## 2. Confirmed: nine advertised symptom settings are not consumed

The following placeholders occur in their configurations but not in local template files. Parent inspection confirmed the generic generator substitutes referenced tokens only (`generate_env.py:795` and `:1125` onward), with no special use of these factor names in the shared renderer/arena path.

| Environment | Unused setting | Configuration location |
|---|---|---|
| architecture_naturality | `CHECK_DIM` | `architecture_naturality/config.yaml:19` |
| categorical_lenses | `STRICT_LAWS` | `categorical_lenses/config.yaml:19` |
| compositional_optimizer | `LR_VAL` | `compositional_optimizer/config.yaml:19` |
| equivariant_diagram | `SYMMETRY_DIM` | `equivariant_diagram/config.yaml:19` |
| functorial_augmentation | `AUG_PARAM` | `functorial_augmentation/config.yaml:19` |
| monadic_reward | `SIDE_EFFECT_CHECK` | `monadic_reward/config.yaml:19` |
| neuro_symbolic_parser | `TOLERANCE` | `semiring/neuro_symbolic_parser/config.yaml:19` |
| stochastic_monad | `SIGMA_VAL` | `stochastic_monad/config.yaml:19` |
| tokenizer_adjunction | `UNICODE_SUPPORT` | `tokenizer_adjunction/config.yaml:19` |

`MODEL_CLASS` in the optimizer configuration is also not used in its source or prompt, making that naming variation inert there. `MODEL_FILE` can be consumed by the layout and should not be flagged merely because it is absent from file contents.

Severity: high for difficulty or factor-sensitivity claims. The promised intervention never changes the named mechanism. Derived seed or metadata changes would not fix that causal interpretation. Either wire these settings into a documented behavior, remove the factor, or relabel it as a presentation-only/no-op control. Add a generator check that detects axis substitutions unused by generated task files and verifies that distinct semantic levels produce the intended changed behavior.

## 3. Confirmed: GNN rejects valid answers to its stated contract

Prompt: `semiring/gnn_message_passing/files/prompt.md:5` onward asks only for permutation equivariance. Source: `gnn.py:17` includes a self-feature term. Judge: `judge.py:34` defines one target, and `:45` hides exact equality to `A h` inside a check called `basic_run`.

`h + A h` is equivariant too. In the historical records every one of the 18 candidate permutation checks passes; the residual variants fail exact reference equality. This defect directly changes the apparent model ranking.

Repair: explicitly require the exact aggregation operator, or judge the allowed class of equivariant operators. Keep anti-triviality separate from an unstated architectural preference. A zero output can be excluded without rejecting a valid residual layer.

## 4. Confirmed: safe parser import is blocked in the monad task

`monadic_reward/config.yaml:32` adds only `monad` to the allowed imports. The source asks the model to repair unsafe evaluation of serialized coordinates; `monadic_reward/files/agent_code.py:8` names that defect. The current prompt supplies no supported parsing API or import-policy explanation.

Historical effect: eight Mercury and nine reasoning-Atria submissions are rejected specifically for `import ast`, before their monadic behavior is evaluated. Mercury's remaining case is `invalid_action`. Ordinary Atria has a passing manual parser, so this is not a proof the task is impossible.

Repair: permit `ast` if literal parsing is intended, supply a sanctioned parser, or define a narrow serialization grammar and make the restriction visible. Do not label these rejections as a failure to understand state monads. Keep any intended import restriction as an explicit, separately scored contract.

## 5. Confirmed: physical-constraint judge adds hidden fairness objectives

Prompt: `sheaf/sheaf_physical_constraints/files/prompt.md` requires safe routing under overlapping capacity limits. Judge: `judge.py:66` demands a 5:3 allocation ratio; `:94` demands total utilization greater than 100; `:97` demands symmetry between equal-demand routes. These are additional objectives beyond the stated capacity bounds.

Atria's sampled max-min allocation `(50,50,0)` for demands `(120,60,0)` and local capacity 100 satisfies all capacity constraints. The local check rejects it because the judge requires clipped-demand proportional allocation near `(62.5,37.5,0)`. Other submitted algorithms do have order/symmetry defects; do not excuse every failure under this one diagnosis.

Repair: state the allocation objective, specify the order of clipping and scaling, and score feasibility separately from fairness/utilization. Include arbitrary overlap topologies and demand regimes if local-to-global constraint reasoning is the intended construct.

## 6. Confirmed: SSM associativity diagnosis is mathematically false

`semiring/ssm_parallel_scan/files/prompt.md:8` says the initial operator fails associativity. `ssm.py:12` and `:16` repeat this. The original reverse-order affine composition is associative; its mismatch is chronological order. The judge knows this distinction in practice: `judge.py:41` tests the chronological reference, then `:67` and `:68` test regrouping separately.

The source also calls `M` a transition matrix (`ssm.py:11`) while the judge supplies 4-by-8 arrays and uses elementwise multiplication (`judge.py:34` through `:43`). The representation should be described as batched diagonal coefficients, or the judge should use genuine matrices.

Repair: correct the diagnosis, specify chronology and tensor representation, and keep both semantic and associativity tests. This removes an erroneous teaching signal and makes Mercury's matrix-versus-elementwise failures interpretable.

## 7. Confirmed: mathematical labels outrun the checks

**Optimizer:** `compositional_optimizer/files/prompt.md` asks for associativity across nested compositions and multiple steps. `judge.py:43` through `:58` computes one update through two instances. It checks state isolation, not the full claim. Add three-way regrouping, repeated steps, state-aliasing checks, and parameter independence, or narrow the task name and prompt.

**Parser:** `semiring/neuro_symbolic_parser/files/judge.py:34` checks only shape; `:44` onward checks derivatives at `(1.5,2.5)` and temperature 1. No scalar output is compared with soft minimum. Adding a constant to a correct answer preserves all these checks while changing the required value. Add direct value comparisons, temperatures, tied inputs, and large-magnitude numerical tests. This is a judge blind spot, not an allegation that a model exploited it.

**Tokenizer:** `tokenizer_adjunction/files/prompt.md:3` calls `T D T = T` a sufficient adjunction/Galois condition. It is not. `tokenizer.py:5` maps spaces to the literal marker, while all other characters, including a literal `Ġ`, pass through unchanged. Thus two distinct strings have the same tokenization, and arbitrary exact reconstruction is impossible. The judge's words and test strings (`judge.py:56` onward) avoid that collision. Either define an actual ordered/category setting or call this a reconstruction/normalization exercise; escape the marker or explicitly restrict the domain.

**Attention lift:** the judge's reference is unnormalized linear attention (`transformer_ssm_lift/files/judge.py:54` through `:59`). The prompt's “correct and lossless” wording should be limited to that readout, not full softmax attention or invertibility of the entire sequence history.

## 8. Static candidate: schema difficulty can supply the repair in advance

`sheaf/sheaf_schema_sync/config.yaml:21` and `:23` put `DEFERRABLE INITIALLY DEFERRED` into the medium/hard schema. The template inserts the three rows through one SQLite connection and commits after all insertions (`files/migration.py:43` through `:47`). Under ordinary SQLite deferred-constraint semantics, that is already enough to satisfy the circular foreign keys at commit.

This is a strong static candidate for a baseline that already passes the behavioral target at the nominally harder settings, despite its `BUG` comment. It has not been rerun in this read-only audit. Check it with an isolated baseline-versus-reference preflight before treating those settings as broken-code repair tasks. The judge requires a changed file (`files/judge.py:18`), so a baseline already satisfying the behavior could force unnecessary edits.

## 9. Secondary augmentation issues

`functorial_augmentation/files/judge.py:41` onward restricts the output to C4 rotations and requires at least three nonidentity outputs in ten trials. The prompt states geometric preservation and mentions 90-degree rotational invariance as an example, but does not explicitly require C4-only outputs, prohibit reflections, or state that sampling quota. An identity-only augmentation preserves the orbit yet fails; a D4 sampler adds transformations outside the judge's accepted orbit. Rotation invariance does not imply reflection invariance, but the omitted group restriction still makes this an underspecified task. State the allowed group and nontrivial sampling requirement explicitly before treating every mismatch as a model error.

The emitted evaluation script has no explicit random seeding and uses a finite quota. Even a correct uniform C4 sampler has probability `436 / 1,048,576`, about 0.0416%, of sampling fewer than three nonidentity rotations in ten draws. This is a small reproducibility defect; it does not explain reasoning Atria's seven observed failures, all of whose submitted patches add reflections. Replace the lottery with controlled randomness or deterministic coverage checks.

## Coverage of the nine recursive additions

Unlike the old 17 templates, these ask for certificates of richer finite structures. Their weak-baseline descriptions sometimes explain why the baseline is inadequate; that is a scaffolding choice, not evidence that the full solution is exposed. No `network.py` oracle is mapped into `agent/workspace` in any of the nine configurations.

| Environment | Intended object inspected | Oracle placement | Static review result |
|---|---|---|---|
| recursive_gluing | Simultaneous constraints over local finite domains, including nonfunctional relations and cycles | `recursive_gluing/config.yaml:76` | Judge-only oracle; prompt accepts any valid assignment and separates unsat from runtime failure |
| recursive_gluing_discovery | Complete interface relations of a recursively specified grammar | `recursive_gluing_discovery/config.yaml:85` | Judge-only oracle; complete relation certificate, not merely one satisfying pair |
| recursive_holonomy_gluing | Two loop transport maps, flatness, common fixed states, calibration | `recursive_holonomy_gluing/config.yaml:75` | Judge-only oracle; prompt distinguishes equal maps, identity maps, and existence of sections |
| recursive_maze_gluing | Nested path search with orientation, sealing, and per-copy edge use | `recursive_maze_gluing/config.yaml:74` | Judge-only oracle; explicit full-state-search permission and nesting semantics |
| recursive_epistemic_gluing | Product-frame knowledge, compatible reports, reachability certificate | `recursive_epistemic_gluing/config.yaml:76` | Judge-only oracle; baseline explicitly treats knowledge transparently, so diagnosis remains scaffolded |
| recursive_distributed_gluing | Legal worker interleavings with spawn, queues, locks, and return values | `recursive_distributed_gluing/config.yaml:65` | Judge-only oracle; prompt states non-root spawn precondition and semantic lock-capacity effects |
| recursive_compiler_bootstrap | Submitted compiler source and independently checked compilation stages | `recursive_compiler_bootstrap/config.yaml:63` | Judge-only oracle; trusted executable seed is intentionally part of task input, not an accidental exposed answer |
| recursive_error_correcting_codes | Global field constraints plus ambiguous calibration and corrections | `recursive_error_correcting_codes/config.yaml:63` | Judge-only oracle; prompt requires all admissible identifications instead of invented uniqueness |
| recursive_coarse_graining | Exact effective spin tables, stability, and a compatible transition quotient | `recursive_coarse_graining/config.yaml:63` | Judge-only oracle; complete output contract states arbitrary valid quotients are accepted |

The reviewed judge entry points run the candidate in a subprocess and evaluate returned certificates against judge-side logic. In the inspected recursive gluing/discovery/epistemic/compiler paths, oracle budget exhaustion is reported as a judge failure rather than silently as unsat. This is a useful improvement over conflating failed search with a mathematical impossibility claim.

No severe answer leak was found on these exposed surfaces. This does not certify the large reference implementations, every generated instance, or every security boundary. The priority is to preserve that distinction in the audit record and run baseline/reference plus metamorphic checks before a new capability campaign. Current recursive results cannot be imputed to the old model campaigns, which did not contain these environments.

## Repair order

First correct prompt/judge contradictions and import-policy collisions, because they can turn valid work into a failed score. Then remove diagnosis leakage from the unassisted condition and make each advertised factor affect the intended mechanism. Add baseline and known-correct preflights, including the schema deferral candidate. Finally widen the behavioral checks and collect certificates suited to the mathematical claim. Preserve the existing runs as measurements of their original scaffold and judge; do not silently relabel them as results from the repaired benchmark.
