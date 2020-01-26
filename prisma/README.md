# `@thegigatlas/prisma`

Prisma module contains the docker-compose.yml to run the prisma docker instance. 
It also contains the generated prisma-client which can be used by different packages 

## Getting started
  1. Compose docker
  ```bash
     yarn run compose:dev
  ```
  2. Apply Datamodel
  ```bash
     yarn run prisma:apply
  ```
  3. Apply raw SQL configuration migration
  ```bash
     yarn run migrate:dev
  ```
  4. Generate prisma api
  ```bash
     yarn run yarn prisma:generate
  ```

## Usage
  ```
  const prisma = require('@thegigatlas/prisma');
  const data = await prisma.user({ email: "hey@gmail.com" });
  ```
