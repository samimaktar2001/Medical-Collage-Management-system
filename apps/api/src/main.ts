import 'reflect-metadata';
import {
  Controller,
  Module,
  Get,
  Post,
  Req,
  Res,
  Param,
  Body,
  Query,
  HttpException,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { Database } from './database';
import { Domain, DomainError, Actor } from './domain';
import { seed } from './seed';
import { seedWebsite } from './website-seed';
import { Learning } from './learning';
const db = new Database(),
  domain = new Domain(db),
  learning = new Learning(domain);
const service = (name: string) =>
  ['learning', 'submissions', 'requests'].includes(name) ? learning : domain;
const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
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
    if (req.headers.origin !== origin || req.headers['x-requested-with'] !== 'medora')
      throw new DomainError(403, 'ORIGIN', 'Untrusted request.');
    if (!body.name || !body.email || !body.password || !body.institution_id)
      throw new DomainError(422, 'VALIDATION', 'Missing required fields.');
    if (body.password.length < 8)
      throw new DomainError(422, 'VALIDATION', 'Password must be at least 8 characters.');

    const hash = await bcrypt.hash(body.password, 10);
    const id = randomUUID();
    const token = randomBytes(32).toString('hex');
    try {
      await db.query(
        'INSERT INTO users(id, institution_id, name, email, role, active, password_hash, verification_token) VALUES ($1,$2,$3,$4,$5,true,$6,$7)',
        [id, body.institution_id, body.name, body.email, 'student', hash, token]
      );
      // In a real system, send email here. For now, we simulate success.
      return { ok: true, message: 'Signup successful. Please verify your email.' };
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

  @Post('auth/login') async realLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { email?: string; password?: string },
  ) {
    if (req.headers.origin !== origin || req.headers['x-requested-with'] !== 'medora')
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
    res.setHeader('Content-Type', file.mime);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
    );
    res.send(Buffer.from(file.content_base64, 'base64'));
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
class AppModule {}
async function main() {
  await db.migrate();
  await seed(db);
  await seedWebsite(db);
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
