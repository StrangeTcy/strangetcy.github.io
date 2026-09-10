---
title: "A Long Trajectory Is Not Necessarily Deep Reasoning"
date: 2026-09-10
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>
    Douglas Hofstadter's <em>Gödel, Escher, Bach</em>
    (<a href="https://www.physixfan.com/wp-content/files/GEBen.pdf">this wonderful book</a>);
    <a href="https://en.wikipedia.org/wiki/Quine_(computing)">quines</a>
    and program self-reference; the broader literature on dynamical systems
    &amp; computational complexity. The particular evaluation proposal came
    out of a dialogue with <span class="icon-openai">ChatGPT</span>.
  </dd>
  <dt>Synthesis</dt>
  <dd><span class="icon-self">StrangeTcy</span></dd>

  <dt>Prose</dt>
  <dd><span class="icon-openai">ChatGPT</span> — assembled from the dialogue and subsequent criticism</dd>

  <dt>Certainty</dt>
  <dd>Confident about the distinction between rollout length and necessary computation. Exploratory about the proposed evaluation and what it will reveal.</dd>

  <dt>Importance</dt>
  <dd>Potentially useful evaluation methodology; no experimental results presented here.</dd>
</dl>

I wanted to trip up recurrent depth.

Not by giving a model a huge theorem, or asking it to multiply unpleasantly large numbers, or making it perform a thousand operations that nobody particularly wants performed.

I wanted a small, strange machine.

Something with a simple update rule and a nasty consequence. Something that looks as though it should fit comfortably inside a model's head, and then does something annoying when you actually try to follow it.

Perhaps a self-modifying automaton, perhaps a loop that comes back to where it started, except that where it started no longer means quite the same thing. Perhaps one of the constructions from [Hofstadter's *Gödel, Escher, Bach*](https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach), where you move between levels of description & unexpectedly find yourself back inside the thing you were describing.

So I asked ChatGPT. It was enthusiastic. This was, apparently, “a much more interesting direction.”

It suggested delayed self-interpreters, hidden phases, nested clocks, [cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton), graph rewriting, finite permutations, and a moving hole.

The moving hole will become relevant shortly.

The general promise was:

> Each individual step is trivial, but the globally correct answer requires many recurrent steps.

That sounded like a useful starting point for a new genre in my [eval generator](https://github.com/strangetcy/rl_eval_generator).

There was just one problem: **recurrent steps of what?**

## Three things called depth

Suppose I give you a deterministic system:

\[
s_{t+1}=F(s_t).
\]

Here is the initial state. Here is the update rule. Run it for \(T\) steps and tell me something about the result.

The task looks like:

    initial state
        ↓
    transition
        ↓
    transition
        ↓
       ...
        ↓
    state after T steps
        ↓
    answer

There are at least three quantities hiding in this picture.

| Quantity | What it means |
|---|---|
| **Rollout length** | How many updates the specified system undergoes |
| **Necessary sequential computation** | How much computational depth answering the question requires, under a specified computational model |
| **Model recurrence budget** | How many internal recurrent updates the model actually receives |

The task designer controls the first.

The second needs an argument.

The third depends on the model and on what access we have to its inference process.

These are not interchangeable.

But the dialogue kept making something like the following transition:

    the system takes T steps
        ↓
    predicting the system requires T steps
        ↓
    a model that fails has insufficient recurrent depth

Both arrows need justification, neither gets it merely from writing down a long trajectory.

This was the central mistake.

Not that small dynamical systems are bad evaluation tasks or that recurrent computation is irrelevant.

The mistake was assuming that the amount of time a machine spends doing something tells us how much computation is needed to answer a question about it.

## The moving hole

One proposed construction was a ring with a distinguished empty position.

At every update, the hole moves one position:

$$
h_{t+1}=h_t+1\pmod n.
$$

Now ask where the hole will be after $$T$$ updates.

This gives us:

$$
h_T=(h_0+T)\pmod n.
$$

The hole can spend a billion steps going around the ring.

We do not have to accompany it.

The dialogue had a qualification:

> This requires many recurrent steps if the model cannot jump directly to the answer.

Well, yes.

But “if the model cannot use the shortcut” is doing rather a lot of work.

The interesting question is whether the model *can* recognize the shortcut.

Preventing it from doing so would not necessarily make the evaluation better. It might just punish the very capability we ought to be measuring.

A long trajectory can be a reason to stop simulating.

## Clocks are also allowed to be boring

Another suggestion was to nest periodic processes.

Suppose one clock has period $$n$$, another has period $$m$$, and we ask when they next coincide.

The waiting time can be large.

For clocks starting together, the first positive coincidence is:

$$
\operatorname{lcm}(n,m).
$$

With phase offsets, we get a problem about congruences and whether the requested coincidence exists.

Either way, the computation need not resemble waiting for the clocks.

This is a useful distinction:

    time until the event
        ≠
    time needed to predict the event

It sounds obvious when stated this way. It was considerably less obvious when wrapped in phrases like “nested dynamical clocks” & “enormous effective reasoning depth.”

Apparently mathematical atmosphere is not a substitute for an argument.

## Finite automata don't quite save us

Finite automata were my first thought.

Given a transition table and an initial state, ask what happens after many transitions.

This is a perfectly reasonable evaluation task.

But if the transition function is deterministic and the state space has $$N$$ elements, the trajectory eventually repeats. There is some transient length $$\mu$$ and cycle length $$\lambda$$, with

$$
\mu+\lambda\leq N.
$$

Once the cycle has been identified, a large rollout count becomes manageable.

Again:

    understand the orbit
        ↓
    stop following every step

There is an important qualification here, because an early draft of this post got it wrong.

**A large state space does not necessarily require a large description.**

An $$n$$-bit counter has $$2^n$$ possible states. Its transition rule can be tiny.

An explicit transition table and a compact program describing transitions are very different representations.

So the original aesthetic survives:

> A small description can specify an enormous evolution.

What does not follow is:

> Therefore, answering my particular question requires following that evolution.

The question matters as much as the machine.

A counter may have a huge orbit and a trivial final-value query. Another compactly described system may be much harder to predict.

The length of the orbit does not settle which situation we are in.

## A light cone is not a lower bound for an observer

Cellular automata seemed more promising.

Take a radius-one rule. Information propagates at most one cell per update. Place something far away and ask whether it affects the origin after $$T$$ steps.

There really is a causal light cone here, but it belongs to the automaton.

The model solving the task is not necessarily a cell in that automaton.

It may see the entire initial configuration at once. It may exploit a global pattern. It may perform computations that the local update rule does not permit.

So:

    information needs T local updates to reach this cell

does not automatically imply:

    an external solver needs T sequential updates to predict this cell

A locality argument can constrain a solver that is itself restricted to local computation.

It does not automatically constrain a globally attending language model.

Cellular automata remain interesting. The proposed proof of their relevance was just too quick.

## Hidden state is sometimes just missing information

There was also an adversarial loop whose visible representation repeats while a hidden phase changes.

The intended trap was:

    same observation
        ↓
    same state

when the implication is false.

This can make a good task, but we need to decide what the solver is actually given.

If the hidden phase can be reconstructed from the supplied history, we have a state-reconstruction problem.

If the phase is genuinely inaccessible, then the answer may not be determined by the input.

More thinking does not repair that.

There is a related point about history-dependent machines.

If a deterministic machine returns to its *complete* state, its subsequent behavior is fixed.

If it behaves differently after an apparent return, then the thing that repeated was not the complete state.

Perhaps the transition table changed; perhaps a phase variable was omitted; perhaps the “state” was only a picture of the state.

This is worth testing. But the test concerns whether the solver identifies the right state representation, not automatically whether it has enough recurrence.

## Delayed consequences are still interesting

One construction survives quite naturally:

    early:
      create token X

    middle:
      X persists

    later:
      X interacts with Y
      the answer changes

Pair it with a version in which X disappears just before the interaction.

The two instances can look similar for a long time and have different outcomes.

That is useful, but what exactly does it stress?

Possibly retention. Possibly event tracking. Possibly reconstruction of state from a history containing many irrelevant updates.

If the complete current state explicitly contains X, there is no need to remember its entire biography.

Again, the machine is not the problem.

The description of the capability being measured needs work.

**What failed was not the construction. It was the claim that rollout length had already told us what made it difficult.**

## There is actual theory nearby

None of this means every dynamical system has an easy shortcut.

There are well-studied [P-complete problems](https://en.wikipedia.org/wiki/P-complete), including circuit evaluation and certain precisely formulated prediction problems.

Under the conjecture that $$\mathrm{P}\ne\mathrm{NC}$$, P-complete problems do not admit uniform polynomial-size, polylogarithmic-depth parallel solutions across all instances.

That is a serious motivation for investigating sequential computation.

It is not a proof that a particular generated instance requires $$T$$ serial steps.

It is also not a statement about every cellular automaton, every encoding of the time horizon, or every possible question about the resulting state.

And it certainly does not identify the internal mechanism behind a language model's mistake.

To get a lower bound, we have to say what the solver is allowed to do.

How much parallelism? How much memory? What precision? What access to the transition function? What preprocessing?

“No obvious closed form” is a useful design observation.

It is not a theorem.

## The depth cliff

The obvious experiment is to increase $$T$$, plot accuracy, and look for a cliff.

Perhaps the model handles short trajectories and then abruptly stops handling longer ones.

That would be interesting.

It would not explain itself.

Suppose, as a deliberately crude model, each simulated step is correct independently with probability $$1-p$$.

Then:

$$
P(\text{all steps correct})=(1-p)^T.
$$

That is not necessarily the probability of a correct final answer. Errors can cancel, and a solver can recover.

But it shows the basic problem.

A falling accuracy curve can result from imperfect local execution without any fixed recurrence limit.

Other possibilities include:

    parsing the rule incorrectly
    forgetting a state component
    confusing similar intermediate states
    encountering unfamiliar rollout lengths
    exhausting an output budget

An accuracy cliff does not come with a label saying which one happened.

Checkpoint questions can help.

Ask for the state at selected times and compare those predictions with the reference execution.

But the checkpoints are still outputs, not a window into latent computation. Asking the model to write intermediate states also gives it an external scratchpad.

That is a separate experimental condition.

We should not quietly introduce extra computation and then announce that we have measured the computation the model would otherwise have used.

## Quines

At this point I returned to the thing I had actually wanted: not merely a long process, but a strange loop.

[Quines](https://en.wikipedia.org/wiki/Quine_(computing)) are an obvious place to look.

A standard quine outputs its own source:

$$
\operatorname{Run}(q)=\operatorname{Source}(q).
$$

It looks like an infinite mirror.

But self-reference does not, by itself, require a long execution. A quine can produce its source and halt without any prolonged computation.

A particular quine can also do a great deal of unnecessary work before printing. The self-reproduction property alone tells us little about its running time.

Now ask:

> Execute this program. Execute its output. Repeat $$T$$ times. What source appears?

Once the quine property is established, the answer is the same for every $$T$$.

The apparent recursion has given us a fixed point.

Rather inconveniently for my original plan, recognizing the self-reference can make repeated simulation unnecessary.

This is an excellent control.

## Ouroboros programs

The broader family includes quine relays, or ouroboros programs.

One program outputs another, which outputs another, which eventually outputs the first:

    A → B → C → A

The stages may use different programming languages, with each emitted source interpreted in the appropriate language.

There are two different questions we can ask.

> Given a verified relay of length three, which stage appears after a million executions?

And:

> Given these source texts and their execution semantics, does this relay actually close?

The first is modular arithmetic.

The second requires establishing what the programs do.

Being told that something is a cycle is not the same as proving that it is one.

This distinction seems much closer to the kind of trap I wanted.

A model might recognize the *shape* of self-reference and stop checking the transformations that would justify it.

## Returning to what?

Now give each program template a payload.

Three templates. One bit.

```text
A(b) emits B(b)
B(b) emits C(1 − b)
C(b) emits A(b)
```

Starting from `A(0)`:

```text
A(0) → B(0) → C(1) → A(1) → B(1) → C(0) → A(0)
```

After three executions, we are back at template A.

After six, we are back at `A(0)`.

Assuming a canonical source representation determined by the template and payload:

    first template return:
      3

    first complete-source return:
      6

So “have we returned?” has several meanings.

Are we looking at the same template? The same payload? The same complete source?

A solver that sees three programs arranged in a circle and answers “three” to every return question has confused the form with the object.

This example is deliberately small.

It does not establish a depth lower bound.

It establishes that we can make a precise question out of an otherwise rather vague intuition about returning to where we started.

## A loop need not return to its beginning

We can separate the notions further.

Let one stage increment a bounded payload until it saturates:

$$
b\mapsto\min(b+1,3).
$$

Let the other stages preserve it.

Starting at zero, successive traversals produce payloads:

    0
    1
    2
    3
    3
    3
    ...

The template keeps coming back.

The initial program does not.

The full system eventually enters a cycle, but that cycle does not contain its initial state.

So:

    it eventually loops

does not imply:

    it eventually returns to the beginning

There is nothing exotic about this as finite-state dynamics.

What makes the reflective presentation interesting is that the state travels through representations that become executable objects.

The same distinction can be obvious in a transition table and surprisingly easy to lose in source-generating code.

That is something we can test.

## Where Hofstadter enters

Hofstadter's strange loop is not simply a process that repeats. It involves moving between apparent levels and finding oneself back at the starting point.

Description and described object. Code and data. A statement and a statement _about_ the statement.

The relay example is a modest, mechanical analogue of this idea. I do not need to claim that every source-generating program captures everything Hofstadter meant.

But I do want the level crossing to be real.

The schematic notation `A(b)` is not enough by itself.

The implementation should do something like:

    parse source
        ↓
    execute restricted semantics
        ↓
    emit source
        ↓
    parse emitted source
        ↓
    execute again

Otherwise, we risk making an ordinary state machine, calling its states “programs,” and congratulating ourselves for having evaluated reflection.

A small restricted language should be sufficient; no arbitrary generated-code execution is needed.

The point is to define quotation, payloads, source identity, and execution precisely enough that a wrong answer is actually wrong.

## The eval genre

This is what I want to put into my [eval generator](https://github.com/strangetcy/rl_eval_generator).

Working name:

    iterated_systems

Not:

    certified_recurrent_depth_meter

The initial design has three parts.

### Ordinary iteration

Explicit finite-state systems.

Engineered transients and cycles. Randomized transition tables. Relabeled states.

Ask for the state after $$T$$ updates, or for the transient and cycle lengths.

Include fixed points and easy cycles deliberately.

Shortcuts are not contamination.

### Source-generating relays

Programs that emit programs while transforming an embedded payload.

Ask about template identity, payload identity, and complete-source identity.

Use a restricted interpreter and canonical serialization.

Check its behavior against a separate abstract transition model.

If those disagree, the generator is broken before any model has a chance to be.

### Flattened and reflective pairs

Generate one underlying computation and present it twice.

**Flattened:**

> Here is a state consisting of a template index and a payload. Here are its transition rules.

**Reflective:**

> Here is a program. Executing it emits the source of the next program.

Same initial state, same transition semantics, same rollout length, same query, same answer.

Different representation.

This is the comparison I care about most.

## What a paired result would mean

Suppose a model succeeds on the flattened version and fails on the reflective one.

We have learned that presentation affects performance despite matched underlying dynamics.

That is already useful.

We have not yet learned that the cause is specifically a failure to track representational levels.

The reflective prompt may be longer. Its syntax may be less familiar. Parsing may be harder. Tokenization may be less convenient.

Those are alternative explanations to investigate, not details to dismiss.

The matched pair gives us a place to start. It does not finish the causal argument.

Likewise, a correct answer on a cycle task does not prove that the model recognized a cycle. It might have simulated the whole thing.

Answer accuracy is observable. Internal strategy generally is *not*.

## What additional recurrence buys

If a model exposes a genuine recurrence control, the experiment becomes more direct.

Hold the task fixed.

Vary the number of internal recurrent updates.

Then ask:

    Does more recurrence improve one-step rule execution?

    Does it improve longer-horizon state tracking?

    Does it help the reflective presentation more than the flattened one?

    Does it help on systems with easy shortcuts?

    How does it compare with an external scratchpad?

We should also record other resources.

More recurrence is more computation. Different architectures may allocate that computation differently. A fair comparison cannot pretend otherwise.

Without an exposed control, the genre is still useful.

It is an evaluation of iterated-state reasoning and reflective representation handling.

It is not a direct measurement of internal recurrent depth.

“Think harder” is not a calibrated knob.

## The model was part of the experiment

There is a slightly awkward additional lesson here.

The dialogue itself exhibited the sort of premature compression I was trying to test.

I asked for possible constructions.

The model gave me plausible examples.

Then it repeatedly compressed:

> The obvious way to solve this is to iterate.

into:

> Solving this requires iteration.

It compressed:

> The system has a long trajectory.

into:

> The model needs deep recurrence.

And it compressed:

> This resembles a strange loop.

into:

> Self-reference creates computational difficulty.

None of those transitions was forced.

They were persuasive because the examples sounded right and the terminology sounded relevant.

This is not a report that the proposed machines experimentally defeated a model.

We have not established that.

It is a report that the arguments offered for their supposed difficulty did not survive scrutiny.

The distinction matters.

Otherwise, an exploratory conversation can turn into a benchmark proposal, and the benchmark proposal can turn into a claim about architecture, without anybody noticing that the central implication was never demonstrated.

## The small machine is still out there

I still want the small, elegant machine.

I have not concluded that recurrence is unimportant, or that all dynamical systems have easy shortcuts, or that self-reference is merely decorative.

I have concluded that making a system run for a long time is not enough.

A solver might:

    follow the transitions
    recognize a cycle
    derive an invariant
    preserve the wrong state
    confuse source with execution
    answer correctly for the wrong reason

Those are different outcomes.

An evaluation should help distinguish them rather than assigning all of them a place on one “depth” axis.

So the genre I want is a collection of controlled situations where iteration, shortcuts, retention, and representation can be varied and inspected.

Not a collection of machines already certified to require deep reasoning.

The question that survives is:

> **What does additional recurrence actually buy a model?**

A long trajectory alone does not answer it.

---

*This post describes a proposed evaluation genre, not experimental results. The source-generating relay is a design sketch; the implementation and its reference semantics still need to be checked.*

*The useful outcome of the dialogue was not a proof that the original idea was impossible. It was a clearer account of what would have to be measured before claiming that it worked.*
