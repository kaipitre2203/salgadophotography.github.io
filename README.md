# Kai Salgado Photography — Portfolio

A responsive, dependency-free portfolio prepared for GitHub Pages. The layout is individually adapted for desktop, tablet and mobile: asymmetrical project cards on large screens, a compact menu on tablets, and single-column galleries on phones.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the complete contents of this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.

## Contact and profile details

The website is configured with:

- Name: Kai Salgado Photography
- Photographer: Kai Pitre Salgado
- Location: Bern, Switzerland
- Email: `salgado.photography@icloud.com`
- Instagram: `@kai.pitre.sgd`

You can update these details and the About text in `assets/js/site-data.js`.

## Image organisation

The final curation contains 69 unique images in five categories:

- People: 12
- Landscape: 12
- Street: 25
- Wildlife: 13
- Events: 7

The following exact duplicates were intentionally removed:

- `DSCF0362(1).jpg`
- `DSCF1019(1).jpg`
- `DSCF2030-Topaz-Sharpen-Strong-Denoise(1).jpg`

The generated website uses responsive WebP versions at 640, 1100 and 1800 pixels, plus art-directed hero images selected separately for wide and narrow screens. Images load lazily and open in a keyboard- and swipe-enabled lightbox.

## Add more photographs later

Use the included helper script:

```bash
python3 -m pip install Pillow
python3 tools/add_image.py "/path/to/new-photo.jpg" street --alt "Description of the photograph"
```

Valid categories are `people`, `landscape`, `street`, `wildlife`, and `events`.

The script creates the responsive WebP files and appends the photograph to `assets/js/site-data.js`. Commit and push the changed files to GitHub.

## Preview locally

The pages also work when opened directly. For the most reliable preview, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Version 2 update

- Uses the new portrait `Hochzeit-87.jpg` on the About page.
- Removes all references to “Authentic View”.
- Adds a clear commercial focus for companies, restaurants, cafés and organisations.
- Displays gallery images in a compact responsive layout: three columns on desktop, two on tablets and one on smartphones.
