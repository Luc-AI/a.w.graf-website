import { DEFAULTS, groups, STORAGE_KEY } from './options';

/**
 * Runs inline before first paint: restores the Design Lab choice from the URL
 * query (and stores it) or from localStorage. ES5, no imports.
 */
const body = `
try {
  var D = ${JSON.stringify(DEFAULTS)};
  var G = ${JSON.stringify(Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.ids])))};
  var K = ${JSON.stringify(STORAGE_KEY)};
  var el = document.documentElement;
  var q = location.search;
  if (/(^|[?&])lab=off(&|$)/.test(q)) {
    el.setAttribute('data-lab', 'off');
  } else {
    var found = {}, any = false, key;
    for (key in G) {
      var m = new RegExp('[?&]' + key + '=([^&#]*)').exec(q);
      if (m && G[key].indexOf(decodeURIComponent(m[1])) > -1) { found[key] = decodeURIComponent(m[1]); any = true; }
    }
    var state = found;
    if (any) {
      try { localStorage.setItem(K, JSON.stringify(found)); } catch (e) {}
    } else {
      try { state = JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (e) { state = {}; }
    }
    for (key in G) {
      var v = state[key];
      if (typeof v === 'string' && v !== D[key] && G[key].indexOf(v) > -1) el.setAttribute('data-' + key, v);
      else el.removeAttribute('data-' + key);
    }
  }
} catch (e) {}
`;

export const designLabInitScript = `(function(){${body.replace(/\s*\n\s*/g, ' ')}})();`;
