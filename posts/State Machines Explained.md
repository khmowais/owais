---
title: "State machines explained"
date: "2025-11-09"
tags: ["CS", "engineering", "state machines", "computers"]
---
### TL;DR

A _state machine_ (often a _finite-state machine_, FSM) is a way of modelling systems by describing distinct modes (states) and how they transition from one to another based on inputs/events. This concept underlies hardware circuits, embedded firmware, software workflows, even aspects of biological or control systems. Historically rooted in automata theory (e.g., George H. Mealy and Edward F. Moore in the 1950s) and formalised in computer science/engineering, state machines remain a powerful design tool.

### Introduction

### What is a State Machine?

At its core, a **state machine** is a model of computation or control in which a system is always in **one of a finite set of states** and when inputs or events occur, the system transitions to another (or possibly the same) state according to some defined rules.

- _States_ represent distinct modes or configurations of the system.
- _Inputs/events_ trigger transitions from one state to another.
- _Transitions_ specify how inputs cause the change of state (and often associated actions or outputs). 
    For example: “Idle” → (power button pressed) → “Active”.  
    From the textbook definition: “A machine that can be in exactly one of a finite number of states at any given time.” ([Wikipedia](https://en.wikipedia.org/wiki/Finite-state_machine? "Finite-state machine"))

### Historical Origins and Foundations

Understanding the history gives depth and shows how this concept matured.
- The field of automata theory (which studies abstract machines and the problems they can solve) began mid-20th century. ([Computer Science](https://cs.stanford.edu/people/eroberts/courses/soco/projects/2004-05/automata-theory/basics.html? "Basics of Automata Theory - Stanford Computer Science"))
- Key contributions: In the 1950s, George H. Mealy published _“A Method for Synthesizing Sequential Circuits”_ (1955) and Edward F. Moore published _“Gedanken-experiments on Sequential Machines”_ (1956). ([smacc.dev](https://smacc.dev/synthesis-of-smacc/"The Synthesis of SMACC"))
- Later works expanded the model (e.g., statecharts by David Harel in 1987 introduced hierarchical states and concurrency) ([smacc.dev](https://smacc.dev/synthesis-of-smacc/ "The Synthesis of SMACC"))
- Much of modern embedded systems and hardware design bases itself on the finite-state machine model and tools for formal verification leverage it heavily. ([lamport.azurewebsites.net](https://lamport.azurewebsites.net/pubs/deroever-festschrift.pdf "Computer Science and State Machines - Leslie Lamport"))
### Types and Formal Variants of State Machines

It’s not “one size fits all”. Here are some distinctions:
- **Deterministic Finite State Machine (DFSM or DFA)**: For each state and input, the next state is uniquely defined. ([blog.markshead.com](https://blog.markshead.com/869/state-machines-computer-science/ "State Machines – Basics of Computer Science - Mark Shead"))
- **Non-deterministic Finite State Machine (NFA)**: For a given state and input, multiple possible next states may exist. ([blog.markshead.com](https://blog.markshead.com/869/state-machines-computer-science/ "State Machines – Basics of Computer Science - Mark Shead"))
- **Mealy vs. Moore machines**: In Mealy machines, outputs depend on state + input; in Moore machines, outputs depend purely on state. (These historical variations come from Mealy and Moore’s work.)
- **Abstract State Machines (ASM)**: A more general model in which states can be complex data structures (not just a finite set of simple states) and transitions can manipulate these structures. ([Wikipedia](https://en.wikipedia.org/wiki/Abstract_state_machine? "Abstract state machine"))

### Why State Machines Matter (and Where They’re Used)

#### In hardware and embedded systems
Embedded controllers, digital logic, circuits often use FSMs to control behaviour. For example: traffic light controllers, vending machines, sequential logic in microprocessors. ([Wikipedia](https://en.wikipedia.org/wiki/Finite-state_machine "Finite-state machine"))

#### In software design
Workflows, UI navigation, parsing, game logic, network protocols etc. Many of these can be modelled as state machines. For example, the _State pattern_ in software engineering (object-oriented design) is based on the same idea: an object changes behaviour when its internal state changes. ([gameprogrammingpatterns.com](https://gameprogrammingpatterns.com/state.html "State · Design Patterns Revisited"))

#### In systems modelling and control
When you want to model behaviour that depends on history (not just current input), state machines offer a compact way to capture that. As one description says: “State machines are a method of modelling systems whose output depends on the entire history of their inputs and not just on the most recent input.” ([MIT OpenCourseWare](https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/063daea1b8a3573d2aff0f0b96d390da_MIT6_01SCS11_chap04.pdf "6.01SC Course Notes: Chapter 4, State Machines"))

#### In formal verification and modelling
Because the behaviour is discrete and well-defined, state machines are amenable to formal methods, verification, model-checking. They form the backbone of many specification languages and design flows. ([lamport.azurewebsites.net](https://lamport.azurewebsites.net/pubs/deroever-festschrift.pdf "Computer Science and State Machines - Leslie Lamport"))

### Building a State Machine: A Practical Walkthrough
Let’s sketch how you might design a state machine for a simple system. Say a modal dialog box in a UI.

1. Identify states: e.g., **Hidden**, **Visible**, **Disabled**.
2. Identify inputs/events: e.g., _ShowCommand_, _HideCommand_, _DisableCommand_, _EnableCommand_, _UserClickOutside_.
3. Define transitions:
    - Hidden + ShowCommand → Visible
    - Visible + HideCommand → Hidden
    - Visible + DisableCommand → Disabled
    - Disabled + EnableCommand → Visible
    - Disabled + HideCommand → Hidden
        
4. Optionally, define output actions on entry/exit of states (e.g., when entering Visible → animate fade in).
5. Draw the state diagram or table: gives you clarity, avoids logic errors.
6. Implement: either via a `switch` statement or delegate via the State Pattern or use a state-machine library.
7. Extend: maybe you introduce sub-states (“Visible.Modal” vs “Visible.NonModal”) → hierarchical FSM (statecharts) come into play.

## Common Pitfalls and Best Practices

- Don’t confuse simple boolean flags with a proper state machine: many “if/else” spaghetti codes are really just ad-hoc state logic. A real FSM gives clarity and maintainability.
- State explosion: if you try to model every variable as a state, you’ll get huge graphs. Manage complexity via state hierarchy (statecharts), concurrency and abstraction.
- Don’t ignore transitions: states are one thing—but transitions (and their conditions, actions) often hide bugs.
- Represent entry/exit actions when needed: often behaviours need to trigger on entering or leaving a state.
- Visualise: drawing state diagrams helps immensely in communication, documentation and verification.
- Use the right tool: for hardware synthesis (FPGA, ASIC) FSMs are built in hardware description languages; for software UI/workflow, state-machine frameworks help.

## Why It’s Still Relevant and Powerful
Even though the notion of a state machine is decades old, it remains **hugely relevant** because:

- Systems continue to become more complex (IoT, embedded devices, real-time systems) and need clear models.
- As concurrency, distributed systems, multi-state devices grow, the simple FSM is extended (hierarchies orthogonality, concurrency) but the core remains.
- Designers, engineers and developers benefit from “thinking in states” to avoid bugs, race conditions, undefined behaviour.  
    As one researcher put it: using state machines allows you to capture the “essential properties of the history of the inputs” in a bounded set of states. ([MIT OpenCourseWare](https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/063daea1b8a3573d2aff0f0b96d390da_MIT6_01SCS11_chap04.pdf "6.01SC Course Notes: Chapter 4, State Machines"))

## Advanced Topics & Extensions

- **Hierarchical State Machines / Statecharts**: states contain other states; transitions can cross levels; concurrency possible (Harel, 1987). ([smacc.dev](https://smacc.dev/synthesis-of-smacc/? "The Synthesis of SMACC"))
- **Algorithmic State Machines (ASM charts)**: a method in digital logic design combining FSM with datapath logic. ([Wikipedia](https://en.wikipedia.org/wiki/Algorithmic_state_machine? "Algorithmic state machine"))
- **Abstract State Machines (ASMs)**: for modelling algorithms at high abstraction levels (Gurevich). ([Wikipedia](https://en.wikipedia.org/wiki/Abstract_state_machine "Abstract state machine"))
- **State machine replication**: in distributed systems, consensus protocols model nodes’ states and transitions (beyond scope here).
- **Probabilistic or stochastic state machines**: when transitions are not deterministic, useful in modelling biological, economic or complex systems.

## Conclusion

A state machine is one of those elegant engineering-ideas: simple to state, broadly applicable and deeply useful. Whether you’re writing firmware, designing a UI workflow, building a network protocol or modelling a control system, the state machine gives you a clear architectural framework: “What states can I be in? What events cause transitions? What happens on those transitions?”  
Embracing this mode of thinking improves clarity, reduces bugs and aligns your design with decades of theoretical and practical work.

If you’re ready to go deeper, you might explore statecharts for hierarchical designs or look into formal verification of state machines in safety-critical systems. Design your next system with “state mind” and you’ll find the complexity a little less chaotic.
