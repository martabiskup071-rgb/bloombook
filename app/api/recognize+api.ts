// Серверний проксі для Pl@ntNet — обходить CORS обмеження браузера
const PLANTNET_API_KEY = process.env.EXPO_PUBLIC_PLANTNET_API_KEY ?? '';
const PLANTNET_BASE_URL = 'https://my-api.plantnet.org/v2/identify/all';

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();

    const url = `${PLANTNET_BASE_URL}?api-key=${PLANTNET_API_KEY}&lang=uk&nb-results=5`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Pl@ntNet error: ${response.status}`, detail: text }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message ?? 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
