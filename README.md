# Twitch SubSounds

## Project Setup

Must have [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

## For Stream

[Create a Client ID and Client Secret](https://dev.twitch.tv/docs/authentication/register-app). [Create an OAuthKey](http://twitchapps.com/tmi/). Copy contents of `.env.example` into a new file `.env` put newly created values into respective variables. Twitch Channel should be replaced with your own as well.

For a new sub sound, place mp3 files in `public/subSounds/` they should be named [subscriber name].mp3

- Create new browser source with URL: http://localhost:3030/
- 1920x1080 (not tested with smaller resolution)
- check "Control audio via OBS"

For auto shoutouts for Tier 2&3 Subs make sure to have a `!so` command registered. Should work like `!so @username` in twitch chat.

Before starting stream open a terminal window and run

```sh
npm run dev
```

should get message in terminal saying `dev server running at:`. Keep the terminal window open, this allows the program to continue running in the background. Then refresh browser source in OBS so that it can connect to the dev server, also you must click on the browser source in preview window to interact with browser source, so it is allowed to play sounds.


