export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req: Request) {
    const geo = (req as any).geo || {};
  
    const latitude = geo.latitude ?? 34.0522;
    const longitude = geo.longitude ?? -118.2437;
    const city = geo.city ?? "Los Angeles";
    const region = geo.region ?? "CA";
    const country = geo.country ?? "US";
    const usedFallback = geo.latitude == null || geo.longitude == null;
  
    console.log(
      JSON.stringify({
        rawGeo: geo,
        usedFallback,
        latitude,
        longitude,
        city,
        region,
        country
      })
    );
  
    return new Response(
      JSON.stringify({ latitude, longitude, city, region, country, usedFallback }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }