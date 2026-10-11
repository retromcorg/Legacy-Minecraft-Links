# Legacy Minecraft Links

A community-maintained list of links for **Legacy Minecraft (Beta 1.7.3)**: server jars, plugins, trackers and server
lists, launchers, world tools, modding resources and community hubs.

Everything lives in one file, [`data/links.json`](data/links.json). The Legacy Minecraft website is built from it, so a
link added here shows up on the site once the maintainers merge it and rebuild.

## Add a link

1. Edit [`data/links.json`](data/links.json) (the GitHub web editor is fine) and add an entry to the right group.
2. Check your change if you can. It needs Node 18 or newer and no packages:

   ```bash
   node scripts/validate-links.mjs
   ```

3. Open a pull request.

The details, the list of fields and what we accept are in [CONTRIBUTING.md](CONTRIBUTING.md).

## What is in this repo

| Path                                        | What it is                                                                                                  |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `data/links.json`                           | Every link. This is the file you edit.                                                                      |
| `CONTRIBUTING.md`                           | What we accept, the fields, and the rules the validator enforces.                                           |
| `scripts/validate-links.mjs`                | Checks the data file and points at the exact entry and field of any mistake.                                |
| `scripts/lib/validate.mjs`                  | The rules that check applies.                                                                               |
| `.github/PULL_REQUEST_TEMPLATE.md`          | The checklist shown when you open a pull request.                                                           |
| `.github/workflows/validate-and-deploy.yml` | Checks every pull request, and after a merge to `main` uploads over SSH. Template: off until you set it up. |

There is no website code here. That lives in a separate repository and takes `data/links.json` from this one.
