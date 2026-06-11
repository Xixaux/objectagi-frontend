// src/app/api/create-hierarchy-file/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { name, hierarchyId } = await req.json();

    if (!name || !hierarchyId) {
      return NextResponse.json(
        { error: 'Missing name or hierarchyId' },
        { status: 400 }
      );
    }

    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dir = path.join(process.cwd(), 'public', 'hierarchy', hierarchyId);
    const filePath = path.join(dir, `${safeName}.json`);

    // Ensure directory exists
    await fs.promises.mkdir(dir, { recursive: true });

    // Write file
    const payload = {
      name,
      hierarchyId,
      createdAt: new Date().toISOString(),
      fullPath: `hierarchy/${hierarchyId}/${safeName}.json`,
    };

    await fs.promises.writeFile(filePath, JSON.stringify(payload, null, 2));

    return NextResponse.json({
      success: true,
      path: `/hierarchy/${hierarchyId}/${safeName}.json`,
      filePath: filePath.replace(process.cwd(), ''),
    });
  } catch (err) {
    console.error('File creation error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}