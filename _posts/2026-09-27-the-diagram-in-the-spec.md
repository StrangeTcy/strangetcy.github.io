---

title: "The Diagram Is the Spec"
date: 2026-09-27
layout: post
---

{% include mathjax.html %}

*by <span class="icon-self">StrangeTcy</span>*

<dl class="epistemic-status">
  <dt>Original ideas</dt>
  <dd>Category theory as a source of implementation constraints rather than vocabulary; the use of algebraic laws as held-out behavioural specifications; sheaf conditions as local-to-global consistency. The packaging into agent environments is mine.</dd>

  <dt>Synthesis</dt>
  <dd><span class="icon-self">StrangeTcy</span></dd>

  <dt>Prose</dt>
  <dd>Several models (<span class="icon-openai">gpt</span>span and <span class="icon-anthropic">claude</span> mostly), from the dialogue &amp; successive rounds of criticism; final edit <span class="icon-self">StrangeTcy</span></dd>

  <dt>Certainty</dt>
  <dd>Confident about the executable design described here &amp; the mathematical laws illustrated below. Exploratory about what frontier models will do on the resulting environments. No model results yet.</dd>

  <dt>Importance</dt>
  <dd>A design post for the <code>cat_theo/*</code> family in <a href="https://github.com/StrangeTcy/rl_eval_generator">rl_eval_generator</a>. Companion to the broader evaluation framing; this post is about the category-theoretic family itself.</dd>
</dl>

I did not build these environments because I wanted agents to recite the [Yoneda lemma](https://en.wikipedia.org/wiki/Yoneda_lemma).

I built them because a large class of ML bugs are **failed diagrams**.

Two computations that ought to be the same composite, traversed two ways, do not agree. A transform that should commute with a symmetry does not. A get/put pair behaves correctly once & breaks on the second update. A parallel scan works on the lengths somebody tested & fails when the tree of compositions changes.

The surface of the code _looks like_ ordinary engineering.

The failure is algebraic.

And that gives me a rather nice way to write an evaluation environment:

> **Make the law the specification, then vary the concrete instance.**

This is one of the reasons I like category theory here. The laws are often small enough to draw.

And the diagrams are pretty :D

That is not entirely a joke.

## The diagram is the spec

A naturality square, a lens law, a sheaf gluing condition: each is small enough to *see*. Once you can see it, you can ask whether a submitted patch preserves it — &, more importantly, whether **the judge is asking the right question**.

Beauty here is compression of the specification.

If a law doesn't fit on a napkin, I don't trust myself to hold it constant across procedural generation. I also do not trust a judge I can't audit by eye.

I have earned that second rule the hard way. A grader elsewhere in the suite once failed a known-correct patch & reported a plausible but wrong failure mode. I believed it longer than I should have because the number agreed with what I expected.

The judge has to solve the same problem I'm posing to the model.

A diagram I can check in ten seconds is a cheap defence against getting that wrong again.

Which sets a standard for this post itself:

> Every diagram below should typecheck.

If it doesn't, the section is not yet a specification.

## Why diagrams, not unit tests

A unit test says:

> On these inputs, produce these outputs.

A diagram says:

> **These two paths are the same morphism.**

For a natural transformation $\eta:F\Rightarrow G$,

$$
\large
\begin{array}{ccccc}
F(A) & \xrightarrow{\ F(f)\ } & F(B) \\
\big\downarrow{ \eta_A} & & \big\downarrow{ \eta_B} \\
G(A) & \xrightarrow{\ G(f)\ } & G(B)
\end{array}
$$

The square commutes when

$$
\eta_B\circ F(f)=G(f)\circ\eta_A.
$$

That equation does something a unit test does not.

It says what should remain true when the concrete objects change.

The evaluator can therefore change the sequence length, the group element, the batching, the chunking, the parenthesisation, or the generated instance without changing the law being tested.

The visible tests are one sample of the diagram.

The held-out judge is another.

```text
surface reading of the code
            ≠
operative law in the judge
```

That distinction is the centre of the family.

## 1 — Functors everywhere

One reason category theory is useful here is that the same structure reappears under completely different engineering names.

A functor preserves identity:

$$
\large
\begin{array}{ccc}
A & \xrightarrow{\ id_A\ } & A \\
\big\downarrow{ F} & & \big\downarrow{ F} \\
F(A) & \xrightarrow{\ id_{F(A)}\ } & F(A)
\end{array}
$$

and composition:

$$
\large
\begin{array}{ccccc}
A & \xrightarrow{\ f\ } & B & \xrightarrow{\ g\ } & C \\
\big\downarrow{ F} & & \big\downarrow{ F} & & \big\downarrow{ F} \\
F(A) & \xrightarrow{\ F(f)\ } & F(B) & \xrightarrow{\ F(g)\ } & F(C)
\end{array}
$$

with

$$
F(g\circ f)=F(g)\circ F(f).
$$

You do not need to implement a library called `Functor` to encounter this structure.

You can encounter it as applying a model independently to a batch, relabelling the nodes of a graph, transforming a sequence and then slicing it, changing coordinates while preserving an operation, or composing state transitions.

The diagram does not care what the classes are called.

That is the useful part.

## 2 — Naturality & equivariance

Suppose a model operation $h$ should commute with a symmetry $g$.

$$
\large
\begin{array}{ccccc}
X & \xrightarrow{\ g\cdot(-)\ } & X \\
\big\downarrow{ h} & & \big\downarrow{ h} \\
Y & \xrightarrow{\ g\cdot(-)\ } & Y
\end{array}
$$

Equivariance means

$$
h(gx)=g\,h(x).
$$

Invariance is the special case where the action on $Y$ is trivial:

$$
h(gx)=h(x).
$$

The distinction is easy to state & easy to break in code.

The suite contains the same structural idea in several forms.

For graph message passing:

$$
\large
\begin{array}{ccccc}
(A,X) &
\xrightarrow{\ (A,X)\mapsto(PAP^T,PX)\ } &
(PAP^T,PX) \\
\big\downarrow{ \ell} & & \big\downarrow{ \ell} \\
\ell(A,X) & \xrightarrow{\ P(-)\ } & P\,\ell(A,X)
\end{array}
$$

with

$$
\ell(PAP^T,PX)=P\,\ell(A,X).
$$

For vectorisation, the same shape becomes:

$$
\large
\begin{array}{ccccc}
[x_1,\ldots,x_B] &
\xrightarrow{\ \operatorname{vmap}(f)\ } &
[y_1,\ldots,y_B] \\
\big\downarrow{ \operatorname{unbatch}} &&
\big\downarrow{ \operatorname{unbatch}} \\
\{x_i\} & \xrightarrow{\ \text{apply }f\text{ independently}\ } & \{y_i\}.
\end{array}
$$

The question is whether “apply the model to the batch” agrees with “apply the model to each element”.

For architecture conversion:

$$
\large
\begin{array}{ccccc}
F(X) & \xrightarrow{\ F(h)\ } & F(Y) \\
\big\downarrow{ \alpha_X} & & \big\downarrow{ \alpha_Y} \\
G(X) & \xrightarrow{\ G(h)\ } & G(Y)
\end{array}
$$

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

The three laws are

$$
get(put(s,a))=a,
$$

$$
put(s,get(s))=s,
$$

and

$$
put(put(s,a),a')=put(s,a').
$$

They can be drawn directly.

Put–Get:

$$
\large
\begin{array}{ccccc}
S\times A & \xrightarrow{\ \operatorname{put}\ } & S & \xrightarrow{\ \operatorname{get}\ } & A \\
\big\downarrow{ \pi_A} & & & & \big\Vert \\
A & & & & A
\end{array}
$$

Get–Put:

$$
\large
\begin{array}{ccccc}
S & \xrightarrow{\ \langle id,get\rangle\ } & S\times A \\
\big\Vert & & \big\downarrow{ \operatorname{put}} \\
S & \xrightarrow{\ id\ } & S
\end{array}
$$

Put–Put:

$$
\large
\begin{array}{ccccc}
S\times A\times A &
\xrightarrow{\ \operatorname{put}\times id_A\ } &
S\times A \\
\big\downarrow{ \langle\pi_S,\pi_{A'}\rangle} &&
\big\downarrow{ \operatorname{put}} \\
S\times A & \xrightarrow{\ \operatorname{put}\ } & S
\end{array}
$$

The interesting failure mode is not forgetting the definition of a lens.

It is implementing something that passes one round-trip and breaks when the operation is composed.

That is exactly the kind of mistake a visible example can hide.

The current environment names the lens laws in its prompt. That makes it a useful **law-application** task: the agent is told what must hold, then has to make the implementation continue to satisfy those equations under cases it was not shown.

That is already a meaningful capability.

It is just not the same capability as discovering the law.

## 4 — Monads & Kleisli composition

For a monad $(T,\eta,\mu)$, the two unit laws can be written as commuting diagrams:

$$
\large
\begin{array}{ccc}
T(A) & \xrightarrow{\ \eta_{T(A)}\ } & T^2(A) \\
\big\Vert & & \big\downarrow{ \mu_A} \\
T(A) & \xrightarrow{\ id\ } & T(A)
\end{array}
\qquad
\begin{array}{ccc}
T(A) & \xrightarrow{\ T(\eta_A)\ } & T^2(A) \\
\big\Vert & & \big\downarrow{ \mu_A} \\
T(A) & \xrightarrow{\ id\ } & T(A)
\end{array}
$$

Associativity is the square

$$
\large
\begin{array}{ccccc}
T^3(A) & \xrightarrow{\ T(\mu_A)\ } & T^2(A) \\
\big\downarrow{ \mu_{T(A)}} & & \big\downarrow{ \mu_A} \\
T^2(A) & \xrightarrow{\ \mu_A\ } & T(A).
\end{array}
$$

In code, however, these usually appear as bind:

$$
\large
\begin{array}{ccccc}
A & \xrightarrow{\ f\ } & T(B) & \xrightarrow{\ T(g)\ } & T^2(C)
\end{array}
$$

followed by $\mu_C:T^2(C)\to T(C)$, giving the Kleisli composite

$$
g\circ_K f=\mu_C\circ T(g)\circ f.
$$

In bind form:

$$
return(a)\mathbin{>>=}f=f(a),
$$

$$
m\mathbin{>>=}return=m,
$$

and

$$
(m\mathbin{>>=}f)\mathbin{>>=}g
=
m\mathbin{>>=}
(\lambda x.\,f(x)\mathbin{>>=}g).
$$

The interesting engineering failure is therefore not “forgot to write `return`”.

It is writing the happy path as a plain function and decorating the output with the syntax of an effect, without fuckingly preserving the composition law.

## 5 — Adjunctions

A lossy tokenizer and a detokenizer are not inverses.

The design language is a Galois connection:

$$
L(a)\le b
\quad\Longleftrightarrow\quad
a\le R(b).
$$

That gives the unit and counit inequalities

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

Categorically, that is the commuting triangle

$$
\large
\begin{array}{ccccc}
L & \xrightarrow{\ L\eta\ } & LRL \\
\big\Vert & & \big\downarrow{ \varepsilon L} \\
L & \xrightarrow{\ id_L\ } & L.
\end{array}
$$

Encode, decode, encode again.

You must land back where the first encoding landed.

That is a nice example of the difference between **the mathematical design** and **the executable check**. The diagram tells me what structure I think I am implementing. The judge checks a concrete consequence of that structure.

## 6 — Associativity: one law, many systems

The associative law is small:

$$
(a\oplus b)\oplus c
=
a\oplus(b\oplus c).
$$

But it has enormous engineering reach.

A parallel scan can regroup the same transitions in different trees:

$$
\begin{aligned}
((x_0\oplus x_1)\oplus x_2)\oplus x_3
&=
(x_0\oplus x_1)\oplus(x_2\oplus x_3) \\
&=
x_0\oplus(x_1\oplus(x_2\oplus x_3)).
\end{aligned}
$$

The sequential computation and the balanced computation should agree.

So should every other parenthesisation.

A bug that passes powers-of-two lengths and breaks odd lengths may not be a mysterious scan bug.

It may simply be a broken associator.

And then the same idea appears as a semiring:

$$
\large
\begin{array}{c|cc|cc}
 & \oplus & \otimes & 0 & 1 \\
\hline
\text{reachability} & \lor & \land & \bot & \top \\
\text{shortest path} & \min & + & +\infty & 0 \\
\text{sum-product} & + & \times & 0 & 1
\end{array}
$$

One interface.

Three concrete fillings.

That is a very category-theoretic way of looking at ordinary algorithms.

And it produces some rather pretty pictures.

## 7 — The tropical connection

One of the nicest examples in the suite is the differentiable parser.

The task says to replace a hard minimum with a smooth Log-Sum-Exp formulation so that gradients flow.

The category-theoretic structure is not required to solve the task.

But once you know the structure, the relationship is visible:

$$
\operatorname{softmin}_\tau(a,b)
=
-\tau\log
\left(
e^{-a/\tau}+e^{-b/\tau}
\right)
$$

and

$$
\lim_{\tau\to0^+}\operatorname{softmin}_\tau(a,b)=\min(a,b).
$$

So the picture is:

$$
\boxed{
\begin{array}{c}
\text{hard minimum} \\[2pt]
\min(a,b)
\end{array}}
\quad
\xrightarrow{\ \tau>0\ }
\quad
\boxed{
\begin{array}{c}
\text{smooth minimum} \\[2pt]
-\tau\log(e^{-a/\tau}+e^{-b/\tau})
\end{array}}
\quad
\xrightarrow{\ \tau\to0^+\ }
\quad
\min(a,b).
$$

The hard operation selects a branch.

The smooth version distributes gradient across branches.

The implementation problem is therefore not an isolated numerical trick. It is a change in the algebra used by the dynamic program.

The agent does not need to recognise that story to solve the task.

But the diagram makes the structure obvious to the person designing the evaluation.

## 8 — Sheaves: local fixes, global failure

The sheaf-shaped environments take the same idea somewhere stranger.

Restriction goes from a larger region to a smaller one:

$$
\large
\begin{array}{ccccc}
&&F(U_1\cup U_2)&&\\[4pt]
&\swarrow{ \rho_{U_1}}&&
\searrow{ \rho_{U_2}}&\\[4pt]
F(U_1)&&&&F(U_2)\\[4pt]
&\searrow{ \rho_{U_1\cap U_2}}&&
\swarrow{ \rho_{U_1\cap U_2}}&\\[4pt]
&&F(U_1\cap U_2)&&
\end{array}
$$

Local sections must agree on the overlap:

$$
s_1|_{U_1\cap U_2}
=
s_2|_{U_1\cap U_2}.
$$

Then the sheaf condition says that they glue to a unique global section.

In equaliser form:

$$
F(U)
\longrightarrow
\prod_i F(U_i)
\rightrightarrows
\prod_{i<j}F(U_i\cap U_j).
$$

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

Some environments explicitly state the mathematical law. Others talk about the engineering behaviour without giving the category-theoretic label.

That distinction is important enough that I do not want to hide it in the prose.

The agent can be given the law:

$$
\text{law}
\quad\longrightarrow\quad
\text{implementation}
\quad\longrightarrow\quad
\text{held-out composition},
$$

or it can be given only behavioural evidence:

$$
\text{behaviour}
\quad\longrightarrow\quad
\text{hypothesis}
\quad\longrightarrow\quad
\text{implementation}
\quad\longrightarrow\quad
\text{held-out composition}.
$$

Those are different experiments.

The current family contains both forms, but not in a perfectly balanced way. Several prompts explicitly name lenses, monads, adjunctions, associativity, naturality, equivariance, functors, semirings, and so on. Others — including the SSM lift, tensor/vectorisation task, parser, and sheaf tasks — describe the engineering failure without giving the category-theoretic label.

That is useful rather than embarrassing.

It means the first experiment is not “can a model discover category theory?”

It is:

> **Can a model take an abstract law, or a behavioural shadow of that law, and make an implementation satisfy it under compositions and instances it was not shown?**

That is already a hard question.

And later I can add a genuinely de-named condition in which the law statement itself disappears.

A benchmark that claims to measure recognition while simply handing the law to the model would be a rather good example of the problem this project is supposed to study.

## What the agent sees versus what the judge holds

The intended separation is simple:

| Agent-visible                         | Held-out judge                    |
| ------------------------------------- | --------------------------------- |
| Executable ML / systems code          | New compositions                  |
| Visible tests                         | New parenthesisations             |
| A concrete engineering failure        | New lengths, shifts, permutations |
| Sometimes the abstract law            | New overlaps & chunkings          |
| Sometimes only its behavioural shadow | Algebraic law checks              |

The important separation is not merely visible test versus hidden test.

It is:

$$
\text{what the example demonstrates}
\qquad\neq\qquad
\text{what the law guarantees}.
$$

The generator can give the model one concrete instance and ask the judge about another.

That is the trick.

## The division of labour

There is also a useful asymmetry between the researcher and the model.

$$
\large
\begin{array}{rcl}
\text{researcher}
&:&
\text{invariant}
\to
\text{diagram}
\to
\text{generator}
\to
\text{instances}
\to
\text{judge}
\\[8pt]
\text{model}
&:&
\text{artifact}
\to
\text{hypothesis}
\to
\text{patch}
\to
\text{consequences}
\end{array}
$$

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
