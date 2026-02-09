import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing file (field: resume)' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use PDF or Word (DOC/DOCX).' },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB).' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.pdf';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Public URL: served from /uploads/resumes/...
    const url = `/uploads/resumes/${safeName}`;
    return NextResponse.json({ url, path: url });
  } catch (err) {
    console.error('Resume upload error:', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
