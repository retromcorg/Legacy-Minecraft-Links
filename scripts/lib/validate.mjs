// Dont edit this file without editing the private Legacy Minecraft Site Repo :P
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ICONS = ['chest', 'torch', 'compass', 'bench', 'play', 'potion', 'heart', 'book'];
export const BADGE_TYPES = ['live', 'rc', 'exp', 'stale', 'archived', 'warn', 'src'];

const SECTION_KEYS = ['id', 'title', 'icon', 'description', 'groups', 'links', 'note'];
const GROUP_KEYS = ['title', 'links'];
const LINK_KEYS = ['title', 'url', 'description', 'badge', 'badgeType', 'host', 'tags', 'featured', 'internal'];
const SERVER_KEYS = ['title', 'url', 'description', 'address', 'host', 'links', 'tags'];
const SUBLINK_KEYS = ['label', 'url'];

export const isServer = (item) => item && typeof item === 'object' && 'address' in item;

export function loadLinks(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

//Validation

export function validateLinks(data, publicDir) {
  const errors = [];
  const warnings = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);

  const str = (where, obj, key, { required = true, max = 300 } = {}) => {
    const v = obj[key];
    if (v === undefined) {
      if (required) err(where, `"${key}" is required`);
      return;
    }
    if (typeof v !== 'string' || !v.trim()) return err(where, `"${key}" must be a non-empty string`);
    if (v.length > max) err(where, `"${key}" is too long (${v.length} > ${max} characters)`);
    if (/[<>]/.test(v)) err(where, `"${key}" must not contain HTML. Use \`code\`, *italic* or **bold**`);
    if ((v.match(/`/g) ?? []).length % 2) err(where, `"${key}" has an unclosed backtick`);
  };

  const url = (where, value, key = 'url') => {
    if (typeof value !== 'string') return err(where, `"${key}" must be a string`);
    let u;
    try { u = new URL(value); } catch { return err(where, `"${key}" is not a valid URL: ${value}`); }
    if (u.protocol !== 'https:') err(where, `"${key}" must start with https:// (${value})`);
    if (u.username || u.password) err(where, `"${key}" must not contain a username or password`);
    if (/\s/.test(value)) err(where, `"${key}" must not contain spaces`);
  };

  const keys = (where, obj, allowed) => {
    for (const k of Object.keys(obj)) if (!allowed.includes(k)) err(where, `unknown field "${k}" (allowed: ${allowed.join(', ')})`);
  };

  if (!data || typeof data !== 'object' || !Array.isArray(data.sections) || data.sections.length === 0) {
    return { errors: ['the file must be an object with a non-empty "sections" array'], warnings, count: 0 };
  }

  const sectionIds = new Set();
  const urlSeen = new Map(); // url > section id
  const addresses = new Set();
  let count = 0;

  data.sections.forEach((section, si) => {
    const at = `sections[${si}]${typeof section?.id === 'string' ? ` (${section.id})` : ''}`;
    if (!section || typeof section !== 'object') return err(at, 'must be an object');
    keys(at, section, [...SECTION_KEYS]);

    if (typeof section.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(section.id)) err(at, '"id" must be lowercase letters, digits or dashes');
    else if (sectionIds.has(section.id)) err(at, `duplicate section id "${section.id}"`);
    else sectionIds.add(section.id);
    str(at, section, 'title', { max: 60 });
    str(at, section, 'description', { max: 500 });
    str(at, section, 'note', { required: false, max: 600 });
    if (!ICONS.includes(section.icon)) err(at, `"icon" must be one of: ${ICONS.join(', ')}`);

    if (Boolean(section.groups) === Boolean(section.links)) err(at, 'use exactly one of "groups" or "links"');
    const groups = section.groups ?? [{ title: null, links: section.links }];
    if (!Array.isArray(groups) || groups.length === 0) return err(at, '"groups" must be a non-empty array');

    groups.forEach((group, gi) => {
      const gat = section.groups ? `${at}.groups[${gi}]` : at;
      if (section.groups) {
        keys(gat, group, GROUP_KEYS);
        str(gat, group, 'title', { max: 60 });
      }
      if (!Array.isArray(group.links) || group.links.length === 0) return err(gat, '"links" must be a non-empty array');

      group.links.forEach((item, li) => {
        const where = `${gat}.links[${li}]${typeof item?.title === 'string' ? ` ("${item.title}")` : ''}`;
        if (!item || typeof item !== 'object') return err(where, 'must be an object');
        count++;
        str(where, item, 'title', { max: 80 });
        str(where, item, 'tags', { required: false, max: 300 });
        str(where, item, 'description', { max: 300 });
        if (item.host !== undefined) str(where, item, 'host', { max: 80 });

        const seen = (u) => {
          const prev = urlSeen.get(u);
          if (prev === section.id) err(where, `duplicate link in this section: ${u}`);
          else if (prev) warnings.push(`${where}: ${u} also appears in section "${prev}"`);
          urlSeen.set(u, section.id);
        };

        if (isServer(item)) {
          keys(where, item, SERVER_KEYS);
          if (typeof item.address !== 'string' || !/^[A-Za-z0-9.-]+(:\d{1,5})?$/.test(item.address)) err(where, '"address" must look like play.example.com or play.example.com:25577');
          else if (addresses.has(item.address.toLowerCase())) err(where, `duplicate server address ${item.address}`);
          else addresses.add(item.address.toLowerCase());
          if (item.host !== undefined && !/^[A-Za-z0-9.-]+$/.test(item.host)) err(where, '"host" must be a plain host name (no port)');
          if (item.url !== undefined) { url(where, item.url); seen(item.url); }
          if (item.links !== undefined) {
            if (!Array.isArray(item.links)) err(where, '"links" must be an array');
            else item.links.forEach((sub, k) => {
              const sat = `${where}.links[${k}]`;
              if (!sub || typeof sub !== 'object') return err(sat, 'must be an object');
              keys(sat, sub, SUBLINK_KEYS);
              str(sat, sub, 'label', { max: 30 });
              url(sat, sub.url);
              seen(sub.url);
            });
          }
          return;
        }

        keys(where, item, LINK_KEYS);
        if (item.internal === true) {
          if (typeof item.url !== 'string' || !/^[a-z0-9-]+\.html$/.test(item.url)) err(where, 'an internal link needs a "url" like guide.html');
          else if (publicDir && !existsSync(join(publicDir, item.url))) err(where, `internal page not found: public/${item.url}`);
        } else {
          if (item.internal !== undefined) err(where, '"internal" can only be true');
          url(where, item.url);
          if (typeof item.url === 'string') seen(item.url);
        }
        if ((item.badge === undefined) !== (item.badgeType === undefined)) err(where, '"badge" and "badgeType" go together');
        if (item.badge !== undefined) {
          str(where, item, 'badge', { max: 14 });
          if (!BADGE_TYPES.includes(item.badgeType)) err(where, `"badgeType" must be one of: ${BADGE_TYPES.join(', ')}`);
        }
        if (item.featured !== undefined && item.featured !== true) err(where, '"featured" can only be true');
      });
    });
  });

  return { errors, warnings, count };
}
