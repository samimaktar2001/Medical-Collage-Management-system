'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
const destinations = [
  ['Home', '/institution'],
  ['About', '/institution/about'],
  ['Academics', '/institution/programmes'],
  ['Admissions', '/institution/admissions'],
  ['Departments', '/institution/departments'],
  ['Hospital', '/institution/hospital'],
  ['Research', '/institution/research'],
  ['Notices', '/institution/notices'],
  ['Student Services', '/institution/student-services'],
  ['Contact', '/institution/contact'],
];
export default function Navigation() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div
      className="college-nav"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          document.getElementById('college-menu-toggle')?.focus();
        }
      }}
    >
      <div className="college-width">
        <button
          id="college-menu-toggle"
          className="college-menu-toggle"
          aria-expanded={open}
          aria-controls="college-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />} {open ? 'Close menu' : 'Menu'}
        </button>
        <nav id="college-menu" aria-label="College navigation" className={open ? 'is-open' : ''}>
          {destinations.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
