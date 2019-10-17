-#!/bin/sh     
sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no dev@167.179.102.140 <<EOF       
  cd the-gig-atlas && git pull origin develop
  npm run bootstrap && npm run common:build
  cp server/.env.staging server/.env
  npm run server:prisma
  cp client/.env.staging client/.env
  npm run client:build
  pm2 restart client && pm2 restart server
  exit  
EOF