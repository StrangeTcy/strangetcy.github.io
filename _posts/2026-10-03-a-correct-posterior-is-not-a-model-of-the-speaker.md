---
title: "A Correct Posterior Is Not a Model of the Speaker"
date: 2026-10-03
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>The argument here is a reading discipline. It separates three questions: what an observation tells you, which world you now favour, and who supplied the speaker's behaviour. The recursive follow-up is a proposal. It has not been run.</dd>
  <dt>Synthesis</dt>
  <dd>Seven selected case records from one archived evaluation campaign, an inspected clean-source comparator for the task, and prior literature cited as context.</dd>
  <dt>Prose</dt>
  <dd>Different language models drafted and improved this article; StrangeTcy made the final edits.</dd>
  <dt>Certainty</dt>
  <dd>High for the seven recorded judgments; unresolved for exact executed-source identity; none for generalisation beyond these cases.</dd>
  <dt>Importance</dt>
  <dd>Moderate. Treating a calculation as a capability costs little to do and a lot to undo.</dd>
</dl>

I ran an evaluation campaign across a set of generated environments. The previous post presented the raw results, then mapped them in family charts and case heatmaps. One environment, `epistemic_games`, gave the model two possible worlds and asked it to update a probability after seeing a player's announcement. This post zooms in on the seven selected cases from that environment.

In the inspected clean-source comparator, World 1 is the “genuine” hypothesis and World 2 the “strategic” one. Each case supplies a prior probability for World 1 and the likelihood of the observed announcement under each world. The prior is the starting probability before hearing the announcement; the likelihoods say how probable that announcement would be if World 1 or World 2 were true. Most cases use a balanced $1/2$ prior; one starts with a skewed prior that already favours World 1: $3/5$. The posterior, $P(W_1 \mid o)$, is the probability of World 1 after the announcement; a separate evidence verdict says whether the announcement distinguishes the worlds. These source details come from the clean comparator, not a certified copy of the code that ran. The run's source could not be matched definitively to the clean comparator because the repository was dirty (the source tree was recorded as dirty). All 33 selected configuration hashes match the clean comparator, but that does not prove that the executed task, judge, or helper code was identical.

One archived answer in the skewed-prior case reports $P(W_1 \mid o)=3/5$, calls the evidence *indistinguishable*, and names World 1 as the more-supported world. Those outputs are consistent: the prior already put World 1 at $3/5$, and the announcement is equally likely under both worlds, so the posterior stays at $3/5$. World 1 is favoured before and after the observation, while the observation itself adds no evidence.

That accounting point leads to a larger one. A model can update correctly on what a speaker said without having worked out *why* the speaker would say it. The task is called epistemic games, and its narratives talk about “genuine” and “strategic” speakers. But the inspected implementation supplies the speakers' behaviour in a table rather than deriving it through recursive strategic reasoning.

So I want to keep three questions apart throughout:

1. **Does this observation discriminate between the worlds?**
2. **Which world is more probable after seeing it?**
3. **Who supplied the account of what each world would produce?**

The judge scores answers to the first two. In the inspected comparator, the answer to the third is “the task did.” Its design description says this version does not implement a fully recursive level-$k$ engine with utilities and recursive belief updates. Instead, it describes the target as Bayesian inference over two specified behavioural policies, presented through genuine-versus-strategic narratives.

Within those limits the result is clean. Atria-Dawn-Preview passed all seven selected cases with score 1.0. Each final result credits the posterior, the likelihood-ratio verdict and the most-supported world, and records the consistency and provenance checks as passing.

This is a real success on a specified Bayesian update, not evidence of recursive [theory of mind](https://en.wikipedia.org/wiki/Theory_of_Mind).

## Three fields, three questions

The inspected task gives the model two hypotheses, $W_1$ and $W_2$, a prior over them, an observed announcement $o$, and a likelihood for that announcement under each stipulated behavioural policy. The update is ordinary two-hypothesis Bayes:

$$
P(W_1 \mid o) = \frac{P(o \mid W_1)\,P(W_1)}{P(o \mid W_1)\,P(W_1) + P(o \mid W_2)\,P(W_2)}
$$

The numerator asks how plausible World 1 was to begin with, and how likely World 1 would be to produce this announcement. The denominator applies the same question to both worlds, so the result is a proper probability.

The odds form is easier to read, because it separates the two contributions:

$$
\frac{P(W_1 \mid o)}{P(W_2 \mid o)} = \frac{P(W_1)}{P(W_2)} \cdot \frac{P(o \mid W_1)}{P(o \mid W_2)}
$$

The first factor on the right is where you stood before the observation. The second factor is the likelihood ratio: what the observation itself contributes. The task's evidence verdict is about the second factor. The most-supported-world label is about the left-hand side.

The $3/5$ case is straightforward once the prior is explicit. In the ambiguous-evidence condition, both worlds produce the announcement with equal likelihood. The likelihood ratio is 1, so the observation contributes no evidence. With a balanced prior, the posterior stays at $1/2$ and neither world leads. With the skewed prior, the posterior stays at $3/5$, or odds of 3 to 2 for World 1. World 1 leads because of the prior, not because the announcement advanced it.

“More supported” and “indistinguishable” are answers to different questions. Someone who changes the evidence verdict because the posterior is not one half has merged two outputs that the judge deliberately keeps apart.

## What was answered

Four selected cases use paired presentation, bare-table framing and the “report” scenario. Values below are judge-credited reference answers, not measurements of how speakers behave.

| Evidence, prior | Posterior for World 1 | Evidence verdict | More-supported world |
| --- | ---: | --- | --- |
| Ambiguous, balanced | $1/2$ | Indistinguishable | Neither |
| Ambiguous, skewed | $3/5$ | Indistinguishable | World 1 |
| Strong, balanced | $1/15$ | Distinguishable | World 2 |
| Weak, balanced | $92/177$ | Weakly distinguishable | World 1 |

**A note on precision.** The model reported decimals rather than fractions. The judge credited those decimals against the exact reference fractions $92/177$ and $1/15$. “Exact” here describes the reference the judge checks against. It does not mean the model printed a fraction.

The plot shows each selected case's prior and judge-credited posterior on the same probability scale. Cases A–G use the same labels as the heatmap below; for each row, the open circle is the configured prior and the filled diamond is the posterior.

![Prior probabilities (open circles) and judge-credited posteriors (filled diamonds) for the seven cases. The balanced ambiguous cases stay at 1/2; the skewed ambiguous case stays at 3/5; strong evidence shifts the posterior to 1/15; weak evidence gives 92/177. Each pair is one selected case.]({{ '/assets/figures/family-maps/epistemic-games-prior-posterior.svg' | relative_url }})

*The horizontal position encodes probability of World 1. Overlapping markers show no update; each row is one selected result, not a replicate.*

The strong and weak rows separate *how much* the evidence shifts the posterior from *which way* it shifts it. With a balanced prior, the prior odds are 1, so the posterior odds equal the likelihood ratio. In the strong case, $1/15$ leaves World 1 far behind; the evidence favours World 2 heavily. In the weak case, $92/177$ sits just above one half, so the odds lean only slightly towards World 1.

These descriptions are derived from the credited posteriors and priors. They are not a speaker-policy table that anyone inferred. For these two cases the judge checks the posterior value and, separately, whether the evidence falls in the correct likelihood-ratio band. I don't know the band thresholds and won't invent them. I don't need them to see that a near-coin-flip posterior and a “weakly distinguishable” verdict are distinct claims, and that the model got both right.

The other three selected cases each change one setting from the base case: narrative framing, solo presentation, or the scenario labelled “trap.” All three retain ambiguous evidence and a balanced prior, and all three return $1/2$, “indistinguishable” and “neither.” The trap label needs a little unpacking. In the source template's story version, a player may have noticed a trap, and a site official's decision about assigning a follow-on inspection depends on the player's answer. The selected trap case used bare-table framing, though: the model saw the prior, the two announcement policies and the transcript, not that story. Here, “trap” identifies the scenario template; it is not a narrative cue the model saw.

## Where did the likelihoods come from?

This is where the task's boundary sits.

Every row above depends on two numbers: $P(o \mid W_1)$ and $P(o \mid W_2)$. In a recursive strategic setting, those numbers would be the hard part. A speaker who knows a listener is watching chooses what to announce based on what they expect the listener to infer. The listener knows that, and the speaker knows the listener knows. The likelihood of an announcement comes out of that regress, together with whatever utilities drive it.

The framework I have in mind for a follow-up sits in the Bayesian level-$k$ tradition. For one formal example, [Ho, Park, and Su's *A Bayesian Level-k Model in n-Person Games*](https://doi.org/10.1287/mnsc.2020.3595) describes higher-level players updating beliefs about opponents' reasoning levels and best-responding. That is a reference point for specifying a new task, not a description of what this campaign ran.

In the inspected comparator, that regress is not present. An evidence table supplies the likelihoods for two stipulated policies. The genuine-versus-strategic narrative explains *why* a speaker might announce one thing rather than another, but it doesn't generate the table. Bayesian inference is performed on numbers that arrive already computed.

I don't think this is a flaw in the task. Supplying the policies isolates the update, and that is valuable. If an answer is wrong, you can tell whether the posterior, the verdict or the label went wrong. You don't have to wonder whether the model's theory of the speaker simply differed from the evaluator's. The task is well specified and has a unique answer, and the environment carries a public Bayesian-oracle behavioural self-test that was recorded as executed and passed.

The same isolation limits what a pass can mean. Giving a reasoner a likelihood table and checking that it uses the table correctly is a different test from checking whether it could build that table from interacting minds.

This boundary cuts only one way: the archive doesn't show that Atria-Dawn-Preview *cannot* reason recursively. It shows nothing in either direction about that. A passing final answer doesn't reveal the procedure behind it. The model might have done explicit arithmetic, used some other reliable route, or something else. The archive contains no evidence that the model inferred a policy table, built an opponent model or updated beliefs recursively over several strategic agents. The task never asked it to.

The oracle self-test also needs to stay in its own box. It is an environment-level check that the task's reference machinery behaves as intended. It is separate from the per-case calibration and final judgment on each answer. It isn't an eighth model answer, and its existence says nothing about how the model produced its seven.

## Seven green cells are not a robustness curve

The heatmap lays out the categorical settings and outcomes for all seven selected cases. Case A is the base setup; each of the other rows changes one setting at a time. The green outcome cells show what happened on those single selected runs, not a response curve across repeated samples.

![Heatmap of the seven epistemic-games cases, listing scenario, evidence, prior, presentation, framing, judge mode and outcome. Each row is one selected case; every case passed under behavioral-reference judging.]({{ '/assets/figures/family-maps/epistemic-games-heatmap.svg' | relative_url }})

*The factor values are categorical, and each row is one seed-0 case—not a replicate.*

It is tempting to read seven perfect scores across five axes (evidence, framing, presentation, prior and scenario) as evidence that framing or presentation has no effect, or that the model resists narrative pull in general. The design can't support any of those conclusions.

There is **one selected seed per case**. There is one model and one configuration. The axis comparisons are sparse substitutions of one factor at a time around a fixed base cell, not an interaction grid. Exactly one case uses narrative framing, one uses solo presentation and one uses a skewed prior. When the narrative case and its bare-table counterpart both pass, all we learn is that neither of those two cells failed. That is not a framing effect of zero, and it is certainly not a robustness estimate over a population of stories.

These seven cases are also not seven independent draws from “strategic situations.” They are hand-varied neighbours of each other. Five of the seven share ambiguous evidence, where the correct move is to leave the prior alone.

All seven cases use behavioural-reference judging, which scores answers against a reference. Compile-only results elsewhere in the campaign are exploratory and excluded from validated behavioural aggregates. None of these seven is compile-only; the distinction keeps them from being pooled with outcomes judged under weaker guarantees.

## What a recursive test would have to specify

If someone wants to measure what the task's name suggests, the seven current cases make a good calibration floor. They check that the update itself is sound. A recursive layer above them would be a different and separately specified experiment. I am proposing it here, not reporting it.

*I plan to develop the recursive version as a separate post and will add a link here once it is written.*

At a minimum, it would need:

- **Base policies and utilities**, so that a speaker's choice of announcement follows from what they want rather than from a table.
- **An information structure**: who observes what, in what order, and how player and observer moves alternate.
- **Belief-update rules**, so the regress has a defined depth and a defined fixed point, or at least a defined truncation.
- **A mapping from beliefs to public actions**, so that the likelihood of an announcement is something the model must *derive*.

The model would then predict how each world's speaker acts, turn that into observation likelihoods, and only then compute the posterior.

The scoring has to keep those stages apart. If only the final fraction is judged, an incorrect speaker model could produce a correct posterior through errors that happen to cancel. The policy predictions need a reference check of their own.

The design would also need unseen policy structures and likelihoods rather than public ones, multiple seeds per cell, and perturbations that change one player's information or incentives while holding everything else fixed. A natural stress test would put a narrative cue in tension with the generated evidence. That would be a new condition. I don't claim the current trap case did this.

There is one trap in the design itself. If the evaluator withholds the likelihood table without fully defining how actions are generated, the problem may no longer have a unique posterior. Removing necessary information makes a task underdetermined, which is not the same as making it test a deeper model of another agent.

Other researchers have already made social and epistemic reasoning precise in other ways. [MindGames](https://aclanthology.org/2023.findings-emnlp.303/) uses dynamic epistemic logic to build controlled theory-of-mind problems. [Hi-ToM](https://aclanthology.org/2023.findings-emnlp.717/) targets higher-order recursive beliefs and deception. [BigToM](https://proceedings.neurips.cc/paper_files/paper/2023/file/2b9efb085d3829a2aadffab63ba206de-Paper-Datasets_and_Benchmarks.pdf) uses causal templates to generate social-reasoning evaluations. These target different constructs with different machinery. They don't validate anything in this campaign, and this targeted comparison is not a novelty claim. Their relevance is simple: careful work already exists on the construct that the name “epistemic games” points to. A seven-item supplied-likelihood update should not be presented as a new benchmark of it.

Even a stronger test would score observable outputs; it still would not reveal the model's private reasoning. It would move the evaluation closer to the capability this article is discussing.

## What the 3/5 answer licenses

Back to where I started. World 1 sits at $3/5$, and the announcement is indistinguishable between the worlds. Atria-Dawn-Preview got that right. It also got the six other selected behavioural-reference cases right, as recorded.

**The evidence licenses this:** on the seven selected cases, the model returned answers credited as correct for the posterior, the likelihood-ratio verdict and the most-supported world, with consistency and provenance checks passing. This was Bayesian inference over two behavioural policies stipulated by the task. It includes the cases where the right move is to let an uninformative observation leave the prior where it was. That is a narrow result, and a good one.

**The evidence does not license these claims:**

- that the model can build the policies it was given, or did build them;
- that it models opponents recursively, or has [theory of mind](https://en.wikipedia.org/wiki/Theory_of_Mind) in any general sense;
- that framing, presentation or scenario wording has no effect;
- a difficulty scale or a ranking of strategic reasoners;
- any statement about the procedure the model used internally.

All of this rests on one run per cell; the archive records the source tree as dirty, so the run's exact source remains unresolved. The task's name is about games. What the evidence shows is a correctly computed posterior on given inputs.
