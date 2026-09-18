# Zephyr

A mock Pokémon card storefront built around tactile, interactive holographic cards. The presentation uses a dark, lime-accented storefront and eight curated cards, with the original **Pokémon Cards CSS v2** foil treatments by Simon Goellner.

## Run locally

No installation or build step is required. From this repository:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173 in a current browser. Serve the files over HTTP; JavaScript modules will not work by opening `index.html` directly from the filesystem.

## Experience

- Hover over cards to tilt them and move their foil reflections.
- Select a card to open its larger inspection view.
- Flip the card, reset its position, or browse to the previous/next card.
- On touchscreens, open a card and drag over it; the collection itself remains scrollable.
- Turn holographic effects on or off for comparison.
- Keyboard: Tab to controls, Enter to open a card, Escape to close. With the enlarged card focused, use arrow keys to tilt, F to flip, and Home to reset.
- Reduced-motion preferences disable automatic introductory movement and 3D tilt while preserving explicit front/back viewing.

This is a display-only concept. There are no payments, customer accounts, actual inventory claims, or checkout.

## Project structure

`dist/` is the authored, deployable website (intentionally tracked in Git):

- `index.html`: storefront and accessible native dialog.
- `styles.css`: Zephyr layout, responsive rules, card integration, and reduced-motion behavior.
- `app.js`: card pointer interaction, inspection, flipping, and keyboard controls.
- `cards.js`: the selected card data, local artwork paths, and original image sources.
- `effects.css`: the applicable original foil styles, combined with asset paths adapted for relative hosting.
- `assets/`: locally stored card artwork and foil textures.

Upload the contents of `dist/` to any static host. Relative asset paths support hosting under a repository subdirectory, including GitHub Pages. No hosting service is configured automatically.

## Credits and licensing

The code is distributed under GPL-3.0; see [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Simon Goellner's original card effects and license are retained, with a visible credit in the website footer.

The original project's unmasked fallback textures are used. Card-specific etched foil maps and masks are not bundled, so fine foil placement is an approximation of the physical cards.

Card art is sourced from TCGdex, with the card back from the official Pokémon TCG website. Pokémon art and trademarks remain the property of their respective owners and are not covered by the software license.

## Validation

JavaScript syntax, local asset references, selected card metadata, and the local HTTP preview were checked. Automated visual and browser interaction checks could not run in the authoring session because the browser's required security policy check was unavailable. Browser behavior should be reviewed before production use.
