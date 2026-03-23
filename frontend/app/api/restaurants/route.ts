import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const minRating = parseFloat(searchParams.get('minRating') || '0');
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');

        const dataPath = '/home/rachid/BigDisk/workspace/Projects/file_rouge/backend/data/restaurantDetails.json';
        const fileContents = fs.readFileSync(dataPath, 'utf8');
        let data = JSON.parse(fileContents);

        data = data.filter((item: any) => {
            const name = item?.name || '';
            const rating = item?.rating || 0;
            let price = 0;

            // Try extracting price from priceRange e.g. "$10.00 - $30.00"
            if (item?.priceRange) {
                const match = item.priceRange.match(/\d+(\.\d+)?/);
                if (match) price = parseFloat(match[0]);
            } else if (item?.priceLevel) {
                price = item.priceLevel.length * 10; // $ = 10, $$ = 20 etc.
            }

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
