# Adding a link

All the links on the site live in three files with the same format. To add one, edit the right file and open a pull
request. You do not need to touch any HTML.

- [`data/links.json`](data/links.json): the hub (server jars, servers, launchers, tools, modding resources, docs and
  community).
- [`data/mod_links.json`](data/mod_links.json): the Mods page. Add mods, mod loaders and libraries here, and tools for
  making mods.
- [`data/plugin_links.json`](data/plugin_links.json): the Plugins page. Add server plugins here, grouped by who makes them
  (RetroMC, BetaMC, more).

## What makes a good link

- It is about **Minecraft Beta 1.7.3** or the legacy Minecraft community around it (server software, plugins, trackers,
  launchers, world tools, modding, docs, communities).
- It is **alive**, public, and safe. No paywalled downloads, no pages that need an account to read, no link shorteners.
- It is **useful on its own**. Say what it is and why someone would want it in one sentence.
- It is not already on the site. The validator catches exact duplicates within a section.

We will say no to links that are mostly advertising, and to server listings that do not run A Legacy Minecraft Version.

## How to add one

1. Find the right section and group in the right file. Copy a neighbouring entry.
2. Fill in your own values:

   ```json
   {
     "title": "Example Plugin",
     "url": "https://github.com/example/plugin",
     "description": "One sentence on what it does and who it is for.",
     "tags": "extra search words people might type",
     "badge": "Active",
     "badgeType": "live"
   }
   ```

3. Check it: `node scripts/validate-links.mjs`. It checks every file and lists every problem with the exact entry and
   field.
4. Open a pull request and fill in the checklist.

You can edit the file right in the GitHub web editor.

### Fields

| Field                 | Required | Notes                                                                                                                                                                              |
|-----------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`               | yes      | Up to 80 characters.                                                                                                                                                               |
| `url`                 | yes      | Full `https://` link.                                                                                                                                                              |
| `description`         | yes      | Up to 300 characters, one or two sentences.                                                                                                                                        |
| `tags`                | no       | Space-separated extra words for the site search.                                                                                                                                   |
| `badge` + `badgeType` | no       | Both or neither. Types: `live` (active), `rc`, `exp` (experimental), `stale`, `archived`, `warn` (use caution), `src` (build from source). A badge is a word, never only a colour. |
| `host`                | no       | The small grey line on the card. Defaults to the site name (for GitHub, `github.com/owner/repo`).                                                                                  |
| `featured`            | no       | Wide gold card. Reserved for the one main pick in a section, so please leave it to the maintainers discretion.                                                                     |
| `internal`            | no       | Links to a page on the site itself. Maintainers only.                                                                                                                              |

Servers (in the **Featured servers** group) use `address` instead of a plain link: `title`, `description`, `address`,
and optionally `url` (website) and `links` (a list of `{ "label": "Wiki", "url": "https://..." }`). Only add a server that
is public and has been online for a while.

### Text formatting

Everything is plain text, and **HTML is not allowed**. Three small extras work inside any text field:

- `` `code` `` for file names and commands
- `*italic*`
- `**bold**`

## Rules the validator enforces

- Links must start with `https://`, with no username or password in them.
- No duplicate URL inside one section.
- No unknown fields (this catches typos such as `descripton`).
- `badge` and `badgeType` go together.
- Titles, descriptions and tags stay inside their length limits.

The same checks run again when the maintainers build the website, so no mistake can reach the live site.
