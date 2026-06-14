/**
 * @fileOverview Collects the InsightTravelPK knowledge corpus from the very same
 * content modules that render the website. Because this reads the live app data
 * at runtime, the assistant's knowledge updates automatically whenever the site's
 * content changes and is redeployed — there is no separate index to maintain.
 *
 * Add a new `push(...)` block here to teach the assistant about a new content
 * source; everything downstream (chunking, embedding, retrieval) adapts on its own.
 */

import { CONTACTS } from '@/data/contacts';
import { provinces } from '@/lib/data';
import { getDistrictDetail } from '@/lib/district-details';
import { BLOG_POSTS } from '@/lib/blog-data';
import { VIRTUAL_TOUR_LOCATIONS } from '@/data/virtual-tours';

import { SITE_INFO_DOCUMENTS } from './site-info';
import type { KnowledgeDocument } from './types';

function collectContactDocuments(): KnowledgeDocument[] {
  const docs: KnowledgeDocument[] = CONTACTS.map((contact) => ({
    id: `contact-${contact.province.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: `${contact.province} — emergency & tourism contacts`,
    url: '/contact',
    section: 'Contacts',
    text:
      `${contact.province} emergency and tourism contacts (from the InsightTravelPK Contacts page). ` +
      `Emergency numbers — Police: ${contact.emergency.police}, Ambulance: ${contact.emergency.ambulance}, ` +
      `Fire Brigade: ${contact.emergency.fire}, Motorway Police: ${contact.emergency.motorway}. ` +
      `Tourism department: ${contact.tourism.department}. Tourism phone: ${contact.tourism.phone}.` +
      (contact.tourism.website ? ` Official website: ${contact.tourism.website}.` : '') +
      ` Source: ${contact.tourism.source}. Last verified: ${contact.tourism.lastVerified}. ` +
      `Always verify numbers before travel as departments may update their details.`,
    keywords: [contact.province, 'contact', 'emergency', 'police', 'ambulance', 'tourism department', 'helpline'],
  }));

  // A general, nationwide emergency document so generic "emergency numbers" questions match.
  docs.push({
    id: 'contact-pakistan-general',
    title: 'Pakistan nationwide emergency numbers',
    url: '/contact',
    section: 'Contacts',
    text:
      `Common nationwide emergency numbers in Pakistan: Police 15, Rescue/Ambulance 1122 (115 in parts of Sindh), ` +
      `Fire Brigade 16, Motorway Police 130. Full province-by-province emergency and official tourism department ` +
      `contacts are listed on the InsightTravelPK Contacts page at /contact. Verify numbers before travel.`,
    keywords: ['emergency', 'police 15', 'rescue 1122', 'ambulance', 'fire 16', 'motorway 130', 'helpline', 'numbers'],
  });

  return docs;
}

function collectDestinationDocuments(): KnowledgeDocument[] {
  const docs: KnowledgeDocument[] = [];

  for (const province of provinces) {
    const districtNames = province.districts.map((d) => d.name).join(', ');

    docs.push({
      id: `province-${province.slug}`,
      title: `${province.name} (province / region)`,
      url: `/provinces/${province.slug}`,
      section: 'Province guide',
      text:
        `${province.name} is one of the regions of Pakistan covered by InsightTravelPK. ` +
        `Districts and destinations featured: ${districtNames}. ` +
        `Open /provinces/${province.slug} for the regional overview, or a district guide at /districts/[slug].`,
      keywords: [province.name, 'province', 'region', 'districts'],
    });

    for (const district of province.districts) {
      const detail = getDistrictDetail(district.slug);

      if (detail) {
        const attractions = detail.attractions
          .map((a) => `${a.name} (${a.description})`)
          .join('; ');

        docs.push({
          id: `district-${district.slug}`,
          title: `${district.name}, ${province.name} — travel guide`,
          url: `/districts/${district.slug}`,
          section: 'District guide',
          text:
            `${district.name} (${province.name}). ${detail.description} ` +
            `Best time to visit: ${detail.bestTime}. ` +
            `Top attractions: ${attractions}.`,
          keywords: [district.name, province.name, 'district', 'attractions', 'best time to visit'],
        });
      } else {
        docs.push({
          id: `district-${district.slug}`,
          title: `${district.name}, ${province.name}`,
          url: `/districts/${district.slug}`,
          section: 'District guide',
          text: `${district.name} is a destination in ${province.name}, Pakistan, featured on InsightTravelPK. Open /districts/${district.slug} for its travel guide.`,
          keywords: [district.name, province.name, 'district'],
        });
      }
    }
  }

  return docs;
}

function collectBlogDocuments(): KnowledgeDocument[] {
  return BLOG_POSTS.map((post) => ({
    id: `blog-${post.id}`,
    title: `Blog: ${post.title}`,
    url: `/blog/${post.id}`,
    section: 'Travel blog',
    text:
      `Travel blog article "${post.title}" (${post.category}, by ${post.author}, ${post.date}, ${post.readTime}). ` +
      `${post.description} ${post.content}`,
    keywords: [post.title, post.category, 'blog', 'article', post.author],
  }));
}

function collectVirtualTourDocuments(): KnowledgeDocument[] {
  return VIRTUAL_TOUR_LOCATIONS.map((tour) => ({
    id: `tour-${tour.id}`,
    title: `360 virtual tour: ${tour.name}`,
    url: '/virtual-tour',
    section: 'Virtual tours',
    text: `${tour.name} (${tour.province}) is available as a 360 virtual tour on InsightTravelPK at /virtual-tour. ${tour.description}`,
    keywords: [tour.name, tour.province, 'virtual tour', '360', 'video'],
  }));
}

/**
 * Builds the full list of knowledge documents. Pure and synchronous — it only
 * reshapes data that is already loaded in memory, so it is cheap to call.
 */
export function collectKnowledgeDocuments(): KnowledgeDocument[] {
  return [
    ...SITE_INFO_DOCUMENTS,
    ...collectContactDocuments(),
    ...collectDestinationDocuments(),
    ...collectBlogDocuments(),
    ...collectVirtualTourDocuments(),
  ];
}
