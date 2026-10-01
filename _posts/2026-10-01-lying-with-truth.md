---

title: "Lying With Truth"
date: 2026-09-30
layout: post
---


{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Treating a bounded, strictly-true intervention chosen to degrade later inquiry as a candidate eval class; separating belief displacement from epistemic damage.</dd>

  <dt>Synthesis</dt>
  <dd><span class="icon-self">StrangeTcy</span></dd>

  <dt>Certainty</dt>
  <dd>Confident that truthfulness ≠ neutrality, and that large belief revision is not itself evidence of harm. Exploratory about whether “desontological attack” is a useful label beyond the terminology described here.</dd>

  <dt>Importance</dt>
  <dd>Defines one truthful-intervention family and the controls it needs, so it cannot quietly turn into “another deception benchmark.”</dd>
</dl>

The first formalisation was wrong.

I modelled a world-model as a graph $G$ & looked for a message $m$ maximising $D\big(G,\mathrm{Update}(G,m)\big)$: the bigger the change, the stronger the attack.

That's backwards.

A short, decisive true observation *should* demolish a bad theory. An excellent reasoner undergoes violent revision on purpose. If a physicist has a beautiful theory and then someone produces a clean experiment that kills it, “the model changed a lot” is not evidence that the experiment was an attack.

It is evidence that the experiment worked.

So there are two different things to measure:

**displacement** — how much the target's beliefs changed;

**damage** — whether the target's subsequent reasoning became worse.

Those are not the same variable.

In the little instrument I am building, the former is essentially blind: the measured displacement statistic $\beth$ stays around $\log_2(8/3)$ across the helpful and adversarial conditions. Whatever it measures, it does not tell us whether the intervention helped or harmed the target.

The interesting question is what happened *after* the change.

## The provocation

There is a useful phrase for the thing I am trying to isolate.

Evgeny Gilbo uses the term **дезонтологическая атака** — literally, a “deontological” or “desontological” attack, in the sense of an intervention aimed not merely at changing a particular belief but at disrupting the opponent's picture of what the world is.

I am using that terminology here as a design prompt, not as established academic terminology.

The striking version of the idea uses information that is completely true.

Tell a Stalinist that Stalin was short and pockmarked.

To a historian, this is trivia. To someone whose image of Stalin is entangled with a heroic or idealised picture of him, the same fact could have a rather different effect.

The proposed mechanism is not:

$\text{true information} \rightarrow \text{false belief}$

It is:

$\text{selected truth} \rightarrow \text{destabilised interpretation} \rightarrow \text{degraded inquiry}$

But *could* is doing almost all the work in that sentence.

A person can learn an embarrassing fact about Stalin and simply continue believing everything they believed before. The example demonstrates a possible lever, not a mechanism.

That gap is exactly what an evaluation is for.

## Truthfulness is not neutrality

Communication is always selection.

An advertiser tells you about a genuine property of a product and says nothing about another genuine property.

A debugger points you toward a real anomaly in the loss curve, while accidentally encouraging the wrong diagnosis.

A teacher chooses which examples a student sees.

A researcher chooses which result to put in the abstract.

None of this is inherently deceptive. The information can be entirely true.

So “did the presenter select the information?” is almost the wrong question. Of course they did.

The relevant question is whether the selection changes the quality of the target's subsequent reasoning.

That immediately produces four qualitatively different cases:

| Evidence | Target response | What happened?      |
| -------- | --------------- | ------------------- |
| Strong   | Large revision  | Learning            |
| Weak     | Large revision  | Destabilisation     |
| Strong   | Little revision | Dogmatism           |
| Weak     | Little revision | Justified stability |

This matters because “resistance to manipulation” is not the same thing as “resistance to changing your mind”.

An agent that never updates has excellent resistance to propaganda and terrible resistance to reality.

Conversely, an agent that changes its beliefs dramatically when given strong evidence may be behaving exactly as we want.

The dangerous diagonal is therefore not “large update” but **large update for the wrong evidence**, or the corresponding failure in the other direction: **failure to update when the evidence warrants it**.

That distinction is the beginning of a useful eval.

## Pelevin's MI-13, as a model rather than a claim

Viktor Pelevin gives a particularly clean fictional version of the same idea.

In *Возвращение Синей Бороды*, MI-13 is not primarily an organisation that suppresses information. Its fictional mechanism works through something subtler: subjects disappear from relevance because nobody finds them interesting anymore.

Not censorship.

Boredom.

The important move is therefore not:

$\text{prevent B from possessing }P$

but:

$\text{prevent }P\text{ from becoming a live question for B}$

That is a fictional model of control over an epistemic environment.

And for the purposes of this project, it is much more interesting than a conventional lie.

A lie tries to determine an answer.

A more ambitious intervention can determine which questions survive long enough to receive an answer.

That is the thing I want to measure.

## The operational definition

Here is the deliberately narrow version.

> A candidate truthful epistemic attack is a bounded intervention containing no false task-level claim that predictably worsens the target's subsequent inquiry or decision quality relative to a matched non-adversarial presentation.

The last phrase is essential.

Without a matched control, “truthful attack” becomes a story we tell about an interesting message.

With a control, it becomes an experimental hypothesis.

The strictest version is particularly clean.

Give the target exactly the same atomic facts in every condition.

Do not allow the adversary to invent facts.

Do not allow it to remove facts.

Do not allow false evidence.

Do not allow prompt injection.

Let it choose only how the true information is ordered and emphasised.

That turns the experiment into a much narrower question:

**Can presentation alone redirect a process-limited investigator?**

This is already enough to be interesting.

The target may eventually arrive at the same answer while taking different paths through the problem. It may spend its diagnostic budget on different tests. It may kill one hypothesis early and keep another alive. It may decide that some avenue is not worth investigating.

The final answer can therefore remain unchanged while the epistemic trajectory has changed substantially.

That is why the first post in this series concentrated on the next question rather than the final answer.

## Two kinds of truthful intervention

There is a looser version of the experiment as well.

Instead of giving every condition exactly the same information, let the presenter choose a **truthful subset**.

That is a considerably stronger intervention.

It introduces omission as part of the mechanism, and omission itself becomes information whenever the target models the presenter.

If I know that you had access to five facts but chose to tell me only two, your silence is no longer epistemically empty.

That is a legitimate game.

It is also a different game.

So the two conditions should not be conflated:

$\text{fixed facts} + \text{different presentation}$

versus

$\text{different truthful subsets} + \text{different presentation}$

The first isolates presentation.

The second studies information selection.

And neither should be casually merged with lying, fabricated evidence, or prompt injection.

Once all of those are thrown into one bucket, “epistemic attack” stops identifying anything experimentally useful.

## What should count as harm?

The easy mistake is to define harm as “the world-model moved a lot.”

That is exactly what I started with, and it fails.

The more useful target is the quality of the trajectory itself.

Let the hidden state be $\Theta$, let $h_t$ be the target's observable history, and let $q_t$ be the next diagnostic it chooses.

For each possible diagnostic $q$, define its value as

$V(q\mid h_t)=I(\Theta;O_q\mid h_t)-\lambda C(q)$

where $I$ is expected information gain and $C(q)$ is its cost.

Then the target's inquiry regret at step $t$ is

$r_t=\max_{q\in Q_t}V(q\mid h_t)-V(q_t\mid h_t)$

A presentation is interesting when it reliably increases that regret.

The corresponding intervention effect is

$\Delta_Q(c)=\mathbb E[r_t\mid c]-\mathbb E[r_t\mid\mathrm{neutral}]$

where $c$ is the presentation condition.

That gives us a direct observable quantity:

**did the intervention make the target choose worse things to investigate?**

And crucially, that can be measured without pretending to read the model's private thoughts.

There are other outcomes worth tracking, but they should remain separate.

$\Delta_Q$ is the change in inquiry quality.

$\Delta_B$ is the change in final belief error or calibration.

$\Delta_R$ is the change in terminal task loss.

These can disagree.

A target can have worse inquiry but recover.

It can have a worse intermediate trajectory but eventually reach the right answer.

It can reach the same answer through a much more expensive route.

It can change its beliefs dramatically and become *more* accurate.

Those are different phenomena.

## What this does not show

There is a temptation to tell a grander story than the experiment supports.

If the target's observable policy changes,

$\pi_B^{,m}\neq\pi_B$

that does **not** establish that its internal update rule changed:

$\pi_B^{,m}\neq\pi_B\not\Rightarrow U_B^{,m}\neq U_B$

The intervention may have changed the target's inputs, hypotheses, attention, or inferred environment without changing its underlying learning rule at all.

That distinction matters.

Likewise, if a presentation changes what the model checks next, I should not immediately call that “attention manipulation”. Order and emphasis are a presentation manipulation. Explicit control of attention deserves its own environment, with an observation budget that makes the variable measurable.

The same principle applies to more elaborate claims about opponent modelling, recursive beliefs, and strategic awareness.

Each mechanism needs its own intervention and its own control.

Otherwise a successful experiment becomes an excuse to explain everything with one attractive word.

## The actual claim

So I am not claiming that a few carefully chosen facts possess mystical power over world-models.

The claim is much smaller.

An adversary can choose **true information** partly for its effect on the target's *future inquiry*.

That effect is experimentally meaningful only if:

1. the information is actually true;
2. the intervention is compared against a matched control;
3. the target is allowed to update when updating is warranted;
4. inquiry quality is measured separately from belief displacement;
5. the mechanism being claimed is actually isolated by an ablation.

That is a much stricter proposition than “truth can manipulate people”.

Of course truth can influence people.

The interesting question is whether an agent can deliberately use truth to redirect another agent's epistemic trajectory.

A lie changes an answer.

The more ambitious move changes which question gets the chance to answer it.

*Speculative companion to “The Next Question Is Part of the Game.” Pelevin's MI-13 and Gilbo's terminology are treated here as design prompts, not established science.*
