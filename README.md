# Legacy Minecraft Links

A community-maintained list of links for **Legacy Minecraft (Beta 1.7.3)**: server jars, plugins, trackers and server
lists, launchers, world tools, modding resources and community hubs.

Everything lives in two files. The Legacy Minecraft website is built from them, so a link added here shows up on the
site once the maintainers merge it and rebuild.

- [`data/links.json`](data/links.json) is the hub: server jars, plugins, servers, launchers, tools and community.
- [`data/mod_links.json`](data/mod_links.json) is the Mods page: loaders, libraries and client mods.

## Add a link

1. Edit [`data/links.json`](data/links.json), or [`data/mod_links.json`](data/mod_links.json) for a mod (the GitHub web
   editor is fine), and add an entry to the right group.
2. Check your change if you can. It needs Node 18 or newer and no packages:

   ```bash
   node scripts/validate-links.mjs
   ```

3. Open a pull request.

The details, the list of fields and what we accept are in [CONTRIBUTING.md](CONTRIBUTING.md).

## What is in this repo

| Path                                        | What it is                                                                                                  |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `data/links.json`                           | Every link on the hub. One of the two files you edit.                                                       |
| `data/mod_links.json`                       | Every link on the Mods page. The other file you edit, same format.                                          |
| `CONTRIBUTING.md`                           | What we accept, the fields, and the rules the validator enforces.                                           |
| `scripts/validate-links.mjs`                | Checks both data files and points at the exact entry and field of any mistake.                              |
| `scripts/lib/validate.mjs`                  | The rules that check applies.                                                                               |
| `.github/PULL_REQUEST_TEMPLATE.md`          | The checklist shown when you open a pull request.                                                           |
| `.github/workflows/validate.yml`            | Checks every pull request and every push to `main`.                                                         |
| `.github/workflows/deploy.yml`              | After a successful check on `main`, copies both data files to the site and rebuilds it. Off until set up.   |

There is no website code here. That lives in a separate repository and takes the two data files from this one.
