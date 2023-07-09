#!/usr/bin/env bash

if node ./scripts/updateVersion.js; then
    if ./scripts/build.sh; then
        cd dist || exit
        npm publish
    fi
fi
