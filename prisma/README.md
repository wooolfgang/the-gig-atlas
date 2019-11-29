# `@thegigatlas/prisma`

Prisma module contains the docker-compose.yml to run the prisma docker instance. 
It also contains the generated prisma-client which can be used by different packages 

## Getting started
  ```bash
  $ yarn compose:dev => Creates the docker prisma instance
  $ yarn prisma:generate => Generates an up-to-date prisma-client
  $ yarn prisma:apply => Apply's the latest datamodel to the prisma db
  ```

## Usage
  ```
  const prisma = require('@thegigatlas/prisma');
  const data = await prisma.user({ email: "hey@gmail.com" });
  ```
