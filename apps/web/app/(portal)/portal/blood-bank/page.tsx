'use client';

import GenericModulePage from '../../GenericModulePage';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function BloodBankPage() {
  return (
    <GenericModulePage
      category="Hospital"
      title="Licensed Blood Centre &amp; Component Separation"
      description="Whole blood units, Packed Red Cells (PRBC), Platelet Concentrates (RDP/SDP), Fresh Frozen Plasma (FFP), and voluntary donor camps."
      addModalTitle="Donor Blood Unit"
      addFields={[
        { id: 'donorName', label: 'Donor Name' },
        { id: 'bloodGroup', label: 'Blood Group (A+, B+, O+, AB+, O-, etc.)' },
        { id: 'component', label: 'Component (PRBC / FFP / Platelets)' },
      ]}
      kpis={[
        { title: 'Total Blood Units in Stock', value: '418', trend: 8, icon: <BloodtypeIcon sx={{ fontSize: 20 }} />, color: { bg: '#FEF2F2', icon: '#DC2626' } },
        { title: 'PRBC Units Available', value: '184', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Platelet Packs (RDP)', value: '68', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Rare Negative Groups', value: '24 Units', trend: -4, icon: <WarningAmberIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
      ]}
      columns={[
        { id: 'unitId', label: 'Bag / Unit ID' },
        { id: 'bloodGroup', label: 'Blood Group' },
        { id: 'component', label: 'Component' },
        { id: 'donorName', label: 'Donor' },
        { id: 'collectedOn', label: 'Collection Date' },
        { id: 'expiryDate', label: 'Expiry Date' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', unitId: 'BLD-4012', bloodGroup: 'O Positive (O+)', component: 'PRBC (Packed Cells)', donorName: 'Voluntary Camp Donor', collectedOn: '24 Sep 2025', expiryDate: '29 Oct 2025', status: 'Available' },
        { id: '2', unitId: 'BLD-4013', bloodGroup: 'B Positive (B+)', component: 'Fresh Frozen Plasma (FFP)', donorName: 'A. K. Sharma', collectedOn: '20 Sep 2025', expiryDate: '20 Sep 2026', status: 'Available' },
        { id: '3', unitId: 'BLD-4014', bloodGroup: 'AB Negative (AB-)', component: 'PRBC', donorName: 'Emergency Replacement', collectedOn: '26 Sep 2025', expiryDate: '31 Oct 2025', status: 'Available' },
      ]}
    />
  );
}
