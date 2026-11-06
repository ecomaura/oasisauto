(function () {
  "use strict";

  var WA_NUMBER = "918976050506";
  var WA_BASE = "https://wa.me/" + WA_NUMBER;

  function waLink(text) {
    return WA_BASE + "?text=" + encodeURIComponent(text);
  }

  /* WhatsApp links */
  document.querySelectorAll("a[data-wa]").forEach(function (a) {
    a.href = waLink("Hi Oasis Automotive, I'd like to book a detailing appointment.");
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("a[data-service]").forEach(function (a) {
    a.href = waLink("Hi Oasis Automotive, I'd like to know more about " + a.dataset.service + ".");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* Mobile menu */
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  function closeMenu() {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* Open / closed status, in studio time (India Standard Time).
     Open Tuesday to Sunday, 11:00 to 22:00. Closed Monday. */
  function updateStatus() {
    var el = document.getElementById("status");
    var txt = document.getElementById("status-text");
    if (!el || !txt) return;
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
      }).formatToParts(new Date());
      var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var day = days.indexOf(get("weekday"));
      var mins = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
      var OPEN = 11 * 60, CLOSE = 22 * 60;

      el.classList.remove("open", "closed");
      if (day !== 1 && mins >= OPEN && mins < CLOSE) {
        el.classList.add("open");
        txt.textContent = "Open now, until 10 PM";
      } else {
        el.classList.add("closed");
        if (day !== 1 && mins < OPEN) txt.textContent = "Closed now, opens today at 11 AM";
        else if (day === 0) txt.textContent = "Closed now, opens Tuesday at 11 AM";
        else if (day === 1) txt.textContent = "Closed on Mondays, opens Tuesday at 11 AM";
        else txt.textContent = "Closed now, opens tomorrow at 11 AM";
      }
    } catch (err) { /* keep the static text */ }
  }
  updateStatus();

  /* Enquiry form -> WhatsApp */
  var form = document.getElementById("enquiry");
  var error = document.getElementById("form-error");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var vehicle = form.elements.vehicle.value.trim();
    var service = form.elements.service.value;
    if (!name || !vehicle) {
      error.hidden = false;
      (name ? form.elements.vehicle : form.elements.name).focus();
      return;
    }
    error.hidden = true;
    var msg = "Hi Oasis Automotive, my name is " + name + ". I have a " + vehicle + " and I'm interested in: " + service + ". Please share availability and a quote.";
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* Brand reel: play when visible, never for reduced-motion users */
  var reel = document.getElementById("reel");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reel && !reduce && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var p = reel.play(); if (p && p.catch) p.catch(function () {}); }
        else reel.pause();
      });
    }, { threshold: 0.4 }).observe(reel);
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
