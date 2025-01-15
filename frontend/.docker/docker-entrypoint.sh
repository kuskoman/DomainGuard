#!/bin/bash

set -eo pipefail

ENV_FILE_TEMPLATE='/docker/base-env.js'
ENV_DEFINITION_FILE='/docker/base-env.json'
ENV_FILE_DESTINATION='/var/www/env.js'
ENV_VAR_PREFIX='CONTAINER_ENV_VAR_'

rm -rf $ENV_FILE_DESTINATION

JS_ENV_FILE=$(cat $ENV_FILE_TEMPLATE)
ENV_JSON=$(cat $ENV_DEFINITION_FILE | jq)
ENV_KEYS=$(echo $ENV_JSON | jq -r 'keys[]')
for envName in $ENV_KEYS; do
    varFullName="$ENV_VAR_PREFIX$envName"
    currentEnvVar="${!varFullName}"
    if [[ -n "$currentEnvVar" ]]; then
        echo "Replacing $envName with $currentEnvVar"
        ENV_JSON=$(echo $ENV_JSON | jq ".$envName = \"$currentEnvVar\"")
    fi
done

echo "${JS_ENV_FILE/JSON_ENV_TO_REPLACE/$ENV_JSON}" > $ENV_FILE_DESTINATION
echo "Created environment file based on application env"
echo "Starting nginx server..."

nginx -g 'daemon off;'
