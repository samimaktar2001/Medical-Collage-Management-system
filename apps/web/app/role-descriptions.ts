export const roleDescriptions: Record<string, string> = {
  student: 'Your own timetable, published results, fees, learning work and service requests.',
  faculty: 'Assigned teaching, attendance, assessment entry and supervised learning reviews.',
  registrar:
    'Admission verification, enrolment, student records and service requests. Final admission approval belongs to the dean.',
  finance:
    'Invoices, verified receipts and refunds. Academic and confidential welfare records are outside this role.',
  dean: 'Academic oversight and independent approvals, including admissions, results and refunds.',
  admin:
    'Organization setup, schedules and operational support. This role cannot approve every business action or read private committee complaints.',
  editor: 'Draft and revise website content, then submit it for independent publication.',
  publisher:
    'Review, publish or withdraw website content. An author cannot publish their own content.',
  committee:
    'Review confidential student concerns within the institution. Academic and finance modules are outside this role.',
  auditor:
    'Review institutional evidence and audit history. Business approvals and record changes are outside this role.',
};
