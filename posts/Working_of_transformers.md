---
title: "Working of trnasformers, bird eye view"
date: "2025-11-10"
tags: ["Transformers", "Computers", "engineering", "LLMs", "CS"]
---
**TL;DR:**
Transformer architecture works by processing input data (like words in a sentence) all at once and not one by one like RNNs using a mechanism called **self attention** that lets every word look at and weigh every other word in the input. This self attention mechanism added to layers of feedforward networks, normalization and positional encoding allows Transformers to understand context and relationships efficiently and in parallel.

---

Now let’s open the hood.
### 1. The core idea: Parallel processing via attention
Before transformers, models like RNNs and LSTMs processed text sequentially meaning one token(word, subword, etc.) after another. Transformers break that limitation by processing the entire sequence at once.  
To do this, they use **self attention** which lets every token look at all other tokens to decide what’s relevant.

Example:  
Let's take an example sentence: “The cat sat on the mat because it was soft”
In the sentence above, word “it” should refer to “mat”.
Self attention helps model link “it” to “mat” by assigning a high attention weight between them.

---

### 2. Anatomy of the Transformer

A standard transformer has **two main blocks**:

- **Encoder**: Reads and encodes input into contextual representations.
- **Decoder**: Generates output step by step (used in translation, text generation, etc).
Let’s break down the **encoder** (the same principles apply to the decoder, with some twists like masking).

#### (a) Input embeddings + positional encoding

The model starts by turning each token (like a word) into a numerical vector, an **embedding**. 
But since the model processes everything simultaneously, it has no sense of word order. For example: Tariq ate apple = Apple ate Tariq,  So it adds **positional encoding** (sinusoidal or learned vectors) to inject sequence order information.

Result:  
`input_vector = word_embedding + positional_encoding`

---

#### (b) Self attention mechanism:

For each token, the model creates **three vectors** using learned matrices:
- **Q** (Query)
- **K** (Key)
- **V** (Value)

Then it computes **attention scores** like this:
Attention(Q, K, V) = softmax(QK^T)/(sqrt(d_k)V  

Intuition:
- ( QK^T ): Measures how related two words are.
- Divide by ( \sqrt{d_k} ): Prevents large values that destabilize softmax.
- Softmax: Turns scores into probabilities (attention weights).
- Multiply by ( V ): Blends word meanings based on relevance.

This produces a new representation of each word, informed by the entire sentence.

---

#### (c) Multi head attention:

Instead of one set of Q, K, V, the model uses several in parallel.  Each head learns different relationships: syntax, coreference, semantics, etc.  Their outputs are concatenated and linearly transformed.

---

#### (d) Feedforward + residual c]onnections

Each position then passes through a **feedforward neural network** (two linear layers with a ReLU or GELU activation).  A **residual connection** (add the input to the output) and **layer normalization** stabilize learning and preserve information.

---

### 3. Decoder (for text generation)

The decoder works like the encoder but:
- Uses **masked self-attention** (so it doesn’t peek at future tokens).
- Has another attention layer that attends over the **encoder’s output** (so the decoder can focus on relevant parts of the input).  
This enables things like translation: “look at the source, decide what to write next.”

---

### 4. The big picture: Why It works so well

- **Parallelization**: All words are processed at once (GPU friendly).
- **Contextual understanding**: Each word knows about the entire sentence.
- **Scalability**: Deeper and wider models (GPT, BERT, etc.) just stack these blocks.
- **Flexibility**: Works for text, code, images, audio and more — anything that can be represented as a sequence.

---

### 5. Evolution

- **BERT**: Bidirectional encoder — good for understanding tasks.
- **GPT**: Decoder-only model — good for generation tasks.
- **T5 / BART**: Encoder-decoder hybrids for translation, summarization, etc.
- **Vision Transformers (ViT)**: Apply the same attention principles to image patches instead of words.

---

In short, the Transformer is like a council of word-thinkers: every word gets to talk to every other word and together they vote on what the sentence _really means_. That democratic attention mechanism is what made GPTs, BERTs and LLaMAs possible.
