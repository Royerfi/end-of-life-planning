import pool from './db';

const RENTCAST_API_KEY = process.env.NEXT_PUBLIC_RENTCAST_API_KEY;

if (!RENTCAST_API_KEY) {
  console.error('Rentcast API key is not set. Please set NEXT_PUBLIC_RENTCAST_API_KEY in your .env.local file.');
}

export interface TaxAssessment {
  year: number;
  value: number;
}

export interface PropertyTax {
  year: number;
  amount: number;
}

export interface Property {
  id: string;
  address: string;
  price: number | null;
  squareFootage: number | null;
  yearBuilt: number | null;
  ownerName: string | null;
  ownerType: string | null;
  legalDescription: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  taxAssessments: TaxAssessment[];
  propertyTaxes: PropertyTax[];
  lastSaleDate: string | null;
  lastSalePrice: number | null;
  lotSize: number | null;
  county: string | null;
  subdivision: string | null;
}

export async function getProperties(): Promise<Property[]> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM properties');
    return result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      address: row.address as string,
      price: row.price as number | null,
      squareFootage: row.square_footage as number | null,
      yearBuilt: row.year_built as number | null,
      ownerName: row.owner_name as string | null,
      ownerType: row.owner_type as string | null,
      legalDescription: row.legal_description as string | null,
      bedrooms: row.bedrooms as number | null,
      bathrooms: row.bathrooms as number | null,
      taxAssessments: row.tax_assessments as TaxAssessment[],
      propertyTaxes: row.property_taxes as PropertyTax[],
      lastSaleDate: row.last_sale_date as string | null,
      lastSalePrice: row.last_sale_price as number | null,
      lotSize: row.lot_size as number | null,
      county: row.county as string | null,
      subdivision: row.subdivision as string | null,
    }));
  } catch (error) {
    console.error('Error fetching properties from database:', error);
    return [];
  } finally {
    client.release();
  }
}

export async function getPropertyByAddress(address: string): Promise<Property | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.rentcast.io/v1/properties?address=${encodedAddress}`;

    console.log('Fetching property from Rentcast API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Api-Key': RENTCAST_API_KEY || '',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Rentcast API error:', response.status, errorText);
      throw new Error(`Failed to fetch property: ${response.status} ${response.statusText}`);
    }

    const data: {
      id: string;
      formattedAddress: string;
      lastSalePrice: number | null;
      squareFootage: number | null;
      yearBuilt: number | null;
      owner?: { names: string[]; type: string | null };
      legalDescription: string | null;
      bedrooms: number | null;
      bathrooms: number | null;
      taxAssessments?: Record<string, { value: number }>;
      propertyTaxes?: Record<string, { total: number }>;
      lastSaleDate: string | null;
      lotSize: number | null;
      county: string | null;
      subdivision: string | null;
    }[] = await response.json();

    console.log('Rentcast API response:', data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Property not found or unexpected API response structure:', data);
      return null;
    }

    const property = data[0];
    return {
      id: property.id || '',
      address: property.formattedAddress || '',
      price: property.lastSalePrice || null,
      squareFootage: property.squareFootage || null,
      yearBuilt: property.yearBuilt || null,
      ownerName: property.owner?.names?.join(', ') || null,
      ownerType: property.owner?.type || null,
      legalDescription: property.legalDescription || null,
      bedrooms: property.bedrooms || null,
      bathrooms: property.bathrooms || null,
      taxAssessments: Object.entries(property.taxAssessments || {}).map(([year, assessment]) => ({
        year: parseInt(year),
        value: assessment.value,
      })),
      propertyTaxes: Object.entries(property.propertyTaxes || {}).map(([year, tax]) => ({
        year: parseInt(year),
        amount: tax.total,
      })),
      lastSaleDate: property.lastSaleDate || null,
      lastSalePrice: property.lastSalePrice || null,
      lotSize: property.lotSize || null,
      county: property.county || null,
      subdivision: property.subdivision || null,
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function addProperty(property: Property): Promise<Property> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery = `
      INSERT INTO properties (
        id, address, price, square_footage, year_built, owner_name, owner_type, legal_description, bedrooms, bathrooms,
        tax_assessments, property_taxes, last_sale_date, last_sale_price, lot_size, county, subdivision
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const values = [
      property.id,
      property.address,
      property.price,
      property.squareFootage,
      property.yearBuilt,
      property.ownerName,
      property.ownerType,
      property.legalDescription,
      property.bedrooms,
      property.bathrooms,
      JSON.stringify(property.taxAssessments),
      JSON.stringify(property.propertyTaxes),
      property.lastSaleDate,
      property.lastSalePrice,
      property.lotSize,
      property.county,
      property.subdivision,
    ];
    const result = await client.query(insertQuery, values);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
