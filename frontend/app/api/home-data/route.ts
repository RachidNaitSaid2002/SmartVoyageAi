import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const dataDir = path.join(process.cwd(), '..', 'backend', 'data');

        // Read and parse JSON files
        const hotelsRaw = await fs.readFile(path.join(dataDir, 'HotelsData.json'), 'utf8');
        const activitiesRaw = await fs.readFile(path.join(dataDir, 'Activites.json'), 'utf8');
        const restaurantsRaw = await fs.readFile(path.join(dataDir, 'restaurantDetails.json'), 'utf8');

        const hotelsData = JSON.parse(hotelsRaw);
        const activitiesData = JSON.parse(activitiesRaw);
        const restaurantsData = JSON.parse(restaurantsRaw);

        // Format top items for each category
        const topHotels = hotelsData.slice(0, 4).map((h: any) => {
            let imgUrl = h.location?.thumbnail?.photoSizeDynamic?.urlTemplate;
            if (imgUrl) imgUrl = imgUrl.replace('?w=1200&h=1200', '?w=600&h=800');
            return {
                id: h.location?.locationV2?.locationId || '',
                title: h.location?.locationV2?.names?.name || 'Hotel',
                reviews: h.location?.reviewSummary?.count?.toString() || '0',
                price: h.location?.locationV2?.hotelPriceRanges?.minimum?.toString() || '0',
                img: imgUrl || 'https://media-cdn.tripadvisor.com/media/photo-o/1b/37/be/86/caption.jpg'
            };
        });

        const topActivities = activitiesData.slice(0, 4).map((a: any) => {
            return {
                id: a.id || '',
                title: a.title || 'Activity',
                reviews: a.review_count?.toString() || '0',
                price: a.price?.toString() || '0',
                img: a.image_url || 'https://media-cdn.tripadvisor.com/media/photo-s/0e/b1/0c/31/agadir.jpg'
            };
        });

        const topRestaurants = restaurantsData.slice(0, 4).map((r: any) => {
            return {
                id: r.id || '',
                title: r.name || 'Restaurant',
                type: r.cuisines?.join(', ') || 'Moroccan',
                reviews: r.numberOfReviews?.toString() || '0',
                img: r.image || 'https://media-cdn.tripadvisor.com/media/photo-o/1b/37/be/84/caption.jpg'
            };
        });

        return NextResponse.json({
            hotels: topHotels,
            activities: topActivities,
            restaurants: topRestaurants
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}