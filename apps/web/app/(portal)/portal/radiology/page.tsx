'use client';

import GenericModulePage from '../../GenericModulePage';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

export default function RadiologyPage() {
  return (
    <GenericModulePage
      category="Hospital"
      title="Radiology &amp; Imaging Sciences"
      description="3T MRI, 128-Slice MDCT, Digital X-Ray, High-Resolution Ultrasound, PACS image archive and reports."
      addModalTitle="Imaging Scan"
      addFields={[
        { id: 'patientName', label: 'Patient Name' },
        { id: 'modality', label: 'Modality (MRI / CT / USG / X-Ray)' },
        { id: 'region', label: 'Anatomical Region (Brain / Chest / Abdomen)' },
        { id: 'radiologist', label: 'Reporting Radiologist' },
      ]}
      kpis={[
        { title: 'Scans Done (Today)', value: '87', trend: 15, icon: <CameraAltIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'PACS Images Archived', value: '450 GB', icon: <ViewInArIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Reports Verified', value: '72', trend: 12, icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Modalities Active', value: '6 Suites', icon: <MedicalServicesIcon sx={{ fontSize: 20 }} />, color: { bg: '#FAF5FF', icon: '#7C3AED' } },
      ]}
      columns={[
        { id: 'scanId', label: 'Scan Requisition' },
        { id: 'patientName', label: 'Patient Name' },
        { id: 'modality', label: 'Modality' },
        { id: 'region', label: 'Region / Study' },
        { id: 'radiologist', label: 'Radiologist' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', scanId: 'RAD-301', patientName: 'Alok Roy', modality: 'Digital X-Ray', region: 'Right Femur (AP & Lat)', radiologist: 'Dr. S. K. Sen', status: 'Completed' },
        { id: '2', scanId: 'RAD-302', patientName: 'Sudhir Chakraborty', modality: '128-Slice CT', region: 'HRCT Chest (Angio)', radiologist: 'Dr. S. K. Sen', status: 'Completed' },
        { id: '3', scanId: 'RAD-303', patientName: 'Sultana Begum', modality: 'USG', region: 'Whole Abdomen & Pelvis', radiologist: 'Dr. P. Roy', status: 'Active' },
      ]}
    />
  );
}
