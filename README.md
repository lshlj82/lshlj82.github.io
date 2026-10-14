# Network Science Lab @ GNU — plain HTML site

Every page is a finished HTML file. No build step: GitHub Pages serves the files exactly as they are (`.nojekyll` turns Jekyll off).

## Publish at https://lshlj82.github.io

1. Open your existing repository `lshlj82/lshlj82.github.io`.
2. Upload the contents of this folder (not the folder itself) to the repository root: the `.html` files, `assets/`, and `.nojekyll`.
   - Your `CV/` folder is untouched, so `lshlj82.github.io/CV/CV_SHL.pdf` keeps working.
   - If the repository already has an `index.html`, `404.html` or `assets/` folder, it will be replaced or merged. Back them up first if you need them.
   - Your course and demo pages (`/physics1-GNU/`, `/friendship-paradox/`, …) live in their own repositories and are not affected.
3. Commit. The site updates within a minute or two.

## Files

| Page | File |
|---|---|
| Home | `index.html` |
| Principal Investigator | `pi.html` |
| Members | `members.html` |
| Publication List | `publications.html` |
| Research Talks & Lecture | `talks.html` |
| Press Release | `press.html` |
| Network Literacy Project | `network-literacy.html` |
| Missing-page message | `404.html` |

Styles are in `assets/css/style.css`; images are in `assets/img/`. Colors and the text-column width (`--measure`) are the variables at the top of `style.css`.

## Files hosted on the site (formerly on Google Drive)

Certificates, PDFs, and research data live in `assets/files/` (`awards/`, `data/`, `press/`), and the pages link to them there. To fetch them the first time, put `get_drive_files.py` in this folder and run `python3 get_drive_files.py`; it downloads each file from Google Drive and checks its size. Then upload `assets/files/` along with the rest of the site. The largest file is 9.6 MB, well under GitHub's 100 MB limit.

To add a new file later, put it in the right `assets/files/` subfolder and link to it as `assets/files/…` instead of using a Google Drive link.

## Your CV

The CV is at `CV/CV_SHL.pdf` in this repository, the same address as before (`lshlj82.github.io/CV/CV_SHL.pdf`). To update it, replace that file and commit. While your separate `CV` repository still publishes a Pages site, GitHub serves `/CV/` from that repository instead, so turn its Pages off once this site is live (in the `CV` repository: Settings → Pages → Unpublish site).

## Menu links to the meeting sites

The last three menu items, **KPS StatPhys Division**, **MEEting**, and **부경상회**, link to their own sites and sit below a thin divider. They appear in the menu block of every HTML page (the `<li class="nav-divider">` line and the two after it). To change a link or label, edit those lines in each of the 8 HTML files. Hovering over an item shows its full description (the `title="…"` text).

## Checking links

To find broken links, put `check_links.py` in this folder and run `python3 check_links.py`. It tests every link and writes `link_report.html` listing the broken ones. Delete both files before uploading.

## Light and dark mode

The moon/sun button (top-right corner of every page; at the right end of the top bar on phones) switches between light and dark mode. Light is the default; a visitor's choice is remembered in their browser. In dark mode the page turns dark and the sidebar bright. Both color sets are the variables at the top of `assets/css/style.css` (`:root` for light, `:root[data-theme="dark"]` for dark).

## Seeing your changes

After you commit, GitHub needs a minute or two to publish. Each page loads `style.css?v=…` with a code that changes whenever the stylesheet changes, so browsers always pick up a new stylesheet. To force a fresh reload anyway: Safari Option+Cmd+R; Chrome/Firefox on Mac Cmd+Shift+R.

## Fonts and colors

**EB Garamond** for English and **Nanum Myeongjo (나눔명조)** for Korean, both loaded from Google Fonts. Browsers choose per character, so mixed lines like "Gyeongsang National University (경상국립대학교)" use each font for its own script. If Google Fonts can't load, Korean falls back to the visitor's installed Nanum Myeongjo, AppleMyungjo (Mac) or Batang (Windows). The sidebar is dark charcoal (#212121), as on the former Google Site. Fonts and colors are the variables at the top of `assets/css/style.css`.

Pages have no visible title (they open with their content, as on the former Google Site); each still has a hidden title for search engines and screen readers. The home page opens with the lab logo.

## Editing

- **Add a paper:** in `publications.html`, copy an existing `<li>…</li>` block under "Research Papers" and paste it at the top. The list is `<ol reversed>`, so the newest paper always has the highest number and everything renumbers automatically. Put your name, the paper title, and the volume number in bold with `<strong>…</strong>`, e.g. `<a href="…"><strong>Sang&nbsp;Hoon Lee</strong></a>`, `<strong>Paper title</strong>`, `<a href="…">Phys. Rev. E <strong>111</strong>, 054302</a>`.
- **Korean in brackets:** Safari can wrap a line right after "(" when Korean text follows. When you add something like "(경상국립대학교)" by hand, wrap the bracket and the Korean word together: `<span class="nobr">(경상국립대학교)</span>`. That keeps them on the same line in every browser.
- **Quotes and apostrophes:** type curly ones (‘ ’ “ ”), e.g. course ‘Network Science’ or people’s. Straight quotes (' ") look like short vertical ticks in EB Garamond. On a Mac, Option+] and Option+Shift+] give ‘ and ’, and Option+[ and Option+Shift+[ give “ and ”.
- **Your name:** write it as `Sang&nbsp;Hoon Lee` when adding a paper or other text by hand. The `&nbsp;` keeps "Sang" and "Hoon" on the same line.
- **Change the menu:** the sidebar menu is repeated in every `.html` file, so edit it in all eight files (search for `<nav aria-label="Site">`).
- **"Last updated" date:** at the bottom of each file, in the `<footer>`.
