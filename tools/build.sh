#!/bin/sh
# Concatenate src/ into the single-file game (index.html).
cd "$(dirname "$0")/../src" && cat 00_head.html 10_core.js 20_art.js 30_items.js 40_story.js 45_adventure.js 46_horse.js 47_joust.js 50_game.js 60_ui.js 99_tail.html > ../index.html && wc -c ../index.html
