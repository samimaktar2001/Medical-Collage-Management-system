import 'reflect-metadata';
import { getPresignedDownloadUrl } from './s3';
import {
  Controller,
  Module,
  Get,
  Post,
  Patch,
  Req,
  Res,
  Param,
  Body,
  Query,
  HttpException,
} from '@nestjs/common';
import { z } from 'zod';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Database } from './database';
import { Domain, DomainError, Actor } from './domain';
import { seed } from './seed';
import { seedWebsite } from './website-seed';
import { seedClinical } from './clinical-seed';
import { Learning } from './learning';
const db = new Database(),
  domain = new Domain(db),
  learning = new Learning(domain);

function buildEmailTemplate(title: string, bodyContent: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
    .header { background-color: #0f766e; padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; }
    .content { padding: 40px 32px; font-size: 16px; line-height: 1.6; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #0f766e; color: #ffffff !important; font-weight: 600; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; transition: background-color 0.2s; }
    .footer { padding: 24px; text-align: center; font-size: 13px; color: #6b7280; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
    .otp-box { display: inline-block; background-color: #f3f4f6; padding: 16px 32px; border-radius: 8px; font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #0f766e; margin: 24px 0; border: 1px dashed #99f6e4; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MEDORA</h1>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Medora Medical College. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

const service = (name: string) =>
  ['learning', 'submissions', 'requests'].includes(name) ? learning : domain;
const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
const INSTITUTION_ID = process.env.DEFAULT_INSTITUTION_ID || 'demo';
const digest = (s: string) => createHash('sha256').update(s).digest('hex');
function token(req: Request) {
  return (
    (req.headers.cookie || '')
      .split(';')
      .map((x) => x.trim())
      .find((x) => x.startsWith('medora_session='))
      ?.slice('medora_session='.length) || ''
  );
}
async function session(req: Request) {
  const user = (
    await db.query(
      'SELECT u.*,s.csrf FROM auth_sessions s JOIN users u ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true',
      [digest(token(req))],
    )
  ).rows[0];
  if (!user) throw new DomainError(401, 'UNAUTHENTICATED', 'Sign in to continue.');
  if (
    req.method !== 'GET' &&
    (req.headers.origin !== origin || req.headers['x-csrf-token'] !== user.csrf)
  )
    throw new DomainError(403, 'CSRF', 'Request verification failed. Reload and try again.');
  return user as Actor & { csrf: string };
}
const rate = new Map<string, { count: number; reset: number }>();
@Controller('api/v1')
class ApiController {
  @Get('health') async health() {
    await db.query('SELECT 1');
    return { status: 'ok', database: 'postgresql', production_ready: false };
  }
  @Get('public/institutions') async getInstitutions() {
    const result = await db.query('SELECT id, name FROM institutions ORDER BY name');
    return { institutions: result.rows };
  }

  @Get('auth/demo-users') async users() {
    return {
      users: (
        await db.query(
          "SELECT id,name,role,department FROM users WHERE institution_id='demo' AND active=true ORDER BY role,name",
        )
      ).rows,
      development_only: true,
    };
  }
  @Post('auth/demo-login') async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { user_id?: string },
  ) {
    if (req.headers.origin !== origin || req.headers['x-requested-with'] !== 'medora')
      throw new DomainError(403, 'ORIGIN', 'Untrusted sign-in request.');
    if (!body || Object.keys(body).some((k) => k !== 'user_id') || typeof body.user_id !== 'string')
      throw new DomainError(422, 'VALIDATION', 'Select a development identity.');
    const user = (
      await db.query("SELECT id FROM users WHERE id=$1 AND institution_id='demo' AND active=true", [
        body.user_id,
      ])
    ).rows[0];
    if (!user) throw new DomainError(401, 'IDENTITY', 'Identity is unavailable.');
    const secret = randomBytes(32).toString('hex'),
      csrf = randomBytes(32).toString('hex');
    await db.query('DELETE FROM auth_sessions WHERE token_hash=$1 OR expires_at<now()', [
      digest(token(req)),
    ]);
    await db.query(
      "INSERT INTO auth_sessions(token_hash,user_id,csrf,expires_at) VALUES ($1,$2,$3,now()+interval '8 hours')",
      [digest(secret), user.id, csrf],
    );
    res.cookie('medora_session', secret, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 3600000,
      secure: origin.startsWith('https://'),
    });
    return { ok: true };
  }
  @Post('auth/signup') async signup(
    @Req() req: Request,
    @Body() body: { name?: string; email?: string; password?: string; institution_id?: string },
  ) {
    if (req.headers['x-requested-with'] !== 'medora')
      throw new DomainError(403, 'ORIGIN', 'Untrusted request.');
    if (!body.name || !body.email || !body.password || !body.institution_id)
      throw new DomainError(422, 'VALIDATION', 'Missing required fields.');
    if (body.password.length < 8)
      throw new DomainError(422, 'VALIDATION', 'Password must be at least 8 characters.');

    const hash = await bcrypt.hash(body.password, 10);
    const id = randomUUID();
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // The user typed the name manually, so we use it to generate an ID
    const instName = body.institution_id.trim();
    const instId = instName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'default-college';

    try {
      // Upsert the institution if it doesn't already exist
      await db.query(
        'INSERT INTO institutions (id, name, timezone) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
        [instId, instName, 'Asia/Kolkata']
      );

      await db.query(
        'INSERT INTO users(id, institution_id, name, email, role, active, password_hash, verification_token) VALUES ($1,$2,$3,$4,$5,true,$6,$7)',
        [id, instId, body.name, body.email, 'student', hash, token]
      );

      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_USER !== 'your_email@gmail.com') {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Medora" <noreply@medora.edu>',
            to: body.email,
            subject: 'Your Medora OTP',
            text: `Your 6-digit OTP is: ${token}\n\nPlease enter this OTP in the verification form.`,
            html: buildEmailTemplate('Your Medora OTP', `<p>Hello,</p><p>Use the following OTP to verify your email address. It is valid for a limited time.</p><div style="text-align:center"><div class="otp-box">${token}</div></div><p>If you did not request this, please safely ignore this email.</p>`),
          });
        } catch (mailErr) {
          throw new DomainError(500, 'EMAIL_FAILED', 'Failed to send OTP email. Please check SMTP settings.');
        }
      } else {
        console.log(`[Dev Fallback] Verification OTP for ${body.email} is: ${token}`);
      }

      return { ok: true, message: 'Signup successful. Please check your email for the OTP.' };
    } catch (e: any) {
      if (e.message.includes('unique constraint'))
        throw new DomainError(409, 'CONFLICT', 'Email is already registered.');
      throw e;
    }
  }

  @Post('auth/verify-email') async verifyEmail(
    @Body() body: { token?: string }
  ) {
    if (!body.token) throw new DomainError(422, 'VALIDATION', 'Missing token.');
    const result = await db.query(
      'UPDATE users SET email_verified=true, verification_token=NULL WHERE verification_token=$1 RETURNING id',
      [body.token]
    );
    if (result.rows.length === 0)
      throw new DomainError(400, 'INVALID_TOKEN', 'Invalid or expired verification token.');
    return { ok: true, message: 'Email successfully verified.' };
  }

  @Post('auth/invite') async inviteStaff(
    @Req() req: Request,
    @Body() body: { email: string; name: string; role: string; institution_id: string }
  ) {
    // In a real app, you would check if req.user has admin privileges here.
    if (!body.email || !body.name || !body.role || !body.institution_id)
      throw new DomainError(422, 'VALIDATION', 'Missing required fields.');

    const id = randomUUID();
    const token = randomBytes(32).toString('hex'); // This is the setup_token
    try {
      await db.query(
        'INSERT INTO users(id, institution_id, name, email, role, active, password_hash, verification_token, email_verified) VALUES ($1,$2,$3,$4,$5,true,NULL,$6,true)',
        [id, body.institution_id, body.name, body.email, body.role, token]
      );
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_USER !== 'your_email@gmail.com' && process.env.SMTP_PASS !== 'your_app_password') {
        try {
          const inviteUrl = `${process.env.APP_ORIGIN}/portal?setup=${token}`;
          await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Medora" <noreply@medora.edu>',
            to: body.email,
            subject: 'You have been invited to Medora',
            text: `Hello ${body.name},\n\nYou have been invited to Medora as a ${body.role}. Please click the link below to set your password and access your account:\n\n${inviteUrl}`,
            html: buildEmailTemplate('Invitation to Medora', `<p>Hello <strong>${body.name}</strong>,</p><p>You have been invited to join the Medora workspace as a <strong>${body.role}</strong>.</p><div class="button-container"><a href="${inviteUrl}" class="button">Set up your account</a></div><p>If you have any questions, please contact your administrator.</p>`),
          });
        } catch (mailErr) {
          throw new DomainError(500, 'EMAIL_FAILED', 'Failed to send invite email. Please check SMTP settings.');
        }
      } else {
        console.log(`[Dev Fallback] Generated setup token for ${body.email}: ${token}`);
      }

      return { ok: true, message: 'Staff member invited successfully.' };
    } catch (e: any) {
      if (e.message.includes('unique constraint'))
        throw new DomainError(409, 'CONFLICT', 'Email is already registered.');
      throw e;
    }
  }

  @Post('auth/setup-password') async setupPassword(
    @Body() body: { token: string; password?: string }
  ) {
    if (!body.token || !body.password) throw new DomainError(422, 'VALIDATION', 'Missing token or password.');
    if (body.password.length < 8) throw new DomainError(422, 'VALIDATION', 'Password must be at least 8 characters.');

    const hash = await bcrypt.hash(body.password, 10);
    const result = await db.query(
      'UPDATE users SET password_hash=$1, verification_token=NULL WHERE verification_token=$2 AND password_hash IS NULL RETURNING id',
      [hash, body.token]
    );
    if (result.rows.length === 0)
      throw new DomainError(400, 'INVALID_TOKEN', 'Invalid token or password already set.');

    return { ok: true, message: 'Password successfully set. You can now log in.' };
  }

  @Post('auth/forgot-password') async forgotPassword(
    @Body() body: { email?: string }
  ) {
    if (!body.email) throw new DomainError(422, 'VALIDATION', 'Missing email.');
    const token = randomBytes(32).toString('hex');
    const result = await db.query(
      'UPDATE users SET verification_token=$1 WHERE email=$2 RETURNING id, name',
      [token, body.email]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
          const resetUrl = `${process.env.APP_ORIGIN}/portal?reset=${token}`;
          await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Medora" <noreply@medora.edu>',
            to: body.email,
            subject: 'Reset your Medora password',
            text: `Hello ${user.name},\n\nPlease click the link below to reset your password:\n\n${resetUrl}`,
            html: buildEmailTemplate('Reset your Medora password', `<p>Hello <strong>${user.name}</strong>,</p><p>We received a request to reset your password. Click the button below to choose a new one:</p><div class="button-container"><a href="${resetUrl}" class="button">Reset Password</a></div><p>If you did not make this request, you can safely ignore this email.</p>`),
          });
        } catch (e) {
          console.error('Failed to send reset email', e);
        }
      } else {
        console.log(`[Dev Fallback] Reset token for ${body.email}: ${token}`);
      }
    }
    return { ok: true, message: 'If an account exists, a reset link has been sent.' };
  }

  @Post('auth/reset-password') async resetPassword(
    @Body() body: { token: string; password?: string }
  ) {
    if (!body.token || !body.password) throw new DomainError(422, 'VALIDATION', 'Missing token or password.');
    if (body.password.length < 8) throw new DomainError(422, 'VALIDATION', 'Password must be at least 8 characters.');

    const hash = await bcrypt.hash(body.password, 10);
    const result = await db.query(
      'UPDATE users SET password_hash=$1, verification_token=NULL WHERE verification_token=$2 RETURNING id',
      [hash, body.token]
    );
    if (result.rows.length === 0)
      throw new DomainError(400, 'INVALID_TOKEN', 'Invalid or expired token.');

    return { ok: true, message: 'Password successfully reset. You can now log in.' };
  }

  @Post('auth/login') async realLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { email?: string; password?: string },
  ) {
    if (req.headers['x-requested-with'] !== 'medora')
      throw new DomainError(403, 'ORIGIN', 'Untrusted sign-in request.');
    if (!body.email || !body.password)
      throw new DomainError(422, 'VALIDATION', 'Email and password are required.');

    const user = (
      await db.query("SELECT id, password_hash, email_verified FROM users WHERE email=$1 AND active=true", [
        body.email,
      ])
    ).rows[0];

    if (!user || !user.password_hash)
      throw new DomainError(401, 'IDENTITY', 'Invalid email or password.');

    const valid = await bcrypt.compare(body.password, user.password_hash);
    if (!valid) throw new DomainError(401, 'IDENTITY', 'Invalid email or password.');

    if (!user.email_verified)
      throw new DomainError(403, 'UNVERIFIED', 'Please verify your email before logging in.');

    const secret = randomBytes(32).toString('hex'),
      csrf = randomBytes(32).toString('hex');

    await db.query('DELETE FROM auth_sessions WHERE token_hash=$1 OR expires_at<now()', [
      digest(token(req)),
    ]);
    await db.query(
      "INSERT INTO auth_sessions(token_hash,user_id,csrf,expires_at) VALUES ($1,$2,$3,now()+interval '8 hours')",
      [digest(secret), user.id, csrf],
    );
    res.cookie('medora_session', secret, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 3600000,
      secure: origin.startsWith('https://'),
    });
    return { ok: true };
  }

  @Get('auth/me') async me(@Req() req: Request) {
    const a = await session(req);
    return {
      id: a.id,
      name: a.name,
      role: a.role,
      department: a.department,
      institution_id: a.institution_id,
      student_id: a.student_id,
      csrf: a.csrf,
    };
  }
  @Post('auth/logout') async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await session(req);
    await db.query('DELETE FROM auth_sessions WHERE token_hash=$1', [digest(token(req))]);
    res.clearCookie('medora_session', { path: '/' });
    return { ok: true };
  }
  @Get('dashboard') async dashboard(@Req() req: Request) {
    return domain.dashboard(await session(req));
  }
  @Get('options') async options(@Req() req: Request) {
    return domain.options(await session(req));
  }
  @Post('applications/import') async importApplications(
    @Req() req: Request,
    @Body() input: unknown,
  ) {
    const a = await session(req);
    if (a.role !== 'registrar')
      throw new DomainError(403, 'FORBIDDEN', 'Only admissions staff can import allotments.');
    const { z } = await import('zod');
    const parsed = z
      .object({
        source_batch: z.string().trim().min(1).max(100),
        rows: z.array(z.unknown()).min(1).max(1000),
      })
      .strict()
      .safeParse(input);
    if (!parsed.success)
      throw new DomainError(
        422,
        'VALIDATION',
        'Provide a source batch and between 1 and 1,000 rows.',
      );
    const outcomes = [];
    for (let i = 0; i < parsed.data.rows.length; i++) {
      try {
        const row = await domain.create('applications', parsed.data.rows[i], a);
        outcomes.push({ row: i + 1, status: 'Imported', id: row.id });
      } catch (error) {
        outcomes.push({
          row: i + 1,
          status: 'Rejected',
          message:
            error instanceof DomainError
              ? error.message
              : (error as { code?: string })?.code === '23505'
                ? 'Duplicate external allotment reference.'
                : 'Invalid or unavailable record.',
        });
      }
    }
    await domain.audit(
      db,
      a,
      'applications.import',
      parsed.data.source_batch,
      `${outcomes.filter((r) => r.status === 'Imported').length} imported; ${outcomes.filter((r) => r.status === 'Rejected').length} rejected`,
    );
    return { source_batch: parsed.data.source_batch, atomicity: 'Per row', outcomes };
  }
  @Get('attendance-summary') async summary(@Req() req: Request, @Query('student_id') id?: string) {
    return domain.attendanceSummary(await session(req), id);
  }
  @Get('public/content') async publicContent(
    @Query('slug') slug?: string,
    @Query('language') language?: string,
    @Query('q') q?: string,
  ) {
    return { items: await domain.publicContent(slug, language, q) };
  }

  @Get('public/departments') async publicDepartments() {
    const res = await db.query(
      "SELECT code, name FROM masters WHERE kind='Department' AND institution_id='demo' ORDER BY name ASC"
    );
    return { items: res.rows };
  }

  @Get('public/stats') async publicStats() {
    const deps = await db.query("SELECT COUNT(*) FROM masters WHERE kind='Department'");
    const students = await db.query("SELECT COUNT(*) FROM records WHERE module_id='students'");
    const faculty = await db.query("SELECT COUNT(*) FROM records WHERE module_id='staff'"); 
    const patients = await db.query("SELECT COUNT(*) FROM records WHERE module_id='patients'");

    return {
      departments: parseInt(deps.rows[0].count, 10),
      students: parseInt(students.rows[0].count, 10),
      faculty: parseInt(faculty.rows[0].count, 10),
      patients: parseInt(patients.rows[0].count, 10),
    };
  }
  @Get('public/settings') async publicSettings() {
    const res = await db.query('SELECT key, value FROM settings WHERE institution_id=$1', [INSTITUTION_ID]);
    const settings = res.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    return { ok: true, data: settings };
  }

  @Post('public/enquiry') async enquiry(@Body() body: unknown) {
    const { z } = await import('zod');
    const parsed = z
      .object({
        name: z.string().trim().min(1).max(150),
        email: z.email(),
        message: z.string().trim().min(10).max(2000),
      })
      .strict()
      .safeParse(body);
    if (!parsed.success)
      throw new DomainError(
        422,
        'VALIDATION',
        'Provide your name, email and a message of 10–2,000 characters.',
      );
    const a = (await db.query("SELECT * FROM users WHERE id='registrar'")).rows[0] as Actor;
    const result = await domain.create(
      'tickets',
      {
        title: `Public enquiry · ${parsed.data.name}`,
        description: `Reply address: ${parsed.data.email}\n${parsed.data.message}`,
        severity: 'Normal',
        confidential: false,
        due_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      },
      a,
    );
    return { reference: result.id, message: 'Enquiry saved. Email delivery is not configured.' };
  }
  @Get('documents/:id/download') async download(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const a = await session(req);
    const file = await domain.get('documents', id, a);
    if (file.status !== 'Clean')
      throw new DomainError(
        409,
        'QUARANTINED',
        'This file is quarantined. A trusted malware scanner must approve it before download.',
      );
    await domain.audit(db, a, 'documents.download', id);
    const url = await getPresignedDownloadUrl(file.s3_key, file.name);
    res.redirect(url);
  }
  @Get('evidence/:id/download') async evidence(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const a = await session(req);
    const pack = await domain.get('evidence', id, a);
    await domain.audit(db, a, 'evidence.download', id);
    res.setHeader('Content-Disposition', 'attachment; filename="evidence-manifest.json"');
    res.json({ title: pack.title, checksum: pack.checksum, manifest: pack.manifest });
  }

  // ─── CRMI Internship Endpoints ───
  @Get('clinical/internship') async getInternship(@Req() req: Request) {
    const a = await session(req);
    const [rotations, logs] = await Promise.all([
      db.query('SELECT * FROM crmi_rotations WHERE institution_id=$1 ORDER BY sort_order', [a.institution_id]),
      db.query('SELECT * FROM crmi_internship_logs WHERE institution_id=$1 ORDER BY created_at DESC', [a.institution_id]),
    ]);
    return {
      rotations: rotations.rows.map(r => ({
        dept: r.dept,
        duration: r.duration,
        status: r.status,
        progress: r.progress,
        color: r.color,
      })),
      logs: logs.rows.map(l => ({
        id: l.id,
        internName: l.intern_name,
        rollNo: l.roll_no,
        department: l.department,
        procedureCode: l.procedure_code,
        procedureName: l.procedure_name,
        patientDetails: l.patient_details,
        role: l.role,
        date: l.date,
        supervisor: l.supervisor,
        status: l.status,
      })),
    };
  }

  @Post('clinical/internship/logs') async createInternshipLog(@Req() req: Request, @Body() body: any) {
    const a = await session(req);
    const id = `LOG-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    await db.query(
      `INSERT INTO crmi_internship_logs(id, institution_id, intern_name, roll_no, department, procedure_code, procedure_name, patient_details, role, date, supervisor, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending Sign-off')`,
      [
        id,
        a.institution_id,
        body.internName || a.name || 'Dr. Rahul Sharma (Intern)',
        body.rollNo || 'MC/2021/042',
        body.department || 'General Medicine',
        body.procedureCode || 'CLIN-NEW',
        body.procedureName,
        body.patientDetails || 'OPD / Ward Patient',
        body.role || 'Performed',
        dateStr,
        body.supervisor || 'Dr. Debasis Mukherjee (Prof)',
      ]
    );
    const result = await db.query('SELECT * FROM crmi_internship_logs WHERE id=$1', [id]);
    const l = result.rows[0];
    return {
      ok: true,
      item: {
        id: l.id,
        internName: l.intern_name,
        rollNo: l.roll_no,
        department: l.department,
        procedureCode: l.procedure_code,
        procedureName: l.procedure_name,
        patientDetails: l.patient_details,
        role: l.role,
        date: l.date,
        supervisor: l.supervisor,
        status: l.status,
      },
    };
  }

  @Post('clinical/internship/logs/:id/sign-off') async signOffInternshipLog(@Req() req: Request, @Param('id') id: string) {
    const a = await session(req);
    await db.query(
      `UPDATE crmi_internship_logs SET status='Verified' WHERE id=$1 AND institution_id=$2`,
      [id, a.institution_id]
    );
    return { ok: true, message: 'Log successfully signed off.' };
  }

  // ─── NMC Audit Endpoints ───
  @Get('clinical/nmc-audit') async getNMCAudit(@Req() req: Request) {
    const a = await session(req);
    const result = await db.query('SELECT * FROM nmc_department_audits WHERE institution_id=$1 ORDER BY sort_order', [a.institution_id]);
    return {
      departmentAudits: result.rows.map(r => ({
        dept: r.dept,
        opd: r.opd,
        ipdBed: r.ipd_bed,
        majorOt: r.major_ot,
        minorOt: r.minor_ot,
        labTests: r.lab_tests,
        facultyAebas: r.faculty_aebas,
        status: r.status,
      })),
    };
  }

  // ─── Insurance Desk Endpoints ───
  @Get('clinical/insurance') async getInsuranceClaims(@Req() req: Request) {
    const a = await session(req);
    const result = await db.query('SELECT * FROM insurance_claims WHERE institution_id=$1 ORDER BY created_at DESC', [a.institution_id]);
    return {
      claims: result.rows.map(c => ({
        id: c.id,
        patientName: c.patient_name,
        scheme: c.scheme,
        preAuthNo: c.pre_auth_no,
        abhaId: c.abha_id,
        procedurePackage: c.procedure_package,
        packageCost: c.package_cost,
        wardBed: c.ward_bed,
        preAuthStatus: c.pre_auth_status,
      })),
    };
  }

  @Post('clinical/insurance/claims') async createInsuranceClaim(@Req() req: Request, @Body() body: any) {
    const a = await session(req);
    const id = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const preAuthNo = body.scheme?.includes('Swasthya Sathi')
      ? `WBSS/MC/2026/${Math.floor(1000 + Math.random() * 9000)}`
      : `NHA/WB/2026/0${Math.floor(1000 + Math.random() * 9000)}`;
    await db.query(
      `INSERT INTO insurance_claims(id, institution_id, patient_name, scheme, pre_auth_no, abha_id, procedure_package, package_cost, ward_bed, pre_auth_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Under Review')`,
      [
        id,
        a.institution_id,
        body.patientName,
        body.scheme,
        preAuthNo,
        body.abhaId || '91-4432-8812-0041',
        body.procedurePackage,
        body.packageCost,
        body.wardBed || 'General Ward Bed 01',
      ]
    );
    const result = await db.query('SELECT * FROM insurance_claims WHERE id=$1', [id]);
    const c = result.rows[0];
    return {
      ok: true,
      claim: {
        id: c.id,
        patientName: c.patient_name,
        scheme: c.scheme,
        preAuthNo: c.pre_auth_no,
        abhaId: c.abha_id,
        procedurePackage: c.procedure_package,
        packageCost: c.package_cost,
        wardBed: c.ward_bed,
        preAuthStatus: c.pre_auth_status,
      },
    };
  }

  // ─── Birth, Death & MLC Endpoints ───
  @Get('clinical/birth-death') async getBirthDeathRecords(@Req() req: Request) {
    const a = await session(req);
    const [births, deaths, mlcs] = await Promise.all([
      db.query('SELECT * FROM birth_registry WHERE institution_id=$1 ORDER BY created_at DESC', [a.institution_id]),
      db.query('SELECT * FROM death_registry WHERE institution_id=$1 ORDER BY created_at DESC', [a.institution_id]),
      db.query('SELECT * FROM mlc_registry WHERE institution_id=$1 ORDER BY created_at DESC', [a.institution_id]),
    ]);
    return {
      births: births.rows.map(b => ({
        id: b.id,
        crsNo: b.crs_no,
        babyDetails: b.baby_details,
        motherName: b.mother_name,
        fatherName: b.father_name,
        deliveryType: b.delivery_type,
        attendingObgyn: b.attending_obgyn,
        crsStatus: b.crs_status,
        dateTime: b.date_time,
      })),
      deaths: deaths.rows.map(d => ({
        id: d.id,
        patientName: d.patient_name,
        ageGender: d.age_gender,
        wardBed: d.ward_bed,
        immediateCause: d.immediate_cause,
        underlyingCause: d.underlying_cause,
        icd10: d.icd10,
        doctor: d.doctor,
        auditStatus: d.audit_status,
        dateTime: d.date_time,
      })),
      mlcs: mlcs.rows.map(m => ({
        id: m.id,
        mlcNo: m.mlc_no,
        patientName: m.patient_name,
        ageGender: m.age_gender,
        incidentType: m.incident_type,
        policeStation: m.police_station,
        broughtBy: m.brought_by,
        examiningCmo: m.examining_cmo,
        status: m.status,
        dateTime: m.date_time,
      })),
    };
  }

  @Post('clinical/birth-death/births') async registerBirth(@Req() req: Request, @Body() body: any) {
    const a = await session(req);
    const id = `BR-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const crsNo = `CRS/WB/2026/${String(Math.floor(10000 + Math.random() * 90000))}`;
    const dateStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    await db.query(
      `INSERT INTO birth_registry(id, institution_id, crs_no, baby_details, mother_name, father_name, delivery_type, attending_obgyn, crs_status, date_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'CRS Registered', $9)`,
      [id, a.institution_id, crsNo, body.babyDetails || 'Male • 3.0 kg', body.motherName, body.fatherName, body.deliveryType, body.attendingObgyn, dateStr]
    );
    const result = await db.query('SELECT * FROM birth_registry WHERE id=$1', [id]);
    const b = result.rows[0];
    return {
      ok: true,
      birth: {
        id: b.id,
        crsNo: b.crs_no,
        babyDetails: b.baby_details,
        motherName: b.mother_name,
        fatherName: b.father_name,
        deliveryType: b.delivery_type,
        attendingObgyn: b.attending_obgyn,
        crsStatus: b.crs_status,
        dateTime: b.date_time,
      },
    };
  }

  @Post('clinical/birth-death/deaths') async registerDeath(@Req() req: Request, @Body() body: any) {
    const a = await session(req);
    const id = `DR-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const dateStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    await db.query(
      `INSERT INTO death_registry(id, institution_id, patient_name, age_gender, ward_bed, immediate_cause, underlying_cause, icd10, doctor, audit_status, date_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'M&M Audited', $10)`,
      [id, a.institution_id, body.patientName, body.ageGender, body.wardBed, body.immediateCause, body.underlyingCause, body.icd10, body.doctor, dateStr]
    );
    const result = await db.query('SELECT * FROM death_registry WHERE id=$1', [id]);
    const d = result.rows[0];
    return {
      ok: true,
      death: {
        id: d.id,
        patientName: d.patient_name,
        ageGender: d.age_gender,
        wardBed: d.ward_bed,
        immediateCause: d.immediate_cause,
        underlyingCause: d.underlying_cause,
        icd10: d.icd10,
        doctor: d.doctor,
        auditStatus: d.audit_status,
        dateTime: d.date_time,
      },
    };
  }

  // ─── Biomedical Waste Endpoints ───
  @Get('clinical/biomedical-waste') async getWasteLogs(@Req() req: Request) {
    const a = await session(req);
    const result = await db.query('SELECT * FROM biomedical_waste_logs WHERE institution_id=$1 ORDER BY logged_at DESC', [a.institution_id]);
    return {
      logs: result.rows.map(w => ({
        id: w.id,
        barcode: w.barcode,
        category: w.category,
        ward: w.ward,
        weightKg: Number(w.weight_kg),
        handler: w.handler,
        cbwtfManifestNo: w.cbwtf_manifest_no,
        status: w.status,
      })),
    };
  }

  @Post('clinical/biomedical-waste/logs') async createWasteLog(@Req() req: Request, @Body() body: any) {
    const a = await session(req);
    const id = `BMW-${Date.now().toString().slice(-4)}`;
    const barcode = `BMW-${body.category?.[0] || 'Y'}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const manifest = `CBWTF-KOL-2026-092`;
    await db.query(
      `INSERT INTO biomedical_waste_logs(id, institution_id, barcode, category, ward, weight_kg, handler, cbwtf_manifest_no, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Logged')`,
      [id, a.institution_id, barcode, body.category, body.ward, parseFloat(body.weightKg) || 1.0, body.handler || a.name || 'Staff Nurse', manifest]
    );
    const result = await db.query('SELECT * FROM biomedical_waste_logs WHERE id=$1', [id]);
    const w = result.rows[0];
    return {
      ok: true,
      item: {
        id: w.id,
        barcode: w.barcode,
        category: w.category,
        ward: w.ward,
        weightKg: Number(w.weight_kg),
        handler: w.handler,
        cbwtfManifestNo: w.cbwtf_manifest_no,
        status: w.status,
      },
    };
  }

  // ─── Clinical Notifications Endpoints ───
  @Get('clinical/notifications') async getNotifications(@Req() req: Request) {
    const a = await session(req);
    const result = await db.query('SELECT * FROM clinical_notifications WHERE institution_id=$1 ORDER BY created_at DESC', [a.institution_id]);
    return {
      notifications: result.rows.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        category: n.category,
        priority: n.priority,
        time: n.time,
        read: n.read,
        iconType: n.icon_type,
      })),
    };
  }

  @Post('clinical/notifications/mark-all-read') async markAllNotificationsRead(@Req() req: Request) {
    const a = await session(req);
    await db.query('UPDATE clinical_notifications SET read=true WHERE institution_id=$1', [a.institution_id]);
    return { ok: true };
  }

  @Post('clinical/notifications/:id/delete') async deleteNotification(@Req() req: Request, @Param('id') id: string) {
    const a = await session(req);
    await db.query('DELETE FROM clinical_notifications WHERE id=$1 AND institution_id=$2', [id, a.institution_id]);
    return { ok: true };
  }

  // ─── Clinical Messaging Endpoints ───
  @Get('clinical/messages') async getClinicalMessages(@Req() req: Request) {
    const a = await session(req);
    const [threads, messages] = await Promise.all([
      db.query('SELECT * FROM clinical_threads WHERE institution_id=$1', [a.institution_id]),
      db.query('SELECT * FROM clinical_messages WHERE institution_id=$1 ORDER BY created_at ASC', [a.institution_id]),
    ]);
    return {
      threads: threads.rows.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role,
        department: t.department,
        unread: t.unread,
        avatar: t.avatar,
        status: t.status,
      })),
      messages: messages.rows.map(m => ({
        id: m.id,
        threadId: m.thread_id,
        sender: m.sender,
        text: m.text,
        time: m.time,
        priority: m.priority,
      })),
    };
  }

  @Post('clinical/messages') async sendClinicalMessage(@Req() req: Request, @Body() body: any) {
    const a = await session(req);
    const id = `M-${Date.now().toString().slice(-4)}`;
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    await db.query(
      `INSERT INTO clinical_messages(id, institution_id, thread_id, sender, text, time, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, a.institution_id, body.threadId, a.name || 'You', body.text, timeStr, body.priority || 'normal']
    );
    const result = await db.query('SELECT * FROM clinical_messages WHERE id=$1', [id]);
    const m = result.rows[0];
    return {
      ok: true,
      message: {
        id: m.id,
        threadId: m.thread_id,
        sender: m.sender,
        text: m.text,
        time: m.time,
        priority: m.priority,
      },
    };
  }

  // ─── Public Workflows (Institutions, Appointments, Inquiries) ───
  @Get('settings') async getSettings() {
    const res = await db.query('SELECT key, value FROM settings WHERE institution_id=$1', [INSTITUTION_ID]);
    const settings = res.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    return settings;
  }

  @Patch('settings') async updateSettings(@Body() body: Record<string, string>, @Req() req: any) {
    const actorId = req.user.id;
    for (const [key, value] of Object.entries(body)) {
      await db.query(
        'INSERT INTO settings (id, institution_id, category, key, value, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, now()) ON CONFLICT (institution_id, key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()',
        [`set-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, INSTITUTION_ID, 'general', key, String(value), actorId]
      );
    }
    return { ok: true, message: 'Settings updated' };
  }

  @Get('public/institutions') async getPublicInstitutions() {
    const res = await db.query('SELECT id, name FROM institutions WHERE active = true ORDER BY name ASC');
    return res.rows;
  }

  @Post('public/appointments') async createAppointment(@Body() body: unknown) {
    const schema = z.object({
      department: z.string().trim().min(1, 'Department is required').max(100),
      doctor_name: z.string().trim().min(1, 'Doctor is required').max(100),
      patient_name: z.string().trim().min(1, 'Patient name is required').max(100),
      age: z.coerce.number().int().min(0, 'Age must be valid').max(120),
      gender: z.string().trim().min(1, 'Gender is required').max(20),
      phone: z.string().trim().min(7, 'Phone number must be at least 7 digits').max(20),
      uhid: z.string().trim().max(50).optional().nullable(),
      slot: z.string().trim().min(1, 'Appointment slot is required').max(100),
      appointment_date: z.string().trim().min(1, 'Appointment date is required').max(20),
      symptoms: z.string().trim().max(1000).optional().nullable(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new DomainError(422, 'VALIDATION', parsed.error.issues[0]?.message || 'Invalid appointment details.');
    }
    const d = parsed.data;

    const countRes = await db.query(
      'SELECT COUNT(*)::int AS count FROM opd_appointments WHERE appointment_date = $1',
      [d.appointment_date]
    );
    const seq = (countRes.rows[0]?.count || 0) + 101;
    const tokenNumber = `TK-${seq}`;
    const opdSlipId = `OPD-2026-${randomBytes(2).toString('hex').toUpperCase()}-${seq}`;
    const reportingTime = d.slot.toLowerCase().includes('morning') ? '08:45 AM' : '12:45 PM';
    const id = randomUUID();

    const insertRes = await db.query(
      `INSERT INTO opd_appointments (
        id, token_number, opd_slip_id, department, doctor_name, patient_name,
        age, gender, phone, uhid, slot, appointment_date, symptoms, status, reporting_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Waiting', $14)
      RETURNING *`,
      [
        id,
        tokenNumber,
        opdSlipId,
        d.department,
        d.doctor_name,
        d.patient_name,
        d.age,
        d.gender,
        d.phone,
        d.uhid || null,
        d.slot,
        d.appointment_date,
        d.symptoms || null,
        reportingTime,
      ]
    );

    return {
      success: true,
      message: 'Appointment booked successfully',
      data: {
        id: insertRes.rows[0].id,
        tokenNumber,
        opdSlipId,
        reportingTime,
        department: d.department,
        doctorName: d.doctor_name,
        patientName: d.patient_name,
        age: d.age,
        gender: d.gender,
        phone: d.phone,
        slot: d.slot,
        appointmentDate: d.appointment_date,
      },
    };
  }

  @Get('appointments') async getAppointments(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('q') q?: string,
    @Query('page') pageStr = '1',
    @Query('limit') limitStr = '50',
    @Req() req?: Request,
  ) {
    if (req) await session(req);
    const page = Math.max(1, parseInt(pageStr) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr) || 50));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status && status !== 'ALL') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (date) {
      params.push(date);
      conditions.push(`appointment_date = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(patient_name ILIKE $${params.length} OR phone ILIKE $${params.length} OR token_number ILIKE $${params.length} OR opd_slip_id ILIKE $${params.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM opd_appointments ${whereClause}`, params);
    const total = countRes.rows[0]?.total || 0;

    const dataParams = [...params, limit, offset];
    const dataRes = await db.query(
      `SELECT * FROM opd_appointments ${whereClause} ORDER BY created_at DESC LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return {
      success: true,
      data: dataRes.rows,
      items: dataRes.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  @Patch('appointments/:id/status') async updateAppointmentStatus(
    @Param('id') id: string,
    @Body() body: { status?: string },
    @Req() req: Request,
  ) {
    await session(req);
    const allowed = ['Waiting', 'In Consultation', 'Completed', 'Cancelled', 'No Show'];
    if (!body.status || !allowed.includes(body.status)) {
      throw new DomainError(422, 'VALIDATION', `Status must be one of: ${allowed.join(', ')}`);
    }
    const res = await db.query('UPDATE opd_appointments SET status = $1 WHERE id = $2 RETURNING *', [body.status, id]);
    if (res.rows.length === 0) {
      throw new DomainError(404, 'NOT_FOUND', 'Appointment record not found.');
    }
    return {
      success: true,
      message: `Appointment status updated to ${body.status}`,
      data: res.rows[0],
    };
  }

  @Post('public/inquiries') async createPublicInquiry(@Body() body: unknown) {
    const schema = z.object({
      type: z.enum(['contact', 'admission', 'emergency']).default('contact'),
      name: z.string().trim().min(1, 'Name is required').max(150),
      email: z.string().trim().email('Valid email address is required'),
      phone: z.string().trim().max(30).optional().nullable(),
      category: z.string().trim().max(100).optional().nullable(),
      neet_score: z.string().trim().max(50).optional().nullable(),
      subject: z.string().trim().max(200).optional().nullable(),
      message: z.string().trim().min(1, 'Message is required').max(5000),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new DomainError(422, 'VALIDATION', parsed.error.issues[0]?.message || 'Invalid inquiry details.');
    }
    const d = parsed.data;
    const id = randomUUID();

    const insertRes = await db.query(
      `INSERT INTO public_inquiries (id, type, name, email, phone, category, neet_score, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending')
       RETURNING *`,
      [id, d.type, d.name, d.email, d.phone || null, d.category || null, d.neet_score || null, d.subject || null, d.message]
    );

    return {
      success: true,
      message: 'Inquiry ticket registered successfully. Our administrative team will reach out within 24 working hours.',
      data: insertRes.rows[0],
    };
  }

  @Get('public/inquiries') async listPublicInquiries(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page') pageStr = '1',
    @Query('limit') limitStr = '20',
    @Req() req?: Request,
  ) {
    if (req) await session(req);
    const page = Math.max(1, parseInt(pageStr) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr) || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (type && type !== 'ALL') {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }
    if (status && status !== 'ALL') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await db.query(`SELECT COUNT(*)::int AS total FROM public_inquiries ${whereClause}`, params);
    const total = countRes.rows[0]?.total || 0;

    const dataParams = [...params, limit, offset];
    const dataRes = await db.query(
      `SELECT * FROM public_inquiries ${whereClause} ORDER BY created_at DESC LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return {
      success: true,
      data: dataRes.rows,
      items: dataRes.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // ─── Generic Resource Endpoints ───
  @Get(':resource/:id') async detail(
    @Param('resource') r: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return service(r).detail(r, id, await session(req));
  }
  @Get(':resource') async list(
    @Param('resource') r: string,
    @Query() query: Record<string, string>,
    @Req() req: Request,
  ) {
    return service(r).list(r, await session(req), query);
  }
  @Post(':resource') async create(
    @Param('resource') r: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return service(r).create(r, body, await session(req));
  }
  @Post(':resource/:id/:action') async action(
    @Param('resource') r: string,
    @Param('id') id: string,
    @Param('action') action: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return service(r).action(
      r,
      id,
      action,
      body,
      await session(req),
      req.headers['idempotency-key'] as string,
    );
  }
}
@Module({ controllers: [ApiController] })
class AppModule { }
async function main() {
  await db.migrate();
  await seed(db);
  await seedWebsite(db);
  await seedClinical(db);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
    bodyParser: false,
  });
  app.useBodyParser('json', { limit: '7mb' });
  app.set('trust proxy', 'loopback');
  app.use((req: Request, res: Response, next: () => void) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Correlation-ID', randomUUID());
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'local';
    const bucketKey = `${clientIp}:${req.path.includes('auth') ? 'auth' : req.path.includes('enquiry') ? 'public' : 'api'}`;
    const now = Date.now();
    let entry = rate.get(bucketKey);
    if (!entry || entry.reset < now) {
      entry = { count: 0, reset: now + 60000 };
      rate.set(bucketKey, entry);
    }
    entry.count++;
    if (rate.size > 10000) for (const [key, item] of rate) if (item.reset < now) rate.delete(key);
    const max = bucketKey.endsWith('api') ? 600 : 60;
    if (entry.count > max) {
      res.setHeader('Retry-After', '60');
      res.status(429).json({
        error: { code: 'RATE_LIMIT', message: 'Too many requests. Try again in one minute.' },
      });
      return;
    }
    next();
  });
  app.useGlobalFilters({
    catch(error: unknown, host: any) {
      const res = host.switchToHttp().getResponse() as Response;
      let status = 500,
        code = 'INTERNAL',
        message = 'The request could not be completed.';
      if (error instanceof DomainError) {
        status = error.status;
        code = error.code;
        message = error.message;
      } else if (error instanceof HttpException) {
        status = error.getStatus();
        code = 'HTTP_ERROR';
        message =
          status === 413
            ? 'Request is too large.'
            : status === 404
              ? 'Route not found.'
              : 'Invalid request.';
      } else if ((error as { code?: string })?.code === '23505') {
        status = 409;
        code = 'DUPLICATE';
        message = 'This record or reference already exists.';
      } else if ((error as { code?: string })?.code === '23503') {
        status = 422;
        code = 'RELATION';
        message = 'A referenced record is not available.';
      } else {
        console.error('API failure', error instanceof Error ? error.message : 'unknown');
      }
      res
        .status(status)
        .json({ error: { code, message, correlation_id: res.getHeader('X-Correlation-ID') } });
    },
  });
  // Transport is bounded to 7 MB; decoded uploads are independently limited to 5 MB.
  await app.listen(Number(process.env.API_PORT) || 4000, '127.0.0.1');
  console.log('Medora development API: http://127.0.0.1:4000');
  const stop = async () => {
    await app.close();
    await db.close();
    process.exit(0);
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}
main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
