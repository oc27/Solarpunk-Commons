# Solarpunk Commons: admin setup

## Install
1. In Supabase, open **SQL Editor → New query**.
2. Open `admin-setup.sql` and copy it into the editor.
3. Before running, replace `YOUR-LOGIN-EMAIL@example.com` with the email address of the account you use to sign in to Solarpunk Commons.
4. Run the SQL. This adds an admin flag, secure admin-only write policies, and profile-field wording settings. It does not delete existing profile or research data.
5. Upload/commit all website files, including `admin.html`, `admin.js`, `profile-fields.js`, `admin-setup.sql` and `ADMIN-GUIDE.md`.
6. Sign in to the site and visit `admin.html` on your domain (for example `https://your-domain/admin.html`).

## What the admin page does
- Add, edit, reorder, show/hide and delete research questions.
- Edit the labels and help text for the existing profile fields, and hide/show those fields on both registration and profile-edit forms.
- Hiding a field does not delete stored answers.

Deleting a research question also deletes its associated responses. The admin page asks for confirmation first. Do not delete a question if you need to retain its responses; hide it instead.

## Important distinction
The profile-field editor currently configures the five existing fields (`name`, `location`, `introduction`, `interests`, `contribution`). It does not create brand-new database fields or change the available interest checkbox choices. Those are a later extension and require a deliberate data-model change.

Only accounts whose `profiles.is_admin` value is true can write through the admin tools. The public publishable key in `config.js` is expected; access is enforced by Supabase Row Level Security, not by hiding the admin page.
