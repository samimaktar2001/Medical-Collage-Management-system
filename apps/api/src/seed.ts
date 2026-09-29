import { legacyPages } from './legacy-pages';
import { Database } from './database';
export async function seed(db: Database) {
  if (process.env.NODE_ENV === 'production')
    throw new Error('Development seeds forbidden in production');
  if ((await db.query('SELECT id FROM institutions LIMIT 1')).rows.length) return;
  await db.transaction(async (tx) => {
    await tx.query(
      "INSERT INTO institutions(id,name) VALUES ('demo','Medora Medical College · Demonstration'),('other','Isolation test institution')",
    );
    const people = [
      ['admin', 'Ananya Sen', 'admin', 'Administration', null],
      ['registrar', 'Rohan Das', 'registrar', 'Admissions', null],
      ['faculty', 'Dr. Meera Kapoor', 'faculty', 'Anatomy', null],
      ['faculty2', 'Dr. Arjun Roy', 'faculty', 'Physiology', null],
      ['dean', 'Dr. Devika Rao', 'dean', 'Academic office', null],
      ['finance', 'Kabir Shah', 'finance', 'Finance', null],
      ['student', 'Aarav Sharma', 'student', 'Anatomy', 's01'],
      ['student2', 'Diya Sen', 'student', 'Anatomy', 's02'],
      ['editor', 'Ishita Bose', 'editor', 'Communications', null],
      ['publisher', 'Nandita Pal', 'publisher', 'Communications', null],
      ['committee', 'Dr. Neha Paul', 'committee', 'Student welfare', null],
      ['auditor', 'Samar Nair', 'auditor', 'Quality office', null],
    ];
    for (const [id, name, role, dept, student] of people)
      await tx.query(
        'INSERT INTO users(id,institution_id,name,email,role,department,student_id) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [id, 'demo', name, `${id}@medora.example`, role, dept, student],
      );
    await tx.query(
      "INSERT INTO users(id,institution_id,name,email,role) VALUES ('outsider','other','Isolation fixture','outside@example.test','admin')",
    );
    const names = [
      'Aarav Sharma',
      'Diya Sen',
      'Ishaan Patel',
      'Ananya Das',
      'Vihaan Nair',
      'Saanvi Roy',
      'Aditya Kumar',
      'Myra Gupta',
      'Arjun Bose',
      'Avni Mehta',
      'Rohan Iyer',
      'Kavya Shah',
    ];
    for (let i = 0; i < names.length; i++)
      await tx.query(
        'INSERT INTO students(id,institution_id,number,name,email,programme,batch,department) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [
          `s${String(i + 1).padStart(2, '0')}`,
          'demo',
          `MED/2026/${String(i + 1).padStart(3, '0')}`,
          names[i],
          `student${i + 1}@example.test`,
          'MBBS',
          '2026–27',
          'Anatomy',
        ],
      );
    await tx.query(
      "INSERT INTO students(id,institution_id,number,name,email,programme,batch,department) VALUES ('outside-student','other','X1','Private other student','private@example.test','MBBS','2026–27','Anatomy')",
    );
    for (const [kind, code, name] of [
      ['Campus', 'MAIN', 'Main campus'],
      ['Department', 'AN', 'Anatomy'],
      ['Department', 'PY', 'Physiology'],
      ['Programme', 'MBBS', 'MBBS'],
      ['Batch', '2026', '2026–27'],
    ])
      await tx.query(
        'INSERT INTO masters(id,institution_id,kind,code,name) VALUES ($1,$2,$3,$4,$5)',
        [`${kind}-${code}`, 'demo', kind, code, name],
      );
    await tx.query("INSERT INTO seat_pools VALUES ('pool-mbbs','demo','MBBS','2026–27',20,12)");
    for (const [id, name, status] of [
      ['a01', 'Riya Mukherjee', 'Submitted'],
      ['a02', 'Ayaan Khan', 'Verification'],
      ['a03', 'Sneha Rao', 'Clarification'],
      ['a04', 'Pranav Menon', 'Verified'],
    ])
      await tx.query(
        'INSERT INTO applications(id,institution_id,external_ref,name,email,programme,batch,department,pool_id,status,eligibility_verified,allotment_verified,payment_verified,verifier_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11,$11,$12)',
        [
          id,
          'demo',
          `DEMO-ALLOT-${id}`,
          name,
          `${id}@example.test`,
          'MBBS',
          '2026–27',
          'Anatomy',
          'pool-mbbs',
          status,
          status === 'Verified',
          status === 'Verified' ? 'registrar' : null,
        ],
      );
    for (const [id, code, title, subject] of [
      ['c01', 'AN 1.1', 'Describe the anatomical position and planes', 'Anatomy'],
      ['c02', 'AN 14.1', 'Identify the bones of the upper limb', 'Anatomy'],
      ['c03', 'PY 1.1', 'Explain homeostasis and feedback mechanisms', 'Physiology'],
      ['c04', 'AN 3.1', 'Demonstrate respectful cadaver handling', 'Anatomy'],
    ])
      await tx.query('INSERT INTO competencies VALUES ($1,$2,$3,$4,$5,$6,$7)', [
        id,
        'demo',
        code,
        title,
        subject,
        'Demonstration 2026.1',
        'Synthetic teaching catalogue; institutional review required',
      ]);
    const date = new Date();
    date.setUTCHours(3, 30, 0, 0);
    for (let i = 0; i < 5; i++) {
      const start = new Date(date.getTime() + i * 90 * 60000);
      await tx.query(
        'INSERT INTO teaching_sessions(id,institution_id,title,department,cohort,faculty_id,competency_id,room,category,starts_at,ends_at,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
        [
          `ts0${i + 1}`,
          'demo',
          [
            'Upper limb: bones & joints',
            'General physiology',
            'Dissection: pectoral region',
            'Anatomical terminology',
            'Clinical skills orientation',
          ][i],
          i === 1 ? 'Physiology' : 'Anatomy',
          '2026–27',
          i === 1 ? 'faculty2' : 'faculty',
          i === 1 ? 'c03' : 'c02',
          ['Lecture hall A', 'Lecture hall B', 'Dissection hall', 'Lecture hall A', 'Skills lab'][
            i
          ],
          i === 2 ? 'Practical' : 'Theory',
          start.toISOString(),
          new Date(start.getTime() + 60 * 60000).toISOString(),
          i === 0 ? 'Conducted' : 'Planned',
        ],
      );
    }
    await tx.query(
      "INSERT INTO policies(id,institution_id,name,kind,effective_date,config,owner_id) VALUES ('pol1','demo','Attendance policy — awaiting approval','Attendance','2026-09-01','{}','admin')",
    );
    for (let i = 0; i < 4; i++)
      await tx.query(
        'INSERT INTO logbook(id,institution_id,student_id,competency_id,supervisor_id,activity,activity_date,reflection,posting,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        [
          `l${i}`,
          'demo',
          `s0${i + 1}`,
          'c02',
          'faculty',
          'Identification of upper limb bones',
          new Date().toISOString().slice(0, 10),
          'Practised identifying landmarks on a teaching model. No patient information recorded.',
          'Anatomy skills lab',
          i === 3 ? 'Verified' : 'Submitted',
        ],
      );
    await tx.query(
      "INSERT INTO assessments(id,institution_id,title,department,cohort,competency_id,max_marks,examiner_id,creator_id,rubric) VALUES ('ex1','demo','Anatomy · first formative assessment','Anatomy','2026–27','c02',50,'faculty','faculty','Identification 20; explanation 20; communication 10')",
    );
    for (let i = 0; i < 6; i++)
      await tx.query(
        'INSERT INTO invoices(id,institution_id,student_id,description,amount_minor,due_date,fee_version) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [
          `inv${i}`,
          'demo',
          `s0${i + 1}`,
          'Tuition fee · first instalment',
          7500000,
          '2026-10-15',
          'Synthetic fee schedule 2026.1',
        ],
      );
    for (const [id, title, body, audience] of [
      [
        'n1',
        'Academic orientation · MBBS 2026',
        'Orientation materials are available from the academic office.',
        'all',
      ],
      [
        'n2',
        'Faculty review window',
        'Please review submitted competency evidence in your review queue.',
        'faculty',
      ],
      [
        'n3',
        'Library induction',
        'The library team will coordinate induction slots with batch representatives.',
        'student',
      ],
    ])
      await tx.query(
        'INSERT INTO notices(id,institution_id,title,body,audience,owner_id) VALUES ($1,$2,$3,$4,$5,$6)',
        [id, 'demo', title, body, audience, 'admin'],
      );
    await tx.query(
      "INSERT INTO tickets(id,institution_id,title,description,requester_id,due_date) VALUES ('t1','demo','Student ID correction','Please review the spelling on my student record.','student','2026-10-01')",
    );
    const pages = legacyPages;
    for (const [slug, title, body] of pages)
      await tx.query(
        'INSERT INTO content(id,institution_id,slug,title,body,kind,status,owner_id,reviewer_id,review_date,published_body,published_title,published_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$5,$4,now())',
        [
          `page-${slug}`,
          'demo',
          slug,
          title,
          body,
          'Page',
          'Published',
          'editor',
          'publisher',
          '2026-12-31',
        ],
      );
  });
}
