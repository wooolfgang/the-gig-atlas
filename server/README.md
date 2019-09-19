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
