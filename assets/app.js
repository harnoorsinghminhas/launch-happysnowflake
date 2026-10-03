/* Happy Snowflake: sign-up wiring (same request shape as the other pre-launch pages) + honest payment notes.
   No cookies, no analytics, no storage. Only the adult's email address is ever sent. */
(function () {
"use strict";
var API = "https://acp9reat3l.execute-api.us-east-1.amazonaws.com/signal/request-link";
var SITE = "happysnowflake.com";
var LANDING_RE = /^\/[A-Za-z0-9._~!$&'()*+,;=:@%\/-]{0,199}$/;
var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function payload(email, hp) {
  var b = { email: email, hp: hp || "", site: SITE };
  if (LANDING_RE.test(location.pathname)) b.landing_path = location.pathname;
  try { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (tz && tz.length <= 40) b.tz = tz; } catch (e) { /* optional */ }
  var q = location.search;
  if (q && q.length <= 2048 && /[?&](utm_[a-z]+|ref)=/i.test(q)) b.query = q;
  return b;
}
function post(body) {
  var ctl = window.AbortController ? new AbortController() : null, t = ctl ? window.setTimeout(function () { ctl.abort(); }, 15000) : 0;
  return fetch(API, { method: "POST", mode: "cors", credentials: "omit", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
    .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { window.clearTimeout(t); return { status: r.status, code: j && j.error }; }); },
          function () { window.clearTimeout(t); return { status: 0, code: "network" }; });
}
function errText(res) {
  var s = res.status, c = res.code;
  if (s === 400 && c === "invalid_email") return "That email address doesn't look right. Check it for a typo?";
  if (s === 400) return "Something in the form didn't go through. Please try again.";
  if (s === 415) return "Your browser sent the form in a format we can't read. Refresh the page and try again.";
  if (s === 429) return "Lots of sign-ups from your network just now. Wait a minute, then try again.";
  if (s === 403) return "Sign-up only works on our own site. Open happysnowflake.com and try again.";
  if (s >= 500) return "Our sign-up desk hit a snag. Please try again in a moment.";
  return "We couldn't reach the sign-up desk. Check your connection and try again.";
}
function validEmail(v) { return v.length <= 254 && EMAIL_RE.test(v); }

$$(".js-join").forEach(function (form) {
  var em = form.querySelector('input[type="email"]'), hp = form.querySelector('input[name="website"]'), err = form.querySelector(".js-err");
  var btn = form.querySelector('button[type="submit"]'), ok = form.parentNode.querySelector(".js-ok"), busy = false;
  em.addEventListener("blur", function () {
    var v = em.value.trim();
    if (v && !validEmail(v)) { err.textContent = "That email address doesn't look right yet."; em.setAttribute("aria-invalid", "true"); }
    else { err.textContent = ""; em.removeAttribute("aria-invalid"); }
  });
  em.addEventListener("input", function () { if (em.getAttribute("aria-invalid") && validEmail(em.value.trim())) { err.textContent = ""; em.removeAttribute("aria-invalid"); } });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;
    var v = em.value.trim();
    if (!validEmail(v)) { err.textContent = "Please enter your email address, like name@example.com."; em.setAttribute("aria-invalid", "true"); em.focus(); return; }
    busy = true; btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending…"; err.textContent = "";
    post(payload(v, hp ? hp.value : "")).then(function (res) {
      busy = false; btn.disabled = false; btn.textContent = label;
      if (res.status === 200) {
        form.hidden = true; ok.hidden = false; ok.querySelector(".js-addr").textContent = v; ok.focus();
        $$(".js-join").forEach(function (f) { if (f !== form) { f.hidden = true; } });
        return;
      }
      err.textContent = errText(res);
      if (res.code === "invalid_email") { em.setAttribute("aria-invalid", "true"); em.focus(); }
    });
  });
});

/* Buy / reserve: checkout is not live yet, so say so plainly and point to the free preview. */
$$(".js-pay").forEach(function (b) {
  b.addEventListener("click", function () {
    var note = b.parentNode.querySelector(".js-note");
    if (note) note.textContent = "Checkout isn't open yet. Join the free preview and we'll email you the secure link first. Nothing was charged.";
  });
});

/* Household rule builder: all in the page, nothing saved or sent. */
var out = document.querySelector(".js-out"), boxes = $$(".js-rule");
function render() {
  var on = boxes.filter(function (b) { return b.checked; });
  while (out.firstChild) out.removeChild(out.firstChild);
  if (!on.length) { var e = document.createElement("li"); e.className = "empty"; e.textContent = "Tick a rule to start your list."; out.appendChild(e); return; }
  on.forEach(function (b) { var li = document.createElement("li"); li.textContent = b.value; out.appendChild(li); });
}
boxes.forEach(function (b) { b.addEventListener("change", render); });
var pr = document.querySelector(".js-print");
if (pr) pr.addEventListener("click", function () { window.print(); });
})();
