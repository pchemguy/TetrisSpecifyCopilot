## Composing Framework Artifacts for Downstream Project Use

The Spec Kit framework project produces **framework artifacts**: agent prompts, templates, command scaffolds, workflow guidance, and related generative assets. These artifacts are the primary development objects and deliverables of the Spec Kit framework project.

By contrast, downstream **project artifacts** - such as a materialized constitution, specification, implementation plan, task list, checklist, issue mapping, or similar delivery document - are expected outputs of downstream projects that use the Spec Kit framework as a tool. Project artifacts are the immediate working documents used to define, decompose, and deliver specific features. Framework artifacts operate at a higher level: in the context of downstream projects, they are not themselves normal deliverables, but they strongly shape the form, quality, and behavior of the project artifacts produced from them.

This distinction matters because framework artifacts must be written with their downstream effects in mind. A prompt, template, or workflow document in Spec Kit is not just local documentation: it is a generative asset that shapes the structure, clarity, and execution characteristics of artifacts produced elsewhere. As a result, composition defects in framework artifacts can propagate into many downstream project artifacts and are often more costly than comparable local defects in an individual generated document. For that reason, framework artifacts should be authored and optimized for agent clarity, bounded execution, reliable interpretation, and human reviewability.

Framework artifacts must satisfy two distinct but related compositional objectives:

- **local structure**: the arrangement of prose, lists, tables, examples, and other nearby textual units so that requirements, constraints, and decision points are easy to identify and interpret; and
- **high-level organization**: the overall document architecture, including section boundaries, heading hierarchy, and the grouping and sequencing of major concerns.

Local structure should be used where it materially improves operational clarity, scanability, or enforceability. At that level, structure is justified when it helps an agent or reviewer determine:

- what is mandatory;
- where a rule applies;
- which artifact must contain which information; or
- what exception or escalation mechanism exists.

High-level organization is a separate and equally important requirement. Complex prompts, templates, and workflow documents should always have an explicit, well-defined, and meaningful Markdown heading structure. Major concerns, phases, constraints, decision points, and execution stages should be separated into sections whose scope and hierarchy are clear to both humans and AI systems.

That organization should emerge naturally from the content and intended workflow rather than being imposed as empty formality after drafting. Markdown heading levels should reflect real semantic hierarchy rather than visual preference. New sections should be introduced when they separate distinct concerns, phases, or rule sets, not merely to shorten the page superficially.

Even when AI can parse a poorly organized document, that is not a sufficient reason to avoid investing development effort in stronger structure and clearer document architecture. These artifacts are authored, reviewed, and owned by humans, and human maintainers are ultimately responsible for detecting subtle ambiguities, conflicts, omissions, and instruction-ordering problems that may significantly confuse agents or otherwise degrade downstream AI-assisted workflows. Poorly organized documents substantially increase review burden and make it harder to build a precise mental model of the artifact, especially when minor wording issues can have outsized downstream effects.

When revising prompts, templates, workflow guidance, or other structured framework artifacts, maintainers should consider whether a more structured organization would substantively improve clarity or determinism, even when the underlying requirement does not change. That preference for stronger structure does not justify rewriting everything into pure lists or checklist prose for stylistic uniformity alone. Instead, structure should support execution and review while preserving explanation and justification where they materially improve interpretation, constraint handling, or decision quality. Where ambiguity, dense prose, mixed concerns, or weak section boundaries would increase the risk of downstream agent drift, the more clearly organized formulation is preferred, while purely cosmetic reformatting without operational benefit should be avoided.
