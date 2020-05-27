# Shopify Theme Store Review Scraper

This app is used to periodically search the Shopify Theme Store for new or deleted theme reviews. Team members can be notified via Slack when reviews are created or deleted to help turn around negative reviews efficiently.

## Changing the configured themes
---
The app works by checking the `themes` column in the database and periodically checks for review changes. The simplest way to change what themes the app looks for is to change the seed data to match the themes you want to look for. 

You can either edit the included `add_themes_to_themes.js` file or delete it and generate a new one with the command `knex seed:make seed_name`. Each seed entry should be in this format:
```
{
    name: 'theme-name',
    url: 'https://themes.shopify.com/themes/url-to-theme-page'
},
```

### Slack Channel

If you're using this app in a different workspace than the Pixel Union workspace you'll want to follow the first 3 steps [in this guide](https://api.slack.com/messaging/webhooks).

If you're sending reviews to a different channel within Pixel Union's workspace then you can add a new webhook to the [pre-existing app](https://api.slack.com/apps/A013NRAFF8D/incoming-webhooks?). Just click on `Add New Webhook to Workspace` then copy the URL that gets generated. Save this URL in the `.env` file as `SLACK_URL` if you're working locally or add this to your host providers environment variables.


## Working on the app locally
---
To work on this app locally requires 2 environment variables to be configured to read/write to/from the database and to connect to a Slack channel.

### PostgreSQL Database

Follow the below steps to get a PostgreSQL database set up on your machine or VM:

1. Make sure that `postgres` is installed: `sudo apt-get install postgresql`
2. Create a new superuser. You can replace `$USER` with a username of your choosing or leave it to use your current username: `sudo -u postgres createuser -P -s -e $USER
` (Make sure to take note of your password since we'll need it later)
3. Create a new database with your user name: `createdb`
4. Verify this worked by going into the client via `psql` -- Check for the new database you just created with `\l` and verify that the name and owner match your username.
5. Now, you should be able to create a database URL string in this format:
```
postgresql://username:password@host:port/database_name
```
6. Save this as an environment variable in the `.env` file as `DATABASE_URL`
7. Now, you should be able to run the command `npm run db` to run the migrations and seed the database.
