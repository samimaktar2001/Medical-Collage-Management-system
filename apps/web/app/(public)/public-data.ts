export interface Course {
  slug: string;
  name: string;
  degree: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Nursing & Allied';
  duration: string;
  seats: number;
  eligibility: string;
  affiliation: string;
  tuitionPerYear: string;
  overview: string;
  curriculumHighlights: string[];
  careerProspects: string[];
}

export interface Department {
  slug: string;
  name: string;
  type: 'Pre-Clinical' | 'Para-Clinical' | 'Clinical' | 'Super Specialty';
  hod: string;
  hodQualification: string;
  description: string;
  bedCount?: number;
  facilities: string[];
  opdSchedule: string;
  academicPrograms: string[];
}

export interface Doctor {
  slug: string;
  name: string;
  department: string;
  designation: string;
  qualification: string;
  regNumber: string;
  experienceYears: number;
  specialty: string;
  opdDays: string;
  opdTime: string;
  roomNumber: string;
  availableForConsultation: boolean;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Academic' | 'Examination' | 'Admission' | 'Tender' | 'Hospital';
  isNew?: boolean;
  audience: string;
  pdfUrl?: string;
  excerpt: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: 'Conference' | 'Academic Event' | 'Achievement' | 'Community Health Camp' | 'Hospital Update';
  author: string;
  readTime: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Hospital & OTs' | 'Academics & Labs' | 'Events & Sports' | 'Convocation';
  caption: string;
  year: string;
}

export interface Facility {
  title: string;
  category: 'Academic' | 'Hospital' | 'Campus Life' | 'Research';
  description: string;
  features: string[];
  capacity?: string;
}

export const INSTITUTION_INFO = {
  name: 'MedicaCare Medical College & Hospital',
  shortName: 'MMCH',
  tagline: 'Excellence in Medical Education, Patient Healing & Translational Research',
  estYear: 1998,
  campusArea: '52 Acres Green Eco-Campus',
  affiliation: 'West Bengal University of Health Sciences (WBUHS)',
  approvals: 'Recognized by National Medical Commission (NMC), Ministry of Health & Family Welfare, Govt. of India',
  naacGrade: 'A+ (Score 3.62 / 4.00)',
  hospitalAccreditation: 'NABH & NABL Accredited 750-Bedded Super-Specialty Hospital',
  address: 'Health City Campus, Sector V, Salt Lake Bypass, Kolkata, West Bengal 700098',
  casualtyHelpline: '1800-419-MED (Toll Free, 24/7)',
  admissionHelpline: '+91 98765 43210 / +91 33 2490 8000',
  email: 'registrar@medicacare.edu.in',
  admissionEmail: 'admissions@medicacare.edu.in',
  hospitalEmail: 'emergency@medicacare.hospital.in',
  totalBeds: 750,
  dailyOpdFootfall: '1,800+ Patients Daily',
  studentsEnrolled: '1,250+ Undergrads & Postgrads',
  facultyCount: '320+ Specialist Doctors & Professors',
};

export const COURSES: Course[] = [
  {
    slug: 'mbbs',
    name: 'Bachelor of Medicine & Bachelor of Surgery (MBBS)',
    degree: 'MBBS',
    level: 'Undergraduate',
    duration: '4.5 Years Academic + 1 Year Compulsory Rotatory Internship (CRRI)',
    seats: 250,
    eligibility: '10+2 with minimum 50% in Physics, Chemistry, Biology and qualified in NEET-UG with valid national rank.',
    affiliation: 'WBUHS & National Medical Commission (NMC)',
    tuitionPerYear: '₹6,50,000 / year (State Quota) | ₹14,00,000 / year (Management Quota)',
    overview: 'The premier undergraduate medical training programme conforming strictly to NMC Competency-Based Medical Education (CBME) curriculum with integrated clinical bedside exposure from Phase 1.',
    curriculumHighlights: [
      'Pre-Clinical Phase (14 Months): Anatomy (Dissection), Physiology, Biochemistry with Early Clinical Exposure (ECE)',
      'Para-Clinical Phase (12 Months): Pathology, Microbiology, Pharmacology with hospital laboratory attachments',
      'Clinical Phase 1 (13 Months): Community Medicine, Forensic Medicine, Ophthalmology, ENT',
      'Clinical Phase 2 (17 Months): General Medicine, General Surgery, Obstetrics & Gynecology, Pediatrics, Orthopedics, Dermatology',
      'CRRI Internship (12 Months): Paid rotatory clinical postings across Medicine, Surgery, OB-GYN, Casualty and Rural Health Centers',
    ],
    careerProspects: ['Resident Doctor', 'Postgraduate Specialist (MD/MS/DNB)', 'Civil Medical Officer', 'Clinical Researcher', 'Armed Forces Medical Services'],
  },
  {
    slug: 'md-general-medicine',
    name: 'Doctor of Medicine in General Medicine (MD)',
    degree: 'MD',
    level: 'Postgraduate',
    duration: '3 Years Full-Time Residency',
    seats: 18,
    eligibility: 'Recognized MBBS Degree with permanent NMC/State Medical Council registration + Qualified in NEET-PG.',
    affiliation: 'WBUHS & NMC',
    tuitionPerYear: '₹8,00,000 / year',
    overview: 'Advanced clinical training in adult internal medicine, intensive care therapeutics, infectious diseases, nephrology, cardiology and multi-organ critical illness management.',
    curriculumHighlights: [
      'Daily Ward Rounds, ICU/CCU resuscitations and central line catheterizations',
      'Mandatory Dissertation / Thesis research with publication in peer-reviewed PubMed journal',
      'Bedside DOPS (Direct Observation of Procedural Skills) and Mini-CEX evaluations',
    ],
    careerProspects: ['Consultant Physician', 'Fellowship in Critical Care / Cardiology / Nephrology', 'Associate Professor / Faculty'],
  },
  {
    slug: 'ms-general-surgery',
    name: 'Master of Surgery in General Surgery (MS)',
    degree: 'MS',
    level: 'Postgraduate',
    duration: '3 Years Full-Time Residency',
    seats: 16,
    eligibility: 'Recognized MBBS Degree + Qualified in NEET-PG.',
    affiliation: 'WBUHS & NMC',
    tuitionPerYear: '₹8,50,000 / year',
    overview: 'Rigorous operative training in abdominal, laparoscopic, trauma, endocrine and emergency surgical procedures in state-of-the-art laminar flow OT suites.',
    curriculumHighlights: [
      'Over 200 supervised major and minor surgeries in the Logbook',
      'Laparoscopic simulation training and advanced trauma life support (ATLS)',
      'Emergency casualty on-call duties and critical surgical ICU care',
    ],
    careerProspects: ['Consultant Surgeon', 'MCh Super-Specialty (Surgical Oncology, GI Surgery, Urology)', 'Academic Surgical Faculty'],
  },
  {
    slug: 'md-pediatrics',
    name: 'Doctor of Medicine in Pediatrics (MD)',
    degree: 'MD',
    level: 'Postgraduate',
    duration: '3 Years Full-Time Residency',
    seats: 12,
    eligibility: 'MBBS Degree + NEET-PG Qualified.',
    affiliation: 'WBUHS & NMC',
    tuitionPerYear: '₹8,00,000 / year',
    overview: 'Specialized healthcare training for neonates, infants, children and adolescents with rotations in Level-III NICU and PICU.',
    curriculumHighlights: [
      'Neonatal Resuscitation Program (NRP) certification',
      'Pediatric emergency management, mechanical ventilation and developmental assessments',
      'Immunization clinic rotations and pediatric clinical research',
    ],
    careerProspects: ['Consultant Pediatrician', 'Fellowship in Neonatology / Pediatric Cardiology', 'Hospital Clinical Specialist'],
  },
  {
    slug: 'bsc-nursing',
    name: 'Bachelor of Science in Nursing (B.Sc. Nursing)',
    degree: 'B.Sc. Nursing',
    level: 'Nursing & Allied',
    duration: '4 Years Full-Time',
    seats: 100,
    eligibility: '10+2 with minimum 45% in PCB and English. Qualified in State Nursing Entrance (JENPAS-UG).',
    affiliation: 'Indian Nursing Council (INC) & WBUHS',
    tuitionPerYear: '₹1,40,000 / year',
    overview: 'Comprehensive professional training in evidence-based patient nursing, critical care support, operation theatre assistance, pharmacology and community health.',
    curriculumHighlights: [
      '1,200+ hours of supervised hospital clinical ward postings',
      'Advanced patient simulation lab practice and BLS certification',
      'Public health field practice in rural and maternal healthcare centers',
    ],
    careerProspects: ['Staff Nurse in Super-Specialty Hospitals', 'Nurse Educator / Tutor', 'ICU Specialist Nurse', 'International Clinical Opportunities (UK/US/Gulf)'],
  },
];

export const DEPARTMENTS: Department[] = [
  {
    slug: 'general-medicine',
    name: 'Department of General Medicine',
    type: 'Clinical',
    hod: 'Prof. (Dr.) Sanjoy K. Sengupta',
    hodQualification: 'MBBS, MD (Internal Medicine), FRCP (Glasg)',
    description: 'The backbone department of the teaching hospital managing outpatient clinics, multi-specialty acute wards, 30-bedded Medical ICU, infectious disease isolation, and chronic disease clinics.',
    bedCount: 150,
    facilities: ['30-Bedded Medical ICU with Mechanical Ventilators', 'Specialty Diabetes & Hypertension Clinic', 'Tropical Medicine & Infectious Disease Ward', '24/7 Hemodialysis Unit attachment'],
    opdSchedule: 'Monday – Saturday: 08:30 AM – 02:00 PM (Room 101–108)',
    academicPrograms: ['MBBS Clinical Postings & Bedside Clinics', 'MD General Medicine (18 Seats)', 'Post-Doctoral Fellowships'],
  },
  {
    slug: 'general-surgery',
    name: 'Department of General Surgery',
    type: 'Clinical',
    hod: 'Prof. (Dr.) Arup K. Mukherjee',
    hodQualification: 'MBBS, MS (Gen Surgery), FMAS, FAIS',
    description: 'Operates 12 ultra-modern modular operation theatres with HEPA filtration, executing open, minimally invasive laparoscopic, surgical oncology and emergency polytrauma operations.',
    bedCount: 140,
    facilities: ['12 Modular Operation Theatres with 4K Laparoscopy', '16-Bedded Surgical ICU (SICU)', 'Dedicated Minor OT for Day-Care Procedures', 'Burn & Wound Healing Unit'],
    opdSchedule: 'Monday – Saturday: 08:30 AM – 02:00 PM (Room 109–116)',
    academicPrograms: ['MBBS Surgical Clerkship', 'MS General Surgery (16 Seats)', 'Minimal Access Surgery Fellowship'],
  },
  {
    slug: 'pediatrics',
    name: 'Department of Pediatrics & Neonatology',
    type: 'Clinical',
    hod: 'Prof. (Dr.) Meenakshi Roy',
    hodQualification: 'MBBS, MD (Pediatrics), DCH, FIAP',
    description: 'Provides comprehensive tertiary child care featuring a dedicated Level-III NICU with baby warmers and CPAP, Pediatric Intensive Care (PICU), and specialized developmental pediatric clinics.',
    bedCount: 90,
    facilities: ['20-Bedded Level-III Neonatal ICU (NICU)', '10-Bedded Pediatric ICU (PICU)', 'Immunization & Vaccination Clinic', 'High-Risk Newborn Follow-Up Clinic'],
    opdSchedule: 'Monday – Saturday: 09:00 AM – 02:00 PM (Room 201–206)',
    academicPrograms: ['MBBS Pediatric Postings', 'MD Pediatrics (12 Seats)', 'Neonatology Fellowship'],
  },
  {
    slug: 'anatomy',
    name: 'Department of Anatomy',
    type: 'Pre-Clinical',
    hod: 'Prof. (Dr.) Bhaswati Banerjee',
    hodQualification: 'MBBS, MS (Anatomy), Ph.D.',
    description: 'Features a state-of-the-art Dissection Hall accommodating 250 students simultaneously, cold storage embalming mortuary for cadavers, histology microscope lab, and anatomy specimen museum.',
    facilities: ['Air-Conditioned Cadaveric Dissection Hall (250 Capacity)', 'Formalin Embalming & Cadaver Storage Unit', 'Histology Laboratory with 100+ Binocular Microscopes', 'Anatomical Museum with 600+ Plastinated Specimen'],
    opdSchedule: 'Academic Department (Monday – Saturday: 08:00 AM – 04:00 PM)',
    academicPrograms: ['MBBS Phase 1 Gross Anatomy, Embryology, Neuroanatomy', 'MS Anatomy (3 Seats)'],
  },
  {
    slug: 'pathology',
    name: 'Department of Pathology & Blood Bank',
    type: 'Para-Clinical',
    hod: 'Prof. (Dr.) Kalyan K. Bhattacharya',
    hodQualification: 'MBBS, MD (Pathology), DCP',
    description: 'NABL accredited laboratory handling over 2,500 clinical investigations daily including histopathology, frozen sections, automated hematology, cytopathology, and 24/7 licensed Blood Bank.',
    facilities: ['Fully Automated 5-Part Hematology Analyzers', 'Cryostat Frozen Section Rapid Biopsy', 'Automated Immunohistochemistry (IHC) Stainer', '24/7 Blood Component Separation Unit'],
    opdSchedule: 'Central Lab Collection 24/7 (Emergency & Routine)',
    academicPrograms: ['MBBS Phase 2 Systemic Pathology & Hematology', 'MD Pathology (10 Seats)', 'DMLT Paramedical Diploma'],
  },
  {
    slug: 'radiology',
    name: 'Department of Radio-Diagnosis',
    type: 'Clinical',
    hod: 'Prof. (Dr.) Subhasish Dutta',
    hodQualification: 'MBBS, MD (Radio-Diagnosis), DMRD',
    description: 'Equipped with 3.0 Tesla Silent MRI, 128-Slice Low-Dose Dual Source CT Scanner, Color Doppler Ultrasound, Digital Mammography, and Picture Archiving & Communication System (PACS).',
    facilities: ['3.0 Tesla High-Field MRI Scanner', '128-Slice Multidetector Helical CT', 'Digital Fluoroscopy & 500mA X-Ray', 'Enterprise PACS with cloud teleradiology'],
    opdSchedule: 'Routine Diagnostics: 08:00 AM – 06:00 PM | Emergency Scans: 24/7',
    academicPrograms: ['MBBS Radiology Seminars', 'MD Radio-Diagnosis (8 Seats)', 'DRD Paramedical Diploma'],
  },
];

export const DOCTORS: Doctor[] = [
  {
    slug: 'dr-sanjoy-sengupta',
    name: 'Prof. (Dr.) Sanjoy K. Sengupta',
    department: 'General Medicine',
    designation: 'Head of Department & Senior Consultant Physician',
    qualification: 'MBBS, MD (Medicine), FRCP (Glasgow)',
    regNumber: 'WBMC-48192',
    experienceYears: 28,
    specialty: 'Internal Medicine, Critical Care & Diabetic Nephropathy',
    opdDays: 'Mon, Wed, Fri',
    opdTime: '09:00 AM – 01:00 PM',
    roomNumber: 'OPD Room 102',
    availableForConsultation: true,
  },
  {
    slug: 'dr-arup-mukherjee',
    name: 'Prof. (Dr.) Arup K. Mukherjee',
    department: 'General Surgery',
    designation: 'Professor & Senior Surgical Consultant',
    qualification: 'MBBS, MS (Gen Surgery), FMAS, FAIS',
    regNumber: 'WBMC-51044',
    experienceYears: 24,
    specialty: 'Advanced Laparoscopic & GI Surgery, Surgical Oncology',
    opdDays: 'Tue, Thu, Sat',
    opdTime: '09:30 AM – 01:30 PM',
    roomNumber: 'OPD Room 110',
    availableForConsultation: true,
  },
  {
    slug: 'dr-meenakshi-roy',
    name: 'Prof. (Dr.) Meenakshi Roy',
    department: 'Pediatrics',
    designation: 'HOD & Neonatology Director',
    qualification: 'MBBS, MD (Pediatrics), DCH, FIAP',
    regNumber: 'WBMC-54911',
    experienceYears: 22,
    specialty: 'Neonatal Critical Care, Child Immunization & Growth Disorders',
    opdDays: 'Mon, Tue, Thu, Fri',
    opdTime: '10:00 AM – 02:00 PM',
    roomNumber: 'OPD Room 202',
    availableForConsultation: true,
  },
  {
    slug: 'dr-subhasish-dutta',
    name: 'Prof. (Dr.) Subhasish Dutta',
    department: 'Radio-Diagnosis',
    designation: 'Professor & Chief Radiologist',
    qualification: 'MBBS, MD (Radio-Diagnosis), DMRD',
    regNumber: 'WBMC-43920',
    experienceYears: 26,
    specialty: 'Neuroimaging, 3T MRI Diagnostics & Cross-Sectional CT',
    opdDays: 'Mon to Fri',
    opdTime: '08:30 AM – 03:00 PM',
    roomNumber: 'MRI / CT Console Room',
    availableForConsultation: true,
  },
  {
    slug: 'dr-kalyan-bhattacharya',
    name: 'Prof. (Dr.) Kalyan K. Bhattacharya',
    department: 'Pathology & Blood Bank',
    designation: 'Professor & Lab Director',
    qualification: 'MBBS, MD (Pathology), DCP',
    regNumber: 'WBMC-39182',
    experienceYears: 30,
    specialty: 'Histopathology, Oncopathology & Immunohematology',
    opdDays: 'Mon to Sat',
    opdTime: '09:00 AM – 04:00 PM',
    roomNumber: 'Central Lab Office',
    availableForConsultation: true,
  },
];

export const NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'MBBS Batch 2023-24 Professional Exam Schedule Released by University',
    date: '30 Sep 2026',
    category: 'Examination',
    isNew: true,
    audience: 'MBBS 2nd Professional Students',
    excerpt: 'The West Bengal University of Health Sciences has notified the practical and theory timetable for the upcoming 2nd Professional Examinations starting October 24, 2026.',
  },
  {
    id: 'n2',
    title: 'NEET-UG 2026 Institutional Stray Vacancy Round Counseling Registration',
    date: '28 Sep 2026',
    category: 'Admission',
    isNew: true,
    audience: 'MBBS Aspirants',
    excerpt: 'Eligible candidates registered in WBMCC counseling may apply for the stray vacancy round for 14 remaining state and NRI quota MBBS seats before October 5, 2026.',
  },
  {
    id: 'n3',
    title: 'Institutional Ethics Committee (IEC) Call for Clinical Research Proposals',
    date: '25 Sep 2026',
    category: 'Academic',
    audience: 'Faculty & Postgraduates',
    excerpt: 'Faculty and PG residents intending to initiate new drug clinical trials or human observational studies are requested to submit Protocol Forms for the November IEC review.',
  },
  {
    id: 'n4',
    title: 'Notice Regarding Hostels Fee Submission and Room Allotment for 2026',
    date: '22 Sep 2026',
    category: 'Academic',
    audience: 'Hostel Boarders',
    excerpt: 'All undergraduate and postgraduate hostel residents are advised to clear annual hostel boarding dues via the Student Portal by October 15, 2026.',
  },
  {
    id: 'n5',
    title: 'Expression of Interest (EOI) for Upgradation of Central CSSD Autoclaves',
    date: '18 Sep 2026',
    category: 'Tender',
    audience: 'Vendors & Public',
    excerpt: 'Sealed bids are invited from authorized biomedical equipment manufacturers for supply, installation and maintenance of 2 units of 800L Steam Sterilizer Autoclaves.',
  },
];

export const FACILITIES: Facility[] = [
  {
    title: 'Central Air-Conditioned Digital Library',
    category: 'Academic',
    capacity: '600 Seating Capacity',
    description: 'A 25,000 sq.ft. multi-level library housing over 45,000 medical books, international bound journals, high-speed Wi-Fi, and 120 e-learning terminals connected to PubMed, ClinicalKey, and UpToDate.',
    features: ['24/7 Separate Night Reading Hall', 'Over 140 National & International Medical Journals', 'Access to Digital DELNET and Elsevier e-Library', 'Air-Conditioned Soundproof Study Cubicles'],
  },
  {
    title: 'Advanced Clinical Skills & Simulation Laboratory',
    category: 'Academic',
    capacity: '50 Students per Session',
    description: 'Equipped with high-fidelity computer-controlled cardiopulmonary mannequins, laparoscopic procedural trainers, trauma resuscitation stations, and birthing simulators for hands-on preclinical mastery.',
    features: ['Adult & Pediatric SimMan High-Fidelity Robots', 'Virtual Reality Laparoscopic & Endoscopic Simulators', 'Advanced Cardiac Life Support (ACLS) Training Hub', 'Live Video Recording of Procedural Competencies'],
  },
  {
    title: '750+ Bedded Tertiary Care Teaching Hospital',
    category: 'Hospital',
    capacity: '750 Inpatient Beds',
    description: 'A NABH-accredited multi-specialty healthcare hub delivering subsidized round-the-clock healing to urban and rural populations while serving as the primary bedside clinical training ground.',
    features: ['12 Modular Operation Theatres with Laminar Airflow', '60-Bedded ICU, CCU, NICU and PICU Critical Care Suites', '24/7 Level-1 Emergency Trauma & Medico-Legal Center', 'Subsidized Inpatient Medicine and Free Generic Pharmacy'],
  },
  {
    title: 'On-Campus Hostels & Residential Quarters',
    category: 'Campus Life',
    capacity: '1,400 Boarders',
    description: 'Secure, modern residential towers for undergraduate boys, girls, intern doctors, and faculty staff featuring biometric card entry, continuous security surveillance, hygienic cafeterias, and high-speed Wi-Fi.',
    features: ['Twin-Sharing AC & Non-AC Rooms with Attached Baths', 'Hygienic Multicuisine Dining Hall with Dietician Supervision', 'High-Speed Optical Fiber Internet in every room', '24/7 Wardens, Guards, and CCTV Monitored Gated Perimeter'],
  },
  {
    title: 'Sports Complex, Gymnasium & Student Wellness',
    category: 'Campus Life',
    capacity: '1,000+ Participants',
    description: 'Holistic physical and mental health infrastructure including a full-sized football/cricket turf, floodlit basketball and tennis courts, badminton hall, modern gymnasium, and a dedicated Student Counseling Cell.',
    features: ['Full-Size Natural Grass Cricket & Football Ground', 'Indoor Sports Complex for Table Tennis & Badminton', 'Fully Equipped Strength Training Gymnasium', 'Confidential Medical Student Mental Health & Counseling Center'],
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'nw-1',
    slug: 'annual-national-medical-conference-medicon-2026',
    title: 'MedicaCare to Host National Critical Care & Emergency Symposium (MEDICON 2026)',
    date: '05 Oct 2026',
    category: 'Conference',
    author: 'Medical Education Unit',
    readTime: '4 min read',
    summary: 'Over 400 national and international intensivists and emergency medicine delegates will convene at the MMCH Auditorium to discuss breakthroughs in ECMO, trauma resuscitations, and sepsis protocols.',
    content: [
      'The Department of General Medicine and Emergency Care has announced MEDICON 2026, a 3-day CME-accredited national congress featuring hands-on ultrasound in trauma workshops and robotic surgical symposiums.',
      'Keynote addresses will be delivered by renowned critical care fellows from AIIMS New Delhi and PGIMER Chandigarh.',
      'Undergraduate and Postgraduate students will present 65 poster sessions and competitive clinical case papers with monetary awards.'
    ],
    tags: ['CME', 'Critical Care', 'Emergency Medicine', 'Medical Education'],
  },
  {
    id: 'nw-2',
    slug: 'free-multi-specialty-rural-health-camp-sunderbans',
    title: 'Community Medicine Outreach: 1,400 Villagers Treated in Rural Health Camp',
    date: '28 Sep 2026',
    category: 'Community Health Camp',
    author: 'Dept. of Community Medicine',
    readTime: '3 min read',
    summary: 'A team of 45 doctors, intern doctors and nursing students conducted a free 2-day health screening camp providing diagnostics, pediatric immunizations and free medicines.',
    content: [
      'Under the Rural Health Training Centre (RHTC) outreach program, faculty and interns screened over 1,400 patients for hypertension, diabetes, cataract, and malnutrition.',
      'Patients requiring cataract removals and surgical interventions were registered and transported to MMCH for completely free inpatient surgeries under the state Swasthya Sathi scheme.'
    ],
    tags: ['Public Health', 'Rural Outreach', 'Swasthya Sathi', 'Free Clinic'],
  },
  {
    id: 'nw-3',
    slug: 'icmr-grant-awarded-antimicrobial-resistance-study',
    title: 'MMCH Pathology & Micro Department Secures ₹85 Lakh ICMR Research Grant for AMR Study',
    date: '20 Sep 2026',
    category: 'Achievement',
    author: 'Research & Ethics Secretariat',
    readTime: '3 min read',
    summary: 'The Indian Council of Medical Research (ICMR) has approved a multi-centric genomics study on multidrug-resistant Klebsiella and Acinetobacter strains led by Dr. Kalyan Bhattacharya.',
    content: [
      'The three-year research project will involve whole-genome sequencing to track hospital-acquired resistant strains across eastern India.',
      'This grant enables the addition of Next-Generation Sequencing (NGS) facilities to the Central Research Laboratory.'
    ],
    tags: ['ICMR Grant', 'AMR', 'Genomics', 'Medical Research'],
  },
  {
    id: 'nw-4',
    slug: 'inauguration-robotic-laparoscopy-unit-general-surgery',
    title: 'State-of-the-Art Robotic Surgical System Commissioned in Modular OT 4',
    date: '12 Sep 2026',
    category: 'Hospital Update',
    author: 'Hospital Superintendent',
    readTime: '4 min read',
    summary: 'MMCH becomes one of the premier teaching institutions in the region to incorporate robotic console-assisted minimally invasive surgery for complex oncology and urology cases.',
    content: [
      'Prof. (Dr.) Arup Mukherjee and the surgical oncology team successfully conducted the first 4 robotic radical prostatectomies and pelvic lymph node dissections with zero complications.',
      'PG surgical residents will receive simulation console training as part of their advanced laparoscopy curriculum.'
    ],
    tags: ['Robotic Surgery', 'Modular OT', 'Advanced Laparoscopy', 'Hospital Tech'],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Main Academic Block & Central Administrative Tower',
    category: 'Campus',
    caption: 'Front facade of the 52-acre green eco-campus featuring lecture halls and administrative offices.',
    year: '2026',
  },
  {
    id: 'g-2',
    title: 'Modular Operation Theatre Suite (Laminar Flow OT-2)',
    category: 'Hospital & OTs',
    caption: 'HEPA-filtered class 100 laminar airflow surgical suite during a live laparoscopy demonstration.',
    year: '2026',
  },
  {
    id: 'g-3',
    title: 'Central Air-Conditioned Dissection Hall',
    category: 'Academics & Labs',
    caption: 'First-year MBBS batch attending osteology and cadaveric dissection under faculty guidance.',
    year: '2025',
  },
  {
    id: 'g-4',
    title: '3.0 Tesla High-Field MRI Diagnostics Console',
    category: 'Hospital & OTs',
    caption: 'Chief radiologist reviewing high-resolution neurological sequences in the Radio-Diagnosis Department.',
    year: '2026',
  },
  {
    id: 'g-5',
    title: 'Level-III Neonatal Intensive Care Unit (NICU)',
    category: 'Hospital & OTs',
    caption: '20-bedded tertiary neonatal incubator unit providing 24/7 surfactant therapy and radiant warming.',
    year: '2026',
  },
  {
    id: 'g-6',
    title: 'Advanced Clinical Simulation Lab (SimMan 3G)',
    category: 'Academics & Labs',
    caption: 'Final-year MBBS students practicing cardiac resuscitation and endotracheal intubation on robotic simulators.',
    year: '2025',
  },
  {
    id: 'g-7',
    title: 'Annual Hippocratic Oath & White Coat Ceremony',
    category: 'Convocation',
    caption: 'Incoming MBBS batch reciting the Declaration of Geneva and donning white coats in the presence of dignitaries.',
    year: '2025',
  },
  {
    id: 'g-8',
    title: 'Inter-College Annual Sports Meet (PULSE 2026)',
    category: 'Events & Sports',
    caption: 'Football tournament finals under floodlights at the MMCH Central Sports Arena.',
    year: '2026',
  },
  {
    id: 'g-9',
    title: 'Central Digital Library & E-Learning Terminal Hub',
    category: 'Campus',
    caption: 'Students accessing international medical journals and PubMed resources in the night reading hall.',
    year: '2026',
  },
];
