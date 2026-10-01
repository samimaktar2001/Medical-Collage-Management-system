'use client';

import GenericModulePage from '../../GenericModulePage';
import InventoryIcon from '@mui/icons-material/Inventory';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function InventoryPage() {
  return (
    <GenericModulePage
      category="Administration"
      title="Biomedical Equipment &amp; Hospital Assets"
      description="Track diagnostic machines, surgical sets, hospital beds, oxygen plants and biomedical maintenance (AMC/CMC)."
      addModalTitle="Asset / Equipment"
      addFields={[
        { id: 'itemName', label: 'Equipment / Asset Name' },
        { id: 'department', label: 'Department / Location' },
        { id: 'model', label: 'Manufacturer & Model' },
        { id: 'serialNo', label: 'Serial Number' },
      ]}
      kpis={[
        { title: 'Total Capital Assets', value: '1,450', icon: <InventoryIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Operational & Certified', value: '1,418', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Under Maintenance (AMC)', value: '32', icon: <WarningAmberIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
        { title: 'Biomedical Life Support', value: '84 Units', icon: <MedicalInformationIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
      ]}
      columns={[
        { id: 'assetId', label: 'Asset Tag' },
        { id: 'name', label: 'Equipment Name' },
        { id: 'department', label: 'Department / Location' },
        { id: 'manufacturer', label: 'Manufacturer' },
        { id: 'lastService', label: 'Last Calibration' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', assetId: 'EQ-MRI-01', name: '3.0 Tesla Magnetom MRI Scanner', department: 'Radiology Suite 1', manufacturer: 'Siemens Healthineers', lastService: '12 Aug 2025', status: 'Active' },
        { id: '2', assetId: 'EQ-VENT-04', name: 'ICU Servo-air Ventilator', department: 'ICU Bed 04', manufacturer: 'Getinge', lastService: '01 Sep 2025', status: 'Active' },
        { id: '3', assetId: 'EQ-ANAES-02', name: 'Workstation Anesthesia Delivery System', department: 'OT 2', manufacturer: 'Dräger', lastService: '18 Aug 2025', status: 'Active' },
      ]}
    />
  );
}
