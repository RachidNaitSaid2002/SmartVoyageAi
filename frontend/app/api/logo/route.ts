import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function GET() {
    try {
        const filePath = '/home/rachid/.gemini/antigravity/brain/486f1271-a868-4331-8c51-57e494fc4075/smartvoyageai_logo_1773703858592.png';
        const imageBuffer = await fs.readFile(filePath);

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('Error loading logo', { status: 500 });
    }
}
