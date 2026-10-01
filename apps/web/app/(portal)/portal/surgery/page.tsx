'use client';

import GenericModulePage from '../../GenericModulePage';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function SurgeryPage() {
  return (
    <GenericModulePage
      category="Hospital"
      title="Operation Theatres &amp; Surgical Complex"
      description="Major and minor OT bookings, pre-anesthetic clearance (PAC), surgical safety checklists and recovery unit."
      addModalTitle="Surgical Procedure"
      addFields={[
        { id: 'patientName', label: 'Patient Name' },
        { id: 'procedure', label: 'Surgical Procedure' },
        { id: 'otSuite', label: 'OT Suite (OT 1 to 8)' },
        { id: 'leadSurgeon', label: 'Lead Surgeon' },
        { id: 'anesthetist', label: 'Anesthetist' },
      ]}
      kpis={[
        { title: 'Surgeries Scheduled (Today)', value: '14', trend: 6, icon: <MonitorHeartIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Completed Successfully', value: '9', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Active In Operation', value: '3', icon: <AccessTimeIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
        { title: 'Modular OT Suites', value: '8 Suites', icon: <MeetingRoomIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
      ]}
      columns={[
        { id: 'otCase', label: 'OT Case #' },
        { id: 'patientName', label: 'Patient' },
        { id: 'procedure', label: 'Procedure' },
        { id: 'otSuite', label: 'OT Suite' },
        { id: 'leadSurgeon', label: 'Lead Surgeon' },
        { id: 'anesthetist', label: 'Anesthetist' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', otCase: 'OT-701', patientName: 'Alok Roy', procedure: 'Open Reduction & Internal Fixation (ORIF)', otSuite: 'OT-3 (Ortho)', leadSurgeon: 'Dr. Shakib Khan', anesthetist: 'Dr. R. Bose', status: 'Active' },
        { id: '2', otCase: 'OT-702', patientName: 'Rashida Khatun', procedure: 'Laparoscopic Cholecystectomy', otSuite: 'OT-1 (General)', leadSurgeon: 'Dr. K. S. Mukherjee', anesthetist: 'Dr. A. Sen', status: 'Completed' },
      ]}
    />
  );
}
