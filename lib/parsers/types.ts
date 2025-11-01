import { Event } from '@/lib/types';

export interface EventParser {
  canParse(url: string): boolean;
  parse(url: string): Promise<Event>;
}

export interface ParserOptions {
  timeout?: number;
  retries?: number;
}
