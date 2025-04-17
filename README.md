# Vilnius Hardcore

An events agenda app for a DIY music venue, built with [SvelteKit](https://svelte.dev/docs/kit/introduction).

## Local development

### Database setup
A Postgres database server needs to be running (locally or remotely) so that the website can fetch/store data. 

It can be set up using a Docker container or a manual Postgres installation.

#### Using Docker
1. Create a `docker-compose.yml` file with desired database credentials (see `docker-compose.yml.example`).
1. Run the database container:
```bash
npm run db:start
```

> [!NOTE]
> If you are using an existing Postgres server installation, execute all statements from `init.sql` before proceeding.

Once the database is running:
1. Create a `.env` file containing database connection string (see `.env.example`).
1. Build the database schema. Agree to execute all statements when asked.
```bash
npm run db:init
```

Any changes made to the schema during development can be synced by running:
```bash
npm run db:push
```

### Running a development server
Once you've cloned the repository, set up the database and installed dependencies with `npm install`, start a development server:

```bash
npm run dev
```

## Deploying

See [install instructions](https://github.com/execut4ble/vilnius-hardcore/wiki/Installation)
