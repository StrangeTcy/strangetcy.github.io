---
title: "What Mercury & Atria Can Do with Compositional Mathematics"
date: 2026-11-11
layout: post
description: "Seventeen environments, two primary models, and the repairs behind the category-theory scores."
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

**Mercury can repair several elementary algebraic constructions. Its clearest weaknesses here are tensor representation, library precision and boundary handling. Reasoning Atria is more consistent on affine composition and NaN handling, yet also overbuilds solutions and sometimes makes confident mathematical mistakes.** That is a more useful assessment than calling either model good or bad at category theory as a whole.

The category track records 100/153 PASS for Mercury and 110/153 for reasoning Atria. For context, Mercury’s MoCo tally is 36/55: almost the same aggregate rate as its category track. The proposed contrast “good at MoCo, bad at category theory” does not describe these totals. A closer contrast does survive inspection: Mercury reliably makes several short, cued repairs, but often loses the precise relation between an abstract operation and the concrete program representing it.

The most striking sheaf score illustrates why we have to read the programs. Mercury gets 0/9 and Atria 9/9 in `sheaf_invariant_gluing`. Yet every Mercury submission passes the check named global gluing. The entire split comes from the robustness check. Conversely, Atria gets 0/9 in GNN message passing even though every submission passes permutation equivariance. These are not reasons to abandon capability analysis. They identify the capability distinctions the analysis should discuss.

This post works through all 17 archived category/compositional environments. [The companion post](https://strangetcy.github.io/2026/11/11/mercury-and-atria-reasoning-repairs-and-broken-programs.html) follows the same method across ML repair, unusual computational substrates and finite epistemic reasoning.

## How to read the comparison

The primary comparison is <span class="icon-mercury">Mercury-2.5</span> against <span class="icon-atria">Atria-Dawn-Preview</span> with high reasoning effort, called **reasoning Atria** below. Ordinary Atria means the earlier run of the same named model with reasoning disabled. Its smaller cohort and different configuration revisions make it historical context, not a controlled experiment on the reasoning switch.

Across the complete archives, Mercury has 416 recorded cases: 277 PASS, 128 FAIL and 11 infrastructure-unscored. Reasoning Atria has 415: 290 PASS and 125 FAIL. The campaigns share 415 case IDs and configuration hashes; one Atria trajectory case is missing. Among the 404 paired cases with verdicts on both sides, 239 pass for both, 38 only for Mercury, 41 only for Atria, and 86 for neither. That near tie in exclusive successes coexists with large differences on particular mechanisms. The archived worktrees were dirty and used different base commits, so equal configuration hashes do not certify byte-identical executed code.

**A correction to the earlier posts:** the archive label `compile_only` describes reference calibration. It means no behavioral reference was certified for that exact generated instance. It does **not** mean that the submitted program was merely compiled: many such judges run algebraic, behavioral or numerical tests. Those observed tests are evidence, and this analysis uses them. Treating their PASSes as mere syntax checks understates what was demonstrated.

For this track, there are nine variants of each of 17 hand-authored templates per primary model. All 306 final outcomes were tallied; easy/easy and hard/hard submitted patches were inspected across every environment, with additional inspection of failures and every patch in the central contrast families. These are repeated template variants, not 153 independent mathematical problems per model. The table retains recorded verdicts, including the reasoning campaign’s excluded category failure; removing that failure gives 110/152 rather than 110/153.

![Recorded passes in all seventeen category environments for Mercury and reasoning Atria.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/category-verdicts.svg)

*Filled dots are recorded PASSes. A gap can come from mathematics, implementation, delivery, or a judge contract; the sections below locate it.*

| Environment | Mercury PASS / 9 | Reasoning Atria PASS / 9 | Ordinary Atria PASS / 5 |
|---|---:|---:|---:|
| architecture_naturality | 9 | 9 | 5 |
| categorical_lenses | 9 | 9 | 4 |
| compositional_optimizer | 7 | 7 | 3 |
| equivariant_diagram | 7 | 9 | 5 |
| functorial_augmentation | 0 | 2 | 2 |
| gnn_message_passing | 5 | 0 | 0 |
| monadic_reward | 0 | 0 | 1 |
| neuro_symbolic_parser | 9 | 8 | 4 |
| semiring_unification | 9 | 9 | 5 |
| sheaf_invariant_gluing | 0 | 9 | 5 |
| sheaf_physical_constraints | 0 | 0 | 0 |
| sheaf_schema_sync | 8 | 5 | 1 |
| ssm_parallel_scan | 5 | 9 | 5 |
| stochastic_monad | 9 | 9 | 5 |
| tensor_functor | 6 | 7 | 2 |
| tokenizer_adjunction | 9 | 9 | 5 |
| transformer_ssm_lift | 8 | 9 | 5 |
| **Total** | **100 / 153** | **110 / 153** | **57 / 85** |


## The three contrasts that most change the story

### Sheaf invariant gluing: nine failures after nine successful gluing checks

![Both models pass ordinary, gluing and monotonicity checks in every case; Mercury fails the robustness check in every case.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/gluing-checks.svg)

*The 0/9 versus 9/9 split is localized: Mercury repairs the range defect but leaves NaN handling unresolved.*

The intended programming problem is a pipeline boundary: a normalizer feeds a discretizer that should return a bucket from 0 through 99. Large inputs make `tanh` saturate at 1, and the arithmetic then produces bucket 100. The source explicitly identifies this defect.

Mercury clamps the bucket. In **all nine** cases it passes `local_run_ok`, `global_gluing_ok`, and `monotonicity_ok`, and fails only `robustness_ok`. The concrete failing path is NaN reaching integer conversion before the clamp can act. This does not show a failure on infinity: `tanh(+inf)` is 1, and the bucket clamp already handles that endpoint. In the inspected patches reasoning Atria handles NaN before conversion; all nine Atria cases pass all four checks. The judge's robustness section includes NaN and infinity in one combined check, so its binary outcome alone does not identify both as failures. The prompt requests robust handling of large adversarial floats and global boundary safety; an explicit NaN policy would make the requirement clearer.

The observation is not “Atria recognized a sheaf gluing problem and Mercury did not.” Mercury passed the check named gluing. A more faithful judgment is: **Atria handled NaN before integer conversion; Mercury repaired the documented range defect but left that path unhandled.** That is a useful software-reliability difference. There is no family of local sections, restriction maps, or compatibility obstruction here from which to infer recognition of a sheaf-theoretic construction.

For a decisive follow-up, remove the diagnostic source comments and vary the pipeline: different normalizers, open versus closed boundary conventions, NaN policies, and incompatible component contracts. Score diagnosis, ordinary correctness, and non-finite behavior separately. This distinguishes repair generalization from following a named symptom.

### GNN message passing: every permutation check passes

The prompt asks for permutation equivariance: reordering nodes and the adjacency matrix must reorder the output in the same way. The defective implementation adds the first two nodes' features to every node. That is an arbitrary coordinate bias, and the source tells the model to replace it with matrix multiplication.

Reasoning Atria submits the residual update `h + A h` in eight cases, where `h` is the shared linear projection of the node features; its ninth also normalizes the neighbor aggregate by degree. Mercury's four failures comprise three `h + A h` updates and one projection of `x + A x`; its five passes use the non-residual `A h`. **All 18 submissions pass the permutation-equivariance check.** All 13 failures occur at `basic_run`, which silently requires exact equality to `A h`.

The residual update is permutation equivariant: replacing `(A,h)` with `(P A P^T,P h)` produces `P h + P A h = P(h+A h)`. It also preserves the original source's explicit self-feature term. Therefore the prompt/reference mismatch is substantive. The 5/9 versus 0/9 result is not evidence that Mercury understands equivariance better. It measures which model chose the judge's unstated residual convention.

Ordinary Atria's easy/easy patch uses the same residual update and receives FAIL. Its 0/5 outcome is consistent with the same interpretation, not with a reasoning-specific regression. Repair the contract by stating the required aggregation formula or accepting residual and other allowed equivariant constructions while testing equivariance independently.

### SSM parallel scan: an operator representation error, plus a false diagnosis

![Affine composition must preserve chronological order and the elementwise representation of its operators.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/affine-composition.svg)

*Both chronological and reverse-order affine composition are associative. The intended chronology and tensor encoding distinguish them.*

For chronological affine updates, apply `(u1,M1)` first and `(u2,M2)` second:

`x -> M1*x + u1 -> M2*(M1*x+u1)+u2`.

The composite is `(M2*u1+u2, M2*M1)` when `M` is represented as an elementwise/diagonal operator. Reasoning Atria uses that composition in all nine cases, often with an explicit derivation, and passes both semantic and associativity checks. Mercury does so in five cases. In its **four** failures it changes `*` to matrix multiplication `@`. The judge supplies 4-by-8 arrays, so that replacement does not implement the specified elementwise representation and fails both checks. Ordinary Atria's sampled patch gives the same correct derivation and its five cases pass.

This is good evidence that Atria more consistently tracked the concrete representation in this family. Mercury sometimes reached for a familiar matrix formula without reconciling it with the actual tensor shapes. It is not evidence that Mercury never understands affine composition: five submitted repairs are correct.

The environment itself says the original reverse-order composition is non-associative. That is false. `(u1,M1) star (u2,M2) = (M1*u2+u1,M1*M2)` is the opposite affine composition and is associative. Expanding either parenthesization yields `M1*M2*u3 + M1*u2 + u1` and `M1*M2*M3`. The defect is chronological interpretation, not the algebraic law. “M is a transition matrix” in the source also obscures the diagonal/batched encoding used by the judge. A useful rewrite would require a chronological rollout and separately vary scalar, diagonal, and dense representations.

## The rest of the environments, with the actual repairs

### Architecture naturality — 9/9 versus 9/9

The intended domain is compatibility of a neural component conversion with temporal restriction. Both inspected models replace multiplication of `x[:, :8, :]` with multiplication of all of `x`. All 18 final records pass shape execution and `naturality_commutes`. Both can carry out this pointwise repair when the hard-coded slice is named in the source. This is weak evidence about general natural transformations: the prompt and comments identify the location and the offending operation, and the hard naming condition mainly changes the class name. Test unseen restrictions, multiple components, and noncommuting transformations to learn whether the concept transfers.

### Categorical lenses — 9/9 versus 9/9

The object is a pair and the lens focuses on its first coordinate. The setter incorrectly replaces the second coordinate with zero. Both models change `(a,0.0)` into `(a,s[1])`, preserving the untouched coordinate. All 18 records pass PutGet, GetPut, and PutPut. This is a clean, small law-respecting repair, but the source already states which coordinate is lost and which law is violated. It supports competence with this elementary product lens, not arbitrary lens composition. Ordinary Atria is 4/5 with one source-validation failure; that is a different failure layer from violating a lens law.

### Compositional optimizer — 7/9 versus 7/9, different mechanisms

The defect is shared class-level state: distinct momentum steps overwrite the same buffers. Both models' sampled successful patches move the state into each instance. Mercury's two failed patches also do that, but change the returned update into an in-place parameter update (`p.sub_(v)` or `p.add_(v)` then return `p`). They pass shape execution and fail the exact reference calculation. That is a concrete contract drift beyond the required repair.

Reasoning Atria's seven behaviorally evaluated patches pass the state check; its other two cases fail for an empty patch and a disallowed `weakref` import. Some Atria patches add composition classes and explanatory prose that the judge never exercises. The judge tests one step through two momentum instances, not three-way regrouping or several training steps. Equal PASS counts therefore hide a small Mercury semantic failure and Atria submission/policy failures. They also do not establish the broad associativity claim in the prompt.

### Equivariant diagram — 7/9 versus 9/9

The issue is zero padding on a cyclic spatial domain. Successful patches use circular padding so convolution commutes with `torch.roll`. Both models' easy/easy and hard/hard repairs do this. Mercury's two failures use the nonexistent mode name `cyclic`: once in `nn.Conv2d`, once in `torch.nn.functional.pad`. The first produces an explicit allowed-modes error; the second fails both execution and equivariance checks. Atria uses `circular` throughout and passes all nine.

This is primarily an API precision difference. Mercury identifies wraparound behavior but sometimes selects the wrong identifier. The source directly supplies the boundary diagnosis. Calling the failures “failed to understand equivariance” would discard their most useful detail.

### Functorial augmentation — 0/9 versus 2/9

![Four rotations preserve one chiral pattern’s orbit; adding reflections can move outside it.](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/figures/rotation-reflection.svg)

*The judge accepts C4 rotations. Seven reasoning-Atria repairs add reflections; the public contract should state the permitted group explicitly.*

The judge accepts only the orbit of rotations by multiples of 90 degrees. The public prompt mentions such rotational invariance as an example of geometric preservation, but does not explicitly restrict augmentation to C4 or prohibit reflections. Mercury's easy/easy patch supplies the four angles as the `degrees` argument to `RandomRotation`; torchvision expects a two-endpoint interval and raises an error. Across the nine Mercury cases there are three runtime errors and six failed behavioral evaluations. The hard/hard patch sets affine rotation and shear to zero, making a no-op; the judge requires nontrivial rotations on at least three of ten trials, another requirement absent from the prompt. Another case fails even shape execution.

Reasoning Atria's two successful patches sample only C4 rotations with `torch.rot90`. Its **seven** failures add reflections, sampling from the larger dihedral group D4. Their shape checks pass and their C4-orbit checks fail. Rotation invariance does not imply reflection invariance: a reflected chiral pattern can leave the original rotation orbit. Atria's prose sometimes treats membership in the larger group as sufficient for preserving the relevant invariants, which is too broad without specifying those invariants. The observed result is a mismatch between the chosen group and the group accepted by the judge. Because the public contract is vague, it is not an unambiguous violation of an explicit C4-only instruction.

A useful hypothesis is that Atria sometimes chooses a familiar richer construction under an underspecified contract. It can name a group and implement its transformations while choosing a broader group than the evaluator permits. Mercury's failures combine specification ambiguity with library misuse and the judge's unstated nontriviality rule. A follow-up should state C4 explicitly, state the sampling requirement, and include tasks where reflection is permitted versus prohibited; persistence of the D4 substitution in the explicit C4-only condition would provide stronger evidence of model error.

### Monadic reward — 0/9 versus 0/9, before monad behavior was judged

The task asks the model to move logging from global state into a State Monad and stop executing coordinate strings as code. The source names both defects. Mercury has **eight** `source_invalid` results reporting disallowed `ast`; one other result is `invalid_action`. Reasoning Atria has **nine** disallowed-`ast` results. Sampled patches replace `eval` with `ast.literal_eval` and return a state transition that produces a new log. None of those 17 submissions reaches behavioral evaluation.

The dominant result is a harness-policy collision with a standard safer parser. The current allowlist adds `monad` but not `ast`. It does not prove these patches would satisfy every monad or security requirement if admitted; it proves the recorded zero cannot answer that question. Ordinary Atria's easy/easy PASS uses a manual integer-coordinate parser and threads the log without importing `ast`. Its other four cases are source invalid. This shows the task is not categorically impossible; it also shows how easily the score becomes a parser-policy test.

### Neuro-symbolic parser — 9/9 versus 8/9

The code replaces a detached hard minimum with differentiable soft minimum. The starting source gives the complete log-sum-exp formula. Mercury's sampled solutions copy the direct exponentiation formula and pass shape and gradient checks. Atria's sampled successes use a numerically stabilized form. That additional engineering quality is not reflected in identical PASS scores, because the judge tests only small positive inputs at temperature 1.

Atria's one failing patch, hard/easy, uses a maximum shift with inconsistent signs. It effectively introduces an extra `-2*max(x,y)` term rather than preserving the soft-min expression, and fails the gradient check. That is a concrete numerical derivation error. Its existence prevents a blanket claim that longer reasoning yields more careful numerics.

Two useful follow-ups are independent: test the scalar output value (currently absent from the judge), and test numerical stability with large magnitudes and varied temperatures. Direct exponentiation can overflow or underflow by ordinary floating-point arithmetic; this is a static risk in Mercury's sampled implementations, not a new executed result.

### Semiring unification — 9/9 versus 9/9

The target is a generic matrix multiply over arithmetic, tropical/min-plus, and Boolean semirings. Both models restore tropical zero to positive infinity, tropical one to zero, tropical multiplication to addition, and the Boolean identities to false/true. All 18 final records pass the three domain checks. This supports their ability to implement these elementary algebraic identities, with the limitation that comments state the expected values and the prompt supplies the tropical operation. It does not measure discovering a semiring abstraction from an unlabelled algorithm.

### Sheaf physical constraints — 0/9 versus 0/9

The real object is a three-route allocation with overlapping pairwise switch constraints and a total backbone cap. Mercury's sampled repair iteratively scales overloaded pairs and the global total. Across its nine cases every low-demand check passes; three pass the local overlap check and six the global check, never both. Its easy/easy sequential scaling breaks the symmetry demanded by the global test.

Atria's easy/easy repair implements max-min water filling. For clipped demands `(100,60,0)` it naturally yields `(50,50,0)`, a feasible max-min allocation. The hidden local test instead insists on a roughly 5:3 ratio, corresponding to proportional allocation `(62.5,37.5,0)`. That fairness objective is absent from the prompt. Atria's easy/easy and hard/hard cases pass the low-demand and global checks and fail this local ratio check. Across all nine Atria cases, two terminate with invalid actions; seven reach the judge, all seven fail the local ratio check, and only three pass the global check.

The models do not consistently meet this judge's target. The records also do not establish that they cannot combine local constraints: feasible alternative allocation policies are rejected, and some failures are genuine order/symmetry issues. Separate feasibility, symmetry, utilization, and the declared fairness objective. A category-theoretic claim needs a family of overlaps and gluing obstructions, not merely a fixed triangle with an undisclosed optimization target.

### Sheaf schema sync — 8/9 versus 5/9

The concrete repair concerns circular SQLite foreign keys. Successful sampled patches use deferred constraints and transactions, or preserve the already-deferred schema while adding an explicit transaction. Mercury's lone failure passes schema creation and foreign-key preservation but fails the insertion/consistency check; its patch adds only `PRAGMA defer_foreign_keys = ON`. The archive does not provide a specific exception for that failed check, so the precise reason remains unresolved.

All five Atria patches that reach behavioral evaluation pass all three checks. The remaining four are two empty patches and two disallowed `threading` imports. Several Atria solutions expand into hundreds of lines of migration, retry, and query scaffolding. That supports a hypothesis about overbuilding under a restrictive interface, not a finding that Atria understands circular dependencies less well.

Its mathematical narration also needs scrutiny: one failed patch describes a directed foreign-key cycle as “a poset ... whose Hasse diagram is a cycle.” A directed cycle among distinct elements cannot be a poset's Hasse diagram. The implementation may use valid database techniques while the surrounding categorical terminology is unreliable. Code success and mathematical exposition require separate review.

### Tensor functor — 6/9 versus 7/9

The program applies a shared channel projection to a batch of spatial tensors and must cooperate with batching, resizing, and automatic differentiation. Successful Mercury and Atria patches move the channel axis to the end, apply the linear map, and move it back. All four named checks pass in those cases.

The failures reveal a shared vulnerability. Mercury's medium/medium patch flattens `(B,C,H,W)` directly to `(-1,C)` without moving the channel axis, so it projects adjacent spatial values instead of channel vectors. Atria's hard/medium patch makes the same flattening mistake while describing itself as coordinate free. Atria's medium/medium patch assumes channels are already last. Both cases fail execution/reference, batching, and dynamic-shape checks; only one retains the tested Jacobian property. Other Mercury failures include a bad layout restoration and a stale return variable after an otherwise sensible permutation edit.

This is concrete evidence of unreliable tensor-axis bookkeeping in both models. Category-theoretic vocabulary in a docstring does not rescue an incorrect representation. Vary axis order, equal-sized dimensions, and nesting of vectorization to test whether repairs follow the semantics or the familiar visual shape of a tensor expression.

### Stochastic monad — 9/9 versus 9/9

Both models move sampling inside the returned computation instead of sampling once during `bind`. All 18 records pass left identity, right identity, and independence. The repair restores lazy stochastic computation and prevents repeated draws collapsing to one sampled value. This is useful evidence of handling a simple effect-timing bug, aided by a comment that states exactly that bug. It does not cover general probability-monad reasoning or complicated dependent sampling.

### Tokenizer adjunction — 9/9 versus 9/9

Both models restore spaces from the special `Ġ` marker and join the tokens. Every final record passes reconstruction, spacing, and the check named `adjunction_unit`. The programming behavior is simple and successful.

The mathematical label is too strong. `T D T = T` is a regularity/retraction-like identity; it is not by itself a definition or proof of an adjunction or Galois connection. No order relation, hom-set correspondence, or unit/counit naturality is supplied. The tokenizer also maps both a literal `Ġ` and a space to the same token, so full arbitrary-Unicode inversion is impossible without escaping or restricting the domain. Neither model's 9/9 establishes the broad mathematical claim in the prompt.

### Transformer-to-SSM lift — 8/9 versus 9/9

Both models' successful repairs replace lossy temporal mean pooling with the key-value contraction `K^T V`, using batched matrix multiplication or equivalent `einsum`. The resulting state preserves the judge's unnormalized linear attention readout `Q(K^T V) = (QK^T)V`. Mercury's one failure is a malformed edit leaving an unexpected indentation; Atria passes all nine. This is evidence of the contraction repair, not a general equivalence between softmax attention and a fixed recurrent state. The judge's reference is linear attention and should be named that way in any post.

## Hypotheses worth testing

1. **Mercury's gap is partly execution precision under a short-repair strategy.** Evidence includes `cyclic` versus `circular`, the invalid four-angle `RandomRotation` call, missing NaN handling, and matrix multiplication substituted for elementwise affine composition. Remove source hints, match tensor representations, and record diagnosis separately from valid implementation. A persistent gap there would support this explanation.
2. **Reasoning Atria may overgeneralize a familiar construction or enlarge the program beyond what the evaluator accepts.** D4 under a vague prompt with a C4-only judge, residual message passing under an undisclosed non-residual reference, extra forbidden imports, and long migration scaffolding provide different examples. Some are model mistakes; some are benchmark ambiguities. State the contract fully and compare minimal and expanded repairs to separate them.
3. **Both models are vulnerable to representation changes even when they use the right abstract words.** Tensor flattening failures and the SSM `@` error make this more concrete than “transformers are bad at category theory.” Test matched representations of the same mathematics, including counterexamples where a familiar implementation ceases to commute.
4. **The old category track chiefly measures scaffolded implementation repair.** Every one of its 17 source templates has a `BUG:` comment. Several supply the replacement formula or constants. To measure recognition, supply symptoms without diagnosis and require a witness, counterexample, or commuting-law explanation on a fresh instance. To measure gluing, use actual local-to-global compatibility problems.

“Transformers suck at category theory in general” can be written as a conjecture someone wishes to test. These runs cannot substantiate it: the architectures and reasoning treatments are not isolated, the mathematical domains are only thinly sampled, and many scores respond to API syntax or judge contracts. The stronger research result is the identified failure mechanisms and a set of experiments that could separate them.

## The current recursive environments are a different opportunity

The nine current `recursive_*` environments were not part of these 17-environment archived cohorts. Their contracts are more substantive: finite relational gluing, recursive interface summaries, two-loop holonomy and common fixed states, nested route search, product-frame epistemic logic, interleaving schedules, a compiler bootstrap certificate, finite-field block codes with calibration ambiguity, and exact coarse-graining with a transition quotient.

Their reference/oracle modules are placed under the judge, not copied into the agent workspace. A new campaign on these environments could answer more of the original research question, especially if it records counterexamples and intermediate certificates. Their presence today must not be used retroactively to describe what Mercury or Atria solved in the older archive.

## The experiment that would resolve the broad hypothesis

The broad conjecture “transformers struggle with category theory” needs a definition of struggle, tasks whose mathematical content is substantial, and a comparison that can isolate architecture. These archives contain one named Atria model in two historical settings and one Mercury model, not an architecture experiment. Ordinary Atria’s 57/85 category result is useful context; its sampled manual coordinate parser, correct affine composition and residual GNN update help interpret the failure layers. They do not estimate the causal effect of enabling reasoning.

A tractable first study can test a narrower conjecture: **these models recognize familiar algebraic patterns but are brittle when the same structure changes representation or must be recovered without a supplied diagnosis.** That predicts a drop under structural transfer, not merely under unfamiliar terminology. The successful lens, semiring and stochastic-binding repairs are positive controls. Tensor-axis errors, diagonal-versus-matrix scan errors and the augmentation group mismatch are the motivating failures.

| Intervention | Keep fixed | Observe | What would change the interpretation? |
|---|---|---|---|
| Remove the diagnostic comments | Contract, starting behavior, tests | Fault localization and final repair | A collapse only without hints points to diagnosis, not inability to execute the repair. |
| Change the representation | Same law; diagonal, dense, reordered axes | Correct formula, layout and numerical output | Errors tracking representation rather than law names support the representation hypothesis. |
| Require a counterexample or certificate | Same problem and answer budget | Correctness of both artifact and witness | Fluent terminology with invalid witnesses exposes a gap between exposition and mathematical control. |
| Add genuine compatibility obstructions | Local sections, explicit overlaps, global target | Gluable cases versus justified impossibility | Correctly separating both outcomes supplies stronger evidence for gluing competence. |
| Compare several models and repeated seeds | Interface, budgets, tools, source snapshot | Within-model variation and replicated family differences | Only a replicated architecture-associated gap would justify broadening the claim. |

The nine current recursive environments provide plausible material for that study. They need baseline/reference preflights and their own campaigns; no such runs are implied here. For the existing archive, my provisional judgment is that **both models possess usable fragments of compositional reasoning, while neither has demonstrated reliable general command of the advertised category-theoretic domain**. Reasoning Atria’s advantage is strongest where the patch must preserve the chosen affine representation or anticipate NaN. Mercury’s successes are substantial, but its representation errors are too systematic to dismiss as isolated spelling slips.

## Evidence & reproduction

The accompanying [comparison table](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/campaign-comparison.md) covers all 38 environments with main-campaign records and the earlier 194-case ordinary-Atria cohort. The latter shares 131 case IDs with each later campaign, but none of those pairs has the same configuration hash. Snapshot 56 and snapshot 62 are not counted as separate ordinary-Atria campaigns.

Archived evidence comes from `mercury-pairwise-state-38873207827.zip`, `reasoning-atria-pairwise-state-39028365163.zip`, and `atria-campaign-state-62.zip`. Their SHA-256 values are recorded in [archive-hashes.json](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/archive-hashes.json). Each detailed evidence record retains the case ID and the archive member path for the final patch, final judge output, and available observations of the task/source. Counts concern final recorded verdicts; partial successes and protocol failures are explained in the text without silently rewriting those verdicts. No confidence interval here treats template variants as independent samples of mathematical competence.

The current-environment inspection used repository commit [42295b3](https://github.com/StrangeTcy/rl_eval_generator/tree/42295b3aece5d24109a20d08e4a39a19bdba47e9), with [exact inspected source hashes](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/current-source-hashes.json). Current source is used for the separately identified audit, not substituted for historical task observations. The [current environment audit](https://strangetcy.github.io/2026/11/11/current-environment-audit-50-configured-tasks-and-9-interactive-families.html) lists confirmed defects, static candidates and the inspection coverage.

Category evidence: [all final outcomes and contrast summaries](https://strangetcy.github.io/assets/research/capability-audit-2026-11-11/category-evidence.json), plus one extracted episode collection per model/environment (named `category-mercury-ENV.json` or `category-reasoning_atria-ENV.json`). The [domain audit](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/category-current-audit.md) gives the source locations for leaked diagnoses, inert settings and judge mismatches.

{% endraw %}
