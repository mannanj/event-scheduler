import { Event } from '@/lib/types';

export class ParserError extends Error {
  constructor(message: string, public platform: string, public url?: string) {
    super(message);
    this.name = 'ParserError';
  }
}

export function generateEventId(platform: string, url: string): string {
  const hash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  return `${platform}-${hash}-${Date.now()}`;
}

export function parseDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function cleanText(text: string | undefined | null): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

export async function fetchWithTimeout(
  url: string,
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EventScheduler/1.0)',
      },
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error) {
      throw new ParserError(`Failed to fetch URL: ${error.message}`, 'unknown', url);
    }
    throw new ParserError('Failed to fetch URL', 'unknown', url);
  }
}

export function validateEvent(event: Partial<Event>): event is Event {
  return !!(
    event.id &&
    event.title &&
    event.description &&
    event.dates?.start &&
    event.location &&
    event.organizer &&
    event.price !== undefined &&
    event.platform &&
    event.sourceUrl &&
    event.createdAt &&
    event.updatedAt
  );
}

export interface ParseResult {
  success: boolean;
  event?: Event;
  error?: string;
}
