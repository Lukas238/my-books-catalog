#!/usr/bin/env node

/**
 * xml2data.js
 * Converts Calibre XML catalog and Google Drive JSON to Jekyll data files
 *
 * Usage:
 *   node xml2data.js --xml <path> --json <path> --output <path> --name <name>
 */

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { parseString } = require('xml2js');

// Read and parse XML file
function readXML(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) reject(err);

            parseString(data, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    });
}

// Read JSON file
function readJSON(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) reject(err);
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(e);
            }
        });
    });
}

// Build file path to Google Drive ID mapping using last 3 path elements
function buildFileIdMap(gdriveFiles) {
    const map = {};

    gdriveFiles.forEach(file => {
        // Get last 3 elements: Author/Book/Filename
        const pathParts = file.Path.replace(/\\/g, '/').split('/');
        const key = pathParts.slice(-3).join('/').toLowerCase();
        map[key] = file.ID || file.Id;
    });

    return map;
}

// Get Google Drive download URL for a file by comparing last 3 path elements
function getGDriveDownloadURL(filepath, fileIdMap, libraryPath) {
    if (!filepath || !fileIdMap) return null;

    // Get last 3 elements from the XML path: Author/Book/Filename
    const pathParts = filepath.replace(/\\/g, '/').split('/');
    const key = pathParts.slice(-3).join('/').toLowerCase();

    const fileId = fileIdMap[key];

    if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return null;
}

// Extract book cover filename from path
function getCoverFilename(coverPath, libraryName, bookId) {
    if (!coverPath) return null;

    const ext = path.extname(coverPath);
    const title = path.basename(path.dirname(coverPath));
    // Remove content in parentheses (like "(2)") and then sanitize
    const titleWithoutParens = title.replace(/\s*\([^)]*\)\s*/g, '');
    const sanitized = titleWithoutParens.replace(/[^a-zA-Z0-9]/g, '');

    // Format: {bookId}_{normalizedTitle}.jpg
    return `${bookId}_${sanitized}${ext}`;
}

// Function to copy cover image from Calibre library to local covers folder
async function copyCoverImage(coverPath, destFolder, newFilename) {
    if (!coverPath || !fs.existsSync(coverPath)) {
        console.log(`⚠ Cover not found: ${coverPath}`);
        return false;
    }

    // Create covers folder if it doesn't exist
    if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
    }

    const destPath = path.join(destFolder, newFilename);

    try {
        await fsPromises.copyFile(coverPath, destPath);
        return true;
    } catch (error) {
        console.log(`⚠ Error copying cover: ${error.message}`);
        return false;
    }
}

// Process Calibre XML data
async function processData(options) {
    console.log('Reading XML file:', options.xml);
    const xmlData = await readXML(options.xml);

    console.log('Reading JSON file:', options.json);
    const gdriveFiles = await readJSON(options.json);

    const fileIdMap = buildFileIdMap(gdriveFiles);
    const catalogTitle = xmlData.calibredb.$ && xmlData.calibredb.$.title ? xmlData.calibredb.$.title : null;
    const records = xmlData.calibredb.record || [];

    console.log(`Processing ${records.length} books from "${catalogTitle}"`);

    // Determine covers destination folder
    const coversFolder = path.join('assets', 'covers', options.name);

    const books = await Promise.all(records.map(async record => {
        const coverFilename = record.cover ? getCoverFilename(record.cover[0], options.name, record.id[0]) : null;

        // Copy cover image if it exists
        if (record.cover && coverFilename) {
            await copyCoverImage(record.cover[0], coversFolder, coverFilename);
        }

        const book = {
            id: record.id ? record.id[0] : null,
            uuid: record.uuid ? record.uuid[0] : null,
            title: record.title ? (record.title[0]._ || record.title[0]) : null,
            title_sort: record.title ? (record.title[0].$.sort || null) : null,
            authors: record.authors && record.authors[0].author ? record.authors[0].author : [],
            authors_sort: record.authors ? (record.authors[0].$.sort || null) : null,
            publisher: record.publisher ? record.publisher[0] : null,
            pubdate: record.pubdate ? record.pubdate[0] : null,
            rating: record.rating ? parseInt(record.rating[0]) : null,
            isbn: record.isbn ? record.isbn[0] : null,
            tags: record.tags && record.tags[0].tag ? record.tags[0].tag : [],
            series: record.series ? (record.series[0]._ || record.series[0]) : null,
            series_index: record.series && record.series[0].$ && record.series[0].$.index ? parseFloat(record.series[0].$.index) : null,
            comments: record.comments ? record.comments[0] : null,
            timestamp: record.timestamp ? record.timestamp[0] : null,
            languages: record.languages ? record.languages[0] : null,
            identifiers: record.identifiers ? record.identifiers[0] : null,
            cover: coverFilename,
            formats: []
        };

        // Process formats and get Google Drive URLs
        if (record.formats && record.formats[0].format) {
            record.formats[0].format.forEach(format => {
                const ext = path.extname(format).replace('.', '').toUpperCase();
                const libraryName = record.library_name ? record.library_name[0] : '';
                const downloadUrl = getGDriveDownloadURL(format, fileIdMap, libraryName);

                if (downloadUrl) {
                    book.formats.push({
                        type: ext,
                        url: downloadUrl
                    });
                }
            });
        }

        return book;
    }));

    // Filter out "My Clippings" book
    const filteredBooks = books.filter(book => book.title !== 'My Clippings');
    const excludedCount = books.length - filteredBooks.length;

    if (excludedCount > 0) {
        console.log(`⚠ Excluded ${excludedCount} book(s): "My Clippings"`);
    }

    // Create output data structure
    const output = {
        catalog_title: catalogTitle || options.name.charAt(0).toUpperCase() + options.name.slice(1),
        catalog_name: options.name,
        total_books: filteredBooks.length,
        last_updated: new Date().toISOString(),
        books: filteredBooks
    };

    // Write output file
    const outputPath = path.join(options.output, `${options.name}.json`);
    console.log('Writing output to:', outputPath);

    fs.mkdirSync(options.output, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`✓ Successfully processed ${filteredBooks.length} books`);
    console.log(`✓ Output written to ${outputPath}`);

    // Generate catalog page in _catalogs/ collection
    const catalogsDir = '_catalogs';
    fs.mkdirSync(catalogsDir, { recursive: true });
    const catalogPagePath = `${catalogsDir}/${options.name}.md`;
    const catalogPageContent = `---
layout: catalog
---
`;
    fs.writeFileSync(catalogPagePath, catalogPageContent);
    console.log(`✓ Catalog page created: ${catalogPagePath}`);
}

// Main execution
async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = {};

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        options[key] = value;
    }

    // Check if all required parameters are provided
    if (!options.xml || !options.json || !options.output || !options.name) {
        console.error('❌ Missing required parameters\n');
        console.error('Usage: node xml2data.js --xml <path> --json <path> --output <path> --name <name>');
        console.error('\nExample:');
        console.error('  node xml2data.js --xml ./_exports/eBooks238.xml --json ./_exports/eBooks238.json --output ./_data --name lukas238');
        process.exit(1);
    }

    console.log('📄 Processing catalog:\n');
    console.log(`   XML: ${options.xml}`);
    console.log(`   JSON: ${options.json}`);
    console.log(`   Output: ${options.output}`);
    console.log(`   Name: ${options.name}\n`);

    try {
        await processData(options);
        console.log('\n✅ Catalog processed successfully!');
    } catch (err) {
        console.error(`❌ Error processing catalog:`, err.message);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
