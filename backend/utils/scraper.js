const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

/**
 * Scrapes a URL and returns the metadata, summary, and cleaned content
 * @param {string} url 
 * @returns {object} { title, description, summary, content }
 */
const scrapeUrl = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000
        });

        const $ = cheerio.load(data);

        // 1. Basic Metadata
        const title = $('title').text() || $('meta[property="og:title"]').attr('content');
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');

        // 2. Readability Content
        const dom = new JSDOM(data, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        // 3. Generate Summary
        // For now, we'll take the first 300 characters of the text content as a summary
        // In a real app, this would call an LLM API
        let summary = '';
        if (article && article.textContent) {
            summary = article.textContent.trim().substring(0, 300) + '...';
        } else if (description) {
            summary = description;
        }

        return {
            title: title || article?.title,
            description: description,
            summary: summary,
            content: article?.content // Cleaned HTML
        };
    } catch (error) {
        console.error(`Scraping error for ${url}:`, error.message);
        return null;
    }
};

module.exports = { scrapeUrl };
