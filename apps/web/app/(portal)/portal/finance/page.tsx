'use client';

import GenericModulePage from '../../GenericModulePage';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function FinancePage() {
  return (
    <GenericModulePage
      category="Administration"
      title="Fees, Accounts &amp; Financial Ledger"
      description="Student tuition fees, hostel collections, hospital patient billing, vendor payments and audit trails."
      addModalTitle="Fee Invoice / Receipt"
      addFields={[
        { id: 'studentName', label: 'Student / Payer Name' },
        { id: 'type', label: 'Fee Category (Tuition / Hostel / Lab)' },
        { id: 'amount', label: 'Amount (₹)' },
        { id: 'mode', label: 'Payment Mode (Online / NEFT / Cash / DD)' },
      ]}
      kpis={[
        { title: 'Total Revenue (This Month)', value: '₹ 48,32,000', trend: 14, icon: <CurrencyRupeeIcon sx={{ fontSize: 20 }} />, color: { bg: '#F0FDFA', icon: '#0F766E' } },
        { title: 'Tuition Fees Collected', value: '₹ 38,50,000', trend: 12, icon: <AccountBalanceIcon sx={{ fontSize: 20 }} />, color: { bg: '#ECFDF5', icon: '#059669' } },
        { title: 'Invoices Paid', value: '1,420', icon: <ReceiptLongIcon sx={{ fontSize: 20 }} />, color: { bg: '#EFF6FF', icon: '#0284C7' } },
        { title: 'Outstanding Dues', value: '₹ 4,20,000', trend: -8, icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, color: { bg: '#FFFBEB', icon: '#D97706' } },
      ]}
      columns={[
        { id: 'invNo', label: 'Invoice #' },
        { id: 'payer', label: 'Payer / Student' },
        { id: 'category', label: 'Fee Category' },
        { id: 'amount', label: 'Amount' },
        { id: 'date', label: 'Transaction Date' },
        { id: 'mode', label: 'Payment Mode' },
        { id: 'status', label: 'Status' },
      ]}
      initialData={[
        { id: '1', invNo: 'INV-2025-901', payer: 'Rahim Ahmed (MC0001)', category: 'Annual Tuition & Lab Fees', amount: '₹ 4,50,000', date: '15 Aug 2025', mode: 'Online UPI/Card', status: 'Completed' },
        { id: '2', invNo: 'INV-2025-902', payer: 'Sadia Islam (MC0002)', category: 'Hostel & Mess Charges', amount: '₹ 60,000', date: '18 Aug 2025', mode: 'Net Banking', status: 'Completed' },
        { id: '3', invNo: 'INV-2025-903', payer: 'Tanvir Hasan (MC0003)', category: 'Annual Tuition (Year 2)', amount: '₹ 4,50,000', date: '20 Aug 2025', mode: 'Demand Draft', status: 'Completed' },
      ]}
    />
  );
}
