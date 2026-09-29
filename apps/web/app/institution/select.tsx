'use client';
import { useId, useState } from 'react';
import CustomSelect from '../custom-select';
export default function CollegeSelect({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue: string;
}) {
  const id = useId();
  const [value, setValue] = useState(options.includes(defaultValue) ? defaultValue : options[0]);
  return (
    <div className="college-select-field">
      <label htmlFor={id}>{label}</label>
      <CustomSelect
        id={id}
        label={label}
        name={name}
        options={options.map((value) => ({ value, label: value }))}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}
