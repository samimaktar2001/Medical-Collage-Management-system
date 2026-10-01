import { Database } from './database';

export async function seedClinical(db: Database) {
  // 1. CRMI Rotations
  const rotations = [
    { id: 'ROT-01', dept: 'General Medicine', duration: '2 Months', status: 'In Progress (Week 6/8)', progress: 75, color: '#0F766E', sort_order: 1 },
    { id: 'ROT-02', dept: 'General Surgery', duration: '2 Months', status: 'Completed', progress: 100, color: '#0284C7', sort_order: 2 },
    { id: 'ROT-03', dept: 'Obstetrics & Gynae', duration: '2 Months', status: 'Completed', progress: 100, color: '#EC4899', sort_order: 3 },
    { id: 'ROT-04', dept: 'Community Medicine (PSM)', duration: '2 Months', status: 'Upcoming', progress: 0, color: '#8B5CF6', sort_order: 4 },
    { id: 'ROT-05', dept: 'Pediatrics', duration: '1 Month', status: 'Completed', progress: 100, color: '#F59E0B', sort_order: 5 },
    { id: 'ROT-06', dept: 'Orthopedics & Trauma', duration: '1 Month', status: 'Upcoming', progress: 0, color: '#64748B', sort_order: 6 },
    { id: 'ROT-07', dept: 'Emergency & Casualty', duration: '15 Days', status: 'Upcoming', progress: 0, color: '#DC2626', sort_order: 7 },
    { id: 'ROT-08', dept: 'Electives & Anesthesia', duration: '15 Days', status: 'Upcoming', progress: 0, color: '#059669', sort_order: 8 },
  ];

  for (const r of rotations) {
    await db.query(
      `INSERT INTO crmi_rotations(id, institution_id, dept, duration, status, progress, color, sort_order)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [r.id, r.dept, r.duration, r.status, r.progress, r.color, r.sort_order]
    );
  }

  // 2. CRMI Internship Logs
  const crmiLogs = [
    {
      id: 'LOG-101',
      internName: 'Dr. Rahul Sharma (Intern)',
      rollNo: 'MC/2021/042',
      department: 'General Medicine',
      procedureCode: 'MED-PROC-01',
      procedureName: 'Lumbar Puncture (CSF Analysis)',
      patientDetails: 'Male 48Y, Bed #14 (Meningitis Rule-out)',
      role: 'Performed',
      date: '28 Sep 2026',
      supervisor: 'Dr. Debasis Mukherjee (Prof)',
      status: 'Verified',
    },
    {
      id: 'LOG-102',
      internName: 'Dr. Rahul Sharma (Intern)',
      rollNo: 'MC/2021/042',
      department: 'Obstetrics & Gynae',
      procedureCode: 'OBG-DEL-08',
      procedureName: 'Normal Vaginal Delivery with Episiotomy',
      patientDetails: 'Female 24Y, Primigravida (Labour Room 3)',
      role: 'Performed',
      date: '27 Sep 2026',
      supervisor: 'Dr. Kalyani Sen (HOD)',
      status: 'Verified',
    },
    {
      id: 'LOG-103',
      internName: 'Dr. Rahul Sharma (Intern)',
      rollNo: 'MC/2021/042',
      department: 'General Surgery',
      procedureCode: 'SUR-APP-03',
      procedureName: 'Laparoscopic Appendectomy Assistance',
      patientDetails: 'Female 19Y, OT 2 (Acute Appendicitis)',
      role: 'Assisted',
      date: '26 Sep 2026',
      supervisor: 'Dr. Arjun Sen (Assoc Prof)',
      status: 'Verified',
    },
    {
      id: 'LOG-104',
      internName: 'Dr. Rahul Sharma (Intern)',
      rollNo: 'MC/2021/042',
      department: 'Emergency & Trauma',
      procedureCode: 'EMG-RES-05',
      procedureName: 'Endotracheal Intubation & Mechanical Ventilation',
      patientDetails: 'Male 55Y, Red Zone (ARDS / Sepsis)',
      role: 'Assisted',
      date: '25 Sep 2026',
      supervisor: 'Dr. R. Bannerjee (Prof)',
      status: 'Pending Sign-off',
    },
    {
      id: 'LOG-105',
      internName: 'Dr. Rahul Sharma (Intern)',
      rollNo: 'MC/2021/042',
      department: 'Pediatrics',
      procedureCode: 'PED-CVP-02',
      procedureName: 'Pediatric Peripheral Venous Cannulation',
      patientDetails: 'Female 4Y, PICU Bed 6 (Dengue with Warning Signs)',
      role: 'Performed',
      date: '24 Sep 2026',
      supervisor: 'Dr. Debasis Mukherjee (Prof)',
      status: 'Pending Sign-off',
    },
  ];

  for (const l of crmiLogs) {
    await db.query(
      `INSERT INTO crmi_internship_logs(id, institution_id, intern_name, roll_no, department, procedure_code, procedure_name, patient_details, role, date, supervisor, status)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [l.id, l.internName, l.rollNo, l.department, l.procedureCode, l.procedureName, l.patientDetails, l.role, l.date, l.supervisor, l.status]
    );
  }

  // 3. NMC Department Audits
  const audits = [
    { id: 'AUD-01', dept: 'General Medicine', opd: 312, ipdBed: '120/140 (85.7%)', majorOt: '-', minorOt: 8, labTests: 410, facultyAebas: '94.2%', status: 'Compliant', sortOrder: 1 },
    { id: 'AUD-02', dept: 'General Surgery', opd: 245, ipdBed: '105/120 (87.5%)', majorOt: '12', minorOt: 18, labTests: 280, facultyAebas: '91.8%', status: 'Compliant', sortOrder: 2 },
    { id: 'AUD-03', dept: 'Obstetrics & Gynecology', opd: 198, ipdBed: '78/90 (86.6%)', majorOt: '8', minorOt: 12, labTests: 190, facultyAebas: '88.5%', status: 'Compliant', sortOrder: 3 },
    { id: 'AUD-04', dept: 'Pediatrics & Neonatology', opd: 184, ipdBed: '54/60 (90.0%)', majorOt: '2', minorOt: 4, labTests: 160, facultyAebas: '92.0%', status: 'Compliant', sortOrder: 4 },
    { id: 'AUD-05', dept: 'Orthopedics & Trauma', opd: 162, ipdBed: '52/60 (86.6%)', majorOt: '5', minorOt: 8, labTests: 95, facultyAebas: '86.4%', status: 'Compliant', sortOrder: 5 },
    { id: 'AUD-06', dept: 'Ophthalmology (Eye)', opd: 114, ipdBed: '24/30 (80.0%)', majorOt: '4', minorOt: 6, labTests: 35, facultyAebas: '85.0%', status: 'Compliant', sortOrder: 6 },
    { id: 'AUD-07', dept: 'Oto-Rhino-Laryngology (ENT)', opd: 98, ipdBed: '22/30 (73.3%)', majorOt: '3', minorOt: 5, labTests: 28, facultyAebas: '83.3%', status: 'Compliant', sortOrder: 7 },
    { id: 'AUD-08', dept: 'Dermatology (Skin & VD)', opd: 104, ipdBed: '18/20 (90.0%)', majorOt: '-', minorOt: 11, labTests: 42, facultyAebas: '90.0%', status: 'Compliant', sortOrder: 8 },
  ];

  for (const a of audits) {
    await db.query(
      `INSERT INTO nmc_department_audits(id, institution_id, dept, opd, ipd_bed, major_ot, minor_ot, lab_tests, faculty_aebas, status, sort_order)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.dept, a.opd, a.ipdBed, a.majorOt, a.minorOt, a.labTests, a.facultyAebas, a.status, a.sortOrder]
    );
  }

  // 4. Insurance Claims
  const claims = [
    {
      id: 'CLM-8841',
      patientName: 'Subhash Chandra Bose',
      scheme: 'Ayushman Bharat (PM-JAY)',
      preAuthNo: 'NHA/WB/2026/08912',
      abhaId: '91-4432-8812-0041',
      procedurePackage: 'Coronary Angioplasty with Stenting (DES)',
      packageCost: '₹ 85,000',
      wardBed: 'ICU Bed 04',
      preAuthStatus: 'Approved',
    },
    {
      id: 'CLM-8842',
      patientName: 'Sunita Dasgupta',
      scheme: 'Swasthya Sathi (West Bengal)',
      preAuthNo: 'WBSS/MC/2026/4102',
      abhaId: '91-7721-3944-1298',
      procedurePackage: 'Total Knee Replacement (Unilateral)',
      packageCost: '₹ 1,10,000',
      wardBed: 'Orthopedics Ward Bed 12',
      preAuthStatus: 'Approved',
    },
    {
      id: 'CLM-8843',
      patientName: 'Mohammad Farooq',
      scheme: 'Ayushman Bharat (PM-JAY)',
      preAuthNo: 'NHA/WB/2026/09144',
      abhaId: '91-1190-4822-7713',
      procedurePackage: 'Laparoscopic Cholecystectomy',
      packageCost: '₹ 32,500',
      wardBed: 'General Surgery Ward 3',
      preAuthStatus: 'Under Review',
    },
    {
      id: 'CLM-8844',
      patientName: 'Ananya Mukherjee',
      scheme: 'Swasthya Sathi (West Bengal)',
      preAuthNo: 'WBSS/MC/2026/4155',
      abhaId: '91-5541-9012-3321',
      procedurePackage: 'LSCS Caesarean Delivery + Nursery Care',
      packageCost: '₹ 28,000',
      wardBed: 'Maternity Ward Bed 08',
      preAuthStatus: 'Settled',
    },
  ];

  for (const c of claims) {
    await db.query(
      `INSERT INTO insurance_claims(id, institution_id, patient_name, scheme, pre_auth_no, abha_id, procedure_package, package_cost, ward_bed, pre_auth_status)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.patientName, c.scheme, c.preAuthNo, c.abhaId, c.procedurePackage, c.packageCost, c.wardBed, c.preAuthStatus]
    );
  }

  // 5. Birth Registry
  const births = [
    {
      id: 'BR-2026-081',
      crsNo: 'CRS/WB/2026/00142',
      babyDetails: 'Male • 3.2 kg • Gestation 39W',
      motherName: 'Aarti Mondal (24Y)',
      fatherName: 'Bikash Mondal',
      deliveryType: 'Normal Vaginal',
      attendingObgyn: 'Dr. Kalyani Sen (Prof)',
      crsStatus: 'CRS Registered',
      dateTime: '29 Sep 2026, 04:15 AM',
    },
    {
      id: 'BR-2026-082',
      crsNo: 'CRS/WB/2026/00143',
      babyDetails: 'Female • 2.8 kg • Gestation 38W',
      motherName: 'Priyanka Mukherjee (28Y)',
      fatherName: 'Sourav Mukherjee',
      deliveryType: 'LSCS (Emergency)',
      attendingObgyn: 'Dr. S. Chatterjee (Assoc Prof)',
      crsStatus: 'Pending Verification',
      dateTime: '29 Sep 2026, 08:30 AM',
    },
  ];

  for (const b of births) {
    await db.query(
      `INSERT INTO birth_registry(id, institution_id, crs_no, baby_details, mother_name, father_name, delivery_type, attending_obgyn, crs_status, date_time)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.crsNo, b.babyDetails, b.motherName, b.fatherName, b.deliveryType, b.attendingObgyn, b.crsStatus, b.dateTime]
    );
  }

  // 6. Death Registry
  const deaths = [
    {
      id: 'DR-2026-042',
      patientName: 'Rameshwar Roy',
      ageGender: '58Y / Male',
      wardBed: 'ICU Bed 06',
      immediateCause: 'Refractory Septic Shock',
      underlyingCause: 'Severe Acute Pancreatitis (Biliary)',
      icd10: 'K85.1 • R57.2',
      doctor: 'Dr. Debasis Mukherjee (Prof)',
      auditStatus: 'M&M Audited',
      dateTime: '28 Sep 2026, 11:20 PM',
    },
    {
      id: 'DR-2026-043',
      patientName: 'Kamala Devi',
      ageGender: '72Y / Female',
      wardBed: 'Medicine Ward Bed 18',
      immediateCause: 'Acute Cardiopulmonary Arrest',
      underlyingCause: 'Cor Pulmonale secondary to severe COPD',
      icd10: 'I27.9 • J44.9',
      doctor: 'Dr. Ananya Sen (Assoc Prof)',
      auditStatus: 'Audit Scheduled',
      dateTime: '29 Sep 2026, 02:40 AM',
    },
  ];

  for (const d of deaths) {
    await db.query(
      `INSERT INTO death_registry(id, institution_id, patient_name, age_gender, ward_bed, immediate_cause, underlying_cause, icd10, doctor, audit_status, date_time)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [d.id, d.patientName, d.ageGender, d.wardBed, d.immediateCause, d.underlyingCause, d.icd10, d.doctor, d.auditStatus, d.dateTime]
    );
  }

  // 7. MLC Registry
  const mlcs = [
    {
      id: 'MLC-2026-114',
      mlcNo: 'MLC/KOL/2026/0912',
      patientName: 'Bikash Das',
      ageGender: '32Y / Male',
      incidentType: 'Road Traffic Accident (Two-Wheeler vs Truck)',
      policeStation: 'Behala PS (FIR #412/26)',
      broughtBy: 'Sub-Inspector P. Roy',
      examiningCmo: 'Dr. Tanmoy Banerjee (CMO)',
      status: 'Police Acknowledged',
      dateTime: '29 Sep 2026, 06:10 AM',
    },
    {
      id: 'MLC-2026-115',
      mlcNo: 'MLC/KOL/2026/0913',
      patientName: 'Raju Sheikh',
      ageGender: '27Y / Male',
      incidentType: 'Industrial Burn & Blast Injury',
      policeStation: 'Taratala PS',
      broughtBy: 'Factory Manager & PCR Van',
      examiningCmo: 'Dr. Tanmoy Banerjee (CMO)',
      status: 'Intimation Dispatched',
      dateTime: '29 Sep 2026, 09:45 AM',
    },
  ];

  for (const m of mlcs) {
    await db.query(
      `INSERT INTO mlc_registry(id, institution_id, mlc_no, patient_name, age_gender, incident_type, police_station, brought_by, examining_cmo, status, date_time)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [m.id, m.mlcNo, m.patientName, m.ageGender, m.incidentType, m.policeStation, m.broughtBy, m.examiningCmo, m.status, m.dateTime]
    );
  }

  // 8. Biomedical Waste Logs
  const wastes = [
    { id: 'BMW-001', barcode: 'BMW-Y-8841920', category: 'Yellow', ward: 'OT Complex (Main OT 2)', weightKg: 14.2, handler: 'Ram Kumar (HICC Staff)', cbwtf_manifest_no: 'CBWTF-KOL-2026-092', status: 'Logged' },
    { id: 'BMW-002', barcode: 'BMW-R-8841921', category: 'Red', ward: 'General Medicine Ward 2', weightKg: 9.8, handler: 'Sanjay Pal', cbwtf_manifest_no: 'CBWTF-KOL-2026-092', status: 'Logged' },
    { id: 'BMW-003', barcode: 'BMW-W-8841922', category: 'White', ward: 'Emergency Resuscitation Zone', weightKg: 2.1, handler: 'Deben Biswas', cbwtf_manifest_no: 'CBWTF-KOL-2026-092', status: 'Logged' },
    { id: 'BMW-004', barcode: 'BMW-B-8841923', category: 'Blue', ward: 'Central Pathology Laboratory', weightKg: 6.5, handler: 'Sanjay Pal', cbwtf_manifest_no: 'CBWTF-KOL-2026-092', status: 'Logged' },
    { id: 'BMW-005', barcode: 'BMW-Y-8841924', category: 'Yellow', ward: 'Labor & Delivery Suite', weightKg: 18.4, handler: 'Ram Kumar (HICC Staff)', cbwtf_manifest_no: 'CBWTF-KOL-2026-092', status: 'Dispatched' },
  ];

  for (const w of wastes) {
    await db.query(
      `INSERT INTO biomedical_waste_logs(id, institution_id, barcode, category, ward, weight_kg, handler, cbwtf_manifest_no, status)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [w.id, w.barcode, w.category, w.ward, w.weightKg, w.handler, w.cbwtf_manifest_no, w.status]
    );
  }

  // 9. Clinical Notifications
  const notifs = [
    {
      id: 'N-001',
      title: 'Statutory NMC UG MSR Inspection Alert',
      message: 'National Medical Commission inspection team visit scheduled for October 15, 2026. All departments must finalize clinical audit files and AEBAS logs.',
      category: 'NMC / Statutory',
      priority: 'high',
      time: '10 mins ago',
      read: false,
      iconType: 'statutory',
    },
    {
      id: 'N-002',
      title: 'Critical Bedside Panic Alert: ICU Bed 04',
      message: 'Critical blood potassium value (K+: 6.8 mEq/L) reported for patient Subhash Chandra Bose. Immediate cardiology consultation required.',
      category: 'Bedside Critical',
      priority: 'high',
      time: '25 mins ago',
      read: false,
      iconType: 'critical',
    },
    {
      id: 'N-003',
      title: 'CBWTF Bio-Medical Waste Daily Dispatch Cleared',
      message: '42.8 kg hazardous clinical waste (Yellow & Red categories) successfully handed over to Medicare Environmental Management with GPS manifest #CBWTF-092.',
      category: 'Infection Control',
      priority: 'medium',
      time: '1 hour ago',
      read: true,
      iconType: 'statutory',
    },
    {
      id: 'N-004',
      title: 'CRMI Intern Procedure Sign-Off Pending (5)',
      message: '5 new invasive procedures (Lumbar puncture, Central Line) logged by MBBS interns awaiting Unit Chief verification.',
      category: 'Academic & CRMI',
      priority: 'medium',
      time: '2 hours ago',
      read: false,
      iconType: 'academic',
    },
  ];

  for (const n of notifs) {
    await db.query(
      `INSERT INTO clinical_notifications(id, institution_id, title, message, category, priority, time, read, icon_type)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [n.id, n.title, n.message, n.category, n.priority, n.time, n.read, n.iconType]
    );
  }

  // 10. Clinical Threads & Messages
  const threads = [
    { id: 'T-01', name: 'Dr. Debasis Mukherjee', role: 'Prof & HOD, Medicine', department: 'General Medicine', unread: 2, avatar: 'DM', status: 'online' },
    { id: 'T-02', name: 'Dr. Kalyani Sen', role: 'Prof & HOD, OBGYN', department: 'Obstetrics & Gynae', unread: 0, avatar: 'KS', status: 'online' },
    { id: 'T-03', name: 'Dr. Arjun Sen', role: 'Assoc Professor, Surgery', department: 'General Surgery', unread: 1, avatar: 'AS', status: 'offline' },
    { id: 'T-04', name: 'Dr. Tanmoy Banerjee', role: 'Chief Medical Officer', department: 'Emergency & Trauma', unread: 0, avatar: 'TB', status: 'online' },
  ];

  for (const t of threads) {
    await db.query(
      `INSERT INTO clinical_threads(id, institution_id, name, role, department, unread, avatar, status)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [t.id, t.name, t.role, t.department, t.unread, t.avatar, t.status]
    );
  }

  const msgs = [
    { id: 'M-01', threadId: 'T-01', sender: 'Dr. Debasis Mukherjee', text: 'Dr. Rahul, please review the latest arterial blood gas report for Bed 04 in Male Medical Ward.', time: '11:42 AM', priority: 'urgent' },
    { id: 'M-02', threadId: 'T-01', sender: 'You', text: 'Reviewed, sir. PaO2 is 68 mmHg on 4L O2. I have started nebulization and titrated oxygen.', time: '11:45 AM', priority: 'normal' },
    { id: 'M-03', threadId: 'T-01', sender: 'Dr. Debasis Mukherjee', text: 'Excellent. Also sign off his CRMI lumbar puncture entry in the e-logbook when you get to the terminal.', time: '11:48 AM', priority: 'normal' },
  ];

  for (const m of msgs) {
    await db.query(
      `INSERT INTO clinical_messages(id, institution_id, thread_id, sender, text, time, priority)
       VALUES ($1, 'demo', $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [m.id, m.threadId, m.sender, m.text, m.time, m.priority]
    );
  }
}
