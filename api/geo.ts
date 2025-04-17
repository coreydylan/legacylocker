export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req: Request) {
    const geo = (req as any).geo || {};
  
    console.log("🛰️ RAW GEO DATA:", JSON.stringify(geo, null, 2));
  
    const latitude = geo.latitude ?? 34.0522;
    const longitude = geo.longitude ?? -118.2437;
    const city = geo.city ?? "Los Angeles";
    const region = geo.region ?? "CA";
    const country = geo.country ?? "US";
  
    const usedFallback = !geo.latitude && !geo.region;
  
    return new Response(
      JSON.stringify({
        latitude,
        longitude,
        city,
        region,
        country,
        usedFallback
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }