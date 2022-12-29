# Twitch SubSounds
Allows a streamer to play sounds, show profile pic, and a small message when a sub enters stream.

## Project Setup

- [Create a Client ID and Client Secret](https://dev.twitch.tv/docs/authentication/register-app).
- [Create an OAuthKey](http://twitchapps.com/tmi/). 
- Copy contents of `/js/env-example.js` into a new file `/js/env.js` put newly created values (Client ID, Client Secret, OAuthKey) into respective variables.
Twitch Channel is your twitch username in lowercase.

### Sub Sounds
For a new sub sound, place mp3 files in `/subSounds` they should be named `[subscriber-name].mp3`.
`[subscriber-name]` must be in lowercase.

### Alert Customization
Open `setup.html` in your browser. Go through the customization process. 
Once you are done customizing make sure to hit the save button. This will trigger a download.
After the file is downloaded, replace/place newly downloaded file into `/js/my-config.js`.

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
