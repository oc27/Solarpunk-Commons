# Solarpunk Commons — consolidated MVP

A static GitHub Pages site connected to Supabase. This version brings together member profiles, research topics, projects, and member offers & needs.

## Update an existing site
1. Download and unzip this folder.
2. Copy the contents of `solarpunk-commons-mvp` into the root of your existing GitHub repository, replacing the previous site files.
3. **Keep your existing `config.js`**. The copy in this ZIP is a placeholder; do not overwrite the file containing your Supabase Project URL and publishable key.
4. In Supabase, open **SQL Editor → New query**. Paste the entire contents of `all-database-setup.sql` and click **Run**. It creates/updates the tables and policies for profiles, research topics, projects, and offers & needs. Existing member data is not deleted.
5. Commit and push the updated site files to GitHub. Wait for GitHub Pages to deploy, then refresh your domain.

If you have already run some of the earlier SQL setup files, the consolidated script is designed to be safe to run again: it uses `create table if not exists` and replaces named policies. If Supabase reports an error, stop and share the exact error rather than running fragments at random.

## What members can do
- Create and edit a public research identity.
- Browse the People directory.
- Answer open research questions and return to edit answers.
- Publish, edit and delete their own projects.
- Add offers and needs (hospitality, somewhere to live/stay, workspace, skills, local knowledge, collaboration, etc.). Offers and needs can be public or private; private entries are visible only to their owner.

## Configuration and security
`config.js` must contain the Supabase Project URL and the **publishable** key (or legacy anon key). Never put a service-role or secret key in browser code. Email addresses and passwords are not exposed in the public profile table.

The directory, projects and public offers/needs are public. Members can only edit their own records. Private offers/needs are protected by row-level security and are not returned to other members. Keep location descriptions general; never publish a home address or sensitive personal details. This is an early community tool, not a housing, booking or safeguarding service. Members should arrange stays and meetings directly and use their judgement about safety.

## Files
- `index.html` — homepage and explanation of what people can do
- `people.html` / `people.js` — member directory and contributions
- `projects.html` / `projects.js` — project listings and editor
- `offers-needs.html` / `offers-needs.js` — hospitality, offers and needs
- `research-topics.html` / `research.js` — collective research questions
- `register.html`, `login.html`, `profile.html` — account and profile pages
- `all-database-setup.sql` — consolidated Supabase setup
- `config.js` — your local Supabase connection settings (preserve your existing file)
