# Shahrewan Portfolio — PNG & GIF Ready

Open `index.html` in your browser. This package includes the updated HTML, CSS and JavaScript from the earlier redesign, with all twelve image references (the hero slideshow and the Work cards) changed from `.svg` to `.png` or `.gif`.

## Supply your artwork

Place **your own** images inside the `assets/work/` folder with these **exact filenames**:

- `work-01-game-development.png`
- `work-02-illustration.png`
- `work-03-graphic-design.png`
- `work-04-animation.gif` — animated GIF used in both the hero and the Work grid
- `work-05-web-design.png`
- `work-06-code-data.png`

The original SVG/image files were not supplied, so **no actual art has been converted**. Existing gradient and thumbnail placeholders remain until you add the files.

## Important notes

- `script.js` does not need changes to display GIF/PNG images; `<img>` handles both formats.
- The hero slideshow still automatically rotates every **7 seconds** when idle. Change `const slideDuration = 7000;` in `script.js` if needed.
- GIF animation loops independently of slideshow timing and may already be mid-loop when its slide becomes visible.
- Animated GIFs can be large; for long animations, an MP4/WebM `<video>` is often more efficient, but requires different markup.
- Use a sensibly optimized resolution. Images are cropped to fit their containers with `object-fit: cover`.
