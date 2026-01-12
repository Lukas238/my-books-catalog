# 📚 Books Catalog

Jekyll-based books catalog system powered by Calibre and Google Drive.

**Live**: https://books.c238.com.ar/

## Overview

This site displays multiple book catalogs, each generated from:
- **Calibre XML export** - Book metadata (title, author, rating, etc.)
- **Google Drive JSON** - File IDs for download links via rclone

Jekyll automatically compiles the site from templates, making it easy to add new catalogs and keep everything consistent.

## Setup

### Prerequisites

- [Calibre](https://calibre-ebook.com/) - For managing book libraries
- [rclone](https://rclone.org/) - For syncing with Google Drive
- [Node.js](https://nodejs.org/) - For running the conversion script
- [Ruby & Jekyll](https://jekyllrb.com/) - For building the site

### Installation

```bash
# Install Ruby dependencies
bundle install

# Install Node dependencies
npm install
```

## Usage

### Full Update Process

For each library, run the commands in [commands.md](commands.md). Example:

```bash
# Sync, export, and convert Lucas's library
rclone sync ~/eBooksLibraries/eBooks238 gDrive:Backup238/Books/eBooks238 -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooks238 -R --files-only --no-mimetype --no-modtime > ./tmp/eBooks238.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooks238 ./tmp/eBooks238.xml --catalog-title "Lukas238's eBooks Library" &&
node scripts/xml2data.js --xml ./tmp/eBooks238.xml --json ./tmp/eBooks238.json --output ./_data --name lukas238
```

### Local Development

```bash
bundle exec jekyll serve
# Site available at http://localhost:4000
```

### Deploy

Push to GitHub - GitHub Pages will auto-build and deploy.

## Features

- 📱 Responsive design
- 🔍 Real-time search
- 📊 Grid/list views
- 🌗 Dark mode
- ⭐ Star ratings
- 📥 Google Drive downloads
- 🔗 Goodreads integration
- 📱 QR code sharing

## Migration from catalog2web

This is a Jekyll rebuild of the previous static generator. Benefits:

- ✅ No `catalog2web` dependency
- ✅ GitHub Pages auto-compilation
- ✅ Cleaner data/presentation separation
- ✅ Easier to maintain
- ✅ Single template for all catalogs

## Author

Lucas Dasso - [me.c238.com.ar](https://me.c238.com.ar)
