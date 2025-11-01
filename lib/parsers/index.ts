import { Event } from '@/lib/types';
import { EventParser } from './types';
import { meetupParser } from './meetup';
import { facebookParser } from './facebook';
import { websiteParser } from './website';
import { ParserError, ParseResult } from './utils';

const parsers: EventParser[] = [
  meetupParser,
  facebookParser,
  websiteParser,
];

export async function parseEventUrl(url: string): Promise<ParseResult> {
  if (!url) {
    return {
      success: false,
      error: 'URL is required',
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      success: false,
      error: 'Invalid URL format',
    };
  }

  for (const parser of parsers) {
    if (parser.canParse(url)) {
      try {
        const event = await parser.parse(url);
        return {
          success: true,
          event,
        };
      } catch (error) {
        if (error instanceof ParserError) {
          continue;
        }
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }
  }

  return {
    success: false,
    error: 'No parser available for this URL',
  };
}

export async function parseMultipleEventUrls(urls: string[]): Promise<ParseResult[]> {
  return Promise.all(urls.map(url => parseEventUrl(url)));
}

export function getSupportedPlatforms(): string[] {
  return ['meetup.com', 'facebook.com/events', 'any website'];
}

export { meetupParser } from './meetup';
export { facebookParser } from './facebook';
export { websiteParser } from './website';
export { ParserError } from './utils';
export type { ParseResult } from './utils';
export type { EventParser } from './types';
