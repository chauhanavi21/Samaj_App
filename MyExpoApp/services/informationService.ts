import { informationAPI } from './api';

/*
 * informationService
 *
 * Provides functions to search information records and fetch
 * individual records.
 *
 * NOTE: This uses the backend API routes instead of querying Firestore
 * directly. The current Firestore data does not reliably contain the
 * `tokens` array required for client-side token queries.
 */

export interface InformationRecord {
  id: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  memberId?: string | null;
  number?: string | null;
  otherFields?: Record<string, any>;
}

/**
 * Search for information records whose tokens contain all words in the
 * query. Returns at most 50 records. If no query is provided or the
 * query is empty, returns an empty array.
 *
 * Firestore only allows a single array‑contains‑any in a query. We
 * therefore use array‑contains‑any to find candidate documents, then
 * filter them client‑side to ensure all tokens are present.
 */
export async function searchInformation(name: string): Promise<InformationRecord[]> {
  const raw = name?.trim() || '';
  if (!raw) return [];

  const response = await informationAPI.search(raw);
  if (!response?.success) return [];
  return (response.data ?? []) as InformationRecord[];
}

/**
 * Fetch a single information record by its ID. Returns null if the
 * document does not exist.
 */
export async function getInformationById(id: string): Promise<InformationRecord | null> {
  if (!id) return null;
  const response = await informationAPI.getById(id);
  if (!response?.success) return null;
  return (response.data ?? null) as InformationRecord | null;
}