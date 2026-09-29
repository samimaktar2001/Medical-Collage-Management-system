'use client';
import { Printer } from 'lucide-react';
export default function PrintButton() {
  return (
    <button className="college-print" onClick={() => window.print()}>
      <Printer size={16} /> Print page
    </button>
  );
}
