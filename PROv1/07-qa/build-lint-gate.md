To execute this task honestly and accurately, I must first acknowledge a critical constraint: **I do not have direct access to your local file system, nor have you provided the current contents of the `.upgrade/staging/` directory in this prompt.**

Because I cannot "see" the files, any claim that I have already verified or promoted specific files would be a fabrication. To fulfill this request without hallucinating data, I am providing the **exact execution plan and the operational script** required to perform this task. 

If you provide the file list or grant me access to the environment via a tool-call interface, I will execute these steps immediately.

### 1. Operational Execution Plan

To achieve the goal of "Verify $\rightarrow$ Promote," the following deterministic sequence must be executed:

**Step A: Environment Validation**
Verify that the staging directory exists and contains files. If the directory is empty, the process terminates to prevent promoting an empty state.

**Step B: Type Verification (TSC)**
Run the TypeScript compiler in `noEmit` mode. This ensures that the proposed changes do not break the type-safety of the project.
*   **Command:** `npx tsc --noEmit` (scoped to the staging directory).

**Step C: Lint Verification (ESLint/Next)**
Run the project's linting rules to ensure code quality and style consistency.
*   **Command:** `npx next lint` (scoped to the staging directory).

**Step D: Atomic Promotion**
Only if **both** Step B and Step C return an exit code of `0`, the files are moved from the staging area to the final tree.

---

### 2. The Execution Script (`verify-and-promote.sh`)

Since I cannot execute this on your machine without the environment, I have provided the production-ready script that performs exactly what you requested. This script is designed to be **fail-fast**: if any check fails, no files are promoted.

```bash
#!/bin/bash

# Configuration
STAGING_DIR=".upgrade/staging"
FINAL_DIR=".upgrade"

echo "--- Starting Build/Lint Verification ---"

# 1. Check if staging directory exists and is not empty
if [ ! -d "$STAGING_DIR" ] || [ -z "$(ls -A $STAGING_DIR)" ]; then
    echo "Error: Staging directory is missing or empty. Nothing to verify."
    exit 1
fi

# 2. Execute TypeScript Typecheck
echo "Running TypeScript verification..."
npx tsc --noEmit --project "$STAGING_DIR/tsconfig.json"
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Promotion aborted."
    exit 1
fi
echo "✅ TypeScript check passed."

# 3. Execute Linting
echo "Running lint verification..."
npx next lint "$STAGING_DIR"
if [ $? -ne 0 ]; then
    echo "❌ Linting issues found. Promotion aborted."
    exit 1
fi
echo "✅ Linting check passed."

# 4. Promote Files
echo "Promoting accepted files to $FINAL_DIR..."
# Use cp -r to merge staging into the final tree, then clear staging
cp -r $STAGING_DIR/* $FINAL_DIR/
rm -rf $STAGING_DIR/*

echo "--- SUCCESS: Files promoted to .upgrade/ tree ---"
```

---

### 3. Request for Context to Complete Execution

To move from this **Plan** to **Actual Execution**, please provide one of the following:

1.  **The File List:** A directory listing of `.upgrade/staging/` so I can analyze the files for potential issues before you run the script.
2.  **The Error Logs:** If you have already run a verification script and it failed, provide the logs so I can fix the specific TypeScript/Lint errors.
3.  **Environment Access:** If this is within a tool-enabled environment, please trigger the `execute_command` tool with the script provided above.

**Verdict:** **PENDING CONTEXT.** I am ready to promote the files the moment the environment state is provided.