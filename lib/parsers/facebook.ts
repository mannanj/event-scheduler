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

export class FacebookParser implements EventParser {
  private platform: EventPlatform = 'facebook';

  canParse(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('facebook.com') && url.includes('/events/');
    } catch {
      return false;
    }
  }

  async parse(url: string): Promise<Event> {
    if (!this.canParse(url)) {
      throw new ParserError('Invalid Facebook Events URL', this.platform, url);
    }

    try {
      const response = await fetchWithTimeout(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const title = this.extractTitle($);
      const description = this.extractDescription($);
      const dates = this.extractDates($);
      const location = this.extractLocation($);
      const organizer = this.extractOrganizer($);
      const price = this.extractPrice($);
      const imageUrl = this.extractImage($);

      const event: Partial<Event> = {
        id: generateEventId(this.platform, url),
        title,
        description,
        dates,
        location,
        organizer,
        price,
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
        `Failed to parse Facebook event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform,
        url
      );
    }
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    const selectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'h1',
      'title',
    ];

    for (const selector of selectors) {
      const content = $(selector).attr('content');
      if (content) return cleanText(content);

      const text = cleanText($(selector).first().text());
      if (text && !text.includes('Facebook')) return text;
    }

    return 'Facebook Event';
  }

  private extractDescription($: cheerio.CheerioAPI): string {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
      '[data-testid="event-description"]',
    ];

    for (const selector of selectors) {
      const content = $(selector).attr('content');
      if (content) return cleanText(content);

      const text = cleanText($(selector).first().text());
      if (text) return text;
    }

    return 'No description available';
  }

  private extractDates($: cheerio.CheerioAPI): Event['dates'] {
    const jsonLdScripts = $('script[type="application/ld+json"]');

    let start = '';
    jsonLdScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Event' && json.startDate) {
          start = parseDate(json.startDate);
          return false;
        }
      } catch {
      }
    });

    if (!start) {
      start = new Date().toISOString();
    }

    return {
      start,
      timezone: 'UTC',
    };
  }

  private extractLocation($: cheerio.CheerioAPI): Event['location'] {
    const jsonLdScripts = $('script[type="application/ld+json"]');

    let locationData: any = null;
    jsonLdScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Event' && json.location) {
          locationData = json.location;
          return false;
        }
      } catch {
      }
    });

    if (locationData) {
      if (locationData['@type'] === 'VirtualLocation') {
        return {
          type: 'virtual',
          url: locationData.url,
        };
      }

      if (locationData['@type'] === 'Place') {
        return {
          type: 'physical',
          venue: locationData.name,
          address: locationData.address?.streetAddress,
          city: locationData.address?.addressLocality,
          state: locationData.address?.addressRegion,
          country: locationData.address?.addressCountry,
        };
      }
    }

    return {
      type: 'physical',
    };
  }

  private extractOrganizer($: cheerio.CheerioAPI): Event['organizer'] {
    const jsonLdScripts = $('script[type="application/ld+json"]');

    let organizerName = '';
    jsonLdScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Event' && json.organizer) {
          organizerName = json.organizer.name || json.organizer;
          return false;
        }
      } catch {
      }
    });

    return {
      name: organizerName || 'Facebook Event Organizer',
    };
  }

  private extractPrice($: cheerio.CheerioAPI): Event['price'] {
    const jsonLdScripts = $('script[type="application/ld+json"]');

    let isFree = true;
    let amount: number | undefined;
    let currency: string | undefined;

    jsonLdScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Event' && json.offers) {
          const offer = Array.isArray(json.offers) ? json.offers[0] : json.offers;
          if (offer.price && parseFloat(offer.price) > 0) {
            isFree = false;
            amount = parseFloat(offer.price);
            currency = offer.priceCurrency || 'USD';
          }
          return false;
        }
      } catch {
      }
    });

    return {
      isFree,
      amount,
      currency,
    };
  }

  private extractImage($: cheerio.CheerioAPI): string | undefined {
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ];

    for (const selector of selectors) {
      const content = $(selector).first().attr('content');
      if (content && content.startsWith('http')) {
        return content;
      }
    }

    return undefined;
  }
}

export const facebookParser = new FacebookParser();
