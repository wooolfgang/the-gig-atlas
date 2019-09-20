# Server Package

### Initial Setup
1. Docker Setup
    - install docker & docker-compose
    - open docker service
    - run docker-compose
      ```bash
        $ docker-compose -f prisma/docker-compose.yml up -d
      ```
2. Prisma Setup
    - run prisma_apply.sh file
      ```bash
        $ ./prisma_apply.sh
      ```
3. Setup your .env file
    - refer to .env.keys as reference

3. Install argon2 auth dependencies
    - https://www.npmjs.com/package/argon2#before-installing


### Other Description
  - thenode.pem file - key to hosting os
  - config.js files contains and manages constants and configuration values allthoughout the entire app
  - prefix underscore for unused variables (e.g: var _foo = 'f')
