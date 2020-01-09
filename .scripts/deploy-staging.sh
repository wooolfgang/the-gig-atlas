-#!/bin/sh   

#GITHUB_HEAD_REF -> The current branch that is being merged
#GITHUB_BASE_REF -> The base branch when you PR, usually it's the develop branch
#https://help.github.com/en/articles/virtual-environments-for-github-actions#environment-variables

sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no dev@167.179.102.140 <<EOF
  cd the-gig-atlas || exit 1
  git checkout develop || exit 1
  
  # Make sure code is up-to-date with the latest of the base origin
  # Remove untracked files
  git fetch origin || exit 1
  git add --all || exit 1
  git reset --hard origin/develop || exit 1
  git pull origin ${GITHUB_HEAD_REF} || exit 1

  # Install project dependencies
  npm run bootstrap || exit 1

  # Copy all the environment variables for staging
  cp server/.env.staging server/.env || exit 1
  cp client/.env.staging client/.env || exit 1
  cp prisma/.env.staging prisma/.env || exit 1

  # Update prisma db to latest datamodel, generate prisma schema
  npm run prisma:apply || exit 1
  npm run prisma:generate || exit 1

  # Building the common package
  npm run common:build || exit 1

  # Building the scraper package
  npm run scraper:build || exit 1

  # Building the server package

  # Building the client package
  npm run client:build || exit 1

  # Restarting pm2 instances
  (pm2 restart client:staging && pm2 restart server:staging && pm2 restart cron-gig-scraper) || exit 1

  echo Build process executed successfully!
  exit 0
EOF

if [[ $? = 1 ]]; then
  exit 1
else 
  exit 0 
fi
