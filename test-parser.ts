import { parseEventUrl } from './lib/parsers';

const testUrls = [
  'https://www.meetup.com/austin-deep-learning/events/307783680/?recId=20ef60a5-e610-4e8b-a3e4-2dccd0df0123&recSource=ml-popular-events-nearby-offline&searchId=2a075689-a339-46ff-85ac-9914056a9ab9&eventOrigin=find_page%24all',
  'https://www.meetup.com/austin-langchain-ai-group/events/311326010/?recId=9e4b6589-ae35-4179-b94c-c886fd8e515e&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/austin-product-strategy/events/311168676/?recId=f0354690-d975-496f-b6e1-e3c89db91d32&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/bitcoin-park-austin/events/311550357/?recId=3b17adab-bdd2-4cf5-a999-6d0cad3101b6&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/remix-austin/events/311460036/?recId=f0354690-d975-496f-b6e1-e3c89db91d32&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/reuneo-speed-networking-group/events/311444767/?recId=9e4b6589-ae35-4179-b94c-c886fd8e515e&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/austin-cto-club/events/311692585/?recId=f0354690-d975-496f-b6e1-e3c89db91d32&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/austin-tech-sales-meetup/events/311376673/?recId=3b17adab-bdd2-4cf5-a999-6d0cad3101b6&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/yourstartupsucks/events/311693814/?recId=3b17adab-bdd2-4cf5-a999-6d0cad3101b6&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/aittg-austin/events/311613673/?recId=f0354690-d975-496f-b6e1-e3c89db91d32&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/reuneo-speed-networking-group/events/311783916/?recId=f0354690-d975-496f-b6e1-e3c89db91d32&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://luma.com/qgn3c4em',
  'https://www.meetup.com/bitcoin-park-austin/events/306401057/?recId=c2f815cb-430a-45aa-936a-08e68cfb63bd&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/artists-and-the-age-of-ai/events/305058121/?recId=c2f815cb-430a-45aa-936a-08e68cfb63bd&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/oklahoma-city-techlahoma/events/311581219/?recId=c2f815cb-430a-45aa-936a-08e68cfb63bd&recSource=ml-popular-events-nearby-online&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/writethedocs-atx-meetup/events/311558105/?recId=c2f815cb-430a-45aa-936a-08e68cfb63bd&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/devday-austin/events/311561431/?recId=c2f815cb-430a-45aa-936a-08e68cfb63bd&recSource=ml-popular-events-nearby-offline&searchId=815a0a50-1632-48e2-8b09-51f89560ba17&eventOrigin=find_page%24all',
  'https://www.meetup.com/bitcoin-park-austin/events/307337224/?eventOrigin=group_events_list',
];

async function testParser() {
  console.log('Testing Event Parser with provided URLs...\n');
  console.log('='.repeat(80));

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\nTest ${i + 1}/${testUrls.length}`);
    console.log(`URL: ${url}`);
    console.log('-'.repeat(80));

    try {
      const result = await parseEventUrl(url);

      if (result.success && result.event) {
        successCount++;
        console.log('✓ SUCCESS');
        console.log(`Title: ${result.event.title}`);
        console.log(`Date: ${result.event.dates.start}`);
        console.log(`Location Type: ${result.event.location.type}`);
        console.log(`Venue: ${result.event.location.venue || 'N/A'}`);
        console.log(`Address: ${result.event.location.address || 'N/A'}`);
        console.log(`City: ${result.event.location.city || 'N/A'}`);
        console.log(`State: ${result.event.location.state || 'N/A'}`);
        console.log(`Country: ${result.event.location.country || 'N/A'}`);
        console.log(`Organizer: ${result.event.organizer.name}`);
        console.log(`Platform: ${result.event.platform}`);
        console.log(`Price: ${result.event.price.isFree ? 'Free' : `$${result.event.price.amount} ${result.event.price.currency}`}`);
      } else {
        failCount++;
        console.log('✗ FAILED');
        console.log(`Error: ${result.error}`);
      }
    } catch (error) {
      failCount++;
      console.log('✗ EXCEPTION');
      console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\nResults: ${successCount} passed, ${failCount} failed out of ${testUrls.length} total`);
  console.log(`Success rate: ${((successCount / testUrls.length) * 100).toFixed(1)}%`);
}

testParser().catch(console.error);
