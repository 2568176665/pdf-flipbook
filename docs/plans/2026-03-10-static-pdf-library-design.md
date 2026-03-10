# Static PDF Library Design

## Summary

Rebuild the current legacy PDF flipbook site as a lightweight static website with:

- no build step
- minimal external libraries loaded from CDNs
- multiple local PDF books managed through `books.json`
- shareable reader URLs for each book
- a realistic page-flip reading experience

The recommended stack is:

- HTML
- CSS
- vanilla JavaScript
- PDF.js from CDN
- `page-flip` from CDN

## Current Problems

The current project is based on a large legacy flipbook plugin and direct script inclusion.

- Single entry page with inline initialization logic
- Large bundled legacy script in `lib/js/flip.js`
- No real dependency management
- Tight coupling between content and UI
- Limited maintainability for multiple books
- Existing runtime issues in custom UI logic
- README encoding issues and weak project hygiene

## Goals

- Keep the project as a static site
- Avoid any build tooling
- Use as few external libraries as possible
- Load libraries through CDN where practical
- Support multiple books from a JSON config file
- Keep PDF files on the same domain as static assets
- Provide direct shareable URLs for each book
- Preserve a realistic flipbook interaction

## Non-Goals

- No React, Vue, or other framework
- No bundler or TypeScript
- No server-side rendering
- No CMS integration
- No backend API
- No advanced search/indexing in the first version

## Chosen Approach

Use two static pages plus a shared JSON content source:

- `/index.html` for the library page
- `/book.html?slug=<book-slug>` for the reader page
- `/books.json` as the single source of truth for catalog content

This approach keeps deployment simple and works reliably on generic static hosting without rewrite rules.

## Alternatives Considered

### 1. Vanilla JS + PDF.js + page-flip

Recommended.

Pros:

- Minimal stack
- Preserves page-flip interaction
- Keeps code understandable
- Supports multiple books cleanly
- No build pipeline needed

Cons:

- More application glue code must be written manually

### 2. Vanilla JS + PDF.js only

Pros:

- Smallest dependency footprint

Cons:

- Does not preserve a realistic flipbook experience

### 3. Continue using the existing legacy flipbook plugin

Pros:

- Lowest short-term migration effort

Cons:

- Keeps major technical debt
- Harder to maintain and extend
- Continues reliance on legacy patterns and large bundled code

## Architecture

### Pages

`index.html`

- Shows the library grid
- Loads and renders book metadata from `books.json`
- Links each item to the reader page

`book.html`

- Loads one specific book by `slug`
- Renders the reader shell and controls
- Initializes PDF rendering and page flip behavior

### Shared Data Source

`books.json` stores all catalog metadata.

Each book should include at least:

```json
{
  "slug": "tracker-a-en",
  "title": "Tracker A Catalog",
  "description": "Compact product brochure for Tracker A.",
  "lang": "en",
  "cover": "assets/covers/tracker-a-en.webp",
  "pdf": "assets/pdf/tracker-a-en.pdf",
  "featured": true,
  "order": 10
}
```

Rules:

- `slug` must be unique
- `pdf` and `cover` should be same-origin static files
- Sorting should be deterministic through `order`

## File Structure

Suggested structure:

```text
/
  index.html
  book.html
  books.json
  assets/
    covers/
    pdf/
    icons/
  js/
    app.js
    library.js
    reader.js
    contact.js
  css/
    base.css
    library.css
    reader.css
```

## Routing Strategy

Use simple query-parameter routing:

- Library: `/`
- Reader: `/book.html?slug=tracker-a-en`

Reasons:

- No build or router required
- No server rewrites required
- Stable shareable links
- Easy to debug and host

Optional future enhancement:

- Add path-based URLs if the host supports rewrites
- Keep query-based URLs as the fallback canonical format

## Library Page Design

Responsibilities:

- Fetch `books.json`
- Sort and render books
- Show cover, title, language, and summary
- Link to the reader page
- Optionally support simple category or language filters later

Behavior:

- PDF files are not loaded on the library page
- Only metadata and cover images are loaded

## Reader Page Design

Responsibilities:

- Read `slug` from the URL
- Load `books.json`
- Resolve the selected book
- Load the PDF through PDF.js
- Render pages into a flipbook container using `page-flip`
- Update reader UI state

Reader UI sections:

- top bar: back to library, title, language, download, copy link
- main stage: flipbook canvas/container
- page controls: prev, next, current page, total pages
- state layer: loading, not found, load failed
- mobile controls: compact overlay actions

## Data Flow

### Library Page

1. Page loads
2. Fetch `books.json`
3. Validate and sort entries
4. Render book cards
5. User clicks a book link

### Reader Page

1. Page loads
2. Parse `slug` from URL
3. Fetch `books.json`
4. Find matching book
5. Show error state if missing
6. Load PDF document
7. Render pages on demand
8. Mount page-flip instance
9. Sync page number and controls during navigation

## Rendering Strategy

To keep performance acceptable without a framework:

- lazy load reader-only scripts on `book.html`
- render pages progressively instead of pre-rendering the entire PDF at full size
- use lower initial resolution on mobile
- keep cover images compressed and normalized

The reader should prefer:

- initial render of the first visible pages
- background rendering of nearby pages
- cancellation or throttling if the user changes books quickly

## Error Handling

Handle only high-value failure cases:

- `books.json` fetch failure: show library configuration error
- invalid `slug`: show not-found state with link back to the library
- PDF fetch/open failure: show file load error
- page render failure: show retry action without blanking the entire page

## Contact Module

Keep the floating contact widget as an isolated UI module.

Requirements:

- no dependency on the reader internals
- graceful behavior when optional links are missing
- no assumptions about commented-out DOM nodes

## Performance Constraints

- Do not preload PDFs on the library page
- Avoid full-document eager rendering
- Prefer same-origin assets to avoid CORS issues
- Compress cover images
- Keep the reader UI independent from the book list UI

## Verification

Manual verification is sufficient for this static site.

Required checks:

1. Library page loads and renders all books from `books.json`
2. Clicking a book opens `/book.html?slug=...`
3. Directly opening a shared reader URL loads the correct book
4. Prev/next controls and page number work correctly
5. Download and share link actions point to the correct file and URL
6. Mobile layout remains usable
7. Invalid `slug` and invalid `pdf` paths show clear fallback states

## Migration Plan

Phase 1:

- Create the new static structure
- Add `books.json`
- Build the library page shell

Phase 2:

- Build the reader page shell
- Integrate PDF.js and `page-flip`
- Add shareable book URLs

Phase 3:

- Port contact UI cleanly
- Optimize mobile layout and loading states
- Remove legacy plugin dependencies

## Decision

Proceed with:

- static multi-page site
- `books.json` driven catalog
- query-based reader URLs
- vanilla JavaScript
- PDF.js + `page-flip`

This is the lightest approach that still preserves the desired flipbook experience and supports maintainable multi-book sharing.
