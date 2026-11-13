# Solarpunk Commons — research directory MVP

A static GitHub Pages site connected to Supabase. The current experience is intentionally simple: people create a co-researcher profile, browse the directory, and answer the first shared research questions.

## Update your existing site
1. Unzip this folder and copy its contents into the root of your GitHub repository, replacing the previous site files.
2. **Keep your existing `config.js`**; the ZIP version is only a placeholder. It must contain your Supabase project URL and publishable key.
3. In Supabase SQL Editor, run `location-map-migration.sql` once. This adds latitude/longitude columns while preserving existing profile location text.
4. Commit and push to GitHub, then refresh your domain after Pages deploys.

## Current participation flow
- Create and edit a public co-researcher profile.
- Browse and search the co-researcher directory.
- Expand profile sections to read longer introductions and research contributions.
- Answer the open research questions and return later to edit answers.

## Location data for a future map
Members enter a general place name (town, city or region), not a street address. The form looks up an approximate point using OpenStreetMap Nominatim and saves the place label plus `location_lat` and `location_lng` as numeric coordinates in `profiles`. The coordinates are suitable for plotting approximate markers on a future map. Existing text-only locations remain intact; their coordinates will be blank until members edit and look them up. Nominatim attribution and usage policy apply.

## Security
Keep only the Supabase publishable/anon key in browser code; never expose a service-role key. Email addresses and passwords are not displayed in the public directory. Public profile answers are visible to visitors. Members can edit their own profile and research contributions.

## Main files
- `index.html` — homepage and two-step participation callout
- `register.html`, `auth.js` — account creation and profile setup
- `profile.html`, `profile.js` — editable profile
- `people.html`, `people.js` — co-researcher directory
- `research-topics.html`, `research.js` — shared research questions and answers
- `location.js` — approximate geocoding for map-ready profile locations
- `location-map-migration.sql` — one-time Supabase migration
- `config.js` — preserve your existing Supabase connection settings

The old project and offers/needs database tables, if already created, are left untouched. They are no longer part of the site interface.
