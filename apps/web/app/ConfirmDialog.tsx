'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

export interface ConfirmOptions {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info' | 'success';
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = (confirmed: boolean) => {
    if (dialogState) {
      dialogState.resolve(confirmed);
      setDialogState(null);
    }
  };

  const severity = dialogState?.options.severity || 'warning';

  const severityConfig = {
    warning: {
      color: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      confirmBg: '#D97706',
      confirmHover: '#B45309',
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 32, color: '#D97706' }} />,
    },
    error: {
      color: '#DC2626',
      bgColor: '#FEE2E2',
      borderColor: '#FECACA',
      confirmBg: '#DC2626',
      confirmHover: '#B91C1C',
      icon: <ErrorOutlineRoundedIcon sx={{ fontSize: 32, color: '#DC2626' }} />,
    },
    info: {
      color: '#0F766E',
      bgColor: '#CCFBF1',
      borderColor: '#99F6E4',
      confirmBg: '#0F766E',
      confirmHover: '#0D6861',
      icon: <InfoOutlinedIcon sx={{ fontSize: 32, color: '#0F766E' }} />,
    },
    success: {
      color: '#16A34A',
      bgColor: '#DCFCE7',
      borderColor: '#BBF7D0',
      confirmBg: '#16A34A',
      confirmHover: '#15803D',
      icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32, color: '#16A34A' }} />,
    },
  }[severity];

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialogState && (
        <Dialog
          open={dialogState.open}
          onClose={() => handleClose(false)}
          maxWidth="xs"
          fullWidth
          slotProps={{
            backdrop: {
              sx: {
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
              },
            },
            paper: {
              sx: {
                borderRadius: '16px',
                p: 1,
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)',
              },
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: severityConfig.bgColor,
                  border: `1px solid ${severityConfig.borderColor}`,
                  flexShrink: 0,
                }}
              >
                {severityConfig.icon}
              </Box>
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.125rem' }}>
                  {dialogState.options.title || 'Please Confirm'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, lineHeight: 1.5 }}>
                  {dialogState.options.message}
                </Typography>
              </Box>
            </Box>
          </Box>
          <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => handleClose(false)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                color: '#64748B',
                borderColor: '#E2E8F0',
                '&:hover': {
                  borderColor: '#CBD5E1',
                  bgcolor: '#F8FAFC',
                },
              }}
            >
              {dialogState.options.cancelText || 'Cancel'}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClose(true)}
              autoFocus
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: severityConfig.confirmBg,
                '&:hover': {
                  bgcolor: severityConfig.confirmHover,
                },
              }}
            >
              {dialogState.options.confirmText || 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
