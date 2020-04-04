#!/usr/bin/env bash

if output=$(./scripts/build.sh); then
    if output=$(node ./scripts/updateVersion.js); then
        cd dist
        npm publish
    fi
fi