export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    const geo = (req as any).geo || {};
    const { latitude, longitude } = geo;

    // Return a simple response with just the essential data
    return new Response(
      JSON.stringify({
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    // Return a simple error response
    return new Response(
      JSON.stringify({
        latitude: null,
        longitude: null,
        error: "Failed to get location"
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 