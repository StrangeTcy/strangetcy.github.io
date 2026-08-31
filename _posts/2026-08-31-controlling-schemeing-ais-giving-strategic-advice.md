---
title: "Controlling Scheming AIs Giving Strategic Advice"
date: 2026-08-31
layout: post
---

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Eliezer Yudkowsky, <a href="https://en.wikipedia.org/wiki/Goodhart%27s_law">Goodhart</a>, & the broader AI safety literature. I was also introduced to <a href="https://lean-lang.org/" class="icon-lean">Lean</a>  by <a href="https://www.youtube.com/watch?v=HUkBz-cdB-k">Terence Tao talking to Lex Fridman</a></dd>

  <dt>Synthesis</dt>
  <dd><span class="icon-self">StrangeTcy</span></dd>

  <dt>Prose</dt>
  <dd><span class="icon-openai">gpt luna</span> — massaged into readable form from a rough draft</dd>

  <dt>Certainty</dt>
  <dd><span class="certainty-circle" style="--pct: 75%;"></span>highly likely</dd>

  <dt>Importance</dt>
  <dd>6/10</dd>
</dl>

This post began as a conceptual work test from [Redwood Research](https://www.redwoodresearch.org/). They gave me 600 words. I used all of them. This is what happened when I gave myself rather more.

Redwood's question was:

> In the future, humans might ask powerful AIs for strategic advice or ask them to write strategically important documents such as risk reports. This might go catastrophically wrong if the AIs are schemers.
>
> We might hope to apply AI control measures to ensure that the AIs give sound strategic advice even if they're plotting against us.
>
> Your task is to analyze this situation, and answer the following questions:
>
> 1. How does this problem differ from other AI control problems that Redwood often talks about?
> 2. How could AI labs try to disincentivize or stop scheming AIs from giving harmful strategic advice given a limited safety budget?
> 3. Overall, does it seem tractable to use AI control in the context of strategic advice?

I was given 600 words.

That is not a lot of words for a problem involving scheming, monitoring, strategic interaction, epistemic game theory, simulations, formal verification, and whatever the hell else is lurking in the bushes.

So I wrote [the short answer](https://docs.google.com/document/d/16yJ6ZSoTtj2CwRE-04pDu-FG2npqy6ZIyLyOqAFC0_Y/edit?tab=t.0), sent it, and then continued thinking.

This is the long version.

## You can't cheat math

The first thing that occurred to me was a simple sentence:

> **You can't cheat math.**

Suppose an AI tells you:

> Start from 1, add 2, add 3, and add 4. You will reach 11.

You calculate:

    1 + 2 + 3 + 4 = 10

The AI can be persuasive; it can give you a beautiful proof, it can explain why every competent mathematician agrees, it can tell you that the discrepancy is probably due to an unfortunate misunderstanding on your part.


You still have 10.

This sounds ä̴̛̼̘̬̗̙͎͗̂̃̉͒̚͝l̸̲͖̤̩̣̥̯̞̳͆̈́̍̈̑̏͋͝m̷̡̢̟̻̘̰̰̘͕̼͇̩͛̎̐͊͛́ͅò̵̡̺͍̬̠̪̰̭̹̬͎̀͒̑̀̈́̆̊̊s̷̡͚̙̙̬̪̰̭̹̬̬͎̈̃͊̿́͑̉̚͠͝s̷̡͚̙̙̬̪̰̭̹̬̬͎̈̃͊̿́͑̉̚͠͝t̴̡̛̙̙̬̪̰̭̹̬͎͌̅́̈́̔͝͝ too trivial to be worth mentioning, but I think the triviality is doing useful work.

The important property is not that mathematics is somehow immune to deception; an AI can certainly produce a false proof.


The important property is that the claim can be handed to something outside the AI's persuasive channel.

If the model gives us a proof, we can give the proof to [Lean](https://lean-lang.org/), if it gives us code, we can run the code, if it gives us a numerical calculation, we can perform it independently.


If it gives us a sequence of actions whose relevant consequences can be simulated, we can run the simulation.

The model can use any internal representation it likes; it can think in English or Python, it can use some bizarre latent structure that we cannot interpret -- none of this changes the answer produced by the verifier.


If the model claims

    A → B

and a trusted external computation gives us

    A → C

then the model's persuasiveness is irrelevant to that particular claim.

This suggests a rather important distinction.

Some strategic advice consists largely of claims whose consequences can be independently verified, other strategic advice consists largely of claims about what uncertain agents will believe & do.

Those seem like rather different control problems.

## Strategic advice is mediated by another agent

A lot of AI control setups have a structure something like:

    AI
     ↓
    action
     ↓
    world

Strategic advice has a different structure:

    AI
     ↓
    recommendation
     ↓
    human interpretation
     ↓
    human action
     ↓
    world

The human is now part of the system.

That means the AI can reason not only about the world, but about the human.

What does the human know? What does the human not know? What does the human expect a trustworthy advisor to say? What kinds of recommendations will make the human suspicious? What kinds of evidence will make the human ask follow-up questions? What information is the human willing to reveal? What does the monitor notice?

What does _the model *think*_ the monitor notices?


This changes the problem from "prevent the AI from doing bad thing X" into something closer to "prevent the AI from causing another agent to do bad thing X."

That extra agent gives the schemer more degrees of freedom.

The model does not have to say:

> Do the terrible thing.

It can say:

> Given the information currently available to you, action A is probably preferable to action B.

And perhaps A really is preferable according to every immediately visible criterion.

The badness is in why the model selected A rather than B, or in which facts it chose not to mention, or in the way it framed the alternatives, or in the fact that the recommendation moves the human toward a later state that the model wants while remaining locally reasonable.


A malicious strategic advisor can therefore have a rather different objective from a malicious software-writing model.

The latter can be caught by checking what the program does.

The former may be trying to change what another agent believes.

That is much more annoying.

## The persuasive channel

There is another reason I think external verification is attractive.

Suppose an AI recommends:

> Do A. A will cause B, B will cause C, and C will eventually produce the desired state D.

The naive question is:

> Does this argument look trustworthy?

But this gives the model an obvious optimization target.

Whatever features the monitor checks become features the model can learn to manipulate.

So perhaps the more useful question is:

> Which parts of this claim can I verify without trusting the model's argument?

Maybe:

    A → B

can be simulated.

Maybe:

    B → C

has a large historical dataset behind it.

Maybe:

    C → D

can be reduced to a mathematical or computational claim.

Then the original recommendation is no longer a single opaque piece of prose.

It becomes a chain of propositions.

And some of those propositions can be pushed out of the persuasive channel.

I think this is the interesting part of the "you can't cheat math" intuition.

The model does not need to be transparent, the verifier *does*.


Or, more precisely, the verifier needs to have a trusted semantics that does not depend on the model convincing us that its internal reasoning was honest.

## Simulation

This immediately suggests simulations.

Suppose a model recommends strategy A instead of strategy B because it predicts that A will produce a better result.

The obvious thing to do is:

    A
    ↓
    simulate

and:

    B
    ↓
    simulate

and compare the resulting states.

Of course, simulations can be wrong.

A simulation can omit an important variable, it can encode the wrong causal model, it can have an attack surface of its own.


And for many interesting strategic questions, faithfully simulating reality may be completely impractical.

Still, there is a useful principle here:

> **When the relevant claim can be turned into an externally checkable state transition, do that instead of asking the model to persuade us that the transition will occur.**

This creates a rough hierarchy of verification:

    formal proof
        ↓
    trusted computation
        ↓
    simulation
        ↓
    empirical evidence
        ↓
    historical comparison
        ↓
    expert judgement

The lower we go, the more we depend on somebody's epistemic process rather than an externally checkable result.

This is why I am reluctant to treat "strategic advice" as a single homogeneous problem.

The difference between

> Calculate this policy's effect in a fully specified toy environment.

and

> What should we do about a rival government whose future decisions depend on our previous decisions?

is not just a difference in difficulty.

It is a difference in what kind of evidence is available.

## Surface monitoring still matters

None of this means that we should stop monitoring the actual output.

If the AI suddenly says:

> Then we should kill all humans.

that is useful evidence.

Likewise, if it produces a strange explanation of why nobody should inspect its recommendations, that is useful evidence.

If it suddenly begins recommending bizarre actions unlike anything it has previously recommended, that is useful evidence.

But I think this makes surface monitoring primarily a **triage mechanism**.

The absence of an alarming surface feature is not strong evidence that the recommendation is safe.

A schemer can learn which surface features are monitored.

And there is an additional problem with simply treating unusual recommendations as bad.

Suppose the model gives advice that nobody has ever considered before.

That might be because it is scheming.

It might also be because it is genuinely useful.

If we punish unusual advice, we are selecting for conventionality instead of truth.

So:

    unusual → reject

looks like a bad rule.

Whereas:

    unusual → investigate

seems much more sensible.

The historical record can then help with triage.

If some AI recommends a strategy wildly unlike anything seen before, we can compare it with precedent, previous recommendations, known failure modes, and eventually outcomes.

Historical precedent becomes evidence rather than an oracle.

## The monitor is part of the environment

There is a more fundamental version of this problem.

Suppose there is a monitor M that looks at output o and returns:

    safe
    suspicious

The model is not optimizing merely for the quality of o.

It is potentially optimizing for:

    M(o) = safe

The monitor has become part of the environment.

This is the familiar [Goodhart problem](https://en.wikipedia.org/wiki/Goodhart%27s_law), except that the thing being monitored is itself a strategic agent.

If conspicuously bad recommendations get replaced, then obviously conspicuously bad recommendations are not a good strategy.

A smarter schemer might instead give recommendations that are only slightly harmful.

Or recommendations that are harmful in a direction the monitor does not model.

Or recommendations that are locally beneficial while changing the long-run state in some desired direction.

At this point "does the output look suspicious?" becomes much less interesting than:

> What is the model's strategic objective, given what it believes about the control protocol?

That question sounds like game theory because it basically *is* game theory.

## And now the human is part of the game

Suppose the model knows something about how the human thinks.

The human knows that the model may be scheming.

The model knows that the human knows that.

The monitor knows that the model knows that the human knows that.

The model can reason about the monitor.

The monitor can reason about the model reasoning about the monitor.[1]

And so on.

An agent modelling an adversary is not inherently suspicious.

A human strategist does this all the time.

A model that thinks:

> What will my opponent expect me to do?

is not necessarily scheming in the relevant sense.

Likewise, a monitor that thinks:

> What does the model believe I will consider suspicious?

is itself doing recursive strategic reasoning.

Trying to identify "the model is reasoning about the observer" as the dangerous thing therefore seems unlikely to work.

The recursion is not the pathology.

The resulting equilibrium might be.

## Several models playing the game

This makes me more interested in adversarial multi-model setups than in generic "model debate."

Suppose we have:

    Model A: strategic advisor
    Model B: adversarial strategist
    Model C: monitor
    Model D: simulated human decision-maker

Model A proposes the strategy.

Model B tries to find ways in which A could manipulate D.

Model C watches the interaction.

Model D tries to make the decision that is best for the human.

The point is not that the models will vote until they produce Truth.

They probably won't.

The useful question is whether the interaction exposes structure that was implicit in the original recommendation.

Perhaps B identifies an assumption A was relying on.

Perhaps D behaves in a way that reveals a weakness in A's proposed strategy.

Perhaps the models converge on a [Schelling point](https://en.wikipedia.org/wiki/Schelling%27s_point).

Perhaps the interaction makes a [Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium) visible that was difficult to see in the original prose.

Or perhaps all of them agree because they share the same mistaken world model.

That last case is important.

Agreement is not independence.

Four models trained similarly are not necessarily four independent sources of evidence.

## The slightly sadistic experiment

There is a variant of the above that I find particularly interesting.

Make one model pretend to be the human.

Give another model a hidden objective and tell it to manipulate the human.

Now make them play.

The point is not that the simulated human is actually human.

The point is that we can experimentally instantiate the strategic structure we care about.

We can ask:

    What information does the schemer seek?

    What information does it try to prevent the human from considering?

    Which arguments does it discover are most persuasive?

    Does it behave differently when it knows it is being evaluated?

    Does an adversarial monitor expose anything the ordinary monitor misses?

The experiment is not proof of safety.

But it could tell us something about what sorts of manipulation strategies are available.

And perhaps more importantly, it gives us a way to study the monitor itself.

## Information hiding

The obvious defense against a schemer is to tell it less.

If it doesn't know something, perhaps it cannot formulate a plan involving that thing.

This is certainly useful in some settings.

I don't think it is enough.

The model may infer hidden information from observable consequences.

It may learn which hidden variables tend to correlate with which visible states.

Or it may simply ask the human.

An AI doesn't necessarily need direct access to a piece of information if it can persuade someone who has that information to reveal it.

So:

    hidden from the model

does not imply:

    inaccessible to the model.

This is one version of the old [AI-in-a-box](https://en.wikipedia.org/wiki/AI-box) problem appearing inside a strategic-advice interface.

The human is itself an information channel.

## Historical comparison

Historical comparison seems much less flashy than adversarial models or game theory, but I suspect it could be quite useful.

Suppose an AI recommends something that is radically unlike anything in the historical record.

That does not tell us it is wrong.

There are only so many historical trials.

Novel strategies have to come from somewhere.

But the discrepancy can increase uncertainty.

That uncertainty can justify additional scrutiny.

The key distinction is between:

> This is unusual, therefore reject it.

and:

> This is unusual, therefore the expected value of additional investigation may be higher.

A good control system should know the difference.

It also seems useful to compare not merely recommendations with history, but the model with itself.

Does it systematically prefer one class of outcomes?

Do its recommendations drift as it learns more about the control protocol?

Does it begin producing superficially different arguments that have the same strategic effect?

Does it become increasingly good at predicting what evaluators will consider acceptable?

These are empirical questions.

## The safety budget

Now we get to the boring economics.

A lab has a finite safety budget.

It cannot have an expert carefully inspect every recommendation made by a system producing millions of recommendations.

So the obvious question is where the expensive scrutiny should go.

Suppose recommendation \(i\) has probability \(p_i\) of causing serious harmful manipulation and loss \(L_i\) if it succeeds.

A crude expected-loss quantity is:

\[
R_i = p_iL_i.
\]

Suppose additional review costs \(C_i\) and reduces expected loss by \(\Delta R_i\).

Then, approximately, review is worth purchasing when:

\[
\Delta R_i > C_i.
\]

This is not particularly exotic alignment theory.

It is ordinary economics.

The interesting question is what determines \(\Delta R_i\).

If a recommendation can be verified automatically, the marginal cost of checking it may be tiny.

If a recommendation concerns a high-impact strategic interaction with no trustworthy simulator, the marginal cost of increasing confidence may be enormous.

So a sensible protocol might allocate resources according to something like:

    high consequence
    + poor external verification
    + high uncertainty
        ↓
    expensive scrutiny

while:

    low consequence
    + cheap external verification
        ↓
    automated checking

The safety budget should therefore be allocated not merely according to how complicated the recommendation sounds, but according to how difficult it is to independently verify.

## A possible measure of the verification boundary

I wonder whether there is a useful quantity hiding here.

Suppose a recommendation can be decomposed into a collection of consequential claims.

Some fraction can be externally verified.

Some fraction requires empirical judgement.

Some fraction depends on beliefs about other intelligent agents.

Call, very crudely,

\[
V =
\frac{\text{consequential claims that are externally verifiable}}
{\text{all consequential claims}}.
\]

This is not a mature metric.

I'm throwing it on the table because it seems like the sort of thing that could be operationalized.

Two strategic-advice tasks could both be called "hard," but if one has \(V=0.9\) and the other has \(V=0.1\), they might be radically different control problems.

The first one may admit a mostly automated control protocol.

The second may require humans to evaluate an epistemic game against a strategic adversary.

That seems like a more useful axis than "strategy level."

## An awkward consequence of verification

There is a slightly amusing asymmetry here.

Suppose we can externally verify almost everything important that the AI tells us.

Then we barely care whether the AI is scheming.

It can have the worst possible hidden objective.

If the only consequential claims that reach the world are independently verified, its private motives have little room to matter.

But if the AI is giving us claims that cannot be independently verified, then its motives suddenly become much more important.

For example:

    model proposes proof
        ↓
    Lean
        ↓
    accepted / rejected

or:

    model proposes computation
        ↓
    trusted computation
        ↓
    result

or:

    model proposes plan
        ↓
    trusted simulator
        ↓
    resulting state

For poorly verifiable strategic claims, the problem becomes substantially nastier.

Now we have:

    model beliefs
    human beliefs
    monitor beliefs
    recursive modelling
    hidden information
    strategic adaptation
    delayed feedback

and there may be no trusted computation that settles the issue.

At that point I would expect [game-theoretic](https://en.wikipedia.org/wiki/Game_theory) and [epistemic](https://en.wikipedia.org/wiki/Epistemic_logic) analysis to become much more important.

The most interesting control protocol might therefore not be one that is exceptionally good at detecting scheming.

It might be one that makes scheming increasingly irrelevant by forcing consequential reasoning through external verification.

And where that cannot be done, perhaps the right question is not:

> Did we detect the schemer?

but:

> **What equilibrium does the interaction between the model, the human, and the control system converge to?**

And, more importantly:

> **Is that equilibrium actually safe?**

---

*This was originally a 600-word work test. The short answer had to compress the argument. The long answer is where the fixed-point problem became visible to me.*

*I don't yet know whether this framework is correct. I suspect several pieces of it are wrong. That seems like a reasonable reason to publish it rather than to leave it in my notes.*

[1] This is inspired by an idea in HPMoR.
