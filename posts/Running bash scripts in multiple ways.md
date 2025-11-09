---
title: "Running Shell Scripts in Linux: `./` vs `bash`"
date: "2025-11-09"
tags: ["linux", "bash", "CS", "engineering"]
---

## Running Shell Scripts in Linux: `./` vs `bash`

When working with shell scripts in Linux, you'll often encounter two ways to execute `.sh` files: using `./` or by explicitly calling `bash`. While both methods can run the script, they work in little different ways. Here  i am going to explain these differences.


### Using `./` to execute Shell scripts
The `./` command is used to run a script from the current directory. It’s shorthand for telling the shell: "oyye, run this file right here" but for this to work, script must have **execute permissions**.

##### Example:

```bash 
./myscript.sh
```

To grant execute permissions to a script, use:

```bash
chmod +x myscript.sh
```

#### How it works:

- When you run `./myscript.sh`, shell looks for the script in directory and attempts to execute it using the **interpreter specified in the shebang (`#!`)** at the top of script. For example, if your script starts with `#!/bin/bash`, it will run using the Bash shell.
- The script runs in the **same shell environment**, meaning it can modify the terminal's environment, such as setting variables or changing directories.
    

#### When to use `./`:

- When you want the script to be executed like a program.
- When script has executable permissions.
- When script has correct shebang (`#!/bin/bash` or another interpreter) at the top which will automatically tell which interpreter to use.

### Using `bash` to run shell scripts:
Alternatively, you can explicitly run a script using the `bash` command. This method doesn’t require the script to have execute permissions, since you're directly invoking interpreter.

#### Example:

```bash
bash myscript.sh
```

#### How it Works:

- When you use `bash myscript.sh`, you're explicitly calling the **Bash interpreter** to execute the script, no matter what the shebang line in the script is so you can even run it if there is no shebang at all.
- Script will run in a **new subshell**, meaning it won't affect the environment of your current terminal session. Changes to variables or the working directory within the script won't carry over once the script finishes executing.
    

#### When to Use `bash`:
- When you want to ensure the script is run specifically using the Bash shell, regardless of the shebang.
- When you don’t want to modify the file’s permissions.
- When you want the script to run in a **clean environment**, isolated from your current shell session.
- When you dont have a shebang line written in code.
    

## Key Differences: `./` vs `bash`

| Feature                  | `./` (Execute)                                                | `bash`                                        |
| ------------------------ | ------------------------------------------------------------- | --------------------------------------------- |
| **Permissions Required** | Yes, script needs execute permissions                     | No, execute permissions not needed        |
| **Interpreter**          | Uses the interpreter specified in the script's shebang (`#!`) | Uses Bash regardless of the script's shebang |
| **Environment**          | Runs in current shell environment                         | Runs in a new subshell (isolated)             |

### Which Should You Use?

- **Use `./`** when you want the script to be treated like a program, and it has the proper execute permissions and shebang.
    
- **Use `bash`** when you don’t need execute permissions, want to ensure the script runs with Bash, or want to run the script in a clean, isolated environment.
    

By understanding these little differences, you can choose the best method depending on your requirements, whether you're running a personal script or managing a complex automation workflow.