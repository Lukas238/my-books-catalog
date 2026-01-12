# Quick commands

1. Sync up local eBooksLibraries with gDrive remote.
2. Download gDrive remote files id list as JSON file.
3. Export calibre catalog to XML file.
4. Convert XML + JSON to Jekyll data files.

## Lucas's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooks238 gDrive:Backup238/Books/eBooks238 -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooks238 -R --files-only --no-mimetype --no-modtime > ./tmp/eBooks238.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooks238 ./tmp/eBooks238.xml  --catalog-title "Lukas238's eBooks Library" &&
node scripts/xml2data.js --xml ./tmp/eBooks238.xml --json ./tmp/eBooks238.json --output ./_data --name lukas238
```

## Cata's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksCata gDrive:Backup238/Books/eBooksCata -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksCata -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksCata.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksCata ./tmp/eBooksCata.xml  --catalog-title "Cata's eBooks Library" &&
node scripts/xml2data.js --xml ./tmp/eBooksCata.xml --json ./tmp/eBooksCata.json --output ./_data --name cata
```

## Ignacio's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksIgnacio gDrive:Backup238/Books/eBooksIgnacio -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksIgnacio -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksIgnacio.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksIgnacio ./tmp/eBooksIgnacio.xml  --catalog-title "Ignacio's eBooks Library" &&
node scripts/xml2data.js --xml ./tmp/eBooksIgnacio.xml --json ./tmp/eBooksIgnacio.json --output ./_data --name ignacio
```

## Maripaz's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksMaripaz gDrive:Backup238/Books/eBooksMaripaz -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksMaripaz -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksMaripaz.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksMaripaz ./tmp/eBooksMaripaz.xml  --catalog-title "Maripaz's eBooks Library" &&
node scripts/xml2data.js --xml ./tmp/eBooksMaripaz.xml --json ./tmp/eBooksMaripaz.json --output ./_data --name maripaz
```

## Martin's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksMartin gDrive:Backup238/Books/eBooksMartin -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksMartin -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksMartin.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksMartin ./tmp/eBooksMartin.xml  --catalog-title "Martin's eBooks Library" &&
node scripts/xml2data.js --xml ./tmp/eBooksMartin.xml --json ./tmp/eBooksMartin.json --output ./_data --name martin
```


## Regenerate all data files (after XML/JSON already exist in tmp/)
```bash
node scripts/xml2data.js --xml ./tmp/eBooks238.xml --json ./tmp/eBooks238.json --output ./_data --name lukas238 &&
node scripts/xml2data.js --xml ./tmp/eBooksCata.xml --json ./tmp/eBooksCata.json --output ./_data --name cata &&
node scripts/xml2data.js --xml ./tmp/eBooksIgnacio.xml --json ./tmp/eBooksIgnacio.json --output ./_data --name ignacio &&
node scripts/xml2data.js --xml ./tmp/eBooksMaripaz.xml --json ./tmp/eBooksMaripaz.json --output ./_data --name maripaz &&
node scripts/xml2data.js --xml ./tmp/eBooksMartin.xml --json ./tmp/eBooksMartin.json --output ./_data --name martin
```

