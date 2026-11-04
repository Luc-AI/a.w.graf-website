import { colorVars, DEFAULTS, groups, STORAGE_KEY } from './options';

/**
 * Runs inline before first paint: restores the Design Lab choice from the URL
 * query (and stores it) or from localStorage. ES5, no imports.
 * A colour group may hold a custom hex: it becomes data-<group>="custom" plus
 * the CSS custom property set inline on <html>.
 */
const body = `
try {
  var D = ${JSON.stringify(DEFAULTS)};
  var G = ${JSON.stringify(Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.ids])))};
  var K = ${JSON.stringify(STORAGE_KEY)};
  var V = ${JSON.stringify(colorVars)};
  var H = /^#[0-9a-fA-F]{6}$/;
  var el = document.documentElement;
  var ok = function (key, v) { return typeof v === 'string' && (G[key].indexOf(v) > -1 || (V[key] && H.test(v))); };
  var q = location.search;
  if (/(^|[?&])lab=off(&|$)/.test(q)) {
    el.setAttribute('data-lab', 'off');
  } else {
    var found = {}, any = false, key;
    for (key in G) {
      var m = new RegExp('[?&]' + key + '=([^&#]*)').exec(q);
      if (m && ok(key, decodeURIComponent(m[1]))) { found[key] = decodeURIComponent(m[1]); any = true; }
    }
    var state = found;
    if (any) {
      try { localStorage.setItem(K, JSON.stringify(found)); } catch (e) {}
    } else {
      try { state = JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (e) { state = {}; }
    }
    for (key in G) {
      var v = state[key];
      if (V[key]) el.style.removeProperty(V[key]);
      if (V[key] && typeof v === 'string' && H.test(v)) { el.setAttribute('data-' + key, 'custom'); el.style.setProperty(V[key], v); }
      else if (ok(key, v) && v !== D[key]) el.setAttribute('data-' + key, v);
      else el.removeAttribute('data-' + key);
    }
  }
} catch (e) {}
`;

export const designLabInitScript = `(function(){${body.replace(/\s*\n\s*/g, ' ')}})();`;
