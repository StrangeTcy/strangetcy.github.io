---

title: "The Diagram Is the Spec"
date: 2026-09-27
layout: post
------------

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

*Original ideas* — Category theory as a source of implementation constraints rather than vocabulary; the use of algebraic laws as held-out behavioural specifications; sheaf conditions as local-to-global consistency. The packaging into agent environments is mine.

*Synthesis* — StrangeTcy

*Prose* — Several models, from dialogue & successive rounds of criticism; final edit StrangeTcy

*Certainty* — Confident about the executable design described here & the mathematical laws illustrated below. Exploratory about what frontier models will do on the resulting environments. No model results yet.

*Importance* — A design post for the `cat_theo/*` family in [rl_eval_generator](https://github.com/StrangeTcy/rl_eval_generator). Companion to the broader evaluation framing; this post is about the category-theoretic family itself.

---

I did not build these environments because I wanted agents to recite the Yoneda lemma.

I built them because a large class of ML bugs are **failed diagrams**.

Two computations that ought to be the same composite, traversed two ways, do not agree. A transform that should commute with a symmetry does not. A get/put pair behaves correctly once & breaks on the second update. A parallel scan works on the lengths somebody tested & fails when the tree of compositions changes.

The surface of the code looks like ordinary engineering.

The failure is algebraic.

And that gives me a rather nice way to write an evaluation environment:

> **Make the law the specification, then vary the concrete instance.**

This is one of the reasons I like category theory here. The laws are often small enough to draw.

And the diagrams are pretty.

That is not entirely a joke.

## The diagram is the spec

A naturality square, a lens law, a sheaf gluing condition: each is small enough to *see*. Once you can see it, you can ask whether a submitted patch preserves it — and, more importantly, whether **the judge is asking the right question**.

Beauty here is compression of the specification.

If a law does not fit on a napkin, I do not trust myself to hold it constant across procedural generation. I also do not trust a judge I cannot audit by eye.

I have earned that second rule the hard way. A grader elsewhere in the suite once failed a known-correct patch & reported a plausible but wrong failure mode. I believed it longer than I should have because the number agreed with what I expected.

The judge has to solve the same problem I am posing to the model.

A diagram I can check in ten seconds is a cheap defence against getting that wrong again.

Which sets a standard for this post itself:

> Every diagram below should typecheck.

If it does not, the section is not yet a specification.

## Why diagrams, not unit tests

A unit test says:

> On these inputs, produce these outputs.

A diagram says:

> **These two paths are the same morphism.**

For a natural transformation \(\eta : F \Rightarrow G\):

```text
              F(f)
      F(A) ─────────→ F(B)
       │               │
      η_A             η_B
       │               │
       ↓               ↓
      G(A) ─────────→ G(B)
              G(f)
```

The square commutes when

$$
\eta_B \circ F(f) = G(f) \circ \eta_A.
$$

That equation does something a unit test does not.

It says what should remain true when the concrete objects change.

The evaluator can therefore change the sequence length, the group element, the batching, the chunking, the parenthesisation, or the actual generated instance without changing the law being tested.

The visible tests are one sample of the diagram.

The held-out judge is another.

```text
surface reading of the code
            ≠
operative law in the judge
```

That distinction is the centre of the family.

## 1 — Functors everywhere

One reason category theory is useful here is that the same shape reappears under completely different names.

A functor preserves identity:

```text
        id_A
     A ───────→ A
     │           │
     │ F         │ F
     ↓           ↓
    F(A) ─────→ F(A)
        id_F(A)
```

and composition:

```text
          f              g
    A ───────→ B ───────→ C
    │                       │
    │ F                     │ F
    ↓                       ↓
   F(A) ────────────────→ F(C)
             F(g∘f)

          F(g∘f) = F(g) ∘ F(f)
```

You do not need to implement a library called `Functor` to encounter this structure.

You can encounter it as:

* applying a model independently to a batch;
* relabelling the nodes of a graph;
* transforming a sequence and then slicing it;
* changing coordinates while preserving the operation;
* composing state transitions.

The diagram does not care what the classes are called.

That is the useful part.

## 2 — Naturality & equivariance

Suppose a model operation \(h\) should commute with a symmetry \(g\).

```text
              g·(−)
        X ─────────→ X
        │             │
        h             h
        │             │
        ↓             ↓
        Y ─────────→ Y
              g·(−)
```

Equivariance means

$$
h(gx)=g\,h(x).
$$

Invariance is the special case where the action on \(Y\) is trivial:

$$
h(gx)=h(x).
$$

The distinction is easy to state and easy to break in code.

The suite contains the same structural idea in several forms.

For graph message passing:

```text
              (PAPᵀ, PX)
     (A,X) ─────────────────→ (A',X')
       │                         │
       │ ℓ                       │ ℓ
       ↓                         ↓
     ℓ(A,X) ─────── P·(−) ───→ P·ℓ(A,X)
```

with

$$
\ell(PAP^T,PX)=P\,\ell(A,X).
$$

For vectorisation:

```text
                vmap(model)
     [x₁ … x_B] ───────────────→ [y₁ … y_B]
         │                           │
      unbatch                       unbatch
         │                           │
         ↓                           ↓
       {xᵢ} ───── model each ─────→ {yᵢ}
```

The question is whether “apply the model to the batch” agrees with “apply the model to each element”.

For architecture conversion:

```text
                 F(h)
       F(X) ─────────────→ F(Y)
        │                   │
       α_X                 α_Y
        │                   │
        ↓                   ↓
       G(X) ─────────────→ G(Y)
                 G(h)
```

with

$$
\alpha_Y\circ F(h)=G(h)\circ\alpha_X.
$$

Same square.

Different engineering problem.

That repetition is part of what I like about the family. Once you can see the square, you start seeing it everywhere.

## 3 — Lenses

A lens has

$$
get:S\to A
$$

and

$$
put:S\times A\to S.
$$

The three laws are:

$$
get(put(s,a))=a
$$

$$
put(s,get(s))=s
$$

$$
put(put(s,a),a')=put(s,a').
$$

They can be drawn directly.

Put–Get:

```text
                  put             get
      S × A ─────────────→ S ─────────────→ A
        │                                   ║
        └──────────────── π_A ─────────────┘
```

Get–Put:

```text
             ⟨id,get⟩              put
        S ───────────────→ S × A ───────→ S
        │                                  ║
        └──────────────── id ──────────────┘
```

Put–Put:

```text
                     put × id
      S × A × A ───────────────→ S × A
          │                         │
      ⟨π_S,π_A'⟩                   │ put
          │                         ↓
          ↓                       S
        S × A ────────── put ─────→ S
```

The interesting failure mode is not forgetting the definition of a lens.

It is implementing something that passes one round-trip and breaks when the operation is composed.

That is exactly the kind of mistake a visible example can hide.

The current environment actually names the lens laws in its prompt. That makes it a useful **law-application** task: the agent is told what must hold, then has to make the implementation continue to satisfy those equations under cases it was not shown.

That is already a meaningful capability.

It is just not the same capability as discovering the law.

## 4 — Monads & Kleisli composition

For a monad \((T,\eta,\mu)\), the two unit laws are:

$$
\mu_A\circ \eta_{T(A)}=id_{T(A)}
$$

and

$$
\mu_A\circ T(\eta_A)=id_{T(A)}.
$$

They form two triangles:

```text
             η_{T(A)}
        T(A) ─────────→ T²(A)
          ╲               │
           ╲              │ μ_A
            ╲             ↓
             ╲────────── T(A)
                    id
```

and

```text
             T(η_A)
        T(A) ─────────→ T²(A)
          ╱               │
         ╱                │ μ_A
        ╱                 ↓
       T(A) ───────────→ T(A)
              id
```

Associativity is:

```text
               μ_{T(A)}
     T³(A) ─────────────→ T²(A)
       │                     │
   T(μ_A)                  μ_A
       │                     │
       ↓                     ↓
     T²(A) ─────── μ_A ───→ T(A)
```

In code, however, these usually appear as bind:

```text
       f : A → T(B)          g : B → T(C)

                        f          T(g)         μ
       g ∘ᴷ f : A ─────→ T(B) ─────→ T²(C) ───→ T(C)
```

with

$$
return(a)\mathbin{>>=}f=f(a)
$$

$$
m\mathbin{>>=}return=m
$$

$$
(m\mathbin{>>=}f)\mathbin{>>=}g
=
m\mathbin{>>=}
(\lambda x.\,f(x)\mathbin{>>=}g).
$$

The interesting engineering failure is therefore not “forgot to write `return`”.

It is writing the happy path as a plain function and decorating the output with the syntax of an effect, without actually preserving the composition law.

## 5 — Adjunctions

A lossy tokenizer and a detokenizer are not inverses.

The design language is a Galois connection:

```text
          L
      A ⇄    B
          R

      L(a) ≤ b    ⇔    a ≤ R(b)
```

with unit and counit inequalities

$$
id_A\le R\circ L
$$

and

$$
L\circ R\le id_B.
$$

But those inequalities only become meaningful after the two orders have fuckingly been specified.

The executable environment instead checks the concrete triangle identity

$$
L(R(L(s)))=L(s).
$$

```text
                 Lη
        L ─────────────→ LRL
         ╲                 │
          ╲                │ εL
           ╲               ↓
            ╲──────────── L
                  id_L
```

Encode, decode, encode again.

You must land back where the first encoding landed.

That is a nice example of the difference between **the mathematical design** and **the executable check**. The diagram tells me what structure I think I am implementing. The judge checks a consequence of that structure on concrete inputs.

## 6 — Associativity: one law, many systems

The associative law is small:

$$
(a\oplus b)\oplus c
=
a\oplus(b\oplus c).
$$

But it has enormous engineering reach.

A parallel scan can regroup the same transitions in different trees:

```text
      x₀   x₁   x₂   x₃          x₀   x₁   x₂   x₃
       ╲   ╱     ╲   ╱            ╲   ╱     ╲   ╱
        ⊕         ⊕                ⊕         ⊕
         ╲       ╱                  ╲       ╱
          ╲     ╱                    ╲     ╱
           ⊕                         ⊕
           │                       ╱   ╲
        result                  x₀      result
                                 ...
```

The sequential computation and the balanced computation should agree.

So should every other parenthesisation.

A bug that passes powers-of-two lengths and breaks odd lengths may not be a mysterious scan bug.

It may simply be a broken associator.

And then the same idea appears as a semiring:

```text
        (⊕, ⊗)
           │
    ┌──────┼───────────┐
    │      │           │
    ↓      ↓           ↓
   ∨,∧    min,+       +,×
    │      │           │
 reach-   shortest   sum-
 ability   path      product
```

with identities:

```text
reachability    (⊥, ⊤)
shortest path   (+∞, 0)
sum–product     (0, 1)
```

One interface.

Three concrete fillings.

That is a very category-theoretic way of looking at ordinary algorithms.

And it produces some rather pretty pictures.

## 7 — The hidden tropical diagram

One of the nicest examples in the suite is the differentiable parser.

The task says to replace a hard minimum with a smooth Log-Sum-Exp formulation so that gradients flow.

The category-theoretic structure is never required to solve the task.

But once you know the structure, this is what is happening:

```text
        tropical world                      smooth world

             min                                  LSE_τ
              │                                     │
              │        temperature relaxation       │
              └─────────────────────────────────────┘

       min(a,b)                         -τ log(e^{-a/τ}+e^{-b/τ})
          │                                         │
       hard branch                             all branches
          │                                         │
       sparse grad                              smooth grad

                         τ → 0
                           ↓
                    recover min
```

The two operations are not merely visually similar.

They explain why the implementation has the failure mode it does.

Again, the diagram is useful because it compresses several implementation constraints into one object.

## 8 — Sheaves: local fixes, global failure

The sheaf-shaped environments take the same idea somewhere stranger.

Restriction goes from a larger region to a smaller one:

```text
                  F(U₁ ∪ U₂)
                  ╱        ╲
             ρ₁  ↓          ↓  ρ₂
              F(U₁)        F(U₂)
                  ╲        ╱
               ρ₁₂╲      ╱ρ₂₁
                    ↓    ↓
                 F(U₁ ∩ U₂)
```

Local sections must agree on overlaps:

$$
s_1|_{U_1\cap U_2}
=
s_2|_{U_1\cap U_2}.
$$

Then the sheaf condition says that they glue to a unique global section.

In equaliser form:

```text
          ∏ᵢ F(Uᵢ)
             │
             │
     F(U) ──→├──────→ ∏ᵢⱼ F(Uᵢ ∩ Uⱼ)
             │
             └────────→
```

The actual environments are not implementations of sheaf theory.

They are sheaf-inspired engineering problems.

A database schema has overlapping local views.

A preprocessing pipeline has local transformations whose composition can fail globally.

A distributed scheduler has locally feasible allocations that can violate a shared global capacity.

The common pattern is:

> Every local piece looked reasonable. The composite was not.

That is exactly the sort of thing a local unit test can miss.

## The point of the seventeen environments

The suite is deliberately heterogeneous.

Some environments explicitly state the mathematical law. Others talk about the engineering behaviour without using the category-theoretic name.

That distinction is important enough that I do not want to hide it in the prose.

The agent can be given:

```text
              the law
                 │
                 ▼
             implement
                 │
                 ▼
         held-out composition
```

or:

```text
             behaviour
                 │
                 ▼
          infer what holds
                 │
                 ▼
             implement
                 │
                 ▼
         held-out composition
```

Those are different experiments.

The current family contains both forms, but not in a perfectly balanced way. Several prompts explicitly name lenses, monads, adjunctions, associativity, naturality, equivariance, functors, semirings, and so on. Others — including the SSM lift, tensor/vectorisation task, parser, and sheaf tasks — describe the engineering failure without giving the category-theoretic label.

The README calls the family seventeen category-theoretic environments; the prompt files show that the lexical presentation is not uniform.

That is useful rather than embarrassing.

It means the first experiment is not “can a model discover category theory?”

It is:

> **Can a model take an abstract law, or a behavioural shadow of that law, and make an implementation satisfy it under compositions and instances it was not shown?**

That is already a hard question.

And later I can add a genuinely de-named condition in which the law statement itself disappears.

A benchmark that claims to measure recognition while simply handing the law to the model would be a rather good example of the problem this project is supposed to study.

## What the agent sees versus what the judge holds

```text
┌───────────────────────────────────────┐
│ agent-visible                         │
│                                       │
│ · executable ML / systems code        │
│ · visible tests                       │
│ · a concrete engineering failure     │
│ · sometimes the abstract law          │
│ · sometimes only its behaviour       │
└───────────────────────────────────────┘
                    │
                    │ submit patch
                    ▼
┌───────────────────────────────────────┐
│ held-out judge                        │
│                                       │
│ · new compositions                    │
│ · new parenthesisations               │
│ · new lengths / shifts / permutations │
│ · new overlaps / chunkings            │
│ · algebraic law checks                │
└───────────────────────────────────────┘
```

The important separation is not visible test versus hidden test in the usual benchmark sense.

It is:

```text
          what the example demonstrates
                         ≠
              what the law guarantees
```

The generator can give the model one concrete instance and ask the judge about another.

That is the entire trick.

## The division of labour

There is also a useful asymmetry between the researcher and the model:

```text
researcher

    invariant
       ↓
    diagram
       ↓
   generator
       ↓
   many instances
       ↓
     judge


model

   artifact
       ↓
   hypothesis
       ↓
     patch
       ↓
   consequences
```

The model does not need the word *naturality* for the researcher to use a naturality square.

That is one of the things I like most about this setup.

The category-theoretic name is for the person designing the evaluation.

The executable behaviour is for the model.

And the diagram is the interface between those two.

## What this is not

It is not a claim that frontier models fail these tasks.

It is not a claim that category theory is necessary for ML engineering.

It is not a course in category theory.

And it is not yet a claim that this suite measures pure law recognition. Some environments hand the law over explicitly. Some hide the terminology. A genuinely clean recognition experiment would require an additional generator axis which removes the law statement itself while leaving the executable problem unchanged.

The claim I can make now is narrower:

> **A useful slice of structural competence can be operationalised as: hold a small diagram constant, vary its concrete instance procedurally, and score the diagram rather than the surface output.**

That is what `cat_theo` is for.

The results will tell me whether the agents can do it.

For now, I mostly wanted the diagrams on the page.
