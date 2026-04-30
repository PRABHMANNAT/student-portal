import { useState } from 'react';

import { jobsApi } from '../api';

export function useScrape() {
  const [scraping, setScraping] = useState(false);

  const scrape = async (payload) => {
    setScraping(true);

    try {
      return await jobsApi.scrape(payload);
    } finally {
      setScraping(false);
    }
  };

  return {
    scrape,
    scraping
  };
}

