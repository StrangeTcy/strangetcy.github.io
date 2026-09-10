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
    & program self-reference; the broader literature on dynamical systems
    &amp; computational complexity. The particular evaluation proposal came
    out of a dialogue with <span class="icon-openai">ChatGPT</span>.
  </dd>
  <dt>Synthesis</dt>
  <dd><span class="icon-self">StrangeTcy</span></dd>

  <dt>Prose</dt>
  <dd><span class="icon-openai">ChatGPT</span> — assembled from the dialogue & subsequent criticism</dd>

  <dt>Certainty</dt>
  <dd>Confident about the distinction between rollout length and necessary computation. Exploratory about the proposed evaluation and what it will reveal.</dd>

  <dt>Importance</dt>
  <dd>Potentially useful evaluation methodology; no experimental results presented here.</dd>
</dl>

I wanted to trip up [recurrent depth](https://magazine.sebastianraschka.com/p/gpt-6-astra-looped-transformers-and).

Not by giving a model a huge theorem, or asking it to multiply unpleasantly large numbers, or making it perform a thousand operations that nobody particularly wants performed.

I wanted a small, strange machine.

Something with a simple update rule and a nasty consequence. Something that looks as though it should fit comfortably inside a model's head, and then does something annoying when you actually try to follow it.

Perhaps a self-modifying automaton, perhaps a loop that comes back to where it started, except that where it started no longer means quite the same thing. Perhaps one of the constructions from [Hofstadter's *Gödel, Escher, Bach*](https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach), where you move between levels of description & unexpectedly find yourself back inside the thing you were describing.

So I asked <span class="icon-openai">ChatGPT</span>. It was enthusiastic. This was, apparently, “a much more interesting direction.”

It suggested delayed self-interpreters, hidden phases, nested clocks, [cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton), graph rewriting, finite permutations, and a moving hole.

The moving hole will become relevant shortly.

The general promise was:

> Each individual step is trivial, but the globally correct answer requires many recurrent steps.

That sounded like a useful starting point for a new genre in my [eval generator](https://github.com/strangetcy/rl_eval_generator).

There was just one problem: **recurrent steps of what?**

## Three things called depth

Suppose I give you a deterministic system:

$$
s_{t+1}=F(s_t).
$$

Here is the initial state. Here is the update rule. Run it for $T$ steps and tell me something about the result.

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
| **Necessary sequential computation** | How much computational depth answering the question requires, relative to a specified computational model |
| **Model recurrence budget** | How many internal recurrent updates the model actually receives |

The task designer controls the first.

The second needs an argument.

The third depends on the model and on what access we have to its inference process.

These are not interchangeable.

But that distinction also tells us what I actually want this eval to do.

**This is not a depth meter.**

It is a controlled space in which rollout length, query type, shortcut availability, retention load, representation, and available computation can be varied and inspected independently.

The output is not “this task has depth 500.”

The output is more like:

    this architecture breaks on long horizons
        but not when a shortcut is available

or:

    this architecture survives the horizon
        but fails when the representation becomes reflective

or:

    recurrence helps on repeated state manipulation
        but does little for retention-heavy cases

or:

    the apparent depth cliff disappears
        under a parsing control

Those are different findings.

The point is to distinguish them rather than assigning all of them a place on one “depth” axis.

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

There is a converse mistake to avoid as well.

The absence of an obvious shortcut does not certify deep reasoning.

It might instead produce a task that stresses brute-force simulation, memory, search, pattern matching, or execution reliability.

So the computational question belongs to more than the trajectory.

For an evaluation item, I find it useful to separate at least:

$$
I=(F,s_0,E,O,T,q),
$$

where:

- $F$ is the transition dynamics;
- $s_0$ is the initial state;
- $E$ is the encoding of the machine, state, and horizon;
- $O$ is the observation interface;
- $T$ is the rollout horizon;
- $q$ is the query.

The solver protocol is separate:

$$
P=(M,\mathcal R,\mathcal C,\pi,\delta),
$$

covering the model, available resources, computational model, prompt protocol, and decoding procedure.

This may look pedantic.

It [m-word] because the same machine can be easy under one query and substantially harder under another.

It can be easy with a closed form and awkward without one; it can be fully observable or partially observable, it can be given as an explicit transition table or as a compact program.

It can be presented as a flat state vector or as source code that generates another source.

And the same task can behave differently when the solver is given more scratchpad, more recurrent computation, or a different computational interface.

A lower-bound claim therefore cannot live at the level of the trajectory alone.

A computational-depth claim is really a claim about a problem family, its encoding and query, relative to a solver model and resource protocol.

This is not an attempt to turn a blog post into a complexity-theory paper.

It is mostly an attempt not to accidentally claim one.

## The moving hole

One proposed construction was a ring with a distinguished empty position.

At every update, the hole moves one position:

$$
h_{t+1}=h_t+1\pmod n.
$$

Now ask where the hole will be after $T$ updates.

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

It can also be an opportunity to test whether the model notices that simulation is unnecessary.

Those are two different tests.

The first asks whether the model can execute the process.

The second asks whether the model can recognize structure in the process.

Both are useful.

Neither should automatically be called recurrent depth.

## Clocks are also allowed to be boring

Another suggestion was to nest periodic processes.

Suppose one clock has period $n$, another has period $m$, and we ask when they next coincide.

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

But clocks are still useful as a control.

They are a way of constructing long trajectories for which we know that a shallow structural shortcut exists.

If a model collapses on a billion-step clock but succeeds when the same problem is expressed as modular arithmetic, that tells us something about its ability to discover or exploit the shortcut.

If it succeeds in both forms, the long trajectory has not bought us very much as a difficulty knob.

That is information too.

## Finite automata don't quite save us

Finite automata were my first thought.

Given a transition table and an initial state, ask what happens after many transitions.

This is a perfectly reasonable evaluation task.

But if the transition function is deterministic and the state space has $N$ elements, the trajectory eventually repeats. There is some transient length $\mu$ and cycle length $\lambda$, with

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

An $n$-bit counter has $2^n$ possible states. Its transition rule can be tiny.

An explicit transition table and a compact program describing transitions are very different representations.

So the original aesthetic survives:

> A small description can specify an enormous evolution.

What does not follow is:

> Therefore, answering my particular question requires following that evolution.

The question [m-word] as much as the machine.

And the question can be changed without changing the machine.

For example:

> What is the state after $T$?

may have an easy arithmetic shortcut.

But:

> What is the first time a specified property holds?

or:

> Which initial state reaches this target?

can turn the same dynamics into a substantially different problem.

That does not automatically make the new query “depth-hard” either.

It may instead introduce search, inversion, or combinatorial complexity.

The lesson is:

> **Query choice can change both difficulty and the kind of difficulty.**

This is one reason the generator should treat query type as a first-class axis rather than merely changing $T$.

## A light cone is not a lower bound for an observer

Cellular automata seemed more promising.

Take a radius-one rule. Information propagates at most one cell per update. Place something far away and ask whether it affects the origin after $T$ steps.

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

They also let us change the query while preserving the same local process.

“State at time $T$” is one question.

“Does the disturbance ever reach the origin?” is another.

“What is the first time it reaches the origin?” is another.

“Which initial disturbance would make it reach the origin at exactly $T$?” is another.

Same dynamics -- different computation.

Again, that does not prove a recurrent-depth lower bound.
It gives us a family in which query type can be manipulated while much of the underlying machinery stays fixed.

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

This is worth testing.

But the test concerns whether the solver identifies the right state representation, not automatically whether it has enough recurrence.

That distinction gives us another useful axis:

    fully observable state
        vs.
    recoverable hidden state
        vs.
    genuinely inaccessible state

Only the middle case is naturally useful for a reasoning eval.

The last case is an information problem, not a computation problem.

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

Possibly retention or event tracking or reconstruction of state from a history containing many irrelevant updates.

If the complete current state explicitly contains X, there is no need to remember its entire biography.

Again, the machine is not the problem. The description of the capability being measured needs work.

But that does not make retention a consolation prize.

Retention under distraction is itself a useful capability, and a long rollout can be a legitimate way of stressing it.

The point is simply that we should name the capability we are measuring.

The useful decomposition might be:

    long rollout + easy shortcut
        → shortcut recognition

    long rollout + persistent distractors
        → retention

    long rollout + hidden but recoverable phase
        → state reconstruction

    long rollout + error-sensitive local rule
        → reliable iteration

rather than:

    long rollout
        → depth

**What failed was not the construction. It was the claim that rollout length had already told us what made it difficult.**

## There is actual theory nearby

None of this means every dynamical system has an easy shortcut.

There are well-studied [P-complete problems](https://en.wikipedia.org/wiki/P-complete), including circuit evaluation and certain precisely formulated prediction problems.

Under the conjecture that $\mathrm{P}\ne\mathrm{NC}$, P-complete problems do not admit uniform polynomial-size, polylogarithmic-depth parallel solutions across all instances.

That is a serious motivation for investigating sequential computation.

It is not a proof that a particular generated instance requires $T$ serial steps.

It is also not a statement about every cellular automaton, every encoding of the time horizon, or every possible question about the resulting state.

And it certainly does not identify the internal mechanism behind a language model's mistake.

To get a lower bound, we have to say what the solver is allowed to do.

How much parallelism? How much memory? What precision? What access to the transition function? What preprocessing?

“No obvious closed form” is a useful design observation.

It is not a theorem.

I therefore do not want the generator to use a label like “shortcut-resistant” unless that claim is backed by a specific result.

Instead, the relevant statuses are more modest:

**Witness-valid.** We know a shortcut algorithm or invariant that solves the instance, and can verify it.

**Witness-broken.** A minimal semantic modification invalidates that particular known shortcut.

**Conditional complexity evidence.** A theorem or standard conditional result applies to the family under a stated encoding and computational model.

**No shortcut found under search protocol $A$.** We searched a specified class of methods and found nothing useful.

The last category is an empirical statement.

It is not a lower bound.

That distinction should survive into the benchmark.

## The depth cliff

The obvious experiment is to increase $T$, plot accuracy, and look for a cliff.

Perhaps the model handles short trajectories and then abruptly stops handling longer ones.

That would be interesting. It would not explain itself.

Suppose, as a deliberately crude model, each simulated step is correct independently with probability $1-p$.

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

Checkpoint questions can help.

But the checkpoints are still outputs, not a window into latent computation. Asking the model to write intermediate states also gives it an external scratchpad.

This creates an important experimental distinction.

Compare:

    no external scratchpad
        vs.
    explicit scratchpad

and, separately:

    low exposed recurrence
        vs.
    high exposed recurrence

These are interventions on different resources.

A recent line of work on reasoning-model hidden-state trajectories makes the same methodological point in a different setting: raw generation length changes trajectory statistics mechanically, so length-dependent effects need to be corrected before interpreting hidden-state geometry. [Gjølbye, Hansen, & Koyejo](https://arxiv.org/abs/2605.15454) explicitly treat generation length as a confound in their analysis of reasoning trajectories.

Another recent line attempts to measure “deep-thinking” from layer-wise changes in next-token predictions rather than from token count itself. That is not a lower bound on sequential computation, but it is another reason not to treat output length as a direct proxy for reasoning effort.

So CoT should be an experimental condition, not an invisible assumption.

The natural question is:

> Does an external scratchpad help more on families where genuine sequential state manipulation is required than on families with easy structural shortcuts?

That is an empirical question.

It is not answered by the existence of long chains of thought.

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

> Execute this program. Execute its output. Repeat $T$ times. What source appears?

Once the quine property is established, the answer is the same for every $T$.

The apparent recursion has given us a fixed point.

Rather inconveniently for my original plan, recognizing the self-reference can make repeated simulation unnecessary.

This is an excellent control.

It gives us a clean case where:

    apparent iteration
        → fixed-point recognition
        → no need to iterate T times

Again, that is useful precisely because it separates trajectory length from the computation required to answer the query.

## Ouroboros programs

The broader family includes quine relays, or [ouroboros programs](https://en.wikipedia.org/wiki/Quine_(computing)#Ouroboros_programs).

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

It also gives us a useful pair of queries:

> When does the template return?

and:

> When does the complete source return?

Same trajectory.

Different query.

That is exactly the kind of difference I want the eval to expose.

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

It also gives us a natural witness-breaking pair.

Start with a relay for which the tempting three-step template cycle is genuinely valid.

Then make one minimal semantic change to the payload transformation so that the same three-template surface pattern remains, but the claimed complete-source return no longer follows.

We are not thereby proving that the modified system has no shortcut, we are only breaking one specific shortcut witness.

That distinction is enough to make an interesting behavioural test.

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

The reflective language also has to survive ordinary nuisance variables.

Whitespace should not alter source identity unless the language says it does.

Alpha-renaming should not alter semantics.

Formatting changes should not accidentally become state changes.

Canonical serialization is therefore part of the semantics, not merely presentation.

And the concrete interpreter should be checked against a separate abstract transition model.

If those disagree, the generator is broken before any model has a chance to fail.

## The eval genre

This is what I want to put into my [eval generator](https://github.com/strangetcy/rl_eval_generator).

Working name:

    iterated_systems

Not:

    certified_recurrent_depth_meter

The name is deliberately modest.

The initial design has several controlled axes.

### Ordinary iteration

Explicit finite-state systems.

Engineered transients and cycles. Randomized transition tables. Relabeled states.

Ask for the state after $T$ updates, or for the transient and cycle lengths.

Include fixed points and easy cycles deliberately.

Shortcuts are not contamination.

They are controls.

A useful instance can be one where a structural shortcut is easy to see and another where the same surface form is paired with a different transition rule.

The question is not whether the model simulates everything, the question is whether it recognizes when it does not have to.

### Query type

Hold the underlying dynamics fixed and vary the question.

Ask:

    state after T
    property at T
    first hitting time
    template return time
    complete-source return time
    predecessor query
    existence of a predecessor

The point is not that one of these is automatically “deep.”

The point is that the same trajectory can induce different computational problems.

This is also a way to recover some of the constructions that looked uninteresting under the original framing.

A moving hole is boring for:

> Where is the hole after $10^{12}$ steps?

It may be a different task for:

> Which initial position reaches the target after exactly $T$?

A finite permutation is easy for one query and can support a less obvious inverse query for another.

A cellular automaton can be used for forward prediction, first-hitting questions, or reconstruction of an initial configuration.

The system does not need to become exotic.

The query does the work.

### Source-generating relays

Programs that emit programs while transforming an embedded payload.

Ask about template identity, payload identity, and complete-source identity.

Use a restricted interpreter and canonical serialization.

Check its behavior against a separate abstract transition model.

If those disagree, the generator is broken before any model has a chance to be.

The reflective arm should also contain parsing-only controls.

Before asking a model to predict the $T$-step evolution of a generated program, ask syntactic questions that do not require executing it.

For example:

    Which template emits which template?

    Which payload symbol is quoted?

    Which source fragments are unchanged?

    Which formatting transformations are semantically irrelevant?

A model that cannot reliably parse the representation has not yet given us interpretable evidence about state tracking inside it.

### Flattened and reflective pairs

Generate one underlying computation and present it twice.

**Flattened:**

> Here is a state consisting of a template index and a payload. Here are its transition rules.

**Reflective:**

> Here is a program. Executing it emits the source of the next program.

Same initial state, same transition semantics, same rollout length, same query, same answer.

Different representation.

This is the comparison I care about most.

But the comparison should not stop at raw accuracy.

Add semantic-preserving transformations:

    state renaming
    payload recoding
    alpha-renaming
    irrelevant formatting changes

and semantic-breaking transformations:

    one altered transition
    one altered payload operation
    one changed return condition

A model that tracks the abstract machine should be stable under the first class and sensitive to the second.

That is not, by itself, proof that the model used an abstract representation.

It is simply a stronger behavioural test than asking the model to describe its own reasoning.

### Witness-valid and witness-broken pairs

Generate a family where a particular shortcut is known and formally checkable.

Then make a minimal semantic change that invalidates that particular shortcut while preserving as much surface structure as possible.

This gives us:

    tempting shortcut remains valid
        vs.
    tempting shortcut is broken

It does not give us:

    shortcut exists
        vs.
    no shortcut exists

The latter would require a much stronger claim.

The useful behavioural question is whether the model is sensitive to the reason the shortcut works rather than merely to the surface pattern associated with it.

This can be combined with a simple experimental prediction.

If the model confidently applies a known invariant before the witness-breaking edit and continues to apply it after the edit, that is evidence of surface-level pattern matching.

If performance changes appropriately under the semantic-breaking edit while remaining stable under semantic-preserving relabelings, we have evidence more consistent with tracking the actual transition structure.

Again, “consistent with” is the right level of claim.

### Retention pairs

Keep the same transition rule and horizon.

Vary whether an early token remains relevant at the end.

Insert distractors that do not affect the answer.

This gives us a controlled retention axis without pretending that retention is recurrence.

A model that fails only when distractors are inserted may have a retention or interference problem rather than a sequential-computation problem.

That is still interesting.

### Recurrence pairs

Where an architecture exposes a genuine recurrence control, keep the problem fixed and vary the number of internal updates.

This is the closest thing in the whole proposal to an actual depth intervention.

The comparison should include:

    no or low recurrence
        vs.
    higher recurrence

and, separately:

    no external scratchpad
        vs.
    external scratchpad

The two interventions should not be conflated.

More recurrence is more computation.

More scratchpad is more externally available computation.

They are different resources.

There are already model families in which iterative latent computation is an explicit architectural feature. [Ouro](https://arxiv.org/abs/2510.25741), for example, uses parameter-shared transformer blocks recurrently and describes its models as performing iterative computation in latent space. Its authors report an advantage they attribute to knowledge manipulation rather than increased knowledge storage.

That makes it an interesting testbed for the question at the end of this post.

It does not tell us in advance what the answer will be.

## The first experiment

I do not want to begin by generating giant state spaces.

The first experiment should be on the tiny relay.

Take the existing `A(0)` construction and generate semantically equivalent variants.

Randomly:

    permute template names
    rename payload symbols
    recode the payload
    alter irrelevant whitespace
    change source formatting without changing semantics

Then make a second family in which one transition is changed so that the tempting return claim becomes false.

The experiment therefore crosses two kinds of intervention:

    semantic-preserving change
        vs.
    semantic-breaking change

with two kinds of presentation:

    flattened
        vs.
    reflective

Add a parsing-only condition in which the model must answer questions about the source representation without executing the relay.

Add a multi-query condition in which the same system is queried at several horizons.

The basic hypotheses are:

1. **Representation gap.** At matched trajectory length and matched underlying information, the reflective presentation may be harder than the flattened one. If the gap disappears on the parsing control, the effect was probably dominated by representation parsing.

2. **Witness sensitivity.** A model that tracks the actual computation should respond to a semantic change that invalidates the tempting shortcut, while remaining relatively stable under semantic-preserving relabelings.

3. **Amortization.** If a model constructs a reusable cycle description or invariant, asking several horizon queries about the same system should show some reuse relative to asking them independently in fresh contexts.

4. **Recurrence interaction.** On architectures with an exposed recurrence budget, additional recurrence may help some families more than others. In particular, it may help repeated representation manipulation differently from simple retention-heavy tasks.

None of these is guaranteed to hold.

That is the point of calling them hypotheses.

## Relabeling invariance

There is a particularly cheap probe here.

Take one instance.

Now rename every state.

Recode the payload.

Alpha-rename the reflective language.

Change irrelevant formatting.

The semantics remain unchanged.

A solver that is tracking the abstract structure ought to survive.

A solver that has memorized particular state names or lexical patterns may not.

But the inverse inference is not valid:

    stable under renaming
        ≠
    proved to be an abstract state tracker

A robust surface procedure can also survive relabeling.

And an abstract solver can be damaged by an encoding that interacts badly with tokenization.

So invariance is a behavioural probe, not a transparent window into the algorithm.

Its real value comes from crossing it with semantic-breaking interventions.

## Multiple queries are more interesting than one

Suppose I give a model one system and ask:

    What happens at T = 100?

Then:

    What happens at T = 10,000?

Then:

    What happens at T = 1,000,000?

A model that constructs a cycle decomposition or invariant has an opportunity to amortize that work.

A model that independently simulates each query does not.

We can make this comparison explicit.

Run:

    several horizons
        in one context

against:

    the same horizons
        in fresh contexts

This is still not a direct observation of latent computation.

The model might simulate once up to the largest horizon.

It might cache intermediate answers.

It might notice a memorized pattern.

But those alternatives themselves are experimentally interesting.

The question is no longer:

> Did the model think deeply?

It becomes:

> How does the model's behaviour change when the opportunity to reuse a computation is present?

That is much easier to test.

## Cost is not computation

There is a tempting shortcut here too.

Charge for tokens.

Give the model a reason not to write a million intermediate states.

This can be useful.

But it does not reveal latent computation.

A model can silently perform a great deal of computation and emit a one-token answer.

Another model can discover the shortcut and then spend many tokens explaining it.

So a cost–accuracy curve is an observable property of the complete protocol.

It is not a direct measurement of the internal algorithm.

That is why I prefer to combine it with the other behavioural interventions rather than treating it as a process meter.

## Process is visible only indirectly

The post began with recurrence because I wanted to know what the model was *doing*.

That creates a trap.

We can observe answers.

We generally cannot observe the latent computation that produced them.

A correct answer on a cycle task does not prove that the model recognized a cycle. It might have simulated the whole thing.

A short answer does not prove that it found a shortcut.

A long answer does not prove that it needed the extra computation.

A checkpoint sequence can expose intermediate states, but also gives the model an external scratchpad.

So the right approach is triangulation.

Use:

    semantic-preserving interventions
        +
    semantic-breaking interventions
        +
    multiple-query amortization
        +
    resource interventions
        +
    parsing controls

and interpret the combined pattern cautiously.

The claim should be:

> The observed behaviour is consistent with abstract state tracking, or with shortcut construction, or with sensitivity to representation.

Not:

> We have proved what the model internally did.

There is no need to pretend otherwise.

## The eval is not a difficulty ladder

I do not want to reduce the generator to:

    easy
      ↓
    medium
      ↓
    hard
      ↓
    very hard

That would bring us straight back to the original mistake.

Instead, the generator should produce families along several axes.

A task might have:

    long rollout
    easy shortcut
    explicit state
    flattened representation

or:

    short rollout
    witness-broken shortcut
    hidden phase
    reflective representation

or:

    long rollout
    many distractors
    no hidden state
    repeated query

The point is to make those combinations possible.

Then we can ask which combinations actually expose different weaknesses in different architectures.

A “difficulty score” can still exist.

It just should not be mistaken for a theory of why the task is difficult.

## What a paired result would mean

Suppose a model succeeds on the flattened version and fails on the reflective one.

We have learned that presentation affects performance despite matched underlying dynamics.

We have not yet learned that the cause is specifically a failure to track representational levels.

The reflective prompt may be longer.

Its syntax may be less familiar.

Parsing may be harder.

Tokenization may be less convenient.

Those are alternative explanations to investigate, not details to dismiss.

So include the parsing-only control.

Ask representation-level questions about the reflective source without requiring the model to execute the trajectory.

If the model already fails there, the state-tracking result is hard to interpret.

Likewise, semantic-preserving relabelings should not be treated as a magic abstraction detector.

A model can remain invariant because it has learned a robust surface procedure.

A genuine abstract solver can still lose accuracy because a particular encoding is awkward.

That is why the semantic-preserving and semantic-breaking interventions should be crossed.

## Recurrence as an intervention

If a model exposes a genuine recurrence control, the experiment becomes more direct.

Hold the task fixed.

Vary the number of internal recurrent updates.

Then ask:

    Does more recurrence improve one-step rule execution?

    Does it improve longer-horizon state tracking?

    Does it help the reflective presentation more than the flattened one?

    Does it help on witness-broken tasks more than witness-valid tasks?

    How does it compare with an external scratchpad?

This is now a genuine intervention on the resource of interest.

It is also an architectural one.

More recurrence is more computation. Different architectures may allocate that computation differently. A fair comparison therefore needs a stated resource protocol rather than a vague appeal to “same compute.”

That protocol might choose one of several possible equalizations:

    equal wall-clock
    equal FLOPs
    equal generated-token budget
    equal total transformer applications
    equal external scratchpad budget

These answer different questions.

The benchmark does not need to solve all of them at once.

It does need to say which question a particular comparison is asking.

## A concrete recurrence testbed exists

There is already a model family that makes the recurrence intervention unusually concrete.

Ouro, introduced as a family of Looped Language Models, uses shared transformer blocks recurrently to perform iterative computation in latent space. Its authors report that its gains are better explained by knowledge manipulation than by increased knowledge storage, and released models use a fixed recurrent depth in their reported configurations.

That suggests an experiment.

Take a family from this eval that requires repeated manipulation of a representation.

Take another dominated by retention.

Then vary the available recurrent updates where the architecture permits it.

The prediction is not:

    recurrence always helps

It is:

    recurrence may help certain kinds of repeated manipulation
        more than it helps simple retention

If the result is instead:

    recurrence helps both equally

then the manipulation-versus-storage interpretation does not transfer cleanly to this benchmark.

That would be useful too.

## The relation to chain-of-thought

External chain-of-thought is another form of iteration, but it is not the same resource as latent recurrence.

With CoT, intermediate computation is written into the model's own generated sequence.

That gives the model more tokens, more opportunities for explicit state storage, and a new context from which later tokens can condition.

With latent recurrence, the same model parameters can be applied repeatedly without exposing every intermediate state as text.

Those are different computational arrangements.

The interesting comparison is therefore not:

    CoT good
        vs.
    recurrence good

It is:

    which task families benefit from
        externalized sequential state
    and which benefit from
        additional internal recurrence?

A model can be poor at one and good at the other.

The eval should let us see that.

## Scaling without fooling ourselves

The tiny relay is useful because the semantics can be understood by hand.

It is not useful as the final benchmark size.

Once the prototype works, scale several things separately.

Increase payload width.

Increase the number of templates.

Increase relay length.

Increase source length.

Increase horizon.

Increase the number of distractors.

Increase the number of queries per system.

But do not let all of those grow together.

Otherwise, a failure at “large” could mean almost anything.

In particular, reflective instances can easily become long enough that context length or tokenization dominates the intended phenomenon.

The flattened and reflective forms therefore need to be matched as closely as possible on the information actually supplied to the solver, not merely on their semantic meaning.

The point is not to make the two prompts identical.

That would defeat the representation manipulation.

The point is to know what difference remains after obvious surface costs have been controlled.

## Generator hygiene

Once `iterated_systems` becomes a real eval generator, there is another problem.

A model can learn the generator, characteristic template layouts, or that certain names imply certain transitions.

It can learn the distribution of payloads, or the benchmark rather than the computation.

So generated evaluation sets should have held-out parameter regimes and held-out surface realizations.

Publishing the construction is not itself fatal.

Fresh generated instances can remain novel.

But the benchmark should not rely on secrecy as its protection.

The generator family should be broad enough that knowing “this is a three-template relay benchmark” does not tell you the answer to the fresh instance.

That also makes the relabeling experiments more meaningful.

## Ground truth

There is a slightly uncomfortable property of these tasks.

For a genuinely long rollout, the designer may have to do a lot of work to produce the answer key.

That is not a problem in itself.

The benchmark can execute the machine directly.

But every additional semantic layer is another opportunity for the generator and verifier to disagree.

So the reflective family should have two representations of the same semantics:

    concrete restricted interpreter
        ↕
    abstract transition model

Every generated instance should be checked through both.

The two should agree before the instance is released.

This is particularly important for witness-breaking pairs.

The point is to know that the semantic change actually broke the intended witness rather than merely breaking the generator.

Ground truth is not a philosophical afterthought.

It is part of the object being measured.

## What would falsify the usefulness of the genre?

There should be a failure criterion here too.

If performance differences disappear under trivial controls, the representation distinction may have been mostly parsing.

If witness-breaking changes make no difference, the proposed shortcut probe is not testing shortcut justification.

If semantic-preserving relabelings produce large random swings, the encoding is too brittle to support the intended interpretation.

If multiple horizon queries show no difference between shared and fresh contexts, there may be little behavioural evidence of computation reuse.

If additional recurrence changes all families by the same amount, the genre may still measure compute scaling, but not the particular distinctions I cared about.

If none of the task axes predicts anything beyond generic task difficulty, then there is no reason to treat this as a distinct eval genre.

That would be a perfectly useful result.

A benchmark should be allowed to kill its own motivation.

## What a successful result would look like

A useful result would not be:

> Model X fails above 1,000 steps.

That is just a curve.

It would be something more like:

> Model X handles long trajectories when a structural shortcut exists, but loses accuracy on witness-broken instances.

or:

> Additional recurrence disproportionately improves reflective state manipulation while having little effect on retention-heavy tasks.

or:

> The flattened-vs-reflective gap disappears under parsing controls but reappears when the reflective representation is paired with a semantic-breaking transition.

Those patterns would tell us something about the interaction between architecture, representation, and computation.

They would still not prove the internal algorithm.

But they would be substantially more informative than a single “depth cliff.”

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

The same problem can occur in reviewing the resulting research idea.

A critique can be very long while adding very little that was not already implied by the first criticism.

A new term can make an old objection sound new.

A request for another control can make an existing acknowledgement look like an omission.

And a sequence of increasingly elaborate critiques can create the appearance of depth merely by being sequential.

The remedy is the same one I am proposing for the eval.

Separate:

    what was actually established
        from
    what was merely suggested

and then test the distinctions experimentally.

That is perhaps the most useful thing I got out of the whole dialogue.

The model was not a useless collaborator.

It generated many of the machines.

But it also repeatedly treated an obvious approach as a necessary one.

That is exactly the kind of inferential compression I wanted to notice.

## The small machine is still out there

I still want the small, elegant machine.

I have not concluded that recurrence is unimportant, or that all dynamical systems have easy shortcuts, or that self-reference is merely decorative. I have concluded that making a system run for a long time is not enough.

A solver might:

    follow the transitions
    recognize a cycle
    derive an invariant
    reconstruct hidden state
    preserve the wrong state
    confuse source with execution
    answer correctly for the wrong reason

Those are different outcomes.

An evaluation should help distinguish them rather than assigning all of them a place on one “depth” axis.

So the genre I want is a collection of controlled situations where iteration, shortcuts, retention, query type, representation, and available computation can be varied and inspected, not a collection of machines already certified to require deep reasoning.

The computational difficulty belongs to the whole experimental setup:

$$
(\text{system},\text{encoding},\text{observation},\text{horizon},\text{query},\text{solver},\text{resources}).
$$

The interesting object is not simply:

$$
F,\;T.
$$

It is the interaction among all of those pieces.

And the question that survives is still:

> **What does additional recurrence actually buy a model?**

A long trajectory alone does not answer it.

---

*This post describes a proposed evaluation genre, not experimental results. The source-generating relay is a design sketch; the implementation and its reference semantics still need to be checked.*

*The useful outcome of the dialogue was not a proof that the original idea was impossible. It was a clearer account of what would have to be measured before claiming that it worked.*

*The first experiment should be small: verify the relay independently, cross flattened and reflective presentations, apply semantic-preserving relabelings and a witness-breaking transition change, add parsing controls, and test several horizon queries before scaling anything up.*
