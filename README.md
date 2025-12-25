# tldraw Cards Demo

Simple demo that uses `@tldraw/tldraw` and static JSON to create draggable, overlappable "cards" on a tldraw canvas. Features:

- Create cards from a static JSON file
- Shuffle positions
- Filter by collection and tags
- Select a card to view full content in the side panel

Quick start:

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Custom card shape

Cards are a single custom `card` shape (defined in `src/CardShapeUtil.jsx`) that renders:

- A top title bar (`div`, 40px tall, gold background, bold text)
- An image area sized to ~45% of the card height (bounded between 140–220px), filling width with `object-fit: cover`
- A summary area filling the remaining height (padded dark background with light text)
- Rounded corners, shadow, serif font, and no user selection

Shape props are set when shapes are created in `src/App.jsx` (`w/h/title/image/summary/content/cardId`), so adjust layout either in the shape util defaults or where the shapes are instantiated.

### How JSON merges into shapes
- On mount, `src/App.jsx` creates one `card` shape per entry in `src/data/cards.json`, mapping JSON fields (`title`, `image`, `summary`, `content`, `cardId`) into shape props.
- On every filter change, an effect in `App.jsx` re-reads `cards.json` and updates existing shapes’ props to match the latest JSON (including `opacity` for show/hide based on filters).
- The shape uses these props directly when rendering, so edits to `cards.json` or filter state flow into the rendered card without recreating shapes.
