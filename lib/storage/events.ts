import { promises as fs } from 'fs';
import path from 'path';
import { Event } from '@/lib/types';

const EVENTS_DIR = path.join(process.cwd(), 'data', 'events');

export async function ensureEventsDirectory() {
  try {
    await fs.access(EVENTS_DIR);
  } catch {
    await fs.mkdir(EVENTS_DIR, { recursive: true });
  }
}

export async function getAllEvents(): Promise<Event[]> {
  await ensureEventsDirectory();

  try {
    const files = await fs.readdir(EVENTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const events = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(EVENTS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content) as Event;
      })
    );

    return events;
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  const filePath = path.join(EVENTS_DIR, `${id}.json`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Event;
  } catch (error) {
    console.error(`Error reading event ${id}:`, error);
    return null;
  }
}

export async function saveEvent(event: Event): Promise<void> {
  await ensureEventsDirectory();

  const filePath = path.join(EVENTS_DIR, `${event.id}.json`);
  const content = JSON.stringify(event, null, 2);

  try {
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const filePath = path.join(EVENTS_DIR, `${id}.json`);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
}
