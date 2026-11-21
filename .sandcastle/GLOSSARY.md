# Software Factory

The agents that turn Tickets into pull requests, and review those pull requests, without a person in the loop. This glossary covers the language of those runs.

## Language

### Runs

**Ticket**:
A GitHub issue that asks for one change to Cadence. It is what the Implementer builds and what the Reviewer judges the Spec Axis against.
_Avoid_: Spec (for the issue itself), Task, Story

**Implementer**:
The agent run that builds a pull request from a Ticket.
_Avoid_: Builder, Coder, Implementation agent

**Reviewer**:
The agent run that reads a pull request with no memory of the Implementer's run, fixes what it can, and writes the Verdict.
_Avoid_: Review agent, Checker

### Review

**Axis**:
One of the two questions a Reviewer answers separately: **Standards** (does the code follow the coding standards?) and **Spec** (does it do what the Ticket asked?).
_Avoid_: Dimension, Pass

**Finding**:
One problem the Reviewer reports on one Axis. Every Finding is exactly one of Defect, Pre-existing Finding or Decision.
_Avoid_: Issue (clashes with GitHub issues), Comment, Note

**Defect**:
A Finding the pull request itself introduced. An Axis passes only when no Defect on it is left unfixed.
_Avoid_: Bug (a Defect can be a broken standard), Blocker

**Pre-existing Finding**:
A Finding in code that was there before the pull request, including code the pull request only moved.
_Avoid_: Legacy, Old debt

**Decision**:
A Finding that only a person can settle: a product call, or a judgement the coding standards do not decide.
_Avoid_: Question, Open point

**Verdict**:
The Reviewer's comment on the pull request: PASS or CHANGES REQUESTED for each Axis, then its Findings.
_Avoid_: Review summary, Result

**Exemption**:
Permission for one file to break one size limit. Exemptions only ever go away: a new file never gets one.
_Avoid_: Allowlist entry, Override
