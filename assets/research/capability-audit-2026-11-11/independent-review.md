# Independent review of four consequential campaign claims

Reviewed on 2026-11-11 against category-analysis.md, ml-execution-analysis.md, saved episode JSONs, final submission patches and relevant current judge source. This was a read-only review; no Python or live campaign was run. Current-source explanations are distinguished from recorded checks below.

The four central interpretations are supported. Two scope refinements should be retained in the final posts: the sheaf split is specifically the extra non-finite/NaN condition after both models repair ordinary range overflow, and the augmentation result concerns the narrower C4 orbit enforced by the judge while the public prompt is less explicit.

## 1. Sheaf invariant gluing: 0/9 versus 9/9 does not mean failure to glue

**Verified.** The saved records contain nine Mercury FAILs and nine reasoning-Atria PASSes. Every Mercury record has local_run_ok=true, global_gluing_ok=true, monotonicity_ok=true and robustness_ok=false. Every Atria record has all four true. Thus none of Mercury's nine failures is a failed check named global_gluing_ok.

Mercury's nine final patches all clamp the integer bucket after computing it. In the easy/easy case, the code still converts the normalized value to an integer before clamping. For an ordinary very large finite input, tanh saturates at 1, the bucket becomes 100, and the new clamp returns 99. For positive infinity, the same tanh saturation and clamp also work. For NaN, integer conversion fails before the clamp can run. This is a source-derived diagnosis; the archived result reports the grouped robustness check, not a separate exception for NaN.

The current [judge.py:75](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/cat_theo/sheaf/sheaf_invariant_gluing/files/judge.py#L75) calls the NaN case first, followed by positive infinity inside the same try block. It does not establish robustness to every non-finite representation or every separately exposed method. In Atria's easy/easy final patch, NaN and infinity are explicitly mapped to bounded normalizer outputs before discretization. The recorded four successful checks agree with that repair.

Recommended wording: **“Atria extended the boundary repair to the judge's non-finite-input condition; Mercury repaired the named saturation defect but still failed on NaN before bucket clamping.”** Avoid “Mercury cannot handle extreme inputs” or “Atria recognized sheaf gluing and Mercury did not.” The prompt discusses large adversarial floats and global safety but gives no explicit NaN policy; this is an additional robustness requirement, not evidence of a deep sheaf-theoretic recognition gap.

Representative matched case: sheaf_invariant_gluing__naming=easy_symptom_mask=easy__seed-0. Cross-check hard/hard: sheaf_invariant_gluing__naming=hard_symptom_mask=hard__seed-0. Evidence files: category-mercury-sheaf_invariant_gluing.json and category-reasoning_atria-sheaf_invariant_gluing.json. All 18 check dictionaries were reviewed.

## 2. GNN residual convention: every submitted layer passes equivariance

**Verified.** All 18 final records have permutation_equivariance=true. Mercury has five PASSes and four FAILs; Atria has nine FAILs. Every failure has basic_run=false, while the five Mercury passes have basic_run=true.

The final patches explain the split. Mercury's easy/easy and Atria's easy/easy both use h+A h, where h is the shared node projection. Atria uses that residual pattern in eight cases and a residual degree-normalized aggregate in the ninth. Mercury's five accepted cases use A h, with no residual term. Its fourth residual-style failure projects x+A x rather than projecting first.

The mathematical argument is sound: under a node permutation, h becomes P h and A becomes P A Pᵀ; the residual result becomes P h + P A h = P(h+A h). A shared affine projection remains row-permutation equivariant, including its shared bias. Degree normalization also transforms with the node permutation. The passing archived equivariance checks are consistent with these facts.

The archived prompt asks for permutation equivariance and does not specify the exact non-residual formula. The current judge [reference at line 34](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/cat_theo/semiring/gnn_message_passing/files/judge.py#L34) demands A·proj(x) and compares it under the check called basic_run. Its identity-adjacency example makes the residual layer return 2h where the reference returns h. This is an unstated semantic convention, not a failure of the advertised equivariance property.

Recommended wording: **“Both models repaired the permutation defect; their aggregate PASS rates differ because the judge requires an undisclosed non-residual update.”** The central category report already makes this distinction correctly. Avoid calling the residual term an unequivocal model mistake in a capability summary.

Representative matched case: gnn_message_passing__naming=easy_symptom_mask=easy__seed-0. Mercury accepted comparison: gnn_message_passing__naming=hard_symptom_mask=hard__seed-0. Degree-normalized Atria case: gnn_message_passing__naming=medium_symptom_mask=easy__seed-0. Evidence files: category-mercury-gnn_message_passing.json and category-reasoning_atria-gnn_message_passing.json. All 18 final patches and check dictionaries were reviewed.

## 3. Augmentation: D4 exceeds the judge's accepted C4 orbit

**Verified, with a public-contract qualification.** Atria's two PASS patches generate quarter-turn rotations without reflections. Its seven FAIL patches include flips/reflections, and each has basic_run=true and symmetry_preserved=false. The final patches therefore support the stated mechanism; these failures are not missing-source or transport failures.

The distinction is real. A horizontal reflection of an asymmetric/chiral image generally is not any of its four quarter-turn rotations. For the 2×2 labeled image with rows (1,2) and (3,4), the reflected image with rows (2,1) and (4,3) is absent from its four-image rotation orbit. A D4 augmentation can consequently leave the C4 orbit even though it uses legitimate symmetries of a square.

The current [judge.py:40](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/cat_theo/functorial_augmentation/files/judge.py#L40) explicitly restricts outputs to C4 rotations and also requires at least three nonidentity rotations in ten trials. The public prompt says “such as 90-degree rotational invariance” and “preserving structural symmetries”; it does not explicitly state C4-only, prohibit reflections, or give the nontrivial-sampling requirement. Thus “the model chose a broader group than the judge accepted” is fully supported. “The model violated a completely explicit C4-only contract” would overstate the prompt.

Atria's comments explicitly describe rotations plus reflections as remaining in the rotation orbit. That mathematical assertion can be criticized directly: the reflected generic image is outside that orbit. Retain this concrete criticism while acknowledging that the task wording also needs improvement. Mercury's no-op repairs fail a separate, unstated nontriviality condition; those failures should not be merged with the D4 issue.

Representative Atria success: functorial_augmentation__naming=easy_symptom_mask=easy__seed-0. Representative reflected failure: functorial_augmentation__naming=easy_symptom_mask=hard__seed-0. Explicit dihedral construction: functorial_augmentation__naming=hard_symptom_mask=easy__seed-0. Evidence: category-reasoning_atria-functorial_augmentation.json; all nine final patches and check dictionaries were reviewed, with Mercury patches inspected for contrast.

## 4. MoCo inverse-square positive temperature: a confirmed erroneous PASS

**Verified for both cited examples.** Reasoning Atria's final patch changes the shared projection helper from normalize(x/tau) to normalize(x)/tau. The archived starting source invokes that helper for both q and k, computes their positive dot product, concatenates logits, and returns them without another compensating operation. Its final.json reports PASS and temperature_sensitive=true.

For nonzero features let q̂ and k̂ be unit-normalized vectors. The submitted positive logit is (q̂/τ)·(k̂/τ)=(q̂·k̂)/τ². The intended MoCo positive logit is (q̂·k̂)/τ. Doubling τ should halve a fixed-similarity logit; this implementation quarters it. Enqueued keys have norm 1/τ rather than unit norm. Mercury's cited final patch makes the same two-vector scaling change and also receives PASS.

Preserve the word **positive** when describing the inverse-square law. Negative logits depend on the stored queue's state. Newly enqueued keys inherit the extra scaling, while a preexisting unit-normalized queue can produce a different immediate temperature dependence. The ML report currently states the positive-dot-product claim correctly; a summary saying every logit always scales exactly as 1/τ² would be too broad.

The current [temperature probe at line 48](https://github.com/StrangeTcy/strangetcy.github.io/blob/main/assets/research/capability-audit-2026-11-11/source-snapshots/envs/moco/files/judge.py#L48) checks that changing temperature changes finite logits. It does not check the required inverse-temperature ratio or unit norm of queued keys. That explains why the wrong formula can pass its temperature criterion. The recorded PASS is sufficient evidence of this acceptance defect; it does not establish how many other MoCo PASSes use the same incorrect formula.

Representative Atria case: moco__naming=easy_distractors=hard_queue_math=easy_temperature=hard_visible_tests=easy_symptom_mask=hard__seed-0. Representative Mercury case: moco__naming=hard_distractors=hard_queue_math=easy_temperature=easy_visible_tests=medium_symptom_mask=medium__seed-0. Evidence: reasoning_atria-ml-archive.json and mercury-ml-archive.json; final submission.patch and final.json, plus Atria's observed pre-edit moco_model.py, were reviewed.

## Review disposition

No correction to these four numerical comparisons is needed. Keep the existing distinction between recorded verdicts and the competence diagnosed by patches. Refine any shortened summaries to preserve: NaN rather than failed gluing; residual convention rather than failed equivariance; the judge's narrower group rather than an entirely explicit prompt; and inverse-square positive logits rather than a blanket statement about every queue-dependent logit.
