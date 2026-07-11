---
layout: default
title: Metis, Not Intelligence
---

*by *StrangeTcy*{: .icon-self}*

I have a running list of things I can't stop thinking about that don't
obviously belong together: [*Cryptonomicon*](https://www.kulichki.com/moshkow/INOFANT/STEFENSON/cryptonomicon_engl.txt),
card magic (in the [Penn & Teller](https://en.wikipedia.org/wiki/Penn_%26_Teller)
sense — deception as engineering, not flourish), category theory, the
mechanics of good burglary, mechanism design, and — lately —
[the guts of RL environments for evaluating LLMs](https://github.com/StrangeTcy/rl_eval_generator).

I found the name for the connecting thread about twenty years ago, in one
of the best rants in *Cryptonomicon*. Enoch Root makes the point that
Athena isn't the goddess of wisdom in the sense people assume. She's the
goddess of *metis* (μῆτις) — cunning, craft, applied ingenuity, the
quality that in Greek myth she literally swallows (the titaness Metis was
Athena's mother, absorbed by Zeus so her cleverness would live inside his
line permanently — a fairly on-the-nose metaphor for "cunning as
inherited infrastructure" if you sit with it). Wisdom in the
contemplative sense belongs somewhere else. Metis is what builds the
shield. Ares swings the sword; Athena designs the Aegis.

It's stuck with me for two decades because it named something I kept
noticing without having a word for: a specific flavor of cleverness,
distinct from raw horsepower and distinct from contemplation. The skill
of noticing that the game you're being asked to play is not the real
game, and finding the lever the real game responds to.

A few examples I keep returning to:

- A good burglar doesn't get better at picking locks. He notices the wall
  next to the lock is drywall — Gwern has
  [a good aside on this](https://gwern.net/unseeing#fn6): the skill isn't
  force, it's noticing what everyone else has trained themselves not to see.
- A good magician doesn't rely on sleight of hand. Tamariz argues the
  real craft is engineering the *explanation* the spectator will
  construct afterward. The trick survives the spectator's own retelling
  of it. That's the part that took me a while to actually absorb: the
  deception isn't in what you hide, it's in what you let them construct.
- A good exploit rarely comes from pushing harder on the intended
  interface. It comes from noticing the system is accidentally
  [Turing-complete](https://gwern.net/turing-complete) somewhere nobody
  meant it to be — a regex engine that's secretly a state machine, a
  template language that's secretly a scripting language, a permission
  check that becomes a confused deputy.
- Unix, git, containers, public-key cryptography — none of these won by
  being faster at the existing task. They won by changing what the unit
  of composition was.

None of this is about intelligence-as-quantity — more IQ, more compute,
faster reasoning inside a fixed game. It's a different axis entirely: can
you see the machinery generating the game, and can you touch it.

This is also, among other things, what I'm trying to test for when I
[build RL environments for model evaluation](https://github.com/StrangeTcy/rl_eval_generator).
A benchmark score tells you how well a model plays the game as given.
What I actually want to know is whether the model has any metis at all —
whether it can hold an invariant across a change of representation,
recognize that two syntactically different problems are the same
problem, or notice that the framing it was handed is a trap. Most
current frontier models — *Claude*{: .icon-anthropic} included, and
*GPT*{: .icon-openai} just as much — are closer to Ares than Athena:
enormous force, applied with almost no structural awareness of the
substrate they're operating on. They'll happily generate a fluent,
confident, wrong taxonomy and not update when you tell them it's wrong,
fifteen times in a row if you let them. That's not a knock on any one
lab's models specifically. It's the oldest failure mode there is, just
now visible at scale, and cheap to elicit on demand: mistaking the
performance of understanding for understanding.

The thing I want to get better at — in evaluation design, in
engineering, in whatever I do next — is the Athena move, not the Ares
move. Not applying more force to the front of the problem. Finding the
wall next to the lock.
