# Server Package

### Initial Setup
1. Docker Setup
    - install docker & docker-compose
    - open docker service
    - initialize prisma docker image
      ```bash
        $ yarn run compose:dev
      ```
2. Prisma Setup
    - deploy prisma
      ```bash
        $ yarn run prisma:apply
      ```
3. Setup your .env file
    - refer to .env.keys as reference

4. Install argon2 auth dependencies
    - https://www.npmjs.com/package/argon2#before-installing

5. Running Development
   - watch
    ```bash
        $ yarn run dev
    ```

6. Running Test
    - watch
    ```bash
        $ yarn run dev
        $ yarn run test:watch
    ```
    - one time
    - ```bash
        $ yarn run test
    ```


### Other Description
  - thenode.pem file - key to hosting os
  - config.js files contains and manages constants and configuration values all throughout the entire app
  - prefix underscore for unused variables (e.g: var _foo = 'f')
