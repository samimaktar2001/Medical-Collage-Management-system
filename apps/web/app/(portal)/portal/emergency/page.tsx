'use client';

import GenericModulePage from '../../GenericModulePage';
import EmergencyIcon from '@mui/icons-material/Emergency';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export default function EmergencyPage() {
  return (
    <GenericModulePage
      category="Hospital"
      title="Emergency &amp; Trauma Centre (24x7)"
      description="Triage categorization (Red/Yellow/Green), resuscitation bays, ambulance reception and acute surgical referrals."
      addModalTitle="Emergency Casualty"
      addFields={[
        { id: 'patientName', label: 'Patient Name' },
        { id: 'triage', label: 'Triage Priority (Red / Yellow / Green)' },
        { id: 'chiefComplaint', label: 'Chief Complaint' },
        { id: 'cmo', label: 'CMO Incharge' },
      ]}
      kpis={[
        { title: 'Emergency Admissions (24h)', value: '18', trend: 12, icon: <EmergencyIcon sx={{ fontSize: 20 }} />, color: { bg: '#FEF2F2', icon: '#DC2626' } },
        { title: 'Trauma Resuscitations', value: '4', icon: <FlashOnIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
        { title: 'Emergency Beds Free', value: '8 / 20', icon: <AirlineSeatFlatIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Ambulances on Standby', value: '5', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
      ]}
      columns={[
        { id: 'erNo', label: 'ER Case #' },
        { id: 'patientName', label: 'Patient Name' },
        { id: 'triage', label: 'Triage Level' },
        { id: 'chiefComplaint', label: 'Chief Complaint' },
        { id: 'cmo', label: 'CMO Doctor' },
        { id: 'time', label: 'Arrival Time' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', erNo: 'ER-401', patientName: 'Sudhir Chakraborty', triage: 'Red (Critical)', chiefComplaint: 'Acute Myocardial Infarction', cmo: 'Dr. Tanvir Hasan', time: '10:14 AM', status: 'Active' },
        { id: '2', erNo: 'ER-402', patientName: 'Alok Roy', triage: 'Yellow (Urgent)', chiefComplaint: 'Right Femur Fracture (RTA)', cmo: 'Dr. Shakib Khan', time: '09:48 AM', status: 'Active' },
        { id: '3', erNo: 'ER-403', patientName: 'Meena Sharma', triage: 'Green (Stable)', chiefComplaint: 'Acute Abdominal Colic', cmo: 'Dr. Farhana Yasmin', time: '08:30 AM', status: 'Completed' },
      ]}
    />
  );
}
