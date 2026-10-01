'use client';

import GenericModulePage from '../../GenericModulePage';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MedicationIcon from '@mui/icons-material/Medication';

export default function PharmacyPage() {
  return (
    <GenericModulePage
      category="Hospital"
      title="Central Hospital &amp; Retail Pharmacy"
      description="Inpatient prescription dispensing, drug inventory stock control, batch expiry alerts and generic formulary."
      addModalTitle="Medicine Dispense"
      addFields={[
        { id: 'patientName', label: 'Patient Name' },
        { id: 'drugName', label: 'Medicine / Dosage' },
        { id: 'quantity', label: 'Quantity' },
        { id: 'prescribedBy', label: 'Prescribing Doctor' },
      ]}
      kpis={[
        { title: 'Pharmacy Bills (Today)', value: '156', trend: 10, icon: <ReceiptLongIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Formulary Drugs Stocked', value: '1,840', icon: <MedicationIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Emergency Stock Alerts', value: '4 Low', trend: -2, icon: <WarningAmberIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
        { title: '24x7 Counter Revenue', value: '₹ 1.84L', trend: 8, icon: <LocalPharmacyIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
      ]}
      columns={[
        { id: 'billNo', label: 'Bill #' },
        { id: 'patientName', label: 'Patient' },
        { id: 'items', label: 'Prescribed Drugs' },
        { id: 'amount', label: 'Bill Amount' },
        { id: 'pharmacist', label: 'Pharmacist' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', billNo: 'PHARM-8201', patientName: 'Sudhir Chakraborty', items: 'Inj. Heparin, Tab. Clopidogrel 75mg (x10)', amount: '₹ 2,450', pharmacist: 'K. Das', status: 'Completed' },
        { id: '2', billNo: 'PHARM-8202', patientName: 'Rashida Khatun', items: 'Inj. Ceftriaxone 1g, Inj. Pantop 40mg', amount: '₹ 1,120', pharmacist: 'K. Das', status: 'Completed' },
        { id: '3', billNo: 'PHARM-8203', patientName: 'Mohammad Ali', items: 'Tab. Metformin 500mg, Tab. Telmisartan 40mg', amount: '₹ 680', pharmacist: 'M. Imran', status: 'Completed' },
      ]}
    />
  );
}
