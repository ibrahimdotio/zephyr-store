# Third-party notices

## Pokémon Cards CSS

Source: https://github.com/simeydotme/pokemon-cards-css

Author: Simon Goellner (@simeydotme)

Copyright (C) 2022 Simon Goellner.

License: GNU General Public License v3.0. The upstream license is included verbatim in `LICENSE`.

Upstream revision: `acb1197633e749a1fba4412231db2f6581586d00`.

The following styles are combined into `dist/effects.css`: `public/css/cards/base.css`, `public/css/cards.css`, `public/css/cards/v-regular.css`, `public/css/cards/v-full-art.css`, `public/css/cards/rainbow-holo.css`, `public/css/cards/rainbow-alt.css`, and `public/css/cards/radiant-holo.css`. On 2026-09-18 their image paths were changed to relative local paths for this storefront. The referenced grain, glitter, illusion, illusion-mask, and trainerbg textures are retained under `dist/assets/effects/`.

The upstream project additionally credits aschefield101 for Galaxy Holo and Vecteezy for some backgrounds. Those upstream credits are preserved here; no additional ownership of texture artwork is claimed.

The storefront layout and plain-JavaScript interaction controller were written for Zephyr. The interaction controller drives the CSS custom properties expected by the original foil styles. This combined code is distributed under GPL-3.0.

## Card data and artwork

Original card selections were cross-checked against the card dataset in Pokémon Cards CSS. Artwork and card identities were retrieved from the TCGdex API (`https://api.tcgdex.net/v2/en/cards/`) and `https://assets.tcgdex.net/`. The precise artwork source URL for every card is recorded in `dist/cards.js`.

TCGdex: https://tcgdex.dev/

Card back: https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg

Pokémon and Pokémon character names are trademarks of Nintendo. Pokémon card art belongs to its respective rights holders, including Pokémon, Nintendo, Creatures, and GAME FREAK. These assets are included for the requested demonstration and are not licensed under GPL-3.0. Zephyr is an independent mock storefront and is not endorsed by those companies.

## Fonts

DM Sans and Space Grotesk are requested through Google Fonts with local system font fallbacks. Both families are available under the SIL Open Font License.
