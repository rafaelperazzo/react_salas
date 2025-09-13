#!/bin/bash
# This script generates a changelog from git history and commits it to the repository.
if [ -z "$1" ]; then
  echo "Usage: $0 <commit message>"
  exit 1
fi
git log --date=iso --pretty=format:"%x09%ad%x09%s" > CHANGELOG.md
git add .
git commit -m "$1"
git push origin master
