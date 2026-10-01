'use client';
import CustomSelect from './custom-select';
import { roleDescriptions } from './role-descriptions';
import { useEffect, useId, useRef, useState, Suspense } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  Wallet,
  X,
  Bell,
  ExternalLink,
  Layers,
  Building2,
  SlidersHorizontal,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ResourceView } from './workflows';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';

export type Row = Record<string, any>;
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function api(
  path: string,
  method = 'GET',
  body?: unknown,
  csrf?: string,
  idempotencyKey?: string,
): Promise<any> {
  const r = await fetch(`/api/v1/${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'medora',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new APIError(
      r.ok ? 'Unexpected server response.' : `Server error (${r.status}).`,
      r.status,
    );
  }
  if (!r.ok) throw new APIError(data.error?.message || 'Unable to complete request.', r.status);
  return data;
}
export const money = (minor: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
export const shortDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
export const clockTime = (value: string) =>
  new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
export function Badge({ value }: { value: string }) {
  const tone =
    /^(Active|Verified|Finalized|Published|Approved|Paid|Completed|Present|Resolved|Eligible)/.test(
      value,
    )
      ? 'green'
      : /Rejected|Absent|Cancelled|Revoked/.test(value)
        ? 'red'
        : /Submitted|Pending|Verification|Clarification|Returned|Due|Provisional|Quarantined/.test(
              value,
            )
          ? 'amber'
          : 'slate';
  return <span className={`badge ${tone}`}>{value}</span>;
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
const navigation = [
  {
    section: 'WORKSPACE',
    items: [
      ['overview', 'Overview', LayoutDashboard, 'all'],
      ['applications', 'Admissions', ClipboardCheck, 'admin registrar dean'],
      [
        'students',
        'Student directory',
        Users,
        'admin registrar faculty dean student finance auditor',
      ],
    ],
  },
  {
    section: 'ACADEMICS',
    items: [
      ['sessions', 'Timetable & attendance', CalendarDays, 'admin registrar faculty dean student'],
      ['competencies', 'Curriculum', BookOpen, 'admin registrar faculty dean student'],
      ['assessments', 'Assessments', GraduationCap, 'admin faculty dean student'],
      ['learning', 'Learning resources', BookOpen, 'faculty dean student'],
      ['submissions', 'Assignments', ClipboardCheck, 'faculty dean student'],
      ['requests', 'Student requests', FileText, 'registrar dean student'],
      ['logbook', 'Clinical logbook', BookOpen, 'faculty dean student'],
      ['corrections', 'Attendance corrections', ClipboardCheck, 'faculty dean'],
    ],
  },
  {
    section: 'INSTITUTION',
    items: [
      ['invoices', 'Student fees', Wallet, 'finance dean student'],
      ['payments', 'Payment ledger', ArrowDownToLine, 'finance dean'],
      ['refunds', 'Refund requests', Wallet, 'finance dean'],
      ['content', 'Website & content', Layers, 'admin editor publisher'],
      ['notices', 'Noticeboard', Bell, 'all'],
      ['tickets', 'Helpdesk & concerns', HelpCircle, 'all'],
      ['documents', 'My documents', FileText, 'all'],
      ['evidence', 'Evidence workspace', ShieldCheck, 'admin dean auditor'],
      ['audit', 'Audit trail', Activity, 'admin dean auditor'],
      ['policies', 'Policy approvals', SlidersHorizontal, 'admin dean faculty registrar'],
      ['masters', 'Organization', Building2, 'admin dean faculty registrar'],
    ],
  },
];
export const viewNames: Record<string, string> = {
  learning: 'Learning resources',
  submissions: 'Assignments',
  requests: 'Student requests',
  overview: 'Overview',
  applications: 'Admissions',
  students: 'Student directory',
  sessions: 'Timetable & attendance',
  competencies: 'Curriculum',
  assessments: 'Assessments',
  logbook: 'Clinical logbook',
  corrections: 'Attendance corrections',
  invoices: 'Student fees',
  payments: 'Payment ledger',
  refunds: 'Refund requests',
  content: 'Website & content',
  notices: 'Noticeboard',
  tickets: 'Helpdesk & concerns',
  documents: 'My documents',
  evidence: 'Evidence workspace',
  audit: 'Audit trail',
  policies: 'Policy approvals',
  masters: 'Organization',
};
type AuthForm = {
  name?: string;
  institutionId?: string;
  email?: string;
  password?: string;
  token?: string;
};

function Login({ onLogin }: { onLogin: () => void }) {
  const searchParams = useSearchParams();
  const setupToken = searchParams.get('setup');
  const resetToken = searchParams.get('reset');
  
  const [mode, setMode] = useState<'login' | 'signup' | 'verify' | 'setup' | 'forgot' | 'reset'>(setupToken ? 'setup' : resetToken ? 'reset' : 'login'),
    [showPassword, setShowPassword] = useState(false),
    [busy, setBusy] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, clearErrors, control } = useForm<AuthForm>();
  
  const { data: instData } = useQuery({
    queryKey: ['public-institutions'],
    queryFn: () => api('public/institutions'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const onSubmit = async (data: AuthForm) => {
    setBusy(true);
    try {
      if (mode === 'login') {
        await api('auth/login', 'POST', { email: data.email, password: data.password });
        onLogin();
      } else if (mode === 'signup') {
        const res = await api('auth/signup', 'POST', { 
          name: data.name, email: data.email, password: data.password, institution_id: data.institutionId 
        });
        toast.success(res.message || 'Check your email for the verification token.');
        setMode('verify');
      } else if (mode === 'verify') {
        const res = await api('auth/verify-email', 'POST', { token: data.token });
        toast.success(res.message + ' You can now log in.');
        setMode('login');
      } else if (mode === 'setup') {
        const res = await api('auth/setup-password', 'POST', { token: setupToken || data.token, password: data.password });
        toast.success(res.message);
        setMode('login');
      } else if (mode === 'forgot') {
        const res = await api('auth/forgot-password', 'POST', { email: data.email });
        toast.success(res.message);
        setMode('login');
      } else if (mode === 'reset') {
        const res = await api('auth/reset-password', 'POST', { token: resetToken || data.token, password: data.password });
        toast.success(res.message);
        setMode('login');
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-story">
        <div className="brand">
          <span className="brand-mark">
            <Activity size={26} />
          </span>
          <span>
            medora<span className="brand-small">MEDICAL COLLEGE</span>
          </span>
        </div>
        <div>
          <span className="eyebrow">THE ACADEMIC WORKSPACE</span>
          <h1>Care begins<br />with learning.</h1>
          <p>A connected home for your college’s people, teaching and everyday decisions.</p>
          <div className="login-feature"><ShieldCheck /> Academic records, with accountable approvals.</div>
          <div className="login-feature"><BookOpen /> Teaching and evidence, in one place.</div>
        </div>
      </div>
      <main className="login-main">
        <h2>{mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : mode === 'setup' ? 'Set up account' : 'Verify Email'}</h2>
        <p>
          {mode === 'login' && 'Enter your email and password to access your workspace.'}
          {mode === 'signup' && 'Register for a new Medora account.'}
          {mode === 'verify' && 'Enter the 6-digit OTP sent to your email.'}
          {mode === 'setup' && 'Welcome! Please set a secure password for your new account.'}
          {mode === 'forgot' && 'Enter your email address to receive a password reset link.'}
          {mode === 'reset' && 'Please set a new secure password for your account.'}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="name">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="name" type="text" placeholder="E.g. Dr. Jane Doe" {...register('name', { required: 'Please provide your full name.' })} />
                {errors.name && <div className="inline-error">{errors.name.message}</div>}
              </div>
              <div>
                <label htmlFor="institution">Institution <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="institution" type="text" placeholder="E.g. Dhaka Medical College" {...register('institutionId', { required: 'Please provide your institution name.' })} />
                {errors.institutionId && <div className="inline-error">{errors.institutionId.message}</div>}
              </div>
            </>
          )}
          
          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <>
              <div>
                <label htmlFor="email">Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="email" type="email" placeholder="name@college.edu" {...register('email', { 
                  required: 'Please provide your email address.',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Please provide a valid email address.' }
                })} />
                {errors.email && <div className="inline-error">{errors.email.message}</div>}
              </div>
              
              {(mode === 'login' || mode === 'signup') && (
                <div>
                  <label htmlFor="password" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Password <span style={{ color: '#ef4444' }}>*</span></span>
                    {mode === 'login' && (
                      <button type="button" className="text-link" style={{ fontSize: '12px', marginBottom: 0 }} onClick={() => { setMode('forgot'); clearErrors(); }}>
                        Forgot password?
                      </button>
                    )}
                  </label>
                <div style={{ position: 'relative' }}>
                  <input id="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" {...register('password', { 
                    required: 'Password is required.',
                    minLength: mode === 'signup' ? { value: 8, message: 'Password must be at least 8 characters.' } : undefined
                  })} style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '0', bottom: '0', margin: 'auto', background: 'none', border: 'none', padding: 0, color: '#90c8bb', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="inline-error">{errors.password.message}</div>}
              </div>
              )}
            </>
          )}

          {mode === 'verify' && (
            <div>
              <label htmlFor="token">6-Digit OTP <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="token" type="text" placeholder="e.g. 123456" {...register('token', { 
                required: 'Please provide the OTP.',
                pattern: { value: /^\d{6}$/, message: 'OTP must be exactly 6 digits.' }
              })} maxLength={6} style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }} />
              {errors.token && <div className="inline-error">{errors.token.message}</div>}
            </div>
          )}

          {mode === 'setup' && (
            <>
              {!setupToken && (
                <div>
                  <label htmlFor="token">Setup Token <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="token" type="text" placeholder="Paste your token here" {...register('token', { required: 'Please provide the setup token.' })} />
                  {errors.token && <div className="inline-error">{errors.token.message}</div>}
                </div>
              )}
              <div>
                <label htmlFor="password">New Password <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" {...register('password', { 
                    required: 'Password is required.',
                    minLength: { value: 8, message: 'Password must be at least 8 characters.' }
                  })} style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '0', bottom: '0', margin: 'auto', background: 'none', border: 'none', padding: 0, color: '#90c8bb', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="inline-error">{errors.password.message}</div>}
              </div>
            </>
          )}

          {mode === 'reset' && (
            <>
              {!resetToken && (
                <div>
                  <label htmlFor="token">Reset Token <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="token" type="text" placeholder="Paste your reset token here" {...register('token', { required: 'Please provide the reset token.' })} />
                  {errors.token && <div className="inline-error">{errors.token.message}</div>}
                </div>
              )}
              <div>
                <label htmlFor="password">New Password <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" {...register('password', { 
                    required: 'Password is required.',
                    minLength: { value: 8, message: 'Password must be at least 8 characters.' }
                  })} style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '0', bottom: '0', margin: 'auto', background: 'none', border: 'none', padding: 0, color: '#90c8bb', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="inline-error">{errors.password.message}</div>}
              </div>
            </>
          )}
          
          <button className="primary full" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Sign up' : mode === 'setup' ? 'Set Password' : mode === 'reset' ? 'Reset Password' : mode === 'forgot' ? 'Send Reset Link' : 'Verify'}
            <ArrowRight size={18} />
          </button>
        </form>
        
        {(mode !== 'setup' && mode !== 'reset') && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            {mode === 'login' ? (
              <p>Don't have an account? <button type="button" className="text-link" onClick={() => { setMode('signup'); clearErrors(); }}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button type="button" className="text-link" onClick={() => { setMode('login'); clearErrors(); }}>Sign in</button></p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
function Overview({ me, navigate }: { me: Row; navigate: (view: string) => void }) {
  const query = useQuery({ queryKey: ['dashboard', me.id], queryFn: () => api('dashboard') });
  const sessions = useQuery({
    queryKey: ['upcoming', me.id],
    queryFn: () => api('sessions?limit=5'),
    enabled: ['admin', 'faculty', 'dean', 'student', 'registrar'].includes(me.role),
  });
  const d = query.data;
  if (!d)
    return (
      <div className="loading">{query.error?.message || 'Loading your authorized workspace…'}</div>
    );
  const stats = [
    ['Students', d.students, 'students', Users],
    ['Awaiting verification', d.applications, 'applications', ClipboardCheck],
    ['Logbook reviews', d.pending_logbook, 'logbook', BookOpen],
    ['Outstanding invoices', d.invoices, 'invoices', Wallet],
  ].filter((x) => x[1] !== null);
  return (
    <>
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            ACADEMIC YEAR{' '}
            {new Date().getMonth() >= 6
              ? `${new Date().getFullYear()}–${String(new Date().getFullYear() + 1).slice(2)}`
              : `${new Date().getFullYear() - 1}–${String(new Date().getFullYear()).slice(2)}`}
          </div>
          <h1>A clearer view of your college.</h1>
          <p>
            Welcome back, {me.name.replace('Dr. ', '').split(' ')[0]}. Here’s what needs your
            attention.
          </p>
          <p className="form-note">{roleDescriptions[me.role]}</p>
        </div>
        <span className="date-chip">
          <CalendarDays size={16} />
          {shortDate(new Date().toISOString())}
        </span>
      </div>
      <div className="stats-row">
        {stats.map(([label, value, view, Icon]) => {
          const I = Icon as typeof Users;
          return (
            <button className="stat" key={String(label)} onClick={() => navigate(String(view))}>
              <div>
                <span>{String(label)}</span>
                <I size={19} />
              </div>
              <strong>{value}</strong>
              <small>
                View records <ArrowRight size={14} />
              </small>
            </button>
          );
        })}
      </div>
      <div className="overview-grid">
        <div className="main-column">
          <section className="panel priority-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR NEXT STEPS</span>
                <h2>Keep things moving</h2>
              </div>
              <span className="small-tag">Action centre</span>
            </div>
            {['editor', 'publisher'].includes(me.role) && (
              <button className="task-row" onClick={() => navigate('content')}>
                <span className="task-icon teal-bg">
                  <Layers size={21} />
                </span>
                <span>
                  <strong>
                    {me.role === 'editor'
                      ? 'Manage website drafts'
                      : 'Review content for publication'}
                  </strong>
                  <small>
                    {me.role === 'editor'
                      ? 'Prepare pages and notices for independent review'
                      : 'Check submitted content before it becomes public'}
                  </small>
                </span>
                <ChevronRight size={18} />
              </button>
            )}
            {me.role === 'auditor' && (
              <button className="task-row" onClick={() => navigate('evidence')}>
                <span className="task-icon teal-bg">
                  <ShieldCheck size={21} />
                </span>
                <span>
                  <strong>Review institutional evidence</strong>
                  <small>Inspect frozen evidence and use the audit trail to trace changes</small>
                </span>
                <ChevronRight size={18} />
              </button>
            )}
            {d.applications !== null && (
              <button className="task-row" onClick={() => navigate('applications')}>
                <span className="task-icon amber-bg">
                  <ClipboardCheck size={21} />
                </span>
                <span>
                  <strong>Review admission applications</strong>
                  <small>{d.applications} submitted · verify allotment and eligibility</small>
                </span>
                <ChevronRight size={18} />
              </button>
            )}
            {d.pending_logbook !== null && (
              <button className="task-row" onClick={() => navigate('logbook')}>
                <span className="task-icon teal-bg">
                  <BookOpen size={21} />
                </span>
                <span>
                  <strong>
                    {me.role === 'student'
                      ? 'Track your competency evidence'
                      : 'Complete supervisor reviews'}
                  </strong>
                  <small>{d.pending_logbook} submissions awaiting a decision</small>
                </span>
                <ChevronRight size={18} />
              </button>
            )}
            {d.invoices !== null && (
              <button className="task-row" onClick={() => navigate('invoices')}>
                <span className="task-icon blue-bg">
                  <Wallet size={21} />
                </span>
                <span>
                  <strong>Review outstanding fees</strong>
                  <small>{d.invoices} invoices have an outstanding balance</small>
                </span>
                <ChevronRight size={18} />
              </button>
            )}
            <button className="task-row" onClick={() => navigate('tickets')}>
              <span className="task-icon violet-bg">
                <HelpCircle size={21} />
              </span>
              <span>
                <strong>Follow up on support requests</strong>
                <small>{d.tickets} open in your authorized scope</small>
              </span>
              <ChevronRight size={18} />
            </button>
          </section>
          {sessions.isEnabled && (
            <section className="panel">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">TEACHING & LEARNING</span>
                  <h2>Scheduled sessions</h2>
                </div>
                <button className="text-link" onClick={() => navigate('sessions')}>
                  View timetable <ArrowRight size={15} />
                </button>
              </div>
              <div className="schedule-list">
                {sessions.data?.items.map((s: Row) => (
                  <button key={s.id} className="schedule-row" onClick={() => navigate('sessions')}>
                    <div className="schedule-time">
                      {clockTime(s.starts_at)}
                      <small>{shortDate(s.starts_at).split(' ').slice(0, 2).join(' ')}</small>
                    </div>
                    <span className="schedule-line" />
                    <div className="schedule-info">
                      <strong>{s.title}</strong>
                      <small>
                        {s.department} <span>·</span> {s.room}
                      </small>
                    </div>
                    <Badge value={s.category} />
                  </button>
                ))}
                {sessions.error && <p className="inline-error">{sessions.error.message}</p>}
                {sessions.data?.items.length === 0 && (
                  <p className="empty">No sessions scheduled in your scope.</p>
                )}
              </div>
            </section>
          )}
        </div>
        <aside className="right-column">
          <section className="notice-panel">
            <div className="section-heading">
              <h2>College noticeboard</h2>
              <Bell size={19} />
            </div>
            {d.notices.map((n: Row, i: number) => (
              <button key={n.id} className="notice-item" onClick={() => navigate('notices')}>
                <span className="notice-label">
                  {i === 0 ? 'ACADEMIC OFFICE' : 'CAMPUS UPDATE'}
                </span>
                <h3>{n.title}</h3>
                <p>{n.body}</p>
                <small>
                  {shortDate(n.created_at)} <ArrowRight size={15} />
                </small>
              </button>
            ))}
          </section>
          <section className="boundary-card">
            <ShieldCheck size={25} />
            <h3>Academic first. Privacy always.</h3>
            <p>
              Patient records stay in the hospital system. This workspace contains academic evidence
              only.
            </p>
            <span>Hospital bridge · Release 2</span>
          </section>
        </aside>
      </div>
      <div className="data-footnote">
        <Activity size={14} />
        {d.formula} Refreshed {clockTime(d.generated_at)}.
      </div>
    </>
  );
}
function Portal() {
  const params = useSearchParams(),
    router = useRouter(),
    client = useQueryClient();
  const view = params.get('view') || 'overview';
  const [mobile, setMobile] = useState(false);
  const me = useQuery({ queryKey: ['me'], queryFn: () => api('auth/me'), retry: false });
  const navigate = (next: string) => {
    router.push(`/portal?view=${next}`);
    setMobile(false);
  };
  if (me.isPending)
    return (
      <div className="error-page">
        <Activity />
        <p>Opening your workspace…</p>
      </div>
    );
  if (me.error) {
    if (me.error instanceof APIError && me.error.status === 401)
      return (
        <Login
          onLogin={() => {
            client.clear();
            router.replace('/');
            client.invalidateQueries();
          }}
        />
      );
    return (
      <div className="error-page">
        <h1>Unable to reach the college service</h1>
        <p>{me.error.message}</p>
        <button onClick={() => me.refetch()}>Try again</button>
      </div>
    );
  }
  const user = me.data;
  const permitted = navigation
    .flatMap((g) => g.items)
    .filter((i) => i[3] === 'all' || String(i[3]).split(' ').includes(user.role));
  const allowed = permitted.some((i) => i[0] === view);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className={`sidebar ${mobile ? 'mobile-open' : ''}`}>
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Activity size={25} />
          </span>
          <span>
            medora<span className="brand-small">MEDICAL COLLEGE</span>
          </span>
        </Link>
        <div className="workspace-name">
          <span className="workspace-icon">
            <Building2 size={17} />
          </span>
          <div>
            {user.institution_id === 'demo' ? 'Main campus' : user.institution_id}
            <small>
              {user.role === 'student'
                ? 'Student portal'
                : user.role === 'faculty'
                  ? 'Faculty portal'
                  : 'Institution workspace'}
            </small>
          </div>
        </div>
        <nav>
          {navigation.map((group) => (
            <div className="nav-group" key={group.section}>
              <span>{group.section}</span>
              {group.items
                .filter((i) => permitted.includes(i))
                .map(([id, label, Icon]) => {
                  const I = Icon as typeof Users;
                  return (
                    <button
                      key={String(id)}
                      className={view === id ? 'active' : ''}
                      onClick={() => navigate(String(id))}
                    >
                      <I size={18} />
                      <span>{String(label)}</span>
                      {view === id && <span className="nav-active-indicator" />}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">

          <div className="profile">
            <span className="avatar">
              {user.name
                .replace('Dr. ', '')
                .split(' ')
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
            <button
              aria-label="Sign out"
              title="Sign out / switch preview identity"
              onClick={async () => {
                await api('auth/logout', 'POST', {}, user.csrf);
                client.clear();
                window.location.href = '/';
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <button
              className="mobile-toggle icon-button"
              aria-label="Toggle navigation"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={21} />
            </button>
            <span className="breadcrumb">
              Workspace <ChevronRight size={14} />
              <strong>{viewNames[view] || 'Page'}</strong>
            </span>
          </div>
          <div className="topbar-right">
            <span className="environment-label">SYNTHETIC DATA</span>
            <button
              className="icon-button"
              aria-label="Open noticeboard"
              onClick={() => navigate('notices')}
            >
              <Bell size={19} />
            </button>
            <span className="topbar-divider" />
            <span className="avatar small">{user.name.replace('Dr. ', '')[0]}</span>
          </div>
        </header>
        <main id="main-content" className="page-content">
          {!allowed ? (
            <div className="empty">
              <ShieldCheck />
              <h1>Access restricted</h1>
              <p>This module isn’t part of your current role.</p>
            </div>
          ) : view === 'overview' ? (
            <Overview me={user} navigate={navigate} />
          ) : (
            <ResourceView key={`${view}-${user.id}`} resource={view} me={user} />
          )}
        </main>
        <footer className="app-footer">
          <span>Medora · Academic management</span>
          <span>
            Development preview <span>·</span> Asia/Kolkata
          </span>
        </footer>
      </div>
    </div>
  );
}
export default function Workspace() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: 15000, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <Suspense fallback={<div className="error-page">Loading workspace…</div>}>
        <Portal />
      </Suspense>
    </QueryClientProvider>
  );
}
