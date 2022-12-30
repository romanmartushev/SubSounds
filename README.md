# Twitch SubSounds
Allows a streamer to play sounds, show profile pic, and a small message when a sub enters stream.

## Project Setup

- Copy contents of `/js/env-example.js` into a new file `/js/env.js`. Twitch Channel is your twitch username in lowercase.
- [Create a Client ID and Client Secret](https://dev.twitch.tv/docs/authentication/register-app).
  - When creating the app:
  - Name: can be anything you want it to be (it doesnt really matter)
  - OAuth Redirect URLs: http://localhost
  - Category: Chat Bot
  - Click Create
  - After Creation `Manage` that application.
  - Copy Client ID into variable `client_id` in `/js/env.js`.
  - Create New Secret and copy Client Secret into variable `client_secret` in `/js/env.js` (if you ever click it again make sure to copy the new value into `/js/env.js`)
- [Create an OAuthKey](http://twitchapps.com/tmi/). 
  - Copy this value into variable `oauth` in `/js/env.js`.

### Alert Customization
Open `setup.html` in your browser. Go through the customization process. Make sure to connect this application with twitch
the `access_token` field in the URL needs to then be added into variable `sub_oauth` in `/js/env.js`.
Once you are done customizing make sure to hit the save button. This will trigger a download.
After the file is downloaded, replace/place newly downloaded file into `/js/my-config.js`.

### Sub Sounds
For a new sub sound, place mp3 files in `/subSounds` they should be named `[subscriber-name].mp3`.
`[subscriber-name]` must be in lowercase.

### OBS
- Create new browser source
- Set as local file and set to `index.html` (the one located in this directory)
- 1920x1080 (not tested with smaller resolution)
- check "Control audio via OBS"
- audio should be set to "monitor and output"

#### Testing
- Open `index.html` in your browser and add `?testing` to the end of the url.
This will allow you to see how it will look in OBS. By typing into chat your own sub alert will be played.
To play your own sub sound make sure to create a `mp3` file in `/subSounds` with your twitch username as the filename.
To reset hit the reset button.
