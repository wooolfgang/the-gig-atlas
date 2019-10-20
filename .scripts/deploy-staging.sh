-#!/bin/sh   

# Exit script on error
set -e
printenv

#GITHUB_HEAD_REF -> The current branch that is being merged
#GITHUB_BASE_REF -> The base branch when you PR, usually it's the develop branch

sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no dev@167.179.102.140 <<EOF
  cd the-gig-atlas && git checkout ${GITHUB_BASE_REF}
  
  # Make sure code is up-to-date with the latest of the base origin
  # Remove untracked files
  git fetch origin
  git add --all
  git reset --hard origin/${GITHUB_BASE_REF}
  git pull origin ${GITHUB_HEAD_REF}

  # Install project dependencies
  npm run bootstrap

  # Copy all the environment variables for staging
  cp server/.env.staging server/.env
  cp client/.env.staging client/.env

  # Update prisma db to latest datamodel, generate prisma schema
  npm run server:prisma
  npm run server:prisma-generate

  # Building the common package
  npm run common:build

  # Building the server package

  # Building the client package
  npm run client:build

  # Restarting pm2 instances
  pm2 restart client:staging && pm2 restart server:staging

  echo Build process executed successfully!
  exit
EOF