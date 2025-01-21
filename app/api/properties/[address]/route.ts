import { NextRequest, NextResponse } from 'next/server';
import { getPropertyByAddress } from '@/lib/rentcast';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ address: string }> } // Adjusted to match Promise type
) {
  try {
    // Resolve the promise for params
    const resolvedParams = await context.params;
    const address = resolvedParams.address;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const property = await getPropertyByAddress(decodeURIComponent(address));

    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error searching for property:', error);
    return NextResponse.json(
      { error: 'Failed to search for property' },
      { status: 500 }
    );
  }
}
