'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { api, useAuth } from '../../PortalShell';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  attachment?: {
    name: string;
    size: string;
    type: 'pdf' | 'img';
  };
}

interface ChatThread {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  activePatient?: string;
  messages: Message[];
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');

  const loadMessages = () => {
    api('clinical/messages')
      .then((res: any) => {
        if (res?.threads) {
          const threadList: ChatThread[] = res.threads.map((t: any) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            department: t.department,
            avatar: t.avatar || '/images/doctor-placeholder.svg',
            online: t.status === 'online',
            unreadCount: t.unread || 0,
            lastMessage: '',
            lastTime: '',
            activePatient: t.role?.includes('HOD') ? 'Rameshwar Roy (Bed #304)' : undefined,
            messages: [],
          }));

          if (res.messages && Array.isArray(res.messages)) {
            res.messages.forEach((m: any) => {
              const target = threadList.find((th) => th.id === m.threadId);
              if (target) {
                const isMe = m.sender === 'Me' || m.sender === 'You';
                const msgObj: Message = {
                  id: m.id,
                  senderId: isMe ? 'me' : m.sender,
                  senderName: m.sender,
                  text: m.text,
                  timestamp: m.time,
                  isMe,
                };
                target.messages.push(msgObj);
                target.lastMessage = m.text;
                target.lastTime = m.time;
              }
            });
          }

          setThreads(threadList);
          if (threadList.length > 0 && !activeThreadId) {
            setActiveThreadId(threadList[0].id);
          }
        }
      })
      .catch((err) => console.error('Failed to load messages', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeThreadId) return;

    const currentText = inputText.trim();
    setInputText('');

    try {
      const res = await api(
        'clinical/messages',
        'POST',
        {
          threadId: activeThreadId,
          text: currentText,
          priority,
        },
        user?.csrf
      );

      if (res?.message) {
        const newMsg: Message = {
          id: res.message.id,
          senderId: 'me',
          senderName: 'Me',
          text: res.message.text,
          timestamp: res.message.time,
          isMe: true,
        };

        setThreads((prev) =>
          prev.map((t) => {
            if (t.id === activeThreadId) {
              return {
                ...t,
                lastMessage: newMsg.text,
                lastTime: newMsg.timestamp,
                messages: [...t.messages, newMsg],
              };
            }
            return t;
          })
        );
      } else {
        loadMessages();
      }
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q)
    );
  });

  return (
    <Box>
      {/* ─── Breadcrumbs & Header ─── */}
      <Box sx={{ mb: 2.5 }}>
        <Breadcrumbs sx={{ fontSize: '0.8125rem', mb: 0.5 }}>
          <Link underline="hover" color="inherit" href="/portal/dashboard">
            Communication
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            Staff Messages
          </Typography>
        </Breadcrumbs>
        <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2, mb: 0.5 }}>
          Clinical Staff Messaging &amp; Consult Dispatch
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '0.925rem', lineHeight: 1.5 }}>
          Real-time secure inter-departmental consultation channels, STAT clinical dispatch, and on-duty medical staff coordination.
        </Typography>
      </Box>

      {/* Main Messenger Box */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
          height: 'calc(100vh - 220px)',
          minHeight: 560,
          display: 'flex',
        }}
      >
          {/* Left Column: Thread List */}
          <Box
            sx={{
              width: { xs: '100%', md: 360, lg: 400 },
              borderRight: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#FAFCFD',
            }}
          >
            {/* Header */}
            <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  Clinical Consults
                </Typography>
                <Chip size="small" label="Live Staff" sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 800, fontSize: '0.6875rem' }} />
              </Stack>

              <TextField
                fullWidth
                size="small"
                placeholder="Search doctors, nursing, departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* List */}
            <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredThreads.map((thread) => {
                const isSelected = thread.id === activeThreadId;
                return (
                  <ListItem
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setThreads((prev) =>
                        prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
                      );
                    }}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #F1F5F9',
                      bgcolor: isSelected ? '#F0FDFA' : '#FFFFFF',
                      borderLeft: isSelected ? '4px solid #0F766E' : '4px solid transparent',
                      transition: 'all 0.15s',
                      '&:hover': { bgcolor: isSelected ? '#F0FDFA' : '#F8FAFC' },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        mr: 1.8,
                        '& .MuiBadge-badge': {
                          bgcolor: thread.online ? '#10B981' : '#94A3B8',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          border: '2px solid #FFFFFF',
                        },
                      }}
                    >
                      <Avatar src={thread.avatar} alt={thread.name} sx={{ width: 44, height: 44, border: '1.5px solid #E2E8F0' }} />
                    </Badge>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {thread.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8', flexShrink: 0 }}>
                          {thread.lastTime}
                        </Typography>
                      </Stack>

                      <Typography sx={{ fontSize: '0.72rem', color: '#0F766E', fontWeight: 700, mb: 0.4 }}>
                        {thread.department}
                      </Typography>

                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', pr: 1 }}>
                          {thread.lastMessage}
                        </Typography>
                        {thread.unreadCount > 0 && (
                          <Chip size="small" label={thread.unreadCount} sx={{ height: 18, minWidth: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#0F766E', color: '#FFFFFF' }} />
                        )}
                      </Stack>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Right Column: Chat Pane */}
          {activeThread ? (
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', bgcolor: '#FFFFFF' }}>
            {/* Chat Pane Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', bgcolor: '#FAFCFD', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Avatar src={activeThread.avatar} alt={activeThread.name} sx={{ width: 42, height: 42, border: '1.5px solid #0F766E' }} />
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                      {activeThread.name}
                    </Typography>
                    {activeThread.online ? (
                      <Chip label="Online" size="small" sx={{ height: 18, fontSize: '0.625rem', bgcolor: '#ECFDF5', color: '#059669', fontWeight: 800 }} />
                    ) : (
                      <Chip label="Offline" size="small" sx={{ height: 18, fontSize: '0.625rem', bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700 }} />
                    )}
                  </Stack>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {activeThread.role} • <strong>{activeThread.department}</strong>
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {activeThread.activePatient && (
                  <Chip
                    icon={<LocalHospitalIcon sx={{ fontSize: '14px !important', color: '#0F766E !important' }} />}
                    label={`Case: ${activeThread.activePatient}`}
                    size="small"
                    sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 700, border: '1px solid #99F6E4' }}
                  />
                )}
                <Tooltip title="Audio Consultation">
                  <IconButton size="small" sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F766E' }}>
                    <PhoneInTalkIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Tele-Medicine Video">
                  <IconButton size="small" sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F766E' }}>
                    <VideocamIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            {/* Message Stream */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeThread.messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      bgcolor: msg.isMe ? '#0F766E' : '#FFFFFF',
                      color: msg.isMe ? '#FFFFFF' : '#0F172A',
                      boxShadow: msg.isMe ? '0 4px 12px rgba(15,118,110,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                      border: msg.isMe ? 'none' : '1px solid #E2E8F0',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.5, color: msg.isMe ? '#FFFFFF !important' : '#0F172A' }}>
                      {msg.text}
                    </Typography>

                    {/* Attachment preview if any */}
                    {msg.attachment && (
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 1.5,
                          p: 1.2,
                          borderRadius: '8px',
                          bgcolor: msg.isMe ? 'rgba(255,255,255,0.15)' : '#F1F5F9',
                          border: msg.isMe ? '1px solid rgba(255,255,255,0.3)' : '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <FolderSharedIcon sx={{ color: msg.isMe ? '#FFFFFF' : '#0F766E' }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: msg.isMe ? '#FFFFFF' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {msg.attachment.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: msg.isMe ? 'rgba(255,255,255,0.8)' : '#64748B' }}>
                            {msg.attachment.size} • PDF Document
                          </Typography>
                        </Box>
                      </Paper>
                    )}
                  </Box>

                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5, px: 0.5 }}>
                    <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{msg.timestamp}</Typography>
                    {msg.isMe && <DoneAllIcon sx={{ fontSize: 14, color: '#0F766E' }} />}
                  </Stack>
                </Box>
              ))}
            </Box>

            {/* Input Composer */}
            <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1.2, alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Clinical Priority:</Typography>
                <Chip
                  size="small"
                  label="Routine"
                  onClick={() => setPriority('routine')}
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    bgcolor: priority === 'routine' ? '#0F766E' : '#F1F5F9',
                    color: priority === 'routine' ? '#FFFFFF !important' : '#475569',
                  }}
                />
                <Chip
                  size="small"
                  label="Urgent (30m)"
                  onClick={() => setPriority('urgent')}
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    bgcolor: priority === 'urgent' ? '#EA580C' : '#F1F5F9',
                    color: priority === 'urgent' ? '#FFFFFF !important' : '#475569',
                  }}
                />
                <Chip
                  size="small"
                  label="STAT Code Blue"
                  onClick={() => setPriority('stat')}
                  sx={{
                    height: 22,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    bgcolor: priority === 'stat' ? '#DC2626' : '#F1F5F9',
                    color: priority === 'stat' ? '#FFFFFF !important' : '#475569',
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type clinical consultation note or prescription advice... (Press Enter to Send)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Attach Medical Record / Scan">
                            <IconButton size="small" sx={{ color: '#64748B' }}>
                              <AttachFileIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  sx={{
                    height: 40,
                    minWidth: 44,
                    px: 2,
                    bgcolor: priority === 'stat' ? '#DC2626' : priority === 'urgent' ? '#EA580C' : '#0F766E',
                    '&:hover': { bgcolor: priority === 'stat' ? '#B91C1C' : '#115E59' },
                  }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Stack>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, color: '#64748B' }}>
            <Typography sx={{ fontWeight: 600 }}>Loading clinical consultation channels...</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
}
