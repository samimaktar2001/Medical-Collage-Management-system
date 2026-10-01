'use client';

import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { SxProps, Theme } from '@mui/material/styles';

export interface MedoraDatePickerProps {
  label: string;
  value: string | null | undefined; // Expects ISO string 'YYYY-MM-DD' or empty string
  onChange: (dateStr: string) => void;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs | string;
  maxDate?: Dayjs | string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  onErrorChange?: (error: string | null) => void;
  sx?: SxProps<Theme>;
  name?: string;
  id?: string;
}

/**
 * Medora Themed DatePicker
 * Replaces native unstyled browser <input type="date" />.
 * Matches Medora clinical design system (Teal #0F766E, DD-MM-YYYY format, Clear/Today actions).
 * Supports disableFuture (e.g. Date of Birth) and disablePast (e.g. Appointments).
 * Automatically validates and displays inline error messages.
 */
export function MedoraDatePicker({
  label,
  value,
  onChange,
  required = false,
  fullWidth = true,
  size = 'small',
  disabled = false,
  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
  placeholder = 'dd-mm-yyyy',
  error = false,
  helperText,
  onErrorChange,
  sx,
  name,
  id,
}: MedoraDatePickerProps) {
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const parsedValue: Dayjs | null = value ? dayjs(value) : null;
  const parsedMin: Dayjs | undefined = minDate
    ? typeof minDate === 'string'
      ? dayjs(minDate)
      : minDate
    : undefined;
  const parsedMax: Dayjs | undefined = maxDate
    ? typeof maxDate === 'string'
      ? dayjs(maxDate)
      : maxDate
    : undefined;

  // Contextual date validation effect
  React.useEffect(() => {
    let err: string | null = null;
    if (value) {
      const d = dayjs(value);
      if (!d.isValid()) {
        err = 'Please enter a valid date (DD-MM-YYYY).';
      } else {
        const today = dayjs().startOf('day');
        if (disableFuture && d.isAfter(today, 'day')) {
          err = 'Date cannot be in the future.';
        } else if (disablePast && d.isBefore(today, 'day')) {
          err = 'Date cannot be in the past.';
        }
      }
    }
    setInternalError(err);
    onErrorChange?.(err);
  }, [value, disableFuture, disablePast, onErrorChange]);

  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue || !newValue.isValid()) {
      onChange('');
    } else {
      onChange(newValue.format('YYYY-MM-DD'));
    }
  };

  const handlePickerError = (reason: any) => {
    let err: string | null = null;
    if (reason === 'disableFuture' || reason === 'maxDate') {
      err = 'Date cannot be in the future.';
    } else if (reason === 'disablePast' || reason === 'minDate') {
      err = 'Date cannot be in the past.';
    } else if (reason === 'invalidDate') {
      err = 'Please enter a valid date (DD-MM-YYYY).';
    }
    setInternalError(err);
    onErrorChange?.(err);
  };

  const isError = error || !!internalError;
  const displayHelper = helperText || internalError || undefined;

  return (
    <DatePicker
      value={parsedValue}
      onChange={handleChange}
      onError={handlePickerError}
      format="DD-MM-YYYY"
      disableFuture={disableFuture}
      disablePast={disablePast}
      minDate={parsedMin}
      maxDate={parsedMax}
      disabled={disabled}
      slots={{
        openPickerIcon: CalendarTodayOutlinedIcon,
      }}
      slotProps={{
        actionBar: {
          actions: ['clear', 'today'],
        },
        textField: {
          id,
          name,
          fullWidth,
          size,
          error: isError,
          helperText: displayHelper,
          label: label ? (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              {label}
              {required && (
                <Typography
                  component="span"
                  sx={{ color: '#DC2626', ml: 0.5, fontWeight: 700 }}
                >
                  *
                </Typography>
              )}
            </Box>
          ) : undefined,
          slotProps: {
            inputLabel: {
              shrink: true,
              sx: {
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: isError ? '#DC2626' : '#64748B',
                bgcolor: '#FFFFFF',
                px: 0.5,
                zIndex: 1,
                transform: 'translate(14px, -9px) scale(0.75)',
                '&.Mui-focused': {
                  color: isError ? '#DC2626' : '#0F766E',
                },
              },
            },
            formHelperText: {
              sx: {
                color: isError ? '#DC2626 !important' : '#64748B',
                fontSize: '0.75rem',
                fontWeight: 600,
                mt: 0.5,
              },
            },
          },
          sx: {
            '& .MuiOutlinedInput-root': {
              height: size === 'small' ? 40 : 48,
              minHeight: size === 'small' ? 40 : 48,
              borderRadius: '8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              bgcolor: '#FFFFFF',
              boxSizing: 'border-box',
              transition: 'all 0.15s ease',
              '& .MuiOutlinedInput-input': {
                padding: size === 'small' ? '8.5px 14px' : '12px 14px',
                height: 'auto',
                boxSizing: 'border-box',
                fontSize: '0.875rem',
              },
              '& .MuiInputAdornment-root': {
                height: 'auto',
                maxHeight: 'none',
                '& .MuiIconButton-root': {
                  padding: size === 'small' ? '4px' : '6px',
                  color: '#0F766E',
                  marginRight: size === 'small' ? '-2px' : '0px',
                  '&:hover': {
                    bgcolor: '#F0FDFA',
                  },
                },
              },
              '& fieldset': {
                borderColor: isError ? '#DC2626' : '#CBD5E1',
              },
              '&:hover fieldset': {
                borderColor: isError ? '#DC2626' : '#0F766E',
              },
              '&.Mui-focused fieldset': {
                borderColor: isError ? '#DC2626' : '#0F766E',
                borderWidth: '2px',
              },
              '& .MuiSvgIcon-root': {
                color: '#0F766E',
                fontSize: size === 'small' ? 12 : 16,
              },
            },
            ...sx,
          },
        },
      }}
    />
  );
}

export default MedoraDatePicker;
