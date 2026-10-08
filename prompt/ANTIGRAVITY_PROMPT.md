You are taking ownership of the MSMEOS2 repository as the current implementation agent.

IMPORTANT:

This is an existing project repository with persistent documentation.

Before doing ANY substantial work, read these files completely:

1. PRD.md
2. PROGRESS.md
3. DECISIONS.md

If PROGRESS.md or DECISIONS.md do not exist, create them immediately according to the requirements in PRD.md.

============================================================
OBJECTIVE
============================================================

Implement MSMEOS2 according to PRD.md.

Do not merely describe what should be built.

Actually:

- inspect the repository
- create files
- install dependencies
- write code
- run the application
- test functionality
- fix errors
- update documentation
- update PROGRESS.md
- record important decisions in DECISIONS.md

The PRD is the product specification.

PROGRESS.md is the current engineering state.

DECISIONS.md contains persistent architectural/product decisions.

============================================================
MANDATORY WORKFLOW
============================================================

Before coding:

1. Read PRD.md.
2. Read PROGRESS.md.
3. Read DECISIONS.md.
4. Inspect repository structure.
5. Inspect existing source files.
6. Check installed dependencies.
7. Determine what is actually working.
8. Compare actual repository state with PRD requirements.
9. Identify the highest-priority unfinished task.
10. Start implementation.

Do NOT rebuild existing working functionality unless there is a clear reason.

============================================================
PROGRESS MANAGEMENT
============================================================

PROGRESS.md is a persistent AI handoff file.

Every AI working on this project must maintain it.

Update it:

- when starting a significant task
- after completing a significant task
- after discovering a blocker
- after fixing a major bug
- before stopping work

Never leave PROGRESS.md describing an older state of the repository.

============================================================
PROGRESS.md FORMAT
============================================================

Maintain this structure:

# MSMEOS2 — Current Development Progress

## Last Updated

Date/time:

## Current Agent

AI/development agent:

## Current Phase

Example:

Phase 1 — Core MVP

## Overall Completion

Estimated:

0–100%

IMPORTANT:
This must be an honest estimate based on working functionality.

## Product Status

Application:
[Working / Partially Working / Broken]

Frontend:
[Working / Partially Working / Broken]

Backend:
[Working / Partially Working / Broken]

Database:
[Working / Partially Working / Broken]

Document Extraction:
[Working / Partially Working / Broken]

Analysis:
[Working / Partially Working / Broken]

Demo:
[Working / Partially Working / Broken]

Validation:
[Not Started / In Progress / Working]

Business Model:
[Not Started / In Progress / Complete]

Roadmap:
[Not Started / In Progress / Complete]

## Completed

List actual completed functionality.

## In Progress

List current work.

## Next Tasks

List the exact next tasks another AI should perform.

Order them by priority.

## Blocked

List blockers.

For each blocker include:

- issue
- attempted solution
- current state
- recommended next step

## Known Bugs

List known bugs.

Include:

- severity
- reproduction
- current status

## Tests Completed

List tests that actually passed.

## Tests Failing

List tests that currently fail.

## Files Changed Recently

List important files.

## Dependencies

List important installed dependencies.

## Environment

Document:

- OS
- runtime versions
- relevant environment variables
- ports
- commands

Never record secret values.

## Working Commands

List commands that are known to work.

## Failed Commands

List commands that currently fail and why.

## Demo Status

Describe whether the complete demo flow works.

## Validation Status

Describe actual validation status.

Never fabricate users or feedback.

## Business Model Status

Describe current state.

## Roadmap Status

Describe current state.

## Important Notes

Anything another AI needs to know before continuing.

## Exact Next Action

End the file with:

> NEXT ACTION:

Then state the single most important thing the next AI should do.

============================================================
DECISIONS MANAGEMENT
============================================================

When making an important architectural, product or implementation decision:

1. Check DECISIONS.md first.
2. Do not reverse an existing decision without a reason.
3. If a new important decision is made, add it to DECISIONS.md.

Do NOT record trivial coding choices.

Record decisions such as:

- changing architecture
- changing database
- changing analysis strategy
- adding/removing a major dependency
- changing product behavior
- changing demo strategy
- changing LLM provider
- changing document strategy

============================================================
NO FAKE COMPLETION
============================================================

Never write:

"Complete"

unless the feature:

1. exists
2. runs
3. has been tested
4. behaves as intended

If code exists but has not been tested:

mark it:

"In progress / unverified"

If a feature is partially implemented:

mark it:

"Partially implemented"

============================================================
NO FAKE VALIDATION
============================================================

Never fabricate:

- users
- customers
- interviews
- survey results
- ratings
- testimonials
- validation metrics

If no real validation exists:

say:

"No validation responses recorded."

Build the infrastructure for collecting validation instead.

============================================================
DEVELOPMENT PRIORITY
============================================================

Follow PRD.md priority.

P0 first:

1. Application starts
2. Dashboard
3. Document upload
4. Document extraction
5. Demo document
6. Analysis
7. Evidence
8. Findings
9. Recommendations
10. Action plan
11. Results

Then:

P1:
- report
- validation
- business model
- roadmap
- commercialization
- testing

Only then:

P2:
- advanced features
- additional polish
- advanced exports
- deployment
- authentication

============================================================
DOCUMENT ACQUISITION
============================================================

If a demo document does not exist:

Attempt to obtain a suitable publicly available Indian MSME document.

Do not spend more than approximately 5 minutes searching.

If unsuccessful:

create a realistic synthetic MSME document.

Store it under:

sample-data/

Clearly label synthetic data.

Do not use private information.

============================================================
ENGINEERING RULES
============================================================

Use simple, maintainable architecture.

Do not overengineer.

Do not add unnecessary infrastructure.

Do not introduce Docker unless required.

Do not introduce authentication for MVP.

Do not introduce a local LLM.

Do not require GPU.

Do not hard-code API keys.

Do not create unnecessary dependencies.

============================================================
TESTING
============================================================

After implementing meaningful functionality:

Run it.

Test it.

Fix errors.

Then update PROGRESS.md.

For the main demo flow verify:

1. application opens
2. dashboard loads
3. demo document exists
4. document can be analyzed
5. extraction works
6. analysis works
7. findings appear
8. evidence appears
9. recommendations appear
10. action plan appears
11. report works
12. validation works
13. business model works
14. roadmap works

============================================================
WHEN YOU ENCOUNTER AN ERROR
============================================================

Do not stop immediately.

Use this process:

1. Read the error.
2. Identify root cause.
3. Fix it.
4. Run the failing command again.
5. Run related tests.
6. Continue.

If blocked:

document the blocker in PROGRESS.md.

Do not hide the problem.

============================================================
BEFORE STOPPING WORK
============================================================

You MUST:

1. Save all code.
2. Run relevant tests.
3. Verify the application state.
4. Update PROGRESS.md.
5. Update DECISIONS.md if any important decisions were made.
6. Clearly state the next action in PROGRESS.md.

The repository must always be left in a state where another AI can open it and continue.

============================================================
HANDOFF PRINCIPLE
============================================================

Assume that the next developer is a completely different AI with:

- no conversation history
- no memory of previous work
- no knowledge of your reasoning

That AI should be able to understand the project by reading:

PRD.md
PROGRESS.md
DECISIONS.md

and inspecting the repository.

Therefore, preserve important context in those files.

============================================================
START
============================================================

Start now.

First:

1. Read PRD.md.
2. Read PROGRESS.md if it exists.
3. Read DECISIONS.md if it exists.
4. Inspect the repository.
5. Determine the current actual state.
6. Update PROGRESS.md with the current state.
7. Begin the highest-priority unfinished implementation task.

Do not just provide instructions.

Implement the project.
