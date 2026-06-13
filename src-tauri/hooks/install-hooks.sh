#!/bin/sh
# installs daelog git hooks into the current git repo
# usage: sh install-hooks.sh

HOOKS_DIR=$(git rev-parse --git-dir)/hooks
SCRIPT_DIR=$(dirname "$0")

if [ ! -d "$HOOKS_DIR" ]; then
  echo "Error: not inside a git repository"
  exit 1
fi

for hook in post-commit post-push post-merge; do
  SRC="$SCRIPT_DIR/$hook"
  DEST="$HOOKS_DIR/$hook"

  if [ -f "$DEST" ] && ! grep -q "daelog" "$DEST"; then
    # existing hook not from daelog — append to it
    echo "" >> "$DEST"
    cat "$SRC" >> "$DEST"
    echo "appended to existing $hook"
  else
    cp "$SRC" "$DEST"
    chmod +x "$DEST"
    echo "installed $hook"
  fi
done

echo "daelog hooks installed in $(git rev-parse --show-toplevel)"
