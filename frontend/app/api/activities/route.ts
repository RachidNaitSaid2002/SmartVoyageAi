import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const minRating = parseFloat(searchParams.get('minRating') || '0');
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');

        // Read standard activities
        const dockerPath = path.join(process.cwd(), 'data', 'Activites.json');
        const localPath = path.join(process.cwd(), '..', 'backend', 'data', 'Activites.json');
        const dataPath = fs.existsSync(dockerPath) ? dockerPath : localPath;
        let activities = [];
        try {
            activities = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        } catch (e) { }

        // Read free activities
        const dockerFreePath = path.join(process.cwd(), 'data', 'freeactivites.json');
        const localFreePath = path.join(process.cwd(), '..', 'backend', 'data', 'freeactivites.json');
        const freeDataPath = fs.existsSync(dockerFreePath) ? dockerFreePath : localFreePath;
        let freeActivities = [];
        try {
            const rawFree = JSON.parse(fs.readFileSync(freeDataPath, 'utf8'));
            // Normalize to match Activites.json schema expected by frontend
            freeActivities = rawFree.map((f: any) => {
                let priceStr = '0';
                if (f?.offerGroup?.lowestPrice) {
                    priceStr = f.offerGroup.lowestPrice.replace(/[^0-9.]/g, '');
                }
                return {
                    title: f?.name || '',
                    score: f?.rating || '0',
                    price: priceStr,
                    image_url: f?.image || '',
                    duration: f?.subcategories ? f.subcategories.join(', ') : 'Activité Libre'
                };
            });
        } catch (e) { }

        let allActivities = [...activities, ...freeActivities];

        allActivities = allActivities.filter((item: any) => {
            const name = item?.title || '';
            const rating = parseFloat(item?.score || '0');
            const price = parseFloat(item?.price || '0');

            const nameMatch = name.toLowerCase().includes(search.toLowerCase());
            const ratingMatch = isNaN(rating) ? true : rating >= minRating;
            const priceMatch = (isNaN(price) ? 0 : price) <= maxPrice;

            return nameMatch && ratingMatch && priceMatch;
        });

        // Limit to 50 for performance
        return NextResponse.json(allActivities.slice(0, 50));
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
