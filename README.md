# TypeScript Static Blog

To start locally for development:

```
npm run dev
```

The app runs at `http://localhost:4000`.

To build:

```
npm run build
```

To start after building:

```
npm start
```

## Adding Posts

TypeScript Static Blog works using static files as well as static cache files.

To add a new post:

```
npm run posts:new
```

To update the posts cache so that it appears on the website:

```
npm run posts
```

### Importing from WordPress

1. Go to `./bin/importFromWordpress.mjs` and change the `apiUrl` variable to the URL of your WordPress's RestAPI.
2. Run `npm run posts:import`

## Things To Change When Setting Up a New Site

1. Change all instances of `http://localhost` to your website's URL (mainly for SEO tags).
2. Add tracking if wanted, but don't track if the cookies haven't been accepted or DO NOT TRACK is enabled in the user's browser.
