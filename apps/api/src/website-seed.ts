import { Database } from './database';
import { legacyPages } from './legacy-pages';

// Explicit synthetic content upgrade. Never replace edited records or reseed on restart.
export async function seedWebsite(db: Database) {
  if (process.env.NODE_ENV === 'production')
    throw new Error('Demo website fixtures forbidden in production');
  const pages: Record<string, [string, string]> = {
    'home-introduction': [
      'Academic information & admissions',
      'Medora is a demonstration of a connected medical college community. Find notices, admissions guidance, academic programmes and student support information in one place. All institutional profiles and examples in this environment are synthetic.',
    ],
    about: [
      'About the institution',
      'Medora Medical College is a fictional institution used to demonstrate academic administration and public information services. This website does not represent a real college or claim government ownership, affiliation or accreditation.\n\n## Our academic approach\nThe demonstration brings teaching plans, supervised practical learning, attendance and assessment into a connected academic record. Learners can see published outcomes, while faculty review evidence and provide feedback.\n\n## Institutional governance\nThe registrar manages student records and admission verification. Academic decisions are reviewed by the designated dean. Website editors prepare public information and a separate publisher approves its release. Finance and confidential welfare records remain in their restricted workspaces.\n\n## Before a real institutional launch\nThe institution must approve its identity, history, affiliation, leadership profiles, postal address and contact directory. Those facts are not invented for this demonstration.',
    ],
    programmes: [
      'Academic programmes',
      'Explore the academic structure used in this demonstration. Programme eligibility, duration, intake and awards must be confirmed against the responsible authority before any real application.\n\n## Undergraduate medical education\nThe MBBS demonstration connects foundational sciences, teaching sessions, practical work and supervised clinical learning. It includes attendance, internal assessment and a reviewed competency logbook. It is an academic workflow example, not an offer of admission.\n\n## Curriculum and learning\nAnatomy and Physiology provide the initial teaching examples. Curriculum versions, learning outcomes and assessment evidence belong to the relevant cohort. Published university results must remain distinct from internal recommendations.\n\n## Admissions and fees\nAdmission requires an authoritative application or allotment, verification and authorized enrolment. No current intake, fee schedule or counselling vacancy has been approved for publication. Read the admissions guidance and contact the helpdesk before relying on a deadline or payment request.\n\n## Academic support\nStudents can access learning resources, submit assignments and request certificates or leave through the portal. Request approval does not by itself issue an official certificate.',
    ],
    admissions: [
      'Admissions guidance',
      'Use this page to understand the admission process and prepare for an approved reporting window. This is a synthetic demonstration; no live applications or payments are accepted here.\n\n## Current status\nAdmission stage: no institutional cycle has been published.\nLocal application window: not open.\nOfficial seat vacancy: not yet published.\nThese are separate facts. An open form would not guarantee a seat, and a vacant seat would not authorize admission outside the applicable process.\n\n## Before reporting\nRead the current authoritative counselling or programme notice. Confirm the programme, year, round, eligibility, reporting location and timezone. Use only the institution-approved authority links when they are provided. No counselling authority link is configured in this demonstration.\n\n## Document preparation\nCheck the published cycle-specific checklist. Typical categories to verify with the admissions office include allotment evidence, academic qualifications, identity and applicable category documents. Do not send identity or financial documents through the public enquiry form.\n\n## Verification and enrolment\nThe registrar reviews the application and requests clarification where necessary. Fee receipt or approved waiver, document verification and independent academic approval precede capacity-checked enrolment. A submitted enquiry is not an application, and an application is not an admission decision.\n\n## Fees and assistance\nNo approved fee schedule or payment gateway is published. Do not transfer funds based on demonstration content. General process questions can be sent to the contact desk without attaching sensitive documents.',
    ],
    departments: [
      'Academic departments',
      'The current academic demonstration includes Anatomy and Physiology. Department information below describes teaching examples, not verified facilities or institutional staffing.\n\n## Anatomy\nLearning focuses on anatomical terminology, structural relationships and the clinical relevance of human form. Teaching examples combine guided sessions, model-based practical work and supervised reflection. Dr. Meera Kapoor is the fictional faculty profile used for this workflow.\n\n## Physiology\nLearning connects normal body functions, measurement and interpretation. Demonstration activities include foundational concepts, practical reasoning and formative assessment. Dr. Arjun Roy is a fictional faculty profile used in the pilot.\n\n## Teaching and supervision\nEach session identifies the responsible faculty member, cohort, location and competency. Faculty can review assigned work; another department does not automatically gain access to a learner record.\n\n## Department enquiries\nUse the contact desk for general academic questions. Verified office addresses, hours and department-specific contacts require institutional approval before public release.',
    ],
    faculty: [
      'Faculty directory',
      'These profiles are fictional examples for the demonstration. They are not representations of registered practitioners or real institutional appointments.\n\n## Dr. Meera Kapoor — Anatomy\nDemonstration responsibilities include teaching foundational anatomy, reviewing assigned learning activities and supervising competency reflections. Qualifications, registration details and publications have not been asserted.\n\n## Dr. Arjun Roy — Physiology\nDemonstration responsibilities include Physiology sessions and practical learning support. Personal contact information and credential documents are not publicly exposed.\n\n## Profile approval\nA live directory requires verification of professional qualifications, appointment role, department and any published research. Private identity and employment documents must remain separate from the public profile.',
    ],
    'student-services': [
      'Student services',
      'Use the student portal for personal academic information and requests. Public guidance is available without sign-in; individual records require an authenticated account.\n\n## Academic support\nReview your timetable, attendance categories, assignments and published assessment outcomes. Contact the relevant academic office when evidence or a record needs correction. Attendance corrections and result changes require the designated review process.\n\n## Certificates and leave\nThe portal accepts certificate, leave and appeal requests. Describe the purpose and provide only the information required for review. A recorded approval is not a signed or verifiable official certificate.\n\n## Welfare and confidential concerns\nConfidential concerns are restricted to the requester and designated committee. Do not place private counselling or clinical details in ordinary academic requests. For immediate danger, contact an appropriate local emergency service; this demonstration is not an emergency response channel.\n\n## Hostel, scholarships and library\nThese operational application services are not enabled in this release. No availability, scholarship eligibility or accommodation allocation is implied by this guidance.',
    ],
    forms: [
      'Forms & service requests',
      'Find the correct route for your request. This directory distinguishes working portal requests from services that have not opened.\n\n## General enquiry — available\nUse the contact form for programme and process questions. It records a helpdesk ticket and displays a reference. It does not send a confirmation email or create an admission application.\n\n## Certificate, leave and appeal — sign-in required\nStudents can submit these requests in the portal and see recorded review decisions. Certificate issuance, university appeals and regulated outcomes require the responsible office.\n\n## Admission reporting — not open\nNo approved public form version or application window has been published. There is no online admission submission or public applicant tracking in this release.\n\n## Confidential concern — sign-in required\nUse the confidential support route. Sensitive attachments and complaint details must never be included in public notices.\n\n## Documents and downloads\nPublished notice text is available in accessible HTML and can be printed or saved as PDF using your browser. No official prospectus or institutional fee document has been supplied.',
    ],
    calendar: [
      'Academic calendar',
      'This is a demonstration academic calendar. Dates below are synthetic planning examples and must not be used as a real institutional schedule.\n\n## October 2026 orientation\n5–7 October: introductory academic orientation, campus procedures and learning-resource guidance. The published demonstration notice contains the session overview.\n\n## Teaching timetable\nPersonal teaching sessions, assigned faculty and locations are available in the authenticated portal. Cancelled sessions and approved changes should be checked there before attendance capture.\n\n## Assessments and results\nOnly approved assessment outcomes are visible to the relevant student. An internal calendar does not replace a university examination notification.\n\n## Changes and enquiries\nReview the notice board for published updates. Live holidays, examination dates and closures need approval by the academic office.',
    ],
    hospital: [
      'Teaching hospital information',
      'Hospital information must come from the responsible clinical institution. No patient appointment, emergency service or live clinical feed is connected to this demonstration.\n\n## Clinical education\nAcademic postings and supervised training evidence belong to the education workflow. Patient-care records remain in the authoritative hospital system and must not be copied into student reflections.\n\n## Patient services\nVerified OPD locations, service hours, appointment links and patient guidance have not been supplied. Do not travel or make treatment decisions based on this demonstration.\n\n## Privacy and access\nNo live bed count, patient identifier or clinical result is published here. A future teaching-hospital connection requires approved data sharing, identity mapping and reconciliation.',
    ],
    research: [
      'Research & ethics',
      'This demonstration presents research information and the boundary between public summaries and confidential study records. It does not claim an active research project or ethics approval.\n\n## Research enquiries\nContact the institutional research office through the general enquiry route for guidance. Do not upload protocols containing participant information to a public form.\n\n## Ethics and approvals\nProjects involving human participants require the appropriate institutional and regulatory review. A website publication or a portal entry must never be interpreted as approval. The dedicated IEC review workflow is not implemented in this release.\n\n## Publications and collaborations\nOnly institution-approved publication citations, author affiliations and collaboration summaries should be displayed. No publications, grants or collaborators have been fabricated for the demonstration.',
    ],
    facilities: [
      'Learning facilities',
      'The campus artwork on this website is an illustrative concept, not a photograph or evidence of real facilities. The following spaces describe the synthetic teaching environment.\n\n## Teaching spaces\nDemonstration schedules use lecture halls, practical teaching rooms and a skills laboratory. Live room capacity, accessibility arrangements and safety requirements must be verified before allocation.\n\n## Library and learning resources\nLearning-resource guidance covers catalogue use, authorized digital access and responsible citation. Library circulation and reservations are not enabled in this application.\n\n## Accessibility support\nA real campus directory should identify step-free routes, accessible facilities and the responsible support contact. No physical accessibility certification is claimed here.',
    ],
    accessibility: [
      'Accessibility & help',
      'The site uses semantic headings, labelled controls and keyboard-operable navigation. A formal accessibility assessment has not been completed; no certification is claimed.\n\n## Keyboard navigation\nUse Tab to move between controls and Enter to follow links. The skip link moves to the main content. On small screens, open Menu to reach the full navigation and use Escape to close it.\n\n## Reading and printing\nUse your browser zoom to enlarge text. Notice and information pages provide a Print page control; the print layout removes navigation and preserves the readable content.\n\n## Language\nReviewed English content is available. Pages show an explicit fallback message when a reviewed Bengali translation has not been published.\n\n## Report a barrier\nUse the contact desk to describe the page and task that failed. Avoid including sensitive personal information.',
    ],
    policies: [
      'Website policies',
      'This local demonstration contains synthetic institutional content. It is not an official medical college website and does not accept live admissions, payments or clinical requests.\n\n## Content ownership\nThe demonstration website editor prepares content and an independent publisher reviews release. Published dates identify actual publication events; review dates indicate planned content review. Institutional policy approval remains pending.\n\n## Privacy\nUse only synthetic information when trying forms. Public enquiries are recorded as helpdesk tickets. Authenticated records are scoped to the relevant role. Live retention periods and data-owner contacts require institutional approval.\n\n## Content use and links\nIllustrative artwork is not a real campus. Third-party references, where approved, do not imply endorsement. No government hosting, certification or affiliation is claimed.\n\n## Corrections and support\nReport inaccurate content using the contact page, identifying its title and the correction requested. Unpublished pages are removed from the public projection.',
    ],
    contact: [
      'Contact & enquiries',
      'Send a general question to the demonstration contact desk. The form below creates a support ticket and returns a reference on screen; email delivery is not configured.\n\n## Admissions desk\nAsk about the process, approved notices or a missing checklist. This form is not an admission application and cannot reserve a seat.\n\n## Academic and student enquiries\nUse your authenticated portal for personal attendance, assessment, fee or certificate matters. Confidential concerns belong in the restricted support workflow.\n\n## Office directory\nThe institution has not supplied a verified postal address, telephone number or office hours. Those details must be approved before a live launch.\n\n## What to include\nDescribe the page or process and the help you need. Use synthetic contact details in this demonstration. Do not include identity documents, patient information or payment credentials.',
    ],
  };
  const notices = [
    [
      'reporting-checklist',
      'Reporting document checklist for provisionally selected candidates (demo)',
      'Admissions',
      '2026-09-28',
      'DEMO/ADM/2026/01',
      'Prepare documents only against an approved cycle-specific checklist. This example does not open admissions.\n\n## Before reporting\nConfirm the authoritative allotment or eligibility notice, reporting dates and responsible office. Do not infer a seat from a website form.\n\n## Checklist guidance\n- Keep your authoritative allotment reference available where applicable.\n- Check the exact academic and identity documents required by the approved notice.\n- Verify whether originals, copies or digital uploads are requested.\n- Use only an approved payment channel after a real fee schedule is published.\n\n## Demonstration status\nNo real document submission, fee payment or admission window is open. Contact the helpdesk for general guidance without sharing identity documents.',
    ],
    [
      'orientation-2026',
      'Orientation schedule for first-year students (demo)',
      'Academic',
      '2026-09-25',
      'DEMO/ACA/2026/02',
      'A synthetic orientation programme illustrates how approved academic notices are published.\n\n## Demonstration schedule\n- 5 October 2026: academic introduction and learning responsibilities.\n- 6 October 2026: teaching resources and supervised practical learning.\n- 7 October 2026: student support and portal guidance.\n\n## Attendance and changes\nThis notice does not create teaching sessions or attendance records. Students must check their assigned timetable in the portal.\n\n## Information owner\nAcademic office — demonstration content only. No real venue or attendance requirement is asserted.',
    ],
    [
      'library-induction',
      'Library induction programme (demo)',
      'Student services',
      '2026-09-22',
      'DEMO/STU/2026/03',
      'An introduction to library resources, digital access and responsible academic reading.\n\n## What the session covers\n- Finding learning resources and checking their source.\n- Responsible use of licensed educational material.\n- Recording references and avoiding plagiarism.\n\n## Before attending\nRead the approved institutional library instructions when available. No actual library membership or circulation service is enabled by this notice.\n\n## Need assistance?\nUse the contact desk for general guidance. This is a fictional demonstration announcement.',
    ],
  ];
  await db.transaction(async (tx) => {
    await tx.query('LOCK TABLE demo_fixture_versions IN EXCLUSIVE MODE');
    if (
      (
        await tx.query(
          "SELECT name FROM demo_fixture_versions WHERE name='institutional-website-v1'",
        )
      ).rows.length
    )
      return;
    if (!(await tx.query("SELECT id FROM institutions WHERE id='demo'")).rows.length) return;
    for (const [slug, [title, body]] of Object.entries(pages)) {
      const legacy = legacyPages.find((entry) => entry[0] === slug);
      if (legacy)
        await tx.query(
          "UPDATE content SET title=$1,body=$2,published_title=$1,published_body=$2,version=version+1,published_at=now() WHERE id=$3 AND institution_id='demo' AND version=1 AND status='Published' AND body=$4 AND published_body=$4",
          [title, body, `page-${slug}`, legacy[2]],
        );
      await tx.query(
        "INSERT INTO content(id,institution_id,slug,title,body,kind,status,owner_id,reviewer_id,review_date,published_title,published_body,published_at) VALUES ($1,'demo',$2,$3,$4,'Page','Published','editor','publisher','2026-12-31',$3,$4,now()) ON CONFLICT(institution_id,slug,language) DO NOTHING",
        [`page-${slug}`, slug, title, body],
      );
    }
    for (const [slug, title, category, issue, reference, body] of notices) {
      const metadata = JSON.stringify({ category, issue_date: issue, reference });
      await tx.query(
        "INSERT INTO content(id,institution_id,slug,title,body,kind,status,owner_id,reviewer_id,review_date,published_title,published_body,published_at,category,issue_date,reference,published_metadata) VALUES ($1,'demo',$2,$3,$4,'Notice','Published','editor','publisher','2026-12-31',$3,$4,now(),$5,$6,$7,$8) ON CONFLICT(institution_id,slug,language) DO NOTHING",
        [`notice-${slug}`, slug, title, body, category, issue, reference, metadata],
      );
    }
    await tx.query("INSERT INTO demo_fixture_versions(name) VALUES ('institutional-website-v1')");
    await tx.query(
      "INSERT INTO audit(id,institution_id,actor_id,action,entity_id,reason,correlation_id) VALUES ('website-demo-v1','demo','admin','demo.website_fixture','institutional-website-v1','Synthetic content upgrade; only untouched legacy fixture bodies replaced','website-demo-v1')",
    );
  });
}
