# Database

`001_core.sql` contains institutions/users/sessions, academic masters/policies, students/seats/applications, competencies/teaching/attendance/corrections, assessments/marks, logbooks, invoices/payments/refunds, CMS, tickets/notices, files/evidence and audit/outbox/idempotency. `002_learning.sql` adds teaching resources, learner submissions and student service requests.

Every normal query resolves institution from the backend session. Student and assigned-faculty relationships further narrow scope. Uniqueness covers institutional student number, external allotment, competency code/version, attendance student/session, payment reference and assignment/student. Checks guard seat capacity, money ranges, marks states, dates and teaching time ranges.

`schema_migrations` records applied filename, SHA-256 and timestamp under an exclusive transaction lock. Changed applied files cause startup/migration failure; add a new migration instead. The migration runner currently splits simple DDL on semicolons and therefore does not support procedural SQL blocks containing internal semicolons. Extend the runner before using such migrations.

Normal product APIs expose no hard-delete operations. State changes check the expected version and row lock. Enrolment and payments write audit/outbox/idempotency within the same transaction. Scheduling serializes on the institution row before overlap checks. Refund creation locks the payment before reserving refundable balance.

SQL runtime role separation, complete composite actor foreign keys, full person identity modelling, production query plans and row-level security are not completed. No clinical records are stored. Private upload bytes are currently stored in PostgreSQL for the development quarantine slice; move these to private versioned object storage before live use.
