# MCMS Student + CMS + MUI Skill Pack

Use `MCMS-STUDENT-CMS-MUI-MIGRATION-SKILL.md` as the primary Antigravity instruction.

Core decisions:
- Student management is a full lifecycle module, not only a table.
- Student Profile and Student Portal are separate.
- Existing Institute/Landing pages remain, but become CMS-driven.
- CMS is tenant-specific and fully dynamic.
- Replace expanding custom CSS UI with MUI.
- Use MUI DataGrid for enterprise tables.
- Preserve existing backend/database/authentication unless audit proves change is required.
- No duplicate entities/routes/components.
