const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const fs = require('fs');  // Required for file system operations

// URL of the sitemap
const sitemapUrl = 'https://d-steimatzky.co.il/sitemap_index.xml';

const delay = (min, max) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
};

// Function to write data to a CSV file
const writeToCSV = (data) => {
  // Create CSV header
  // title, author, coverImageUrl, description, tags, isAvailableForKindle, releaseYear
  const header = ['URL', 'Title', 'Author', 'ImageURL', 'Description', 'Tags', 'ForKindle', 'ReleaseYear'];
  
  // Format the rows for CSV
  const rows = data.map(item => `${item.url},${item.title},${item.author},${item.coverImageUrl},${item.description},${item.tags},${item.isAvailableForKindle},${item.releaseYear}`).join('\n');
  
  // Combine the header and the rows
  const csvContent = [header.join(','), rows].join('\n');
  
  // Write the content to a file
  fs.writeFileSync('scraped_data.csv', csvContent, 'utf8');
  console.log('Data saved to scraped_data.csv');
};

// Function to fetch the sitemap XML
const fetchSitemap = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;  // Return the XML data as a string
  } catch (error) {
    console.error(`Failed to fetch sitemap: ${error.message}`);
    return null;
  }
};

// Function to parse the sitemap XML and extract URLs
const parseSitemap = (xmlData) => {
  const parser = new xml2js.Parser();
  let urls = [];
  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error(`Failed to parse XML: ${err.message}`);
      return;
    }
    
    const filteredSitemaps = result.sitemapindex.sitemap.filter((sitemap) => {
      // Check if the URL contains 'product-sitemap'
      const loc = sitemap.loc[0];
      return loc && loc.includes('product-sitemap');
    });
    urls = filteredSitemaps;
  });

  return urls;
};
// Function to parse the sitemap XML and extract URLs
const parseProductSitemap = (xmlData) => {
  const parser = new xml2js.Parser();
  let urls = [];

  parser.parseString(xmlData, (err, result) => {
    if (err) {
      console.error(`Failed to parse XML: ${err.message}`);
      return;
    }
    
    // Check if the sitemap has a URL set
    if (result.urlset && result.urlset.url) {
      urls = result.urlset.url.map((urlObj) => urlObj.loc[0]);
    }
  });

  return urls;
};

// Function to scrape the data from a given URL
const scrapePage = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('.product_title').text();
    const author = $('.product_author a').text();
    // converting given text from list of <p> to a single text with \n between old <p> elements.
    const description = $('.text-container')
                        .find('p')  // Find all <p> elements inside the container
                        .map((i, el) => $(el).text())  // Get text of each <p>
                        .get()  // Convert the result to a regular array
                        .join('\n');  // Join the array with line breaks between paragraphs
    const tags = $('.d-flex .book_tags a')
                        .map((i, el) => $(el).text())  // Extract the text from each <a> tag
                        .get();  // Convert the Cheerio object to a plain array
    // Extract the Kindle availability span
    const kindleAvailability = $('.d-flex.align-items-center span')
      .filter((i, el) => $(el).text().trim() === 'זמין לקינדל')  // Filter for the specific text
      .text().trim();  // Extract and clean the text content
    // If the span exists, it will return the text, otherwise return a default message
    const isAvailableForKindle = kindleAvailability ? true : false;
    // Extract the year of release (assuming the text format is consistent)
    const releaseYearText = $('h4')
      .filter((i, el) => $(el).text().includes('יצא לאור ב:')) // Find the <h4> that contains "יצא לאור ב:"
      .text().trim();

    // Extract the year using a regular expression
    const releaseYearMatch = releaseYearText.match(/\d{4}/);  // Match 4 digits (year format)

    const releaseYear = releaseYearMatch ? releaseYearMatch[0] : null;  // If found, get the year, otherwise null

    // Extract the cover image URL from the <img> tag inside the gallery image div
    const coverImageUrl = $('.woocommerce-product-gallery__image img').attr('src');
    // TODO: we can get bigger images if we want, see srcset in the img element. 
    
    return { title, author, coverImageUrl, description, tags, isAvailableForKindle, releaseYear };
  } catch (error) {
    console.error(`Failed to scrape ${url}: ${error.message}`);
  }
};

// Main function to run the crawler
const runCrawler = async () => {
  console.log("Note: this process need to run for hours, there is server side cooldownds, so it takes around 6 hours or so.\n");
  // Step 1: Fetch the sitemap index
  const sitemapIndexXml = await fetchSitemap(sitemapUrl);
  if (!sitemapIndexXml) return;
  
  // Step 2: Parse the sitemap index to get individual sitemap URLs
  const sitemapIndexData = await parseSitemap(sitemapIndexXml);
  // TODO: the URLs comes with lastmod, could be useful to update pages information.
  const sitemapUrls = sitemapIndexData.map(item => item.loc[0]);
  
  // Step 3: Loop through each sitemap and fetch product URLs
  const allProductUrls = [];
  for (let sitemapUrl of sitemapUrls) {
    console.log(`Processing sitemap: ${sitemapUrl}`);
    
    const sitemapXml = await fetchSitemap(sitemapUrl);
    if (!sitemapXml) continue;
    
    const sitemapData = await parseProductSitemap(sitemapXml);    
    allProductUrls.push(...sitemapData);
  }
  console.log("total:%d, sitemaps:%d", allProductUrls.length, sitemapUrls.length);
  var scrapedData = [];
  var count = 0;
  // Now you can scrape each URL
  for (const url of allProductUrls) {
    const data = await scrapePage(url);
    if (data) {
      // Add the URL and scraped data to the array
      scrapedData.push({ url, ...data });
      console.log("[", count , "/", allProductUrls.length, "]","Scraped data from ", url, " : ", data);
    }
    count += 1;
    await delay(100, 200); // A small delay so we won't get banned because of 'DDOSing'.
  }
  // TODO: when done, move it to SQL.
  // After scraping, write the data to a CSV file
  if (scrapedData.length > 0) {
    writeToCSV(scrapedData);
  }
};

// Run the crawler
runCrawler().catch((err) => console.error(`Error: ${err.message}`));
