# Running OLLAMA on an Offline Linux System: Fast Guide + Full Walkthrough

---

## If You're Technical, Start Here: Quick Instructions

If you're a technical user and already understand what OLLAMA and LLMs are, follow the exact steps below. Otherwise, scroll down for the full explanation.  

**Edit:** Run the following shell scripts on your online and offline machine. All work will be done. Don't forget to star the repo:  
[Offline OLLAMA Guide GitHub](https://github.com/khmowais/offline_ollama_guide)

### On an Online Machine (Prep Phase)

```bash
# Step 1: Download OLLAMA installer (choose one)
wget https://ollama.com/download/ollama-linux-amd64-rocm.tgz
# OR
curl -fsSL https://ollama.com/install.sh | sh

# Step 2: Download LLM model(s) in GGUF format
wget https://huggingface.co/TheBloke/Qwen2-0.5B-GGUF/resolve/main/qwen2-0.5b.Q4_K_M.gguf

# Step 3: Create a Modelfile (plain text, no extension)
echo "FROM ./qwen2-0.5b.Q4_K_M.gguf" > Modelfile

# Step 4: Copy the following to USB or external storage
# - ollama installer (e.g., ollama-linux-amd64-rocm.tgz or ollama.deb)
# - your downloaded .gguf model file(s)
# - your Modelfile
````

---

### On the Offline Machine (Deployment Phase)

```bash
# Step 5: Install OLLAMA
tar -xvzf ollama-linux-amd64-rocm.tgz
sudo ./ollama-install
# OR if using .deb:
sudo dpkg -i ollama.deb

# Step 6: Check if OLLAMA is working
ollama serve

# Step 7: Register the model
ollama create coder

# Step 8: Confirm model is registered
ollama list

# Step 9: Run the model
ollama run coder
```

Done! You're now running LLMs fully offline using OLLAMA.

---

## Full Walkthrough: For Beginners or First-Timers

### Why This Guide?

Most modern AI tools like OLLAMA assume internet access. But what if you're in a secure, offline, or air-gapped environment, e.g., a research lab or remote deployment?
I faced this situation, and here's how I got OLLAMA + LLMs running fully offline.

---

### What is OLLAMA?

OLLAMA is an open source CLI tool that lets you run LLMs (Large Language Models) like LLaMA, Mistral, Qwen, etc., locally on your computer.
It's fast, flexible, and works offline once installed, but the initial setup needs internet unless you prepare ahead.

---

## Step-by-Step Guide (With Explanations)

### Step 1: Download the Installer (Online Machine)

Install with:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

This pulls \~1.5GB of dependencies. To save it for offline use, grab the precompiled `.tgz`:

```bash
wget https://ollama.com/download/ollama-linux-amd64-rocm.tgz
```

Or use `.deb` if you prefer Debian packages.

---

### Step 2: Download Models (GGUF Format)

OLLAMA does not come with models. Download LLMs in `.gguf` format from HuggingFace:

**Recommended repositories:**

* TheBloke
* NousResearch
* Qwen

Example:

```bash
wget https://huggingface.co/TheBloke/Qwen2-0.5B-GGUF/resolve/main/qwen2-0.5b.Q4_K_M.gguf
```

---

### ✅ Step 3: Create a Modelfile

```bash
echo "FROM ./qwen2-0.5b.Q4_K_M.gguf" > Modelfile
```

This tells OLLAMA which model to register.

---

### ✅ Step 4: Move Files to Offline System

Copy all of these to a USB or external storage:

* `ollama-linux-amd64-rocm.tgz` or `ollama.deb`
* Your `.gguf` model(s)
* Your `Modelfile`

---

### ✅ Step 5: Install on the Offline Machine

```bash
tar -xvzf ollama-linux-amd64-rocm.tgz
sudo ./ollama-install
# OR if using a Debian package:
sudo dpkg -i ollama.deb
```

This works without internet if dependencies are included in the archive (usually they are).

---

### ✅ Step 6: Check If OLLAMA Works

```bash
ollama serve
```

If this runs without error, OLLAMA is ready.

---

### ✅ Step 7: Register Your Model

With your Modelfile and `.gguf` model in the same folder:

```bash
ollama create coder
```

Replace `coder` with whatever name you want for the model.

---

### ✅ Step 8: Verify the Model

```bash
ollama list
```

You should see your model (e.g., `coder`) listed.

---

### ✅ Step 9: Run the Model

```bash
ollama run coder
```

You're now chatting with your model, fully offline.

---

## Recap: What You Need on USB

```
USB/
├── ollama-linux-amd64-rocm.tgz
├── qwen2-0.5b.Q4_K_M.gguf
└── Modelfile
```

---

## Pro Tips

* Bundle everything into a ZIP or ISO if repeating installs
* Use lightweight models like TinyLLM for low-spec machines
* Models like Mistral, LLaMA, and Mixtral require powerful CPUs/GPUs and more RAM

---

## References

* [OLLAMA Official Site](https://ollama.com)
* [OLLAMA GitHub](https://github.com/ollama/ollama)
* [TheBloke Models on HuggingFace](https://huggingface.co/TheBloke)
* GGUF Format