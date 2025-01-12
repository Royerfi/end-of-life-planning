import { RealEstate } from '@/types/realEstate';

const API_URL = '/api/real-estate';

export const realEstateService = {
  async getAll(): Promise<RealEstate[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch real estate properties');
    }
    return response.json();
  },

  async getById(id: number): Promise<RealEstate> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch real estate property');
    }
    return response.json();
  },

  async create(property: Omit<RealEstate, 'id'>): Promise<RealEstate> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    });
    if (!response.ok) {
      throw new Error('Failed to create real estate property');
    }
    return response.json();
  },

  async update(id: number, property: Partial<RealEstate>): Promise<RealEstate> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    });
    if (!response.ok) {
      throw new Error('Failed to update real estate property');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete real estate property');
    }
  },
};

