This is going to be a longread post about my recent experience with a certain RL env startup and my application thereto. It's going to contain some autobiographical vignettes, ideas (of variable weirdness) and suggestions to anyone who'd bother to take notice.


A while ago I was on a merry walk when I checked my phone and came across a job posting in a telegram channel, which had a link to a full-blown job description. I won't provide contacts or links here (privacy is a concern, and links bitrot eventually by default), opting to quote it instead with some omissions:



"""
Reinforcement Learning Environments Engineers


$[a small fortune]/month



Brief description of the vacancy


We’re hiring RL Environments Engineers to design and build MLE/SWE environments that deliver high-quality, diverse tasks with minimal supervision. You’ll target specific language models and meet a defined difficulty distribution, delivering about one task every 3–5 hours. Remote contractor role with ≥4 hours overlap to PST and advanced English (C1/C2) required.


About the company



Company XOR.AI/Preference Model



Preference Model We Scale AI Agent Infrastructure. We focus on building rigorous environments and evaluations for language models. The company has recently closed a large funding round and is running pilots with leading AI labs.



Responsibilities



Design and build MLE/SWE environments and diverse tasks.



Target a specified language model and satisfy the required difficulty distribution.



Deliver ~1 task per 3–5 hours once onboarded.



Be responsive and edit tasks within 24 hours based on customer feedback.



Onboard quickly and start delivering on day one; operate with minimal supervision.



Requirements



Strong Python skills suitable for building RL environments and tasks.



Experience designing environments/tasks for RL or evaluations.



Ability to meet the throughput expectation (1 task / 3–5h) and respond within 24 hours to feedback.



Comfortable onboarding quickly and working independently.



Ability to work with at least 4 hours overlap to PST business hours.



Advanced English (C1/C2) for specifications, reviews, and feedback.



Working conditions



Remote, independent contractor engagement.



Deliverables-driven; begin shipping on day one.



"""



-- that looked intriguing, so I contacted the person listed in the contacts section and asked for further details. 




Which followed soon, and led me to a google document which presented a take home task: basically I had to design what the document termed "RL tasks" but to me looked more like benchmarking items (admittedly, RL envs could be built around these, more on that later). 



"""



Objective



Your objective is to create an RL task for LLM training. An RL task consists of a prompt, along with some tools and data, and a way to verify whether the task has been completed successfully. The task should teach the model a skill useful in the normal work of an ML engineer or researcher. The task should also satisfy the pass-rate requirements. We’ve provided some example tasks below. 



[.. link to a repo here...]



For inspiration, you can take a look at SWE_Bench_Pro, which is a collection of realistic software engineering style tasks.



Requirements



The task should resemble the kinds of things an ML engineer or ML researcher might do



For each task the model must succeed between 10% and 40% of the time. You can measure this by running a task against the model at least 10 times and averaging.



The prompt must precisely encapsulate what’s verified by the grading function.



Every possible correct solution should be allowed by the grader.



For example, avoid checking for exact match against a string of code when other solutions exist.



Every requirement contained in the prompt should be checked.



For example, if the prompt asks for a dataset filtered by a certain criteria, it should be very difficult to guess the correct answer without having correctly performed filtering.



The task should teach the model something interesting and novel, or address a general weakness in the model.



There should be multiple approaches to solving the task, and the model should fail the task for a variety of reasons, and not just one reason.



The model shouldn’t fail for task-unrelated reasons like not being good at using the tools it’s given. You may need to modify the tools so that they’re suitable for the model.



Example Task Ideas



(Your task doesn’t have to be any of these! This is just for illustrative purposes)



Implement a technique from an ML paper



Ask the model to write a CUDA kernel



Ask the model to clean a dataset



"""

-- well, that was intriguing, but at the time I had a very faint idea what SWE-Bench was about, and anyway it had little to do with what an MLE woul typically do (at least the way I pictured it). So for a long while I was mulling this over in the back of my mind, being busy with other things, and then eventually I decided to come up with something that seemed interesting to me and mimicked the way I think about (admittedly high-level weird) AI research engineer work. 

My ideas evolved around:

* graph representations: it's a long-held belief of mine that these are going to be seriously useful when dealing with projects: comparing git repos, tracking their evolution over time, comparing implementations, and gods know what else. Two particular tasks I came up with were not that SWE/MLE-oriented: 

1) come up with an interesting fact based off wikidata, something in the style of "The guy who discovered hydrogen lived about a 5 minute walk from the guy who introduced the modern piano, and the piano has at least 88 keys, and hydrogen has at least 88 energy levels"

2) come up with a causal graph and try to reverse a single edge in it -- totally different and causality-based (but I figured models are bad at this, especially older ones), but also having to do with graphs

The other tasks I came up with were:

* finding an analogy between some ML concept and some physical concept (somehow RoPE and laplace transforms came to my mind, but there's probably no link there). The point was a little bit graph-representations-adjacent: if you had some internal structure in your mind of how LLM methods work and how physics and math work, you can try to find similarities, and these can be novel and even lead to new cool improvements to existing code

* reading and implementing alphageometry: I wondered how one LLM would handle the concept of another LLM working in concert with a symbolic reasoning engine. I beleived that it would have a slim chance at grasping it, and yet that chance was conceivably non-zero.

* write a story about a cat that had words with numbers of characters in them corresponding to the fibonacci numbers. This is weird, but I had a notion that even the best models aren't perfect at self-reflection: they have to correctly implement the fibonacci sequence generator, then come up with words -- and know beforehand what words need to be ouput and how many characters there are in each of them -- and then come up with something grammatical, making sense and thematical. And I love cats :D



Now, the stupid thing about this was that I've implemented all these and send my submission first, and only then did it occur to me to look into the background of this whole startup. 

And this is where I came up with a bunch of interesting facts -- or educated guesses, anyway -- that wouldn't be revealed here for all sorts of reasons, but which lead me to the following ideas and suggestions:

* study and review the posts & papers from Anthropic research. There're multiple hints that this job would be aimed at Claude and its variants, so forming a comprehensive image of their models with their capabilities, inner working and failure modes would be both awesome and really helpful

* think about areas where current models aren't good, and why. To me these appear to be, among others, high-level pattern matching and working from different angles simultaneously. By these I mean: suppose you're implementing a novel method/writing code for your paper about your new awesome model. In your paper you're likely to have both a "related work" section and references. And on arxiv it'd have a graph (yes, graphs again) of connected papers: guys who've done similar things before you. Ideally they'll all have code for their papers, and so the model can look at these and get an idea of how methods and implementations have evolved over time. If I were designing it now, I'd use the original dqn -> rainbow dqn and alphago -> alphazero -> muzero papers and code for this particular RL env. As for different angles, suppose you have a task and you need tools to complete it, and there are none. How do you tell the model to design its own tools? How do you check the tools do what they should? And so on

* Look into MLE-bench from OpenAI (I'm about to). They took some kaggle tasks and turned them into a dataset, but this is presumably rather... lopsided, I guess. But it might give you and idea of where to go look for more MLE-style tasks

* Other ideas are vague and based on modelling intentions, multiagent RL and utility function manipulations. I might write another post about these one day.



P.S. I didn't get in, and got no explanation of the details of such a decision, but if anyone comes across these notes, I'd be glad to hear some updates: what's it like inside? :)

