import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const minRating = parseFloat(searchParams.get('minRating') || '0');
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');

        const dataPath = '/home/rachid/BigDisk/workspace/Projects/file_rouge/backend/data/HotelsData.json';
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
