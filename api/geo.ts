export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(req: Request) {
    const geo = (req as any).geo || {};
  
    // Log exactly what we got
    console.log("🔍 req.geo contents:", JSON.stringify(geo, null, 2));
  
    const hasLatLon = geo.latitude != null && geo.longitude != null;
    const hasRegion = geo.region != null;
  
    const latitude = hasLatLon ? geo.latitude : 34.0522;
    const longitude = hasLatLon ? geo.longitude : -118.2437;
    const city = geo.city ?? "Los Angeles";
    const region = geo.region ?? "CA";
    const country = geo.country ?? "US";
  
    const usedFallback = !hasLatLon && !hasRegion;
  
    // Optional: Add region_key logic here if you want to return that too
    const regionKey = hasLatLon ? null : region.toLowerCase(); // e.g. "ca"
  
    return new Response(
      JSON.stringify({
        latitude,
        longitude,
        city,
        region,
        country,
        regionKey,
        usedFallback
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }