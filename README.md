
![Index (as) Cards Header Image](https://imagedelivery.net/gaLGizR3kCgx5yRLtiRIOw/300ffefe-0d67-415b-41ba-bc693f4bbd00/public?format=webp)

# Near Future Laboratory Index (as) Cards

**Live Demo:** [https://index-as-cards.nearfuturelaboratory.com](https://index-as-cards.nearfuturelaboratory.com)  
**Read the Blog Post:** [An Index (as) Cards](https://nearfuturelaboratory.com/blog/2026/01/an-index-as-cards)

## The Index Page: A Spatial Reimagining

I have been wondering about the ways in which an “index” page on a website could be reimagined such that it harkens back to when the index on a website was more like an indexical representation of a body of work, rather than the more contemporary approach in which the page needs to be more optimized for search, SEO, and algorithmic discovery.

In that context I set out to prototype and experiment with what this might be without overthinking things.

This prototype is an exploration of what an “index” page is as a series of “cards” that represent different content pieces.

The metaphor of cards looms large in my mind as I really used to love going to the Princeton Public Library and, when I could, the Firestone Library at Princeton University and browsing the card catalog, more invested in the exploration and serendipity of discovery, and anxious about the fragility of these paper cards (wondering how losing one could result in an orphaned book or other artifact!).

Each card can be visually rich, with images, text snippets, and other design elements that convey the essence of the content it represents. The layout can be dynamic, allowing users to scroll around an infinite canvas, select using tags and dates to filter the cards, and even annotate and draw upon the cards/canvas itself.

This idea had come to me while watching an artist‘s talk where they were doing something similar walking through their portfolio using some canvas program on their iPad. I recall playing with that program, but what struck me was that it was just a fixed set of images on a canvas (which is fine, as far as it goes..) but what I wondered about was having the items on the canvas indexed to the actual content pieces themselves so it's a bit more dynamic or at least more directly linked to the content, and could update as more content was added.

But..I did really like the idea that you could annotate on top of the content while presenting it..although I'm not 100% sure how I might use that feature myself...I'd have to think about that more.

This project uses [tldraw](https://tldraw.com) as the engine for this spatial interface, transforming a standard JSON data source into an interactive playground of ideas.

## Features

*   **Spatial Canvas:** An infinite canvas where every blog post, project, or artifact is a manipulatable card.
*   **Dynamic Filtering:** Filter cards by Collection, Tags, and Year. The canvas automatically reorganizes to show only relevant items.
*   **Deep Dive:** Click any card to open a detailed reading pane without losing your place on the canvas.
*   **Annotation Tools:** Use the `Timed Line`, `Timed Draw`, and `Timed Highlight` tools to mark up the canvas. (These annotations fade over time, emphasizing the ephemeral nature of thought).
*   **Collapsible Interface:** Focus on the content by collapsing the index controls.

## Technical Overview

### Tech Stack

*   **Framework:** [React](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Canvas Engine:** [tldraw SDK](https://tldraw.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/)

### Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Architecture

The core of the application is a custom tldraw implementation that maps a static JSON dataset into custom shapes.

*   **Data Source:** `src/data/cards.json` contains the metadata for all index items.
*   **Custom Shape:** `src/CardShapeUtil.jsx` defines the visual rendering of the cards (Title, Image, Summary).
*   **State Management:** `src/App.jsx` handles the logic of mapping filtered data to tldraw shapes, managing layout grids, and handling user interactions.

### How it Works

1.  **Initialization:** On load, the app reads `cards.json` and instantiates a custom `card` shape for every entry on the tldraw canvas.
2.  **Reactivity:** When filters (Tags, Collections) are changed, the app calculates a new grid layout for the visible cards and animates them into position. Hidden cards are removed or faded out.
3.  **Interactivity:** Selecting a card triggers the side panel to display the full content (via iframe or detailed view).

---

*Created by [Near Future Laboratory](https://nearfuturelaboratory.com).*
