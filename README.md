# Twitch SubSounds
Allows a streamer to play sounds, show profile pic, and a small message when a sub enters stream.

## Project Setup

Must have [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.
Once installed run
```sh
npm install
```
in this (SubSounds) directory, this will install all dependencies needed.

## After Install
- [Create a Client ID and Client Secret](https://dev.twitch.tv/docs/authentication/register-app).
- [Create an OAuthKey](http://twitchapps.com/tmi/). 
- Copy contents of `.env.example` into a new file `.env` put newly created values (Client ID, Client Secret, OAuthKey) into respective variables. Twitch Channel should be replaced with your own.

### Sub Sounds
For a new sub sound, place mp3 files in `public/subSounds/` they should be named [subscriber-name].mp3

### Alert Customization
run

```sh
npm run dev
```
in this (SubSounds) directory, this will start up the server.

Once the server is running head on over to [Setup](http://localhost:3030/setup).
Once you are done customizing make sure to hit the save button. This will trigger a download.
After the file is downloaded, replace/place newly downloaded file into `/public/my-config.json`.

### OBS
- Create new browser source with URL: http://localhost:3030/
- 1920x1080 (not tested with smaller resolution)
- check "Control audio via OBS"
- audio should be set to "monitor and output"

#### Testing in OBS
Before starting open a terminal window in this directory and run:

```sh
npm run dev
```

- Set newly created browser source to http://localhost:3030/?testing.
This will allow you to see how it will look in OBS. By typing into chat your own sub alert will be played.
To reset `interact` with the browser source and hit the reset button.

#### Streaming
Before starting stream open a terminal window in this directory and run:

```sh
npm run dev
```

should get message in terminal saying `dev server running at: http://localhost:3030/`.
Keep the terminal window open, this allows the program to continue running in the background. 
Then refresh browser source in OBS so that it can connect to the dev server.


