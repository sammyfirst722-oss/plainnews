export const STATE_COORDINATES: Record<string, [number, number]> = {
  'alabama': [-86.9, 32.8], 'alaska': [-153.5, 64.2], 'arizona': [-111.1, 34.0], 'arkansas': [-92.2, 34.8],
  'california': [-119.4, 36.8], 'colorado': [-105.5, 39.0], 'connecticut': [-72.7, 41.6], 'delaware': [-75.5, 39.0],
  'florida': [-81.5, 27.6], 'georgia': [-83.5, 32.2], 'hawaii': [-155.5, 19.9], 'idaho': [-114.7, 44.1],
  'illinois': [-89.4, 40.6], 'indiana': [-86.1, 39.8], 'iowa': [-93.1, 41.9], 'kansas': [-98.5, 38.5],
  'kentucky': [-84.3, 37.8], 'louisiana': [-91.9, 30.5], 'maine': [-69.4, 45.3], 'maryland': [-76.6, 39.0],
  'massachusetts': [-71.5, 42.2], 'michigan': [-84.5, 44.3], 'minnesota': [-94.6, 46.7], 'mississippi': [-89.7, 32.3],
  'missouri': [-91.8, 38.6], 'montana': [-110.4, 46.9], 'nebraska': [-99.9, 41.1], 'nevada': [-116.4, 38.8],
  'new hampshire': [-71.6, 43.2], 'new jersey': [-74.4, 40.1], 'new mexico': [-105.9, 34.5], 'new york': [-74.2, 43.3],
  'north carolina': [-79.0, 35.8], 'north dakota': [-101.0, 47.5], 'ohio': [-82.9, 40.4], 'oklahoma': [-97.1, 35.0],
  'oregon': [-120.6, 43.8], 'pennsylvania': [-77.2, 41.2], 'rhode island': [-71.5, 41.7], 'south carolina': [-81.2, 34.0],
  'south dakota': [-99.9, 43.9], 'tennessee': [-86.6, 35.5], 'texas': [-99.9, 31.1], 'utah': [-111.1, 39.3],
  'vermont': [-72.6, 44.6], 'virginia': [-79.5, 37.8], 'washington': [-120.7, 47.7], 'west virginia': [-80.5, 38.6],
  'wisconsin': [-89.6, 43.8], 'wyoming': [-107.3, 43.1], 'district of columbia': [-77.0, 38.9]
};

export const STATE_ABBREVIATIONS: Record<string, string> = {
  'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas',
  'ca': 'california', 'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware',
  'fl': 'florida', 'ga': 'georgia', 'hi': 'hawaii', 'id': 'idaho',
  'il': 'illinois', 'in': 'indiana', 'ia': 'iowa', 'ks': 'kansas',
  'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
  'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi',
  'mo': 'missouri', 'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada',
  'nh': 'new hampshire', 'nj': 'new jersey', 'nm': 'new mexico', 'ny': 'new york',
  'nc': 'north carolina', 'nd': 'north dakota', 'oh': 'ohio', 'ok': 'oklahoma',
  'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode island', 'sc': 'south carolina',
  'sd': 'south dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah',
  'vt': 'vermont', 'va': 'virginia', 'wa': 'washington', 'wv': 'west virginia',
  'wi': 'wisconsin', 'wy': 'wyoming', 'dc': 'district of columbia'
};

export const AP_DATELINE_TITLES: Record<string, string> = {
  'Calif.': 'california', 'Tex.': 'texas', 'Fla.': 'florida',
  'Wash.': 'washington', 'Penn.': 'pennsylvania', 'Mass.': 'massachusetts',
  'Colo.': 'colorado', 'Ariz.': 'arizona', 'Tenn.': 'tennessee',
  'Conn.': 'connecticut', 'Okla.': 'oklahoma', 'Minn.': 'minnesota',
  'Wis.': 'wisconsin', 'Ind.': 'indiana', 'Kan.': 'kansas',
  'Mich.': 'michigan', 'Ill.': 'illinois', 'Ga.': 'georgia',
  'N.Y.': 'new york', 'N.J.': 'new jersey', 'N.C.': 'north carolina',
  'S.C.': 'south carolina', 'Va.': 'virginia', 'W.Va.': 'west virginia',
  'Md.': 'maryland', 'Mo.': 'missouri', 'Neb.': 'nebraska'
};

export const CITY_STATE_MAP: Record<string, string> = {
  'los angeles': 'california', 'san francisco': 'california', 'san diego': 'california',
  'san jose': 'california', 'sacramento': 'california', 'oakland': 'california', 'fresno': 'california', 'bakersfield': 'california', 'stockton': 'california', 'modesto': 'california',
  'new york city': 'new york', 'brooklyn': 'new york', 'buffalo': 'new york', 'manhattan': 'new york',
  'chicago': 'illinois',
  'houston': 'texas', 'dallas': 'texas', 'austin': 'texas', 'san antonio': 'texas', 'fort worth': 'texas', 'el paso': 'texas', 'lubbock': 'texas', 'amarillo': 'texas', 'corpus christi': 'texas', 'laredo': 'texas',
  'phoenix': 'arizona', 'tucson': 'arizona', 'mesa': 'arizona',
  'philadelphia': 'pennsylvania', 'philly': 'pennsylvania', 'pittsburgh': 'pennsylvania',
  'jacksonville': 'florida', 'miami': 'florida', 'tampa': 'florida', 'orlando': 'florida',
  'columbus': 'ohio', 'cleveland': 'ohio', 'cincinnati': 'ohio',
  'charlotte': 'north carolina', 'raleigh': 'north carolina',
  'indianapolis': 'indiana',
  'seattle': 'washington', 'spokane': 'washington',
  'denver': 'colorado', 'colorado springs': 'colorado',
  'nashville': 'tennessee', 'memphis': 'tennessee',
  'oklahoma city': 'oklahoma', 'tulsa': 'oklahoma',
  'boston': 'massachusetts', 'cambridge': 'massachusetts',
  'portland': 'oregon',
  'las vegas': 'nevada', 'reno': 'nevada',
  'louisville': 'kentucky',
  'baltimore': 'maryland',
  'milwaukee': 'wisconsin',
  'albuquerque': 'new mexico',
  'atlanta': 'georgia', 'savannah': 'georgia',
  'kansas city': 'missouri', 'st. louis': 'missouri', 'saint louis': 'missouri',
  'omaha': 'nebraska',
  'new orleans': 'louisiana', 'baton rouge': 'louisiana',
  'detroit': 'michigan', 'ann arbor': 'michigan',
  'minneapolis': 'minnesota', 'st. paul': 'minnesota',
  'honolulu': 'hawaii',
  'anchorage': 'alaska',
  'washington dc': 'district of columbia', 'washington d.c.': 'district of columbia', 'capitol hill': 'district of columbia'
};

export const CITY_COORDINATES: Record<string, [number, number]> = {
  'los angeles': [-118.2, 34.0], 'san francisco': [-122.4, 37.7], 'san diego': [-117.1, 32.7],
  'san jose': [-121.8, 37.3], 'sacramento': [-121.4, 38.5], 'oakland': [-122.2, 37.8], 'fresno': [-119.8, 36.7], 'bakersfield': [-119.0, 35.4], 'stockton': [-121.3, 37.9], 'modesto': [-121.0, 37.6],
  'new york city': [-74.0, 40.7], 'brooklyn': [-73.9, 40.6], 'buffalo': [-78.8, 42.8], 'manhattan': [-73.9, 40.7],
  'chicago': [-87.6, 41.8],
  'houston': [-95.3, 29.7], 'dallas': [-96.7, 32.7], 'austin': [-97.7, 30.2], 'san antonio': [-98.4, 29.4], 'fort worth': [-97.3, 32.7], 'el paso': [-106.4, 31.7], 'lubbock': [-101.8, 33.6], 'amarillo': [-101.8, 35.2], 'corpus christi': [-97.4, 27.8], 'laredo': [-99.5, 27.5],
  'phoenix': [-112.0, 33.4], 'tucson': [-110.9, 32.2], 'mesa': [-111.8, 33.4],
  'philadelphia': [-75.1, 39.9], 'philly': [-75.1, 39.9], 'pittsburgh': [-79.9, 40.4],
  'jacksonville': [-81.6, 30.3], 'miami': [-80.1, 25.7], 'tampa': [-82.4, 27.9], 'orlando': [-81.3, 28.5],
  'columbus': [-82.9, 39.9], 'cleveland': [-81.6, 41.4], 'cincinnati': [-84.5, 39.1],
  'charlotte': [-80.8, 35.2], 'raleigh': [-78.6, 35.7],
  'indianapolis': [-86.1, 39.7],
  'seattle': [-122.3, 47.6], 'spokane': [-117.4, 47.6],
  'denver': [-104.9, 39.7], 'colorado springs': [-104.8, 38.8],
  'nashville': [-86.7, 36.1], 'memphis': [-90.0, 35.1],
  'oklahoma city': [-97.5, 35.4], 'tulsa': [-95.9, 36.1],
  'boston': [-71.0, 42.3], 'cambridge': [-71.1, 42.3],
  'portland': [-122.6, 45.5],
  'las vegas': [-115.1, 36.1], 'reno': [-119.8, 39.5],
  'louisville': [-85.7, 38.2],
  'baltimore': [-76.6, 39.2],
  'milwaukee': [-87.9, 43.0],
  'albuquerque': [-106.6, 35.0],
  'atlanta': [-84.3, 33.7], 'savannah': [-81.0, 32.0],
  'kansas city': [-94.5, 39.0], 'st. louis': [-90.1, 38.6], 'saint louis': [-90.1, 38.6],
  'omaha': [-95.9, 41.2],
  'new orleans': [-90.0, 29.9], 'baton rouge': [-91.1, 30.4],
  'detroit': [-83.0, 42.3], 'ann arbor': [-83.7, 42.2],
  'minneapolis': [-93.2, 44.9], 'st. paul': [-93.0, 44.9],
  'honolulu': [-157.8, 21.3],
  'anchorage': [-149.9, 61.2],
  'washington dc': [-77.0, 38.9], 'washington d.c.': [-77.0, 38.9], 'capitol hill': [-77.0, 38.9]
};

export const US_REGIONS: Record<string, { label: string; states: string[] }> = {
  'all': { label: 'All 50 States', states: Object.keys(STATE_COORDINATES) },
  'west': {
    label: 'West Coast & Rockies',
    states: ['california', 'washington', 'oregon', 'nevada', 'idaho', 'montana', 'wyoming', 'utah', 'colorado', 'arizona', 'new mexico', 'alaska', 'hawaii']
  },
  'midwest': {
    label: 'Great Lakes & Midwest',
    states: ['illinois', 'ohio', 'michigan', 'indiana', 'wisconsin', 'minnesota', 'iowa', 'missouri', 'north dakota', 'south dakota', 'nebraska', 'kansas']
  },
  'south': {
    label: 'The South & Sunbelt',
    states: ['texas', 'florida', 'georgia', 'north carolina', 'south carolina', 'virginia', 'west virginia', 'tennessee', 'kentucky', 'alabama', 'mississippi', 'arkansas', 'louisiana', 'oklahoma', 'district of columbia', 'delaware', 'maryland']
  },
  'northeast': {
    label: 'Northeast & Mid-Atlantic',
    states: ['new york', 'pennsylvania', 'massachusetts', 'new jersey', 'connecticut', 'rhode island', 'vermont', 'new hampshire', 'maine']
  }
};

export interface USStateMeta {
  code: string;
  name: string;
  slug: string;
  coordinates: [number, number];
}

export const ALL_US_STATES: USStateMeta[] = Object.keys(STATE_COORDINATES).map((slug) => {
  const code = Object.entries(STATE_ABBREVIATIONS).find(([_, s]) => s === slug)?.[0]?.toUpperCase() || 'US';
  let name = slug
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  if (slug === 'district of columbia') name = 'Washington D.C.';
  return {
    code,
    name,
    slug,
    coordinates: STATE_COORDINATES[slug]
  };
}).sort((a, b) => a.name.localeCompare(b.name));

export const POPULAR_STATES = [
  { slug: 'all', name: 'All 50 States', code: 'USA' },
  { slug: 'california', name: 'California', code: 'CA' },
  { slug: 'texas', name: 'Texas', code: 'TX' },
  { slug: 'florida', name: 'Florida', code: 'FL' },
  { slug: 'new york', name: 'New York', code: 'NY' },
  { slug: 'district of columbia', name: 'Washington D.C.', code: 'DC' },
  { slug: 'pennsylvania', name: 'Pennsylvania', code: 'PA' },
  { slug: 'illinois', name: 'Illinois', code: 'IL' },
  { slug: 'ohio', name: 'Ohio', code: 'OH' },
  { slug: 'georgia', name: 'Georgia', code: 'GA' },
  { slug: 'washington', name: 'Washington', code: 'WA' },
  { slug: 'colorado', name: 'Colorado', code: 'CO' },
  { slug: 'hawaii', name: 'Hawaii', code: 'HI' }
];

export function formatStateName(slug?: string | null): string {
  if (!slug || slug === 'all') return 'All 50 States';
  if (slug === 'district of columbia') return 'Washington D.C.';
  return slug
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function extractUSLocation(title: string, description: string): { state: string; city: string | null; coordinates: [number, number] } | null {
  const rawText = title + ' ' + description;
  const text = rawText.toLowerCase();

  // 1. Formatted postal codes: MUST be preceded by a comma, parenthesis, or dash: e.g. , TX or (TX) or - TX
  const stateCodeRegex = /(?:,\s*|\(\s*|[—–-]\s*)([A-Z]{2})(?:[,\)\.\s]|$)/;
  const codeMatch = rawText.match(stateCodeRegex);
  if (codeMatch && codeMatch[1]) {
    const code = codeMatch[1].toLowerCase();
    const EXCLUDED = ['us', 'ai', 'eu', 'uk', 'un', 'it', 'hr', 'tv', 'iq', 're', 'id', 'or', 'in', 'me', 'ok', 'co', 'pa', 'oh', 'hi', 'ma'];
    if (!EXCLUDED.includes(code) && STATE_ABBREVIATIONS[code]) {
      const state = STATE_ABBREVIATIONS[code];
      return {
        state,
        city: null,
        coordinates: STATE_COORDINATES[state],
      };
    }
    // For postal codes that collide with common words, require explicit comma after proper noun: e.g. Dallas, TX or Portland, OR
    if (EXCLUDED.includes(code) && STATE_ABBREVIATIONS[code]) {
      const strictCommaRegex = new RegExp('(?:[A-Z][a-z]+,\s*|\(\s*)' + codeMatch[1] + '(?:[,\)\.\s]|$)', '');
      if (strictCommaRegex.test(rawText)) {
        const state = STATE_ABBREVIATIONS[code];
        return {
          state,
          city: null,
          coordinates: STATE_COORDINATES[state],
        };
      }
    }
  }

  // 2. Check uppercase shorthand cities (LA, SF, NYC, DC) with boundary
  const upperCityRegex = /\b(NYC|LA|SF|DC|D\.C\.)\b/;
  const upperMatch = rawText.match(upperCityRegex);
  if (upperMatch && upperMatch[1]) {
    const code = upperMatch[1].replace(/\./g, '').toLowerCase();
    const cityMap: Record<string, string> = { 'nyc': 'new york', 'la': 'california', 'sf': 'california', 'dc': 'district of columbia' };
    if (cityMap[code]) {
      const state = cityMap[code];
      const city = code === 'nyc' ? 'new york city' : code === 'la' ? 'los angeles' : code === 'sf' ? 'san francisco' : 'washington dc';
      return {
        state,
        city,
        coordinates: CITY_COORDINATES[city] || STATE_COORDINATES[state],
      };
    }
  }

  // 3. Check unambiguous multi-letter city names
  for (const [city, state] of Object.entries(CITY_STATE_MAP)) {
    const escapedCity = city.replace(/\./g, '\.');
    const regex = new RegExp('\\b' + escapedCity + '\\b', 'i');
    if (regex.test(text)) {
      return {
        state,
        city,
        coordinates: CITY_COORDINATES[city] || STATE_COORDINATES[state],
      };
    }
  }

  // 4. Check full state names
  for (const state of Object.keys(STATE_COORDINATES)) {
    if (state === 'washington') {
      if (/\bwashington\s+(?:d\.?c\.?|dc)\b/i.test(text) || /\bcapitol\s+hill\b/i.test(text)) {
        return {
          state: 'district of columbia',
          city: 'washington dc',
          coordinates: CITY_COORDINATES['washington dc'] || STATE_COORDINATES['district of columbia'],
        };
      }
      if (/\bwashington\s+state\b/i.test(text) || /\bseattle\b/i.test(text)) {
        return {
          state: 'washington',
          city: /\bseattle\b/i.test(text) ? 'seattle' : null,
          coordinates: /\bseattle\b/i.test(text) ? CITY_COORDINATES['seattle'] : STATE_COORDINATES['washington'],
        };
      }
      if (/\bwashington\b/i.test(text)) {
        return {
          state: 'district of columbia',
          city: 'washington dc',
          coordinates: CITY_COORDINATES['washington dc'] || STATE_COORDINATES['district of columbia'],
        };
      }
      continue;
    }

    const regex = new RegExp('\\b' + state + '\\b', 'i');
    if (regex.test(text)) {
      return {
        state,
        city: null,
        coordinates: STATE_COORDINATES[state],
      };
    }
  }

  // 5. Check AP Datelines with titlecase and period: e.g. Calif., Tex., Fla., Wash., Mass.
  for (const [dateline, state] of Object.entries(AP_DATELINE_TITLES)) {
    const escaped = dateline.replace(/\./g, '\.');
    const regex = new RegExp('\\b' + escaped + '(?:\\s+|$|[—–-])', '');
    if (regex.test(rawText)) {
      return {
        state,
        city: null,
        coordinates: STATE_COORDINATES[state],
      };
    }
  }

  return null;
}
