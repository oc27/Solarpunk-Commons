# Solarpunk Commons MVP

A static GitHub Pages starter connected directly to Supabase. Includes a landing page, email/password registration, profile creation, searchable public member directory, and a projects placeholder.

## Install
1. Unzip this folder and copy its contents into the **root** of your existing GitHub Pages repository. Back up your existing `index.html` first if you want to keep it.
2. Edit `config.js`. Replace the URL and key placeholders with your Supabase **Project URL** and **Publishable key** (older projects may label this `anon` key). Never use a secret or service_role key in browser code.
3. In Supabase, open **SQL Editor → New query**, paste all of `supabase-setup.sql`, and click **Run**.
4. In Supabase **Authentication → URL Configuration**, set Site URL to `https://solarpunkcommons.com` and add `https://solarpunkcommons.com/**` to Redirect URLs.
5. In **Authentication → Providers → Email**, enable email/password sign-up. Keep email confirmation on.
6. Commit and push the files to GitHub. Visit `https://solarpunkcommons.com/register.html` to test.

## Test
Register using an email you can access. Confirm via the email link. Check **Table Editor → profiles** in Supabase, then visit `/people.html`.

## Privacy and security
The directory is public. Names, locations, introductions, interests and contribution statements are visible to anyone. Email addresses and passwords are not in the public profiles table. The form requires consent to public display. RLS lets anyone read public profiles and lets authenticated members update only their own record. The signup trigger creates profiles; users cannot insert arbitrary profiles.

This is an MVP, not a fully hardened community platform. Before a wider launch, consider profile editing, account deletion, moderation/reporting, rate limiting/CAPTCHA, a privacy policy and a community agreement. Do not collect sensitive personal information in public profile fields.

## Files
`index.html` landing page · `register.html` signup form · `people.html` directory · `projects.html` placeholder · `styles.css` styling · `config.js` Supabase connection · `auth.js` signup · `people.js` directory logic · `supabase-setup.sql` database setup.
