/* "Today": picks one timeless entry by day of year, so the page is fresh every day with no updates.
   Entries rotate through a fixed list; textContent only (no innerHTML), so the page runs under require-trusted-types-for 'script'. */
(function () {
"use strict";
var ENTRIES = [["Be curious first", "Ask your child to show you one thing they made or asked an AI tool this week. Listen before you react."], ["One screen-free meal", "Agree on one meal today with no screens at the table, for everyone, grown-ups too."], ["Check it together", "Say out loud: a computer can be wrong, let's check. Then check one thing together."], ["Pause before you share", "Teach the rule: wait a minute before sharing a photo of anyone, and ask them first."], ["Devices rest at night", "Charge phones and tablets outside the bedroom tonight."], ["Who is talking?", "When a chatbot answers, ask: who is this talking to? Remind each other it is a program, not a friend."], ["Praise the effort", "Say what you saw: I noticed how hard you worked on that. Skip the grade."], ["Three things we never share", "Make a short household list of what we never share online, such as passwords, school names and where we live."], ["Read on paper", "Read something together, out loud, on paper. Let it be slow."], ["Let them teach you", "Ask your child to teach you about a favourite app, in their own words."], ["It is fine to close it", "Tell your child they can close any chat that feels wrong, and tell you, with no trouble at all."], ["How did it feel?", "After screen time, ask how it felt. Listen without trying to fix anything."], ["Your own first try", "Before asking an assistant for help with homework, write your own first try."], ["When phones go away", "Set one shared rule for when phones are put away, and follow it yourself."], ["Say what is special", "Notice one thing each child is uniquely good at, and say it aloud. Every child is unique, like a snowflake."], ["Spot the difference", "Look at two pictures or two sentences and guess which a machine might have made. Talk about how you could tell."]];
var t = document.getElementById("today-t"), b = document.getElementById("today-b"), n = document.getElementById("today-n"), d = document.getElementById("today-date");
if (!t || !b || !ENTRIES.length) return;
var now = new Date();
var doy = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
var i = doy % ENTRIES.length;
t.textContent = ENTRIES[i][0];
b.textContent = ENTRIES[i][1];
if (n) n.textContent = "Entry " + (i + 1) + " of " + ENTRIES.length + ". A new one every day.";
if (d) { try { d.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); } catch (e) { /* keep the default label */ } }
})();
