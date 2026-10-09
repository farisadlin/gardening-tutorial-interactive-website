# Grow Together

An English–Indonesian learning website for beginner home gardeners in tropical Indonesia. Six crops, two growing methods, and real interactive 3D lesson scenes.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev -- --port 5178
```

Open http://127.0.0.1:5178. If that port is occupied, use another port. The server listens only on localhost.

```sh
npm run check       # bilingual content validation, persistence tests, TypeScript, production build
npx playwright install chromium  # first-time browser test setup
npm run test:e2e    # complete browser journeys, 3D controls, fallback, accessibility, mobile
npm run preview -- --port 4178   # preview the production build
```

## What is included

- Pak choi, water spinach (kangkung), vegetable amaranth (bayam), lettuce, chilli, and common chives (Allium schoenoprasum).
- Thirty-five tutorials (six soil paths and 29 supported hydroponic crop/system combinations) with six steps each: preparation, sowing, transplanting, care, troubleshooting, and harvest.
- Method- and system-specific tool/material guides with required/optional labels, functions, measurement and calibration supplies, crop-sized pots/reservoir guidance, and chilli supports. Full lists appear in crop overviews; the lesson accordion opens by default in preparation.
- English and Indonesian instructions, equipment lists, checklists, quizzes with explanations, model labels, and progress screens.
- Search in both languages, difficulty filters, and growing-method selection, and a six-system hydroponic comparison.
- Progress saved separately for each crop/method/hydroponic system in localStorage, with a confirmed reset action and a warning if storage is unavailable. Completing a step requires all three task checks and the correct quiz answer. Users may explore any step in any order.
- Lazy-loaded Three.js / React Three Fiber / Drei scenes with crop-specific foliage, stage presets, NFT and DFT channels, Wick media pots and capillary wicks, Kratky air gaps, DWC aeration, drip emitters and drain lines, cutaway containers, exposed roots, seeds, net pots, nutrient solution, selectable labels, and camera controls.
- Static cross-section diagrams and equivalent text when WebGL is unavailable or when the user selects Diagram. Context loss and model-rendering errors fall back to the diagram.
- Crop-specific pH, EC, PPM (switchable 500/700 scale), preferred air temperature, and a separately labelled shared solution-temperature reference. These appear on overview and lesson pages with bilingual scope notes, seedling cautions, and sources. The PPM scale choice persists on the device independently of learning progress. Soil pages show air temperature and explain why hydroponic PPM does not measure soil fertility.
- Keyboard controls, reduced-motion support, and responsive layouts.

## Routes and content

- `/`: welcome page with links to the plant library and learning introduction.
- `/how-it-works`: learning introduction and getting-started guidance.
- `/plants`: crop library; `q`, `method` (`soil` / `hydro`), and `difficulty` (`easy` / `moderate`) query filters.
- `/plants/:cropId`: crop overview and equipment; optional `method` query selects a growing path; `system` selects a hydroponic system.
- `/learn/:cropId/:method/:stage`: a lesson, with a stable step URL and optional `system=nft|dft|wick|kratky|dwc|drip` query. Switching systems preserves the current step and language. Unknown or unsupported system URLs display a helpful comparison link.
- `/progress`: device-local learning progress.

Legacy homepage links `/#crop-library`, `/#how-it-works`, and library filter queries redirect to their dedicated pages.

Crop and lesson content lives in `src/data/garden.ts`; bilingual system equipment, setup, care, quizzes, source links, and crop suitability live in `src/data/hydroSystems.ts`. `Crop` holds crop-specific bilingual growing guidance. `Tutorial` holds equipment, source links, and six `Step` records. Quiz, crop, method, and step IDs stay stable across languages. Shared scene definitions live in `src/components/sceneConfig.ts`. Add a crop by adding its profile, adapting its lesson guidance, and updating its botanical and 3D illustration if needed; run content validation afterwards.

Saved data uses `grow-together:v1`. Reading validates known tutorials, checklist bounds, answer indices, and completion requirements. Unknown or damaged data is discarded safely. No account, backend, analytics, cloud syncing, or notifications are included. Clearing browser data or changing devices will lose this device's progress.

## Growing guidance and limitations

Crop guidance references University of Minnesota, University of Maryland, World Vegetable Center, Oklahoma State University, University of Missouri, Indonesian Ministry of Agriculture, and University of Hawaiʻi extension material. Source links appear in each overview and lesson. Climate adaptations and reservoir/container sizes are editorial home-growing starting points, not universal requirements. Published regional planting calendars are not copied into Indonesian guidance. Seed packet instructions, cultivar behavior, local conditions, and nutrient product labels take priority.

Six systems are available: NFT, DFT, Wick, Kratky, DWC, and Drip. Pak choi, amaranth, and lettuce have all six paths. Water spinach has NFT, DFT, DWC, and Drip; chilli has DWC and Drip; chives has all except Kratky. These are the supported beginner guides, not claims that other systems cannot grow these crops. The comparison explains the limitations of unavailable combinations.

New crop overviews select Wick by default for pak choi, amaranth, lettuce, and chives. Water spinach and chilli start with DWC because their beginner guides do not support Wick. Explicit system selections take priority.

For compatibility, the legacy lesson default remains Kratky for pak choi, amaranth, and lettuce, and DWC for water spinach, chilli, and chives. Existing hydroponic URLs and saved tutorial IDs continue to work. Additional paths use system-specific IDs, so their checklists and quiz answers stay independent. No storage migration is required.

DFT terminology varies between sources and installations. This guide uses a recirculating channel with retained deeper solution, an overflow-level fitting, and supplementary reservoir aeration. NFT uses a shallow flowing film. The setup diagrams are conceptual; they are not installation drawings or universal flow rates. Wick lessons require tested capillary uptake and airy medium; drip lessons require checking emitter flow and drainage. Passive Kratky lessons explain preserving established air roots during top-ups. All hydroponic lessons require complete nutrients and pH/EC measurements; they do not prescribe an unverified fertilizer recipe. Lettuce, pak choi, and common chives include explicit tropical-heat considerations.

The procedural models are educational illustrations, not photorealistic models, precise engineering designs, plant-growth simulations, or yield predictions. The six steps update their growth and focus state; growth is not animated automatically. Users can rotate with drag or buttons, zoom by scroll/pinch or buttons, and reset the camera. Cutaway exposes the root zone. The diagram remains available as a lighter alternative.

The header photograph is loaded from Unsplash and has a local botanical fallback. Fonts use Google Fonts with serif/sans-serif fallbacks. These external visual assets need network access; tutorial content and procedural models are bundled locally. This version is locally runnable and has not been deployed. A future static host must rewrite application routes to `index.html`.

## Nutrient and temperature references

`src/data/growingTargets.ts` stores numeric ranges and crop-specific provenance; PPM is calculated from EC rather than copied from inconsistent tables. EC is the total mixed-solution reading in mS/cm, including source-water salts. PPM500 = EC × 500, PPM700 = EC × 700; these are meter conversions, not measured nutrient composition or dosing recipes. The scale preference uses `grow-together:ppm-scale`; unavailable localStorage does not block the controls.

Established-growth starting references:

| Crop | Solution pH | EC (mS/cm) | PPM500 | Preferred growing air (°C) |
| --- | --- | --- | --- | --- |
| Pak choi | 5.5–6.5 | 1.5–2.0 | 750–1,000 | 16–21 |
| Water spinach | 5.5–6.5 | 1.5–2.0 | 750–1,000 | 25–32 |
| Vegetable amaranth | 6.0–6.5 | 1.3–1.7 | 650–850 | 25–35 |
| Lettuce | 6.0–7.0 | 1.2–1.8 | 600–900 | 16–21 |
| Chilli | 5.5–6.0 | 0.8–1.8 | 400–900 | 21–29 |
| Common chives | 5.5–6.8 | 1.8–2.4 | 900–1,200 | 13–24 |

The shared solution-temperature reference is 22–24 °C, rounded from OSU's 72–75 °F. It is not a researched species-specific optimum. Air references apply to growing plants, not germination or survival limits. The amaranth EC band is an explicitly labelled editorial starting band around a 1.5 mS/cm finding for red amaranth Arka Arunima in NFT; it should not be generalized to all Amaranthus cultivars without adaptation. The pepper reference does not replace product-specific flowering/fruiting feed schedules. Seedlings need the nutrient product's seedling guidance, not an automatic full-strength mature-plant target.

Linked provenance is shown beside the metrics and within lesson sources: IPB pak choi trial, BBPP Kupang kangkung guidance, red amaranth NFT research, OSU hydroponic EC/pH guidance, IGWorks chive guidance, WorldVeg crop guides, Iowa State crop guidance, University of Illinois lettuce guidance, Ontario common chives, and Bluelab meter conversion documentation.

Equipment is authored in `src/data/equipment.ts` and shared by overview/lesson UI and tutorial content. Lists distinguish setup materials, measuring/mixing, and care/harvest tools. Equivalent tools are acceptable; optional items depend on the site and product instructions. No purchase links or brands are required.

## Plant age: HSS and HST

Every first-harvest estimate is explicitly tagged Days After Sowing (DAS) / Hari Setelah Semai (HSS), including crop cards and overviews. `Crop.harvestBasis` is `sowing` and is validated. The overview and lesson age guide explain HST as days after moving seedlings to the final growing position (DAT in English), with day 0 on the event date. At 14 HSS, transplanting starts 0 HST; seven days later is 21 HSS / 7 HST. This is a counting example, not a crop-specific transplant schedule. With direct sowing, the starting dates coincide. Seed packet conventions take priority; transplant readiness follows true leaves and roots, and divided chives are not covered by seed-based harvest estimates.
