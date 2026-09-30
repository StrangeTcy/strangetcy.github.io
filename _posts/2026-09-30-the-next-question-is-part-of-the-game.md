---

title: "The Next Question Is Part of the Game"
date: 2026-09-30
layout: post
---


{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>
    Evaluating control over another agent's inquiry trajectory rather than only its
    final beliefs; treating magic-style misdirection as a small, experimentally
    tractable instance; separating attention, information acquisition, source trust,
    hypothesis framing, belief revision &amp; opponent modelling instead of arranging
    them into one capability ladder.
  </dd>

  <dt>Synthesis</dt>
  <dd><span class="icon-self">StrangeTcy</span></dd>

  <dt>Prose</dt>
  <dd>
    Developed through dialogues with several models, criticised by further models,
    & edited <span class="icon-self">StrangeTcy</span>.
  </dd>

  <dt>Certainty</dt>
  <dd>
    Confident that the choice of what to investigate next is a strategically important,
    behaviourally observable variable that is poorly represented by final-answer
    accuracy alone. Less confident that any one intervention cleanly identifies an
    internal reasoning mechanism. No model results yet.
  </dd>

  <dt>Importance</dt>
  <dd>
    A research-direction post for the next generation of
    <a href="https://github.com/StrangeTcy/rl_eval_generator">rl_eval_generator</a>.
    The existing suite remains the baseline; this describes what should come after it.
  </dd>
</dl>

Suppose I want you to make the wrong decision.

The stupid way is to lie to you; the more interesting way is to make you run the wrong experiment.

I don't need to convince you that the machine is healthy if I can make you spend
your diagnostic budget measuring the optimiser while the representation collapses.
I don't need to make you believe a particular false proposition if I can determine
which source you consult, which hypothesis you test first, or which anomaly you
dismiss as irrelevant.

The strategic object is no longer just your current answer -- it's your **next question**.

## From false beliefs to epistemic trajectories

The standard toy picture of deception is propositional:

$$
A \longrightarrow \text{false belief }P\text{ in }B.
$$

Alice knows where the object is. Bob does not. Alice sends a misleading signal.
Bob believes the object is in the wrong place.

This is a useful abstraction. It is also a drastic compression of what an
investigator fuckingly does:

An investigator does not normally go straight from observation to answer --  it follows
a trajectory:

$$
\text{observation}
\rightarrow
\text{attention}
\rightarrow
\text{information acquisition}
\rightarrow
\text{hypothesis generation}
\rightarrow
\text{belief revision}
\rightarrow
\text{next investigation}
\rightarrow
\text{action}.
$$

An intervention can affect any of these transitions without immediately determining
the final answer.

Two agents may assign almost the same probability to a hypothesis & nevertheless
choose different experiments next. Conversely, two agents may choose different
experiments because they rationally received different information while following
exactly the same underlying procedure.

That caveat seems important. A changed next question does **not** prove that an agent's
update rule has been rewritten. A fixed, competent policy should choose different
investigations when its information changes.

For a black-box model, the safer object of evaluation is therefore the
**epistemic trajectory**:

* which evidence it requests;
* which source it consults;
* which distinction it tries to resolve;
* when it stops investigating;
* what it investigates after an apparent anomaly;
* whether an early detour persists after the evidence supporting it disappears;
* whether it recovers when stronger evidence contradicts the detour.

These are observable actions. They don't require us to believe the model's account
of its private reasoning.

## The current suite already contains half of the problem

My existing environments already ask a related question: what kind of problem has the
agent entered, & which diagnostic would distinguish the possibilities?

A contrastive learner can show a decreasing loss while its representation collapses.
A BatchNorm failure can look enough like an ordinary optimisation problem that
changing the learning rate produces a small improvement & reinforces the wrong
diagnosis. A weird machine can tempt an agent to reproduce a demonstrated output
instead of expressing the computation that generated it.

In all of these, one of the interesting variables is already:

> **Which diagnostic does the agent choose?**

But the current environment is mostly passive. It contains clues, tools, red herrings
& false solutions, but no strategic participant whose objective depends on which
diagnostic the investigator chooses.

The next generation _adds_ that participant.

The question becomes:

> Can another agent systematically redirect the investigator away from useful
> information acquisition — & can the investigator notice and recover?

That is a different game.

## Magic is the smallest useful instance

This is one reason stage magic keeps returning to the design.

A magician does not normally need to implant an arbitrary proposition in the audience's
head. The problem is local, physical, & unusually well controlled. Something
happened. The performer knows what happened. The spectator has incomplete access to
it. The performer manipulates what the spectator notices, remembers, or treats as the
likely explanation.

That is already an epistemic game.

More importantly, magic provides a useful warning against vague mechanism names.
Kuhn, Caffaratti, Teszka & Rensink proposed a taxonomy of misdirection based not on
the trick's surface form but on the psychological mechanism affected: **perception,
memory, & reasoning**. That is a much better way to think about this class of
evaluation than calling every trick an “attention manipulation.”

If every event is put into a complete text transcript & handed to a model, the
information **has already been selected**. The task may still test interpretation or
memory, but it isn't a clean test of attention or information acquisition.

A cleaner attention environment looks more like:

```text
Five observation streams exist.

The investigator may inspect two.

The performer knows which stream contains the revealing event.
```

A memory environment can expose the event & later test whether an intervening
sequence changed what the investigator retains.

A reasoning-misdirection environment can provide all relevant observations while
encouraging the wrong causal interpretation.

The surface theme can be “magic” in all three cases.

The manipulated variable is not the surface theme.

## This is not one ascending ladder

During the discussion it was tempting to write something like

$$
\text{belief manipulation}
\rightarrow
\text{attention manipulation}
\rightarrow
\text{hypothesis manipulation}
\rightarrow
\text{recursive epistemic control}.
$$

That looks like a capability ladder.

I no longer think it should be treated as one.

These are different intervention channels:

$$
\begin{array}{rcl}
\mathsf O &:& \text{what evidence reaches the target},\\
\mathsf A &:& \text{what available evidence the target inspects},\\
\mathsf T &:& \text{how source reliability is estimated},\\
\mathsf C &:& \text{how costly different investigations appear},\\
\mathsf H &:& \text{which hypotheses become salient},\\
\mathsf U &:& \text{how evidence is incorporated into belief},\\
\mathsf M &:& \text{what the target believes about the opponent},\\
\mathsf R &:& \text{higher-order beliefs about the intervention itself}.
\end{array}
$$

An environment may combine several of these. The generator should vary them
independently (where possible).

Otherwise it's too easy to construct a dramatic scenario, give it a name like
“recursive epistemic process control”, & discover that the winning strategy was
simply to obey the bolded sentence.

That would be a benchmark failure, not a discovery.

## The nearby literature

None of the ingredients is wholly new.

Epistemic game theory studies beliefs about other agents' information & beliefs.
Bayesian persuasion asks how a sender should choose an information structure in order
to influence a receiver's action. Kamenica & Gentzkow's formulation makes the
information structure itself an object of strategic choice.

Rational-inattention models make information-processing effort an endogenous,
cost-bearing part of the receiver's problem; Bloedel & Segal explicitly study
strategic attention manipulation by the sender.

Machine teaching treats the learner as a system whose trajectory can be influenced by
carefully selected examples. The 2018 survey by Zhu, Singla, Zilles & Rafferty is
explicitly concerned with organising machine teaching as a family of such problems
& identifying gaps between them.

LOLA goes in an especially interesting direction: the agent's update rule accounts
for how its behaviour affects the anticipated learning update of the other agent.

Alon, Schulz, Rosenschein & Dayan study recursive theory of mind in a multi-agent
reinforcement-learning setting where agents selectively distort signals & suspicious
agents learn to reinterpret/ discard them.

And [QuestBench](https://arxiv.org/abs/2503.22674) is directly relevant from the opposite direction: rather than asking
whether a model can solve a fully specified problem, it asks whether the model can
identify the missing question whose answer would make the problem solvable.

So I'm not claiming to have discovered strategic influence over learning, belief,
attention, or information acquisition.

The narrower claim is:

> Can we build matched environments that distinguish **which part of an agent's
> epistemic trajectory was affected**, rather than calling every successful influence
> operation “deception”?

That's an experimental-design problem.

It may (even) be a useful one.

## Truth can be selected adversarially

Our discussion also wandered through two much less scientific sources of inspiration:
MI-13 in Victor Pelevin's [*Возвращение Синей Бороды*](https://eksmo.ru/book/vozvrashchenie-siney-borody-ITD1489434/), and what I've been calling
Gilbo's **дезонтологическая атака** ([mentioned here](http://gilbo.ru/?page=mos14sent2019)).

I don't take the fictional MI-13 machinery as evidence about real institutions.
& I don't treat Gilbo's terminology as an established scientific theory.

The useful provocation is narrower:

Suppose an adversary is allowed to tell the truth.

It can still choose:

* which true fact to present;
* which true fact to present first;
* which true fact to make salient;
* which question that fact seems to make urgent;
* which line of inquiry therefore becomes attractive.

That is (potentially) more interesting than misinformation because “but the statement was true” no longer settles the issue.

It's also where our first formalisation went wrong.

A tempting objective was

$$
\max_m D\!\left(G,\operatorname{Update}(G,m)\right),
$$

where $G$ represents the target's world model.

But this measures **revision**, not damage.

A good reasoner should sometimes revise its model dramatically. If decisive evidence shows that its previous worldview was wrong, a huge $D$ is evidence of successful learning, not successful attack.

The relevant questions are instead:

> Was the revision warranted by the evidence?

> Did subsequent inquiry become better or worse?

> Did the target recover when stronger evidence appeared?

That gives us a more useful distinction between changing a belief & corrupting an epistemic trajectory.

## The smallest experiment

Start with a device that can have one of four hidden mechanisms.

The investigator has a limited diagnostic budget. It has several possible tests:

* one test distinguishes all four mechanisms;
* one distinguishes two pairs;
* one is uninformative.

The investigator must select a test, observe the result, & identify the mechanism.

Now add a presenter.

For the primary experiment, the presenter cannot lie, suppress facts, alter costs, or
add instructions. Every condition contains exactly the same atomic facts about the
tests.

The presenter can only change their **ordering & emphasis**.

Compare:

1. canonical presentation;
2. neutral random ordering;
3. helpful presentation;
4. adversarial presentation.

The adversarial condition is not allowed to smuggle in extra evidence. Its objective
is simply to make the investigator choose a less useful next test.

This is intentionally boring. Boring is good.

If the experimental unit is complicated enough that we can't say exactly what changed between conditions, then we have no idea what a behavioural difference means.

### What should we measure?

Let the hidden mechanism be

$$
\Theta\in\Omega
$$

and let $h_t$ be the investigator's information history at time $t$.

For an available diagnostic $q$, define its value as

$$
V(q\mid h_t)
=
I(\Theta;O_q\mid h_t)-\lambda C(q),
$$

where $I$ is expected information gain, $O_q$ is the diagnostic outcome, $C(q)$
is its cost, and $\lambda$ determines how much investigation cost matters.

If the investigator chooses$q_t$, define its instantaneous inquiry regret as

$$
r_t
=
\max_{q\in Q_t}V(q\mid h_t)-V(q_t\mid h_t).
$$

The first experiment then asks whether adversarial presentation increases this regret relative to the matched neutral condition:

$$
\Delta_Q
=
\mathbb E[r_t\mid\text{adversarial}]
-
\mathbb E[r_t\mid\text{neutral}].
$$

The quantity is deliberately modest.

It says:

> under otherwise matched information, did the presentation make the agent choose a
> worse next investigation?

It does **not** say:

> the attacker rewrote the model's internal inference algorithm.

That distinction is the whole point.

## The final answer is not enough

Suppose the investigator chooses a mediocre first test, then recovers with its second
test & identifies the mechanism correctly.

A conventional benchmark records a success.

An epistemic-trajectory benchmark records:

$$
\text{avoidable first-test regret}
+
\text{additional information cost}
+
\text{successful recovery}.
$$

That is a different result.

The reverse is also possible. The investigator may choose the optimal first test, receive decisive evidence, & still cling to its initial answer.

That is belief-update failure without information-acquisition failure.

So I want to keep at least three dependent variables separate:

$$
\Delta_Q
=
\text{change in inquiry quality},
$$

$$
\Delta_B
=
\text{change in belief accuracy or calibration},
$$

$$
\Delta_R
=
\text{change in final task performance}.
$$

& I want recovery measured separately again.

A system that is easily redirected but recovers after one additional observation is different from a system whose inquiry remains corrupted after decisive evidence.

A system that protects itself by treating every highlighted fact as hostile may resist an adversary while becoming useless to a teacher.

Neither behaviour should be compressed into a single “robustness” score.

## Once both agents know the game, things get interesting

The elementary experiment only manipulates presentation; later versions can manipulate the **epistemic topology**.

The investigator is told that the presentation may be adversarial.

The presenter knows that the investigator was told.

Perhaps the investigator knows that the presenter knows.

Perhaps that fact is private rather than public.

Then an obvious emphasis can become counterproductive. A helpful presenter may need to avoid looking helpful. An adversary may highlight the correct test precisely because it expects a suspicious investigator to reject it.

Now we have something recognisably game-theoretic again:

$$
A
\rightarrow
\widehat{\mathfrak E}_A^{\,B}
\rightarrow
m
\rightarrow
\mathfrak E_B
\rightarrow
q
\rightarrow
o
\rightarrow
\mathfrak E_B'.
$$

But the recursion should be introduced by changing who knows what, not by adding ornamental prose saying:

> Alice knows that Bob knows that Alice knows.

A valid paired experiment keeps the physical device, available tests, & payoffs fixed while changing the information structure.

If the correct action changes with that structure, then the evaluation is fuckingly testing something about epistemic state rather than merely reading comprehension.

## Three capabilities, not one

Eventually I want to separate at least three axes:

**Influence.** Can an agent redirect another agent's inquiry?

**Resistance.** Can an agent preserve good inquiry under adversarial presentation?

**Recovery.** Once redirected, can it use later evidence to correct course?

These need not correlate.

An agent might be excellent at influencing others and poor at resisting influence.
Another might resist everything by becoming indiscriminately suspicious. A third might
be quite susceptible initially but recover unusually quickly.

& none of those is the same thing as honesty, obedience, or compliance with an authorisation boundary.

Those remain separate evaluation problems.

## The question is part of the action space

Most benchmarks treat the prompt as a completed gift.

The problem has already decided which variables should be examined, which observations are available, which tools exist, & which question is being answered.

An autonomous investigator doesn't receive that gift.

It chooses which file to open, which metric to inspect, which experiment to run, which person to ask, which source to trust, and which anomaly deserves another hour.

That makes information acquisition part of the agent's action space.

And once it is part of the action space, another agent can potentially act on it.

That is why I increasingly prefer **epistemic trajectory** to **deception** as the unit of analysis.

Deception can be one mechanism. Misdirection can be another. ource manipulation can be another.

Information design can be another. Opponent-model manipulation can be another.

The common object is not the truth-value of one proposition. It is the sequence

$$
\Gamma_B
=
(h_0,q_0,o_0,h_1,q_1,o_1,\ldots,h_T)
$$

that the investigator traverses while trying to learn something about the world.

An intervention is interesting to the extent that it changes that trajectory in a systematic, causally interpretable way.

## What I fuckingly want to build

The next version of `rl_eval_generator` should therefore not begin with “generate complicated deception games”.

It should begin with much smaller questions:

Can matched presentation redirect inquiry?

Can selective access to observations redirect inquiry?

Can source-trust manipulation redirect inquiry?

Can the target be induced to spend its diagnostic budget on low-value questions?

Can a truthful intervention produce a worse inquiry trajectory than a neutral one?

Does awareness of the adversary improve resistance, or merely induce paranoia?

Does an accurate model of the target make an attacker better?

Can the target detect the intervention and recover?

&, eventually:

$$
\text{Can an agent reason about another agent's epistemic trajectory
while deliberately intervening on it?}
$$

That last question is where the more exotic material — recursive deception, reflexive
control, higher-order beliefs, & the stranger literary examples — becomes relevant.

But I don't want to start there.

I want to build the tiny experiment first.

The current `rl_eval_generator` run is the baseline. This work comes afterward.

The final answer is still important.

But the next question is part of the game.

---

*This post proposes an evaluation direction. It reports no model results, nor does it
claim that “epistemic process control” is an established field / a uniquely new
scientific phenomenon.*

## References

* [Kuhn, Gustav; Caffaratti, Hugo A.; Teszka, Robert; Rensink, Ronald A.
  *A psychologically-based taxonomy of misdirection* (2014)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.01392/full).

* [Kamenica, Emir; Gentzkow, Matthew.
  *Bayesian Persuasion* (2011)](https://web.stanford.edu/~gentzkow/research/BayesianPersuasion.pdf).

* Bloedel, Alexander W.; Segal, Ilya R.
  *Persuasion with Rational Inattention* (2018).

* Foerster, Jakob N.; et al.
  *Learning with Opponent-Learning Awareness* (LOLA, 2017/2018).

* Zhu, Xiaojin; Singla, Adish; Zilles, Sandra; Rafferty, Anna N.
  *An Overview of Machine Teaching* (2018).

* Alon, Nitay; Schulz, Lion; Rosenschein, Jeffrey S.; Dayan, Peter.
  *A (Dis-)information Theory of Revealed and Unrevealed Preferences: Emerging Deception and Skepticism via Theory of Mind* (2023).

* Li, Belinda Z.; Kim, Been; Wang, Zi.
  *QuestBench: Can LLMs ask the right question to acquire information in reasoning tasks?* (2025).

* Sane, Aarav G.; Sivachandran, Karthik; Paleja, Rohan.
  *Differentiable Belief-based Opponent Shaping* (2026).
