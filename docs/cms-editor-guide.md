# Website content and notices

Use the existing portal at `/`, selecting the **editor** development identity. Open **Content**. Development identities are synthetic and forbidden in production.

## Create and publish

1. Create content with a unique lowercase slug, type, language, title, body and review date. For notices select **Notice**, its category, issue date and reference.
2. Plain text is escaped. Use `## Heading` followed by a newline for sections, blank lines between paragraphs, and `- Item` for bullet lists. Raw HTML and scripts are never interpreted.
3. Optional **Visible from** and **Archive from** are dates in Asia/Kolkata. Visibility begins at the start of the first date; archival begins at the start of the archive date. Archive must be after visibility start.
4. Submit the draft for review. Sign in separately as the **publisher** to review and publish. The author cannot self-publish.
5. Published notices appear on the institutional homepage and `/institution/notices`. Filters are preserved in the URL. Detail pages provide accessible text and browser printing.

## Amendments and visibility

Create a draft revision of an owned published record. Edit, submit and have the publisher approve again. The old approved title, body, category and scheduling fields stay public until approval; draft metadata must not leak.

**Archive from** retains a notice in the public Archived listing. **Withdraw from public site** removes it from public detail, search and API entirely. These operations are intentionally different. Current implementation records previous values in audit but does not provide a dedicated immutable revision browser or rollback UI.

The API evaluates visibility dates on reads; no background publication scheduler is claimed. Public reads are uncached. Actual `published_at` is the approval timestamp, while the notice issue date is separately author-supplied.

## Scope limits

Header/footer links and identity are currently code-owned; no structured settings editor is delivered. Admission status is a truthful unconfigured state, not a cycle-management interface. File attachments, corrigenda relationships, verified seat snapshots and a public application builder/review journey remain outstanding. Print-to-PDF uses the browser and is not a stored official document.

`home-introduction` controls the homepage introduction through the same publication workflow. Static navigation does not automatically track withdrawn page destinations; content validation and managed navigation remain release gates.
