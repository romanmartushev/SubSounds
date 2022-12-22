# Twitch SubSounds

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## For Stream

Go to https://dev.twitch.tv/docs/api/get-started to create a Client ID, Client Secret. Copy contents of `.env.example` into a new file `.env` put newly created values into respective variables. Twitch Channel should be replaced with your own as well.

For a new sub sound, place mp3 files in `public/subSounds/` they should be named [subscriber name].mp3

- Create new browser source with URL: http://localhost:3030/
- 1920x1080 (not tested with smaller resolution)
- check "Control audio via OBS"

Before starting stream open a terminal window and run

```sh
npm run dev
```

should get message in terminal saying `dev server running at:`. Keep the terminal window open, this allows the program to continue running in the background. Then refresh browser source in OBS so that it can connect to the dev server.


