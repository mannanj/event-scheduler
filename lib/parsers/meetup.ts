import * as cheerio from 'cheerio';
import { Event, EventPlatform } from '@/lib/types';
import { EventParser } from './types';
import {
  ParserError,
  generateEventId,
  cleanText,
  parseDate,
  fetchWithTimeout,
  validateEvent,
} from './utils';

export class MeetupParser implements EventParser {
  private platform: EventPlatform = 'meetup';

  canParse(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('meetup.com');
    } catch {
      return false;
    }
  }

  async parse(url: string): Promise<Event> {
    if (!this.canParse(url)) {
      throw new ParserError('Invalid Meetup URL', this.platform, url);
    }

    try {
      const response = await fetchWithTimeout(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const title = this.extractTitle($);
      const description = this.extractDescription($);
      const dates = this.extractDates($);
      const location = this.extractLocation($);
      const organizer = this.extractOrganizer($, url);
      const price = this.extractPrice($);
      const imageUrl = this.extractImage($);
      const tags = this.extractTags($);

      const event: Partial<Event> = {
        id: generateEventId(this.platform, url),
        title,
        description,
        dates,
        location,
        organizer,
        price,
        tags,
        platform: this.platform,
        sourceUrl: url,
        imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!validateEvent(event)) {
        throw new ParserError('Failed to extract required event fields', this.platform, url);
      }

      return event;
    } catch (error) {
      if (error instanceof ParserError) {
        throw error;
      }
      throw new ParserError(
        `Failed to parse Meetup event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform,
        url
      );
    }
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    const selectors = [
      'h1[data-event-title]',
      'h1.text--sectionTitle',
      'h1',
      '[data-testid="event-title"]',
    ];

    for (const selector of selectors) {
      const text = cleanText($(selector).first().text());
      if (text) return text;
    }

    return 'Meetup Event';
  }

  private extractDescription($: cheerio.CheerioAPI): string {
    const selectors = [
      '[data-event-description]',
      '.event-description',
      '[data-testid="event-description"]',
      '.description',
    ];

    for (const selector of selectors) {
      const text = cleanText($(selector).first().text());
      if (text) return text;
    }

    return 'No description available';
  }

  private extractDates($: cheerio.CheerioAPI): Event['dates'] {
    const startSelectors = [
      'time[datetime]',
      '[data-event-start-time]',
      '[data-testid="event-time-start"]',
    ];

    let start = '';
    for (const selector of startSelectors) {
      const datetime = $(selector).first().attr('datetime');
      if (datetime) {
        start = parseDate(datetime);
        break;
      }
    }

    if (!start) {
      start = new Date().toISOString();
    }

    return {
      start,
      timezone: 'UTC',
    };
  }

  private extractLocation($: cheerio.CheerioAPI): Event['location'] {
    const venueSelectors = [
      '[data-event-venue]',
      '.venueDisplay',
      '[data-testid="event-venue"]',
    ];

    const onlineIndicators = [
      'online event',
      'virtual',
      'zoom',
      'online',
    ];

    let venue = '';
    for (const selector of venueSelectors) {
      const text = cleanText($(selector).first().text());
      if (text) {
        venue = text;
        break;
      }
    }

    const isOnline = onlineIndicators.some(indicator =>
      venue.toLowerCase().includes(indicator)
    );

    return {
      type: isOnline ? 'virtual' : 'physical',
      venue: venue || undefined,
    };
  }

  private extractOrganizer($: cheerio.CheerioAPI, url: string): Event['organizer'] {
    const nameSelectors = [
      '[data-group-name]',
      '.groupLink',
      '[data-testid="group-name"]',
    ];

    let name = '';
    for (const selector of nameSelectors) {
      const text = cleanText($(selector).first().text());
      if (text) {
        name = text;
        break;
      }
    }

    return {
      name: name || 'Meetup Organizer',
      url: url.split('/events/')[0],
    };
  }

  private extractPrice($: cheerio.CheerioAPI): Event['price'] {
    const priceSelectors = [
      '[data-event-fee]',
      '.eventPrice',
      '[data-testid="event-price"]',
    ];

    for (const selector of priceSelectors) {
      const text = cleanText($(selector).first().text());
      if (text) {
        const isFree = text.toLowerCase().includes('free');
        if (!isFree) {
          const match = text.match(/\$?(\d+(?:\.\d{2})?)/);
          if (match) {
            return {
              isFree: false,
              amount: parseFloat(match[1]),
              currency: 'USD',
            };
          }
        }
        return { isFree: true };
      }
    }

    return { isFree: true };
  }

  private extractImage($: cheerio.CheerioAPI): string | undefined {
    const imageSelectors = [
      '[data-event-image]',
      '.event-photo img',
      '[data-testid="event-image"]',
      'meta[property="og:image"]',
    ];

    for (const selector of imageSelectors) {
      const src = $(selector).first().attr('src') || $(selector).first().attr('content');
      if (src && src.startsWith('http')) {
        return src;
      }
    }

    return undefined;
  }

  private extractTags($: cheerio.CheerioAPI): string[] {
    const tags: string[] = [];
    const tagSelectors = [
      '[data-event-tag]',
      '.event-tag',
      '[data-testid="event-tag"]',
    ];

    for (const selector of tagSelectors) {
      $(selector).each((_, el) => {
        const tag = cleanText($(el).text());
        if (tag) tags.push(tag);
      });
    }

    return tags;
  }
}

export const meetupParser = new MeetupParser();
