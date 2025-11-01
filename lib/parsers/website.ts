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
  extractDomain,
} from './utils';

export class WebsiteParser implements EventParser {
  private platform: EventPlatform = 'website';

  canParse(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async parse(url: string): Promise<Event> {
    if (!this.canParse(url)) {
      throw new ParserError('Invalid URL', this.platform, url);
    }

    try {
      const response = await fetchWithTimeout(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const jsonLdData = this.extractJsonLd($);

      const title = this.extractTitle($, jsonLdData);
      const description = this.extractDescription($, jsonLdData);
      const dates = this.extractDates($, jsonLdData);
      const location = this.extractLocation($, jsonLdData);
      const organizer = this.extractOrganizer($, jsonLdData, url);
      const price = this.extractPrice($, jsonLdData);
      const imageUrl = this.extractImage($, jsonLdData);
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
        `Failed to parse website event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.platform,
        url
      );
    }
  }

  private extractJsonLd($: cheerio.CheerioAPI): any {
    const jsonLdScripts = $('script[type="application/ld+json"]');

    for (let i = 0; i < jsonLdScripts.length; i++) {
      try {
        const json = JSON.parse($(jsonLdScripts[i]).html() || '{}');
        if (json['@type'] === 'Event' || (Array.isArray(json) && json.some(item => item['@type'] === 'Event'))) {
          return Array.isArray(json) ? json.find(item => item['@type'] === 'Event') : json;
        }
      } catch {
      }
    }

    return null;
  }

  private extractTitle($: cheerio.CheerioAPI, jsonLd: any): string {
    if (jsonLd?.name) {
      return cleanText(jsonLd.name);
    }

    const selectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'h1.event-title',
      'h1[itemprop="name"]',
      'h1',
      'title',
    ];

    for (const selector of selectors) {
      const content = $(selector).attr('content');
      if (content) return cleanText(content);

      const text = cleanText($(selector).first().text());
      if (text) return text;
    }

    return 'Event';
  }

  private extractDescription($: cheerio.CheerioAPI, jsonLd: any): string {
    if (jsonLd?.description) {
      return cleanText(jsonLd.description);
    }

    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
      '[itemprop="description"]',
      '.event-description',
      '.description',
    ];

    for (const selector of selectors) {
      const content = $(selector).attr('content');
      if (content) return cleanText(content);

      const text = cleanText($(selector).first().text());
      if (text && text.length > 20) return text;
    }

    return 'No description available';
  }

  private extractDates($: cheerio.CheerioAPI, jsonLd: any): Event['dates'] {
    let start = '';
    let end: string | undefined;

    if (jsonLd?.startDate) {
      start = parseDate(jsonLd.startDate);
      if (jsonLd.endDate) {
        end = parseDate(jsonLd.endDate);
      }
    } else {
      const dateSelectors = [
        'time[itemprop="startDate"]',
        '[itemprop="startDate"]',
        'time[datetime]',
        '.event-date time',
      ];

      for (const selector of dateSelectors) {
        const datetime = $(selector).first().attr('datetime');
        if (datetime) {
          start = parseDate(datetime);
          break;
        }

        const content = $(selector).first().attr('content');
        if (content) {
          start = parseDate(content);
          break;
        }
      }
    }

    if (!start) {
      start = new Date().toISOString();
    }

    return {
      start,
      end,
      timezone: 'UTC',
    };
  }

  private extractLocation($: cheerio.CheerioAPI, jsonLd: any): Event['location'] {
    if (jsonLd?.location) {
      const loc = jsonLd.location;

      if (loc['@type'] === 'VirtualLocation') {
        return {
          type: 'virtual',
          url: loc.url,
        };
      }

      if (loc['@type'] === 'Place') {
        const address = loc.address || {};
        let country = address.addressCountry;

        if (typeof country === 'object') {
          country = country.name || country['@id'] || '';
        }

        return {
          type: 'physical',
          venue: loc.name,
          address: address.streetAddress,
          city: address.addressLocality,
          state: address.addressRegion,
          country: typeof country === 'string' ? country : undefined,
        };
      }

      if (typeof loc === 'string') {
        return {
          type: 'physical',
          venue: loc,
        };
      }
    }

    const locationSelectors = [
      '[itemprop="location"]',
      '.event-location',
      '.location',
      '[data-location]',
    ];

    for (const selector of locationSelectors) {
      const text = cleanText($(selector).first().text());
      if (text) {
        const isVirtual = ['online', 'virtual', 'zoom', 'webinar'].some(keyword =>
          text.toLowerCase().includes(keyword)
        );

        return {
          type: isVirtual ? 'virtual' : 'physical',
          venue: text,
        };
      }
    }

    return {
      type: 'physical',
    };
  }

  private extractOrganizer($: cheerio.CheerioAPI, jsonLd: any, url: string): Event['organizer'] {
    let name = '';
    let organizerUrl: string | undefined;

    if (jsonLd?.organizer) {
      const org = jsonLd.organizer;

      if (Array.isArray(org)) {
        const firstOrg = org[0];
        name = typeof firstOrg === 'object' ? (firstOrg.name || '') : cleanText(String(firstOrg));
        organizerUrl = typeof firstOrg === 'object' ? firstOrg.url : undefined;
      } else if (typeof org === 'object') {
        name = org.name || '';
        organizerUrl = org.url;
      } else {
        name = cleanText(String(org));
      }
    } else {
      const organizerSelectors = [
        '[itemprop="organizer"]',
        '.event-organizer',
        '.organizer',
      ];

      for (const selector of organizerSelectors) {
        const text = cleanText($(selector).first().text());
        if (text) {
          name = text;
          break;
        }
      }
    }

    return {
      name: name || extractDomain(url),
      url: organizerUrl,
    };
  }

  private extractPrice($: cheerio.CheerioAPI, jsonLd: any): Event['price'] {
    if (jsonLd?.offers) {
      const offer = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;

      if (offer.price) {
        const price = parseFloat(offer.price);
        return {
          isFree: price === 0,
          amount: price > 0 ? price : undefined,
          currency: offer.priceCurrency || 'USD',
        };
      }
    }

    const priceSelectors = [
      '[itemprop="price"]',
      '.event-price',
      '.price',
      '[data-price]',
    ];

    for (const selector of priceSelectors) {
      const text = cleanText($(selector).first().text());
      if (text) {
        const isFree = text.toLowerCase().includes('free');
        if (isFree) {
          return { isFree: true };
        }

        const match = text.match(/\$?(\d+(?:\.\d{2})?)/);
        if (match) {
          return {
            isFree: false,
            amount: parseFloat(match[1]),
            currency: 'USD',
          };
        }
      }
    }

    return { isFree: true };
  }

  private extractImage($: cheerio.CheerioAPI, jsonLd: any): string | undefined {
    if (jsonLd?.image) {
      const image = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image;
      if (typeof image === 'string' && image.startsWith('http')) {
        return image;
      }
      if (image.url && image.url.startsWith('http')) {
        return image.url;
      }
    }

    const imageSelectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      '[itemprop="image"]',
      '.event-image img',
    ];

    for (const selector of imageSelectors) {
      const content = $(selector).attr('content');
      if (content && content.startsWith('http')) {
        return content;
      }

      const src = $(selector).attr('src');
      if (src && src.startsWith('http')) {
        return src;
      }
    }

    return undefined;
  }

  private extractTags($: cheerio.CheerioAPI): string[] {
    const tags: string[] = [];

    const tagSelectors = [
      'meta[property="article:tag"]',
      '[itemprop="keywords"]',
      '.event-tags .tag',
      '.tags .tag',
    ];

    for (const selector of tagSelectors) {
      const content = $(selector).attr('content');
      if (content) {
        tags.push(...content.split(',').map(tag => cleanText(tag)));
      } else {
        $(selector).each((_, el) => {
          const tag = cleanText($(el).text());
          if (tag) tags.push(tag);
        });
      }
    }

    return [...new Set(tags)];
  }
}

export const websiteParser = new WebsiteParser();
