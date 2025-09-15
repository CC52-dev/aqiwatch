import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_AQI_API_URL || 'http://46.202.82.152';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const useDemo = searchParams.get('use_demo');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat and lon' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      lat,
      lon,
      ...(useDemo && { use_demo: 'true' })
    });

    const response = await fetch(`${API_BASE_URL}/overview?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    return NextResponse.json(
      { error: `Failed to fetch AQI data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking API health:', error);
    return NextResponse.json(
      { error: `Failed to check API health: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
