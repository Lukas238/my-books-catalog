# Quick commands

1. Sync up local eBooksLibraries with gDrive remote.
2. Download gDrive remote files id list as JSON file.
3. Export calibre catalog to XML file.
4. Generate web pages from calibre catalog XML file.

## Lucas's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooks238 gDrive:Backup238/Books/eBooks238 -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooks238 -R --files-only --no-mimetype --no-modtime > ./tmp/eBooks238.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooks238 ./tmp/eBooks238.xml  --catalog-title "Lukas238's eBooks Library" &&
catalog2web --catalog-path ./tmp/eBooks238.xml --web-path ./lukas238 --gdriveids-path ./tmp/eBooks238.json
```

## Cata's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksCata gDrive:Backup238/Books/eBooksCata -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksCata -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksCata.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksCata ./tmp/eBooksCata.xml  --catalog-title "Cata's eBooks Library" &&
catalog2web --catalog-path ./tmp/eBooksCata.xml --web-path ./cata --gdriveids-path ./tmp/eBooksCata.json
```

## Ignacio's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksIgnacio gDrive:Backup238/Books/eBooksIgnacio -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksIgnacio -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksIgnacio.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksIgnacio ./tmp/eBooksIgnacio.xml  --catalog-title "Ignacio's eBooks Library" &&
catalog2web --catalog-path ./tmp/eBooksIgnacio.xml --web-path ./ignacio --gdriveids-path ./tmp/eBooksIgnacio.json
```

## Maripaz's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksMaripaz gDrive:Backup238/Books/eBooksMaripaz -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksMaripaz -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksMaripaz.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksMaripaz ./tmp/eBooksMaripaz.xml  --catalog-title "Maripaz's eBooks Library" &&
catalog2web --catalog-path ./tmp/eBooksMaripaz.xml --web-path ./maripaz --gdriveids-path ./tmp/eBooksMaripaz.json
```

## Martin's eBooks Library

```bash
rclone sync ~/eBooksLibraries/eBooksMartin gDrive:Backup238/Books/eBooksMartin -v --progress &&
rclone lsjson gDrive:Backup238/Books/eBooksMartin -R --files-only --no-mimetype --no-modtime > ./tmp/eBooksMartin.json &&
calibredb catalog --library-path ~/eBooksLibraries/eBooksMartin ./tmp/eBooksMartin.xml  --catalog-title "Martin's eBooks Library" &&
catalog2web --catalog-path ./tmp/eBooksMartin.xml --web-path ./martin --gdriveids-path ./tmp/eBooksMartin.json
```


## Regenerate all web pages
```bash
catalog2web --catalog-path ./tmp/eBooks238.xml --web-path ./lukas238 --gdriveids-path ./tmp/eBooks238.json &&
catalog2web --catalog-path ./tmp/eBooksCata.xml --web-path ./cata --gdriveids-path ./tmp/eBooksCata.json &&
catalog2web --catalog-path ./tmp/eBooksIgnacio.xml --web-path ./ignacio --gdriveids-path ./tmp/eBooksIgnacio.json &&
catalog2web --catalog-path ./tmp/eBooksMaripaz.xml --web-path ./maripaz --gdriveids-path ./tmp/eBooksMaripaz.json &&
catalog2web --catalog-path ./tmp/eBooksMartin.xml --web-path ./martin --gdriveids-path ./tmp/eBooksMartin.json
```
