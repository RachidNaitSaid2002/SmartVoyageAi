import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const minRating = parseFloat(searchParams.get('minRating') || '0');
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');

        const dockerPath = path.join(process.cwd(), 'data', 'HotelsData.json');
        const localPath = path.join(process.cwd(), '..', 'backend', 'data', 'HotelsData.json');
        const dataPath = fs.existsSync(dockerPath) ? dockerPath : localPath;
        const fileContents = fs.readFileSync(dataPath, 'utf8');
        let data = JSON.parse(fileContents);

        data = data.filter((item: any) => {
            const name = item?.location?.locationV2?.names?.name || '';
            const rating = item?.location?.reviewSummary?.rating || 0;
            const price = item?.location?.locationV2?.hotelPriceRanges?.minimum || 0;

            const nameMatch = name.toLowerCase().includes(search.toLowerCase());
            const ratingMatch = rating >= minRating;
            const priceMatch = price <= maxPrice;

            return nameMatch && ratingMatch && priceMatch;
        });

        return NextResponse.json(data.slice(0, 50));
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
