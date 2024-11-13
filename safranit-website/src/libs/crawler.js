import axios from 'axios';
import xml2js from 'xml2js';
import cheerio from 'cheerio';
import fs from 'fs';

// TODO: it saved tags double, didn't check why.
// TODO: clean up the comments.
// TODO: need another script to upload all of it.

const sitemapUrl = 'https://d-steimatzky.co.il/sitemap_index.xml';
const scraped_json_file = 'scraped_data_test.json';
const delay = (min, max) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
};

// Initialize the JSON array
const initializeJSONFile = () => {
  if (!fs.existsSync(scraped_json_file)) {
    // If the file does not exist, create it and start with an empty array
    fs.writeFileSync(scraped_json_file, '[', 'utf8');
  }
};

// Function to append data to JSON file
const writeToJSON = (data) => {
  // Open the file in append mode
  const isEmpty = fs.statSync(scraped_json_file).size === 2; // Check if the file only contains '[', which means it's empty
  
  const jsonString = JSON.stringify(data, null, 2);

  if (isEmpty) {
    // If it's the first entry, we don't need a comma before the data
    fs.appendFileSync(scraped_json_file, jsonString, 'utf8');
  } else {
    // Otherwise, append a comma and the new entry
    fs.appendFileSync(scraped_json_file, `,\n${jsonString}`, 'utf8');
  }
};

// Function to close the JSON array
const closeJSONFile = () => {
  // Append the closing bracket to end the JSON array
  fs.appendFileSync(scraped_json_file, '\n]', 'utf8');
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

// Function to parse the product sitemap XML and extract URLs
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
    const description = $('.text-container')
                        .find('p')  // Find all <p> elements inside the container
                        .map((i, el) => $(el).text())  // Get text of each <p>
                        .get()  // Convert the result to a regular array
                        .join('\n');  // Join the array with line breaks between paragraphs
    const tags = $('.d-flex .book_tags a')
                        .map((i, el) => $(el).text())  // Extract the text from each <a> tag
                        .get();  // Convert the Cheerio object to a plain array
    const kindleAvailability = $('.d-flex.align-items-center span')
      .filter((i, el) => $(el).text().trim() === 'זמין לקינדל')  // Filter for the specific text
      .text().trim();
    const isAvailableForKindle = kindleAvailability ? true : false;
    const releaseYearText = $('h4')
      .filter((i, el) => $(el).text().includes('יצא לאור ב:'))
      .text().trim();
    const releaseYearMatch = releaseYearText.match(/\d{4}/);
    const releaseYear = releaseYearMatch ? releaseYearMatch[0] : null;
    const coverImageUrl = $('.woocommerce-product-gallery__image img').attr('src');

    return { url, title, author, coverImageUrl, description, tags, isAvailableForKindle, releaseYear };
  } catch (error) {
    console.error(`Failed to scrape ${url}: ${error.message}`);
  }
};

// Main function to run the crawler
const runCrawler = async () => {
  console.log("Note: this process needs to run for hours, there are server-side cooldowns, so it takes around 6 hours or so.\n");

  // Step 1: Fetch the sitemap index
  const sitemapIndexXml = await fetchSitemap(sitemapUrl);
  if (!sitemapIndexXml) return;

  // Step 2: Parse the sitemap index to get individual sitemap URLs
  const sitemapIndexData = await parseSitemap(sitemapIndexXml);
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
  console.log("Total URLs found: %d", allProductUrls.length);

  // Step 4: Scrape each product page and write to JSON
  let count = 0;
  for (const url of allProductUrls) {
    const data = await scrapePage(url);
    if (data) {
      // Write data to JSON file
      writeToJSON(data);
      console.log(`[${count + 1} / ${allProductUrls.length}] Scraped data from ${url}`);
    }
    count += 1;
    await delay(100, 200); // A small delay to avoid overloading the server
  }

  // Close the JSON array when scraping is finished
  closeJSONFile();
};

// Initialize the file at the start
initializeJSONFile();
// Run the crawler
runCrawler().catch((err) => console.error(`Error: ${err.message}`));
