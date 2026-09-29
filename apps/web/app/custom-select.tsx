'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState, type Ref } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type Option = { value: string; label: string };
export default function CustomSelect({
  id: suppliedId,
  label,
  name,
  options,
  value,
  onValueChange,
  onBlur,
  disabled,
  required,
  invalid,
  inputRef,
}: {
  id?: string;
  label: string;
  name?: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  inputRef?: Ref<HTMLButtonElement>;
}) {
  const generatedId = useId(),
    id = suppliedId || generatedId;
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0);
  const search = useRef({ text: '', time: 0 });
  const keyboardNavigation = useRef(true);
  const selected = options.find((option) => option.value === value);
  useLayoutEffect(() => {
    if (!open || !list.current || !trigger.current) return;
    const panel = list.current,
      rect = trigger.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const upward = below < 200 && above > below;
    const height = Math.min(280, Math.max(80, upward ? above : below));
    panel.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8))}px`;
    panel.style.width = `${Math.min(rect.width, window.innerWidth - 16)}px`;
    panel.style.maxHeight = `${height}px`;
    panel.style.top = upward ? 'auto' : `${rect.bottom + 6}px`;
    panel.style.bottom = upward ? `${window.innerHeight - rect.top + 6}px` : 'auto';
    panel.showPopover();
    return () => {
      if (panel.matches(':popover-open')) panel.hidePopover();
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const resize = () => setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', resize);
    };
  }, [open]);
  useEffect(() => {
    if (!open || !keyboardNavigation.current || !list.current) return;
    const option = document.getElementById(`${id}-option-${active}`);
    if (!option) return;
    const panel = list.current.getBoundingClientRect();
    const item = option.getBoundingClientRect();
    if (item.top < panel.top) list.current.scrollTop -= panel.top - item.top + 5;
    else if (item.bottom > panel.bottom) list.current.scrollTop += item.bottom - panel.bottom + 5;
  }, [open, active, id]);
  const choose = (index: number) => {
    if (!options[index]) return;
    onValueChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  };
  const begin = () => {
    keyboardNavigation.current = true;
    search.current = { text: '', time: 0 };
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  };
  return (
    <div
      className="custom-select"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          onBlur?.();
        }
      }}
    >
      {name && <input type="hidden" name={name} value={value} />}
      <button
        id={id}
        type="button"
        role="combobox"
        className="custom-select-trigger"
        aria-label={label}
        ref={(node) => {
          trigger.current = node;
          if (typeof inputRef === 'function') inputRef(node);
          else if (inputRef) inputRef.current = node;
        }}
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={invalid || undefined}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        disabled={disabled || !options.length}
        onClick={() => (open ? setOpen(false) : begin())}
        onKeyDown={(event) => {
          keyboardNavigation.current = true;
          if (event.key === 'Escape') {
            if (open) {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            }
            return;
          }
          if (event.key === 'Tab') {
            setOpen(false);
            return;
          }
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            if (!open) {
              begin();
              return;
            }
            setActive((previous) =>
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? options.length - 1
                  : (previous + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
                    options.length,
            );
          } else if (
            event.key === 'Enter' ||
            (event.key === ' ' && (!search.current.text || Date.now() - search.current.time > 700))
          ) {
            event.preventDefault();
            if (open) choose(active);
            else begin();
          } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            const now = Date.now();
            const term =
              (now - search.current.time > 700 ? '' : search.current.text) +
              event.key.toLowerCase();
            search.current = { text: term, time: now };
            let index = options.findIndex((option) => option.label.toLowerCase().startsWith(term));
            if (index < 0) {
              index = options.findIndex((option) =>
                option.label.toLowerCase().startsWith(event.key.toLowerCase()),
              );
              search.current.text = event.key.toLowerCase();
            }
            if (index >= 0) {
              setActive(index);
              setOpen(true);
            }
          }
        }}
      >
        <span>{selected?.label || 'Select…'}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      {open && (
        <ul
          ref={list}
          popover="manual"
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="custom-select-options"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              data-active={active === index}
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => {
                keyboardNavigation.current = false;
                setActive(index);
              }}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
