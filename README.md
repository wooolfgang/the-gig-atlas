# The Gig Atlas

#### Repository Description Displays here
  - Refer to every package README.md file for guidance

### Guide
  * Installing dependencies
      ```bash
        $ lerna add <package>[@version] [--dev] [--exact]
      ```

      More at: https://github.com/lerna/lerna/tree/master/commands/add
      
### Getting Started
```sh
 # Install project dependencies
yarn run bootstrap

# Set up all environment variables for development
cp server/.env.example server/.env 
cp client/.env.example client/.env
cp prisma/.env.example prisma/.env

# Update prisma db to latest datamodel, generate prisma schema
cd prisma
yarn run prisma:apply
yarn run prisma:generate

# Building the common package
yarn run common:build
  
# Building the scraper package
yarn run scraper:build 

# Running client/frontend server
cd client
yarn run dev

# Running graphql server
cd server
yarn run dev
```
  

### Folder structure

```sh
thegigatlas/
├── .scripts   # Deployment scripts
├── client     # Web App (SSR)
├── common     # Isomorphic, reusable code
├── jobs       # Cron jobs
├── prisma     # Prisma client + docker instance
├── scraper    # Module for scraping jobs
├── server     # Graphql server
```
