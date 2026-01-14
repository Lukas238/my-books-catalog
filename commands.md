# Quick commands

1. Sync up local eBooksLibraries with gDrive remote.
2. Download gDrive remote files id list as JSON file.
3. Export calibre catalog to XML file.
4. Convert XML + JSON to Jekyll data files.

## Lucas's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooks238 gDrive:Backup238/Books/eBooks238 -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooks238 -R --files-only --no-mimetype --no-modtime > ./_exports/eBooks238.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooks238 ./_exports/eBooks238.xml  --catalog-title "Lucas Dasso" &&
node scripts/xml2data.js --xml ./_exports/eBooks238.xml --json ./_exports/eBooks238.json --output ./_data --name lukas238
```

## Cata's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksCata gDrive:Backup238/Books/eBooksCata -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksCata -R --files-only --no-mimetype --no-modtime > ./_exports/eBooksCata.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksCata ./_exports/eBooksCata.xml  --catalog-title "Cata" &&
node scripts/xml2data.js --xml ./_exports/eBooksCata.xml --json ./_exports/eBooksCata.json --output ./_data --name cata
```

## Ignacio's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksIgnacio gDrive:Backup238/Books/eBooksIgnacio -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksIgnacio -R --files-only --no-mimetype --no-modtime > ./_exports/eBooksIgnacio.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksIgnacio ./_exports/eBooksIgnacio.xml  --catalog-title "Ignacio" &&
node scripts/xml2data.js --xml ./_exports/eBooksIgnacio.xml --json ./_exports/eBooksIgnacio.json --output ./_data --name ignacio
```

## Maripaz's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksMaripaz gDrive:Backup238/Books/eBooksMaripaz -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksMaripaz -R --files-only --no-mimetype --no-modtime > ./_exports/eBooksMaripaz.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksMaripaz ./_exports/eBooksMaripaz.xml  --catalog-title "Maripaz" &&
node scripts/xml2data.js --xml ./_exports/eBooksMaripaz.xml --json ./_exports/eBooksMaripaz.json --output ./_data --name maripaz
```

## Martin's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksMartin gDrive:Backup238/Books/eBooksMartin -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksMartin -R --files-only --no-mimetype --no-modtime > ./_exports/eBooksMartin.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksMartin ./_exports/eBooksMartin.xml  --catalog-title "Martin" &&
node scripts/xml2data.js --xml ./_exports/eBooksMartin.xml --json ./_exports/eBooksMartin.json --output ./_data --name martin
```

## Sofi's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksSofi gDrive:Backup238/Books/eBooksSofi -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksSofi -R --files-only --no-mimetype --no-modtime > ./_exports/eBooksSofi.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksSofi ./_exports/eBooksSofi.xml  --catalog-title "Sofi" &&
node scripts/xml2data.js --xml ./_exports/eBooksSofi.xml --json ./_exports/eBooksSofi.json --output ./_data --name sofi
```


## Regenerate all data files (after XML/JSON already exist in _exports/)
```bash
node scripts/xml2data.js --xml ./_exports/eBooks238.xml --json ./_exports/eBooks238.json --output ./_data --name lukas238
node scripts/xml2data.js --xml ./_exports/eBooksCata.xml --json ./_exports/eBooksCata.json --output ./_data --name cata
node scripts/xml2data.js --xml ./_exports/eBooksIgnacio.xml --json ./_exports/eBooksIgnacio.json --output ./_data --name ignacio
node scripts/xml2data.js --xml ./_exports/eBooksMaripaz.xml --json ./_exports/eBooksMaripaz.json --output ./_data --name maripaz
node scripts/xml2data.js --xml ./_exports/eBooksMartin.xml --json ./_exports/eBooksMartin.json --output ./_data --name martin
node scripts/xml2data.js --xml ./_exports/eBooksSofi.xml --json ./_exports/eBooksSofi.json --output ./_data --name sofi
```

