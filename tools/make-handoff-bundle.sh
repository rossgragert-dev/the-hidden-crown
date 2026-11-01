#!/bin/sh
# Bundle everything an assistant needs into ONE file: handoff-bundle.md
# Usage: sh tools/make-handoff-bundle.sh
cd "$(dirname "$0")/.." || exit 1
OUT=handoff-bundle.md
{
  echo "# HANDOFF BUNDLE: The Hidden Crown"
  echo
  echo "Generated $(date -u +%Y-%m-%dT%H:%MZ). Contains HANDOFF.md, the story bible, the changelog and every source file."
  echo "Read HANDOFF.md first. To rebuild the game, concatenate the src files in the order listed (tools/build.sh does this)."
  echo
  echo "=================================================================="
  echo "## FILE: HANDOFF.md"
  echo "=================================================================="
  cat HANDOFF.md
  echo
  echo "=================================================================="
  echo "## FILE: CHANGELOG.md"
  echo "=================================================================="
  cat CHANGELOG.md
  echo
  echo "=================================================================="
  echo "## FILE: docs/STORY_BIBLE.md"
  echo "=================================================================="
  cat docs/STORY_BIBLE.md
  for f in src/00_head.html src/10_core.js src/20_art.js src/30_items.js src/40_story.js src/50_game.js src/60_ui.js src/99_tail.html tools/build.sh; do
    echo
    echo "=================================================================="
    echo "## FILE: $f"
    echo "=================================================================="
    cat "$f"
  done
} > "$OUT"
wc -c "$OUT"
