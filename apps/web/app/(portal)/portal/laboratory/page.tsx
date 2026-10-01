'use client';

import GenericModulePage from '../../GenericModulePage';
import ScienceIcon from '@mui/icons-material/Science';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import BiotechIcon from '@mui/icons-material/Biotech';

export default function LaboratoryPage() {
  return (
    <GenericModulePage
      category="Hospital"
      title="Pathology &amp; Central Diagnostic Laboratory"
      description="Biochemistry, Hematology, Microbiology, Clinical Pathology sample barcoding and test reports."
      addModalTitle="Lab Requisition"
      addFields={[
        { id: 'patientName', label: 'Patient Name' },
        { id: 'testName', label: 'Investigation Test' },
        { id: 'sampleType', label: 'Sample (Blood / Urine / CSF / Tissue)' },
        { id: 'referredBy', label: 'Referred By Doctor' },
      ]}
      kpis={[
        { title: 'Tests Conducted (Today)', value: '214', trend: 20, icon: <ScienceIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Reports Authorized', value: '182', trend: 18, icon: <AssignmentTurnedInIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Samples in Processing', value: '32', icon: <HourglassTopIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
        { title: 'Automated Analyzers', value: '8 Units', icon: <BiotechIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
      ]}
      columns={[
        { id: 'sampleId', label: 'Barcode / Sample' },
        { id: 'patientName', label: 'Patient Name' },
        { id: 'testName', label: 'Test Investigation' },
        { id: 'sampleType', label: 'Sample' },
        { id: 'technician', label: 'Lab Officer' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', sampleId: 'LAB-9042', patientName: 'Rahim Ahmed', testName: 'Complete Blood Count (CBC) + ESR', sampleType: 'Whole Blood EDTA', technician: 'M. Hossain', status: 'Completed' },
        { id: '2', sampleId: 'LAB-9043', patientName: 'Sudhir Chakraborty', testName: 'Cardiac Enzymes (Troponin-I, CK-MB)', sampleType: 'Serum', technician: 'S. Paul', status: 'Completed' },
        { id: '3', sampleId: 'LAB-9044', patientName: 'Kavita Das', testName: 'Liver Function Test (LFT) + Lipid Profile', sampleType: 'Serum', technician: 'M. Hossain', status: 'Active' },
      ]}
    />
  );
}
