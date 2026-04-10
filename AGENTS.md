---
name: AGENTS.md
---

### Shell Selection Policy (Windows)

On Windows environments, agents MUST prefer Bash-compatible scripts when Bash is available. PowerShell scripts are a fallback only.

#### Detection Rule

Agents MUST determine Bash availability by executing:

```bat
bash --version
```

Interpretation:

- **Exit code = 0** → Bash is available → **MUST use Bash scripts**   
- **Non-zero exit code / command not found** → Bash unavailable → use PowerShell

#### Execution Policy

1. If Bash is available:
    - Agents MUST execute Bash scripts.
    - Agents MUST NOT use PowerShell equivalents
2. If Bash is NOT available:
    - Agents MUST execute Windows native scripts.

#### Additional Constraints

- Detection MUST be performed at runtime (no assumptions based on OS alone)
- If Bash is present (e.g., Git Bash, WSL, MSYS2), it MUST be preferred
- Agents MUST NOT mix shells within a single execution path
- Agents MUST NOT silently fall back to PowerShell if Bash detection succeeds

#### Rationale (for agent reasoning, not user output)

- Bash scripts are treated as canonical
- Windows native shell is a compatibility fallback
- Windows environments frequently have Bash via Git for Windows, so OS-based branching is insufficient
