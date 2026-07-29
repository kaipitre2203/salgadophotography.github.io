# Kai Salgado Photography – GitHub source code

This folder is the editable source code for a static GitHub Pages website. It is not a website builder export and it does not require a framework.

## Main files

- `index.html` – homepage structure
- `gallery.html` – shared gallery page for all categories
- `about.html` – About page structure
- `contact.html` – Contact page structure
- `assets/css/styles.css` – complete design and responsive layouts for desktop, tablet and smartphone
- `assets/js/site-data.js` – website name, About text, contact details, category order and all photo entries
- `assets/js/main.js` – menu, galleries, lightbox and responsive behaviour
- `assets/images/` – optimised image files organised by category
- `tools/add_image.py` – optional helper script for adding and optimising new photos

## What to edit most often

### Text, categories and photo order

Open:

`assets/js/site-data.js`

This single file contains the editable content. You can:

- change the website title and tagline
- edit the About text
- change email and Instagram
- rename or reorder categories
- change the order of photographs
- choose separate hero images for desktop and mobile

### Design

Open:

`assets/css/styles.css`

The responsive breakpoints and layouts are already included. Desktop, tablet and mobile can be adjusted independently there.

## Upload to GitHub

Create a repository and upload the **contents of this folder** into the repository root. `index.html` must be directly visible at the top level of the repository, not inside another folder.

## Add a new image manually

1. Add the image files to the appropriate folder under `assets/images/`.
2. Add a new image object to the corresponding category in `assets/js/site-data.js`.

The existing image objects can be copied as templates.

## Add a new image with the helper script

From the project folder, run:

```bash
python3 tools/add_image.py /path/to/photo.jpg street \
  --alt "Short description of the photograph"
```

For a full-width gallery image, add `--full`.

The script creates three responsive WebP versions and adds the photo to `site-data.js`.
