# Current epistemic and unusual-substrate environment audit

Read-only inspection on 2026-11-11 of C:/Users/hatgu/rl_eval_generator, current HEAD 42295b3aece5d24109a20d08e4a39a19bdba47e9. No environment source was changed, no Python process was run, and no live model campaign was started. Current-source conclusions are separate from archived campaign observations.

Scope: all six weird_machine environments; the six archived epistemic environments; current epistemic_deception and epistemic_signaling; public-view boundaries and runner/model-policy separation for all nine interactive epistemic_families. This is a bounded source audit, not an exhaustive verification of every scorer branch.

## Findings to fix first

### E1 — High: partial deception tasks demand distinctions absent from the substantive public evidence

Source: [shared/deception_game.py:193](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L193), [message generation:195](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L195), [redaction:214](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L214), [grading:139](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L139).

The accurate branch sets the hidden fact to the positive result and the statement to the positive result. The falsehood branch sets the hidden fact to the negative result but emits exactly the same positive statement. For either branch the access record says the speaker could inspect the record. Under partial visibility, the only public statement about the independent record says the final status is redacted. Holding mode, scenario and incentive fixed, the evidence content is therefore the same for accurate and falsehood cases. The task nevertheless demands a single exact mechanism label, along with action and audit-behavior labels that can differ between those cases.

This was checked by source inspection and by extracting the two source assignments with a .NET regular expression: the accurate and falsehood message expressions are exactly equal, while the hidden-fact expressions differ. The remaining partial evidence is shared by the two non-error branches. No generated Python task was executed. The finding is equality of the public evidence multiset, not a claim that the two rendered strings are byte-for-byte equal at a particular seed.

There is a second problem in the same location: the evidence shuffle seed includes mechanism. Thus the order of otherwise identical evidence can vary with the desired answer. An agent could learn a generation artifact while lacking the information needed for a substantive attribution. Varying the order is not a legitimate replacement for giving the auditor distinguishing evidence.

Repair: either supply identifying observations, or permit an underdetermined/set-valued/posterior answer for the observational-equivalence class. Randomize presentation independently of the hidden label. Add paired tests asserting that equal permitted evidence requires equal permissible answers; where ground truths differ, calibrated uncertainty must be accepted.

### E2 — High: access is labeled knowledge, and audit adaptation is an unannounced lookup rule

Source: [knowledge assignment:194](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L194), [access wording:204](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L204), [counterfactual lookup:224](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L224), [public task:70](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L70).

All non-error mechanisms receive speaker_knowledge=knows, while the public evidence only says the speaker “could inspect” the record. Opportunity to inspect does not establish inspection, understanding or knowledge. The counterfactual answer is also assigned directly: conflicted falsehood/omission/framing gets audit_adapts, error gets audit_cooperates, and the rest get audit_unchanged. The public prompt supplies no utility table, contingent strategy, adaptation law or observed intervention that implies this rule.

The task asks a model to infer an individual actor's behavior from a mechanism label and incentive category. A wrong answer may reflect an underspecified problem rather than poor opponent modeling. This is source-backed construct failure, not an observed exploit.

Repair: give explicit information access and observation facts; distinguish could-observe from did-observe. Supply a behavioral model or ask for uncertainty over counterfactual responses. Where the objective is policy inference, create observations from that policy rather than grading an unstated stereotype.

### E3 — High for capability claims: signaling prints the scored answer table

Source: [strategic-signaling task:106](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L106), [complete policy table:119](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L119), [target selection:233](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L233).

The prompt reveals the private type and incentive, then prints the complete 2×2 table mapping those inputs to the required signal and receiver action. The generator uses exactly that table for the target. The scored incentive is copied from the prompt; mechanism follows the named signal. There is no payoff optimization or equilibrium calculation to perform, despite the text mentioning a payoff table and receiver updating. No numeric payoff table is provided.

This is acceptable as a policy-reading smoke test. It cannot bear a claim of discovering a signaling strategy or predicting a strategic receiver. Label it as the simpler task, or replace the answer table with the information and utilities from which a policy must be derived. Keep a table-reading control as a separate condition.

### W1 — High: all six weird-machine visible-test imports are malformed module paths

Each visible_tests.py imports from the MODEL_FILE placeholder, and every configuration sets that placeholder to a filename ending in .py. Generated examples therefore contain imports such as “from ci_machine.py import CIDependencyGraph”. That requests a py submodule inside ci_machine, not the ci_machine module. It is not intrinsically a SyntaxError; it is the wrong import path for the generated flat workspace.

Locations:

| Environment | Visible-test line | Configuration evidence |
|---|---|---|
| ci_dependency_graph | [visible_tests.py:1](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/ci_dependency_graph/files/visible_tests.py#L1) | [config.yaml:7](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/ci_dependency_graph/config.yaml#L7) |
| css_state_machine | [visible_tests.py:2](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/css_state_machine/files/visible_tests.py#L2) | [config.yaml:8](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/css_state_machine/config.yaml#L8) |
| regex_state_machine | [visible_tests.py:2](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/regex_state_machine/files/visible_tests.py#L2) | [config.yaml:7](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/regex_state_machine/config.yaml#L7) |
| spreadsheet_dataflow | [visible_tests.py:2](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/spreadsheet_dataflow/files/visible_tests.py#L2) | [config.yaml:7](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/spreadsheet_dataflow/config.yaml#L7) |
| sql_fixed_point | [visible_tests.py:2](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/sql_fixed_point/files/visible_tests.py#L2) | [config.yaml:7](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/sql_fixed_point/config.yaml#L7) |
| template_interpreter | [visible_tests.py:2](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/template_interpreter/files/visible_tests.py#L2) | [config.yaml:7](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/template_interpreter/config.yaml#L7) |

Archived impact is visible: Mercury attempts to repair these imports in CI easy/easy, SQL easy/hard, spreadsheet easy/easy, CSS easy/easy and regex hard/easy traces. The local check becomes an incidental broken-test repair. The final submission patches need not include test-file edits because only the intended source file is patchable.

Repair: separate module name from file name, or use the known fixed module name as the hidden judges already do. Smoke-test each generated visible-test import before publishing an instance. This is a setup defect, independent of the model's domain reasoning.

### W2 — High: regex restriction is undeclared and depends on the input variable's name

Source: [prompt requirement:25](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/regex_state_machine/files/prompt.md#L25), [AST check:47](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/regex_state_machine/files/judge.py#L47), [subscript check:62](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/regex_state_machine/files/judge.py#L62).

The prompt prohibits explicit character-by-character for/while loops. The judge additionally rejects any subscript directly applied to a step argument. Indexing a padded alias or a callback's match string escapes that rule; a range loop is rejected, but other loop forms are not covered equivalently. The required presence of a regex attribute/call is also syntactic and need not prove that regex performs the computational work.

This changes recorded outcomes. Mercury hard/easy and medium/hard final submissions use direct state_str indexing and get 0.75 rather than PASS. Easy/easy uses the same neighborhood idea via padded indexing and passes. The tests can therefore penalize a binding choice while accepting equivalent host computation through an alias. The issue is not just a hypothetical bypass.

Repair: decide the allowed substrate first. If callbacks with host indexing are allowed, state that and remove the accidental direct-argument ban. If regex must perform neighborhood extraction, state it and use a restricted, inspectable regex program format or a principled dataflow-aware validation rule. Include paired direct-input/alias submissions that must receive the same policy judgment.

### W3 — High for substrate claims: CSS judge differs from CSS

Source: [eval_css_logic:32](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/css_state_machine/files/judge.py#L32).

The judge splits selectors on the sibling combinator and checks each checkbox condition independently. It does not enforce DOM sibling order. It accepts a bare checkbox selector in its regex but interprets that as requiring checked state, even though a bare ID selector in CSS matches regardless of the checkbox state. It also treats the last matching declaration as decisive without CSS specificity.

A selector can consequently be accepted by the toy evaluator while meaning something different, or matching nothing, in a browser. The inspected campaign minterm solutions happen to use ascending checkbox order and explicit checked predicates; this audit does not claim they exploited the discrepancy.

Repair: evaluate generated rules in a real fixed DOM with a browser, or define and name this as a custom Boolean-selector language. For a restricted CSS subset, enforce sibling ordering and a single consistent cascade model. Add reversed-selector, bare-ID and competing-specificity controls.

## Additional confirmed weaknesses

### W4 — Medium: hidden CI DAGs always reveal topological order through IDs

Source: [basic and diamond graphs:63](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/ci_dependency_graph/files/judge.py#L63), [random graph generation:79](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/ci_dependency_graph/files/judge.py#L79).

Every parent is selected from earlier numeric job IDs. The generated graphs also give each non-root at least one parent, so they do not exercise multiple roots or disconnected components. A single increasing-ID pass can satisfy these cases while failing arbitrary DAG labeling, which the prompt requests. Static coverage hole; no exploit was run.

Repair: permute IDs and insertion order independently of topology; include multiple roots, disconnected components and parents with larger labels. The inspected Mercury and Atria recursive solutions do not require numeric topological order, but the judge should distinguish them from a shortcut.

### W5 — Medium: source comments announce the defect, while “surface deceptiveness” mostly renames a class

Agent-visible comments explicitly say “Buggy initial implementation” in all six:

- [ci_machine.py:13](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/ci_dependency_graph/files/ci_machine.py#L13): returns empty workflow.
- [css_logic.py:13](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/css_state_machine/files/css_logic.py#L13): returns empty rule list.
- [regex_machine.py:15](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/regex_state_machine/files/regex_machine.py#L15): identity without state transition.
- [sheet_model.py:13](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/spreadsheet_dataflow/files/sheet_model.py#L13): empty dictionary.
- [query_module.py:13](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/sql_fixed_point/files/query_module.py#L13): only one-hop direct edges.
- [template_machine.py:12](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/template_interpreter/files/template_machine.py#L12): static literal string.

These are not hidden accidental bugs the model must localize. Most are exposed implementation stubs. Even without the comments, the prompts name Rule 110, recursive reachability, the exact spreadsheet recurrence, DAG depth and Jinja control flow. The class-name axis does not conceal those instructions. Regex hard adds misleading performance advice against lookarounds; CSS adds a terminology intervention, but neither erases the basic explicitness.

Repair depends on the research question. For implementation tasks, use neutral stubs and describe results as guided construction. For recognizing latent computation or diagnosing an unknown defect, provide plausible working-looking code without answer-bearing comments, withhold the intended construction in a separate condition, and make the model localize and justify the repair. Removing the word “Buggy” alone will not create a domain-recognition test.

### W6 — Medium: spreadsheet formulas are evaluated as Python expressions

Source: [formula evaluation:31](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/spreadsheet_dataflow/files/judge.py#L31).

The checker substitutes cell references and MIN, then applies eval with builtins disabled and min/max supplied. It does not parse a closed spreadsheet grammar or execute a spreadsheet engine. Python-only expression forms can be accepted as formulas. This is a confirmed language mismatch, not a tested security exploit. The inspected successful patches use ordinary spreadsheet-style recurrence formulas.

Repair: parse the intended expression grammar or use a spreadsheet evaluator. Add expressions valid only in Python as negative controls.

### W7 — Low: template judge strips output whitespace that the task forbids

Source: [judge.py:56](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/template_interpreter/files/judge.py#L56) and [judge.py:71](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/weird_machine/template_interpreter/files/judge.py#L71).

Both template checks apply strip to rendered output before comparing it. Leading and trailing whitespace can therefore pass even though the task asks for symbol output without whitespace separators. Compare literal output or relax the stated contract to match the checker.

### E4 — Medium for interpretation: correct-answer scores do not verify explanations

Source: [type-game scoring:442](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/epistemic_type_games/files/core.py#L442), [justification validation:499](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/epistemic_type_games/files/core.py#L499); analogous truth-only scoring appears in announcements and nested knowledge.

The type-game judge checks the strategy profile, then validates only that the justification is a nonempty string below the character limit. An archived reasoning Atria PASS supplies an incorrect dominance argument for the accepted equilibrium. The analysis document gives the counterexample payoff calculation. These scores establish correct submitted answers, not correct proofs. Add best-response certificates or separate explanation review before describing a model's stated reasoning as verified.

The new deception/signaling grader is looser: its required-field tuple excludes justification entirely, despite the prompt requiring one with a length limit. It also ignores extra keys. [shared/deception_game.py:139](https://github.com/StrangeTcy/rl_eval_generator/blob/42295b3aece5d24109a20d08e4a39a19bdba47e9/shared/deception_game.py#L139). This is a smaller protocol defect alongside E1–E3; use a closed validated answer schema.

### E5 — Low: copied answer-file instructions describe the wrong epistemic task

The fragmented-observation and nested-knowledge answer skeletons still describe a sequential public-announcement task and a final restricted model. The task.md files give the relevant semantics, so this is not demonstrated to have caused a failure. Reasoning Atria repairs these docstrings in several archived submissions. Replace them with family-specific instructions so editing an answer does not require reconciling contradictory descriptions.

## Boundaries that appear deliberate, and what was not established

The older epistemic configs put core.py, instance_spec.py and relevant semantic implementation files on the judge side. The current deception/signaling layouts likewise keep the full case and deception_game.py judge-side. This audit did not establish direct access to those target objects in the agent workspace. Public likelihoods, partitions and payoff tables in the old tasks are stipulated task data; their presence alone is not an answer leak.

For the nine interactive families, the inspected public views expose candidate models, priors, public programs and permitted observations, while hidden identity/law/assignment and full audit records remain in controller fields. The views reviewed were agent_reconstruction, inquiry_control, hypothesis_discovery, evidence_process, adaptive_agents, recursive_delegation, evaluator_prediction, belief_revision and memory_inquiry. These are new interactive contracts, not the old answer.py environments.

[catalog.mjs:49](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/arena/epistemic_families/catalog.mjs#L49) writes private configuration into controller/instance.json and only the initial public view into the agent directory. [session.mjs:21](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/arena/epistemic_families/session.mjs#L21) passes a serialized current view to the policy. [model_policy.mjs:38](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/arena/epistemic_families/model_policy.mjs#L38) constructs requests from the system instruction and current view, without replaying prior conversation turns. In [memory_inquiry.mjs:66](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/arena/epistemic_families/memory_inquiry.mjs#L66), advancing clears exposure from the public view and only retained/retrieved events are supplied afterward. No persistent model-conversation leakage was established on that path.

The external argv runner is explicitly not a hostile-code OS sandbox; a fresh temporary working directory does not by itself deny filesystem reads. This is documented at session.mjs:55 and should not be represented as stronger isolation. The checked-in YAML private seeds are demo/controller inputs, not secret values if the entire repository is supplied to an agent. Public model calls currently receive the projected view, which is the relevant boundary to preserve.

No glaring direct hidden-label leak was confirmed in the inspected nine interactive public projections. That is a scoped negative finding, not a guarantee that every scorer is correct or that future packaging cannot expose controller files. No current interactive-family outcomes are inferred from the older Mercury/Atria archives.

## Priority order

Repair deception identifiability and the invented knowledge/counterfactual labels before using those tasks for capability claims. Repair visible imports and clarify/enforce the regex contract before rerunning the existing substrate suite. Decide whether signaling and surface-deceptiveness are intended as guided controls or discovery tasks. Then improve CSS/spreadsheet semantics and graph coverage. Removing conspicuous “Buggy” comments is sensible, but the deeper repair is to make the information supplied and the competence claimed line up.
