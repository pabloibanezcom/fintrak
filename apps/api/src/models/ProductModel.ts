import type { Product } from '@fintrak/types';

const product: Product[] = [];

export const getAll = () => product;

export const getById = (id: string) => product.find((t) => t.id === id);
