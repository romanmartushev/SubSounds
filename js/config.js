var config = {
  "alert_placement": {
    "type": "select",
    "value": "center center",
    "options": [
      "center center",
      "center left",
      "center right",
      "top center",
      "top left",
      "top right",
      "bottom center",
      "bottom left",
      "bottom right"
    ]
  },
  "show_profile_picture": {
    "type": "checkbox",
    "value": true,
    "comments": "enables/disable profile picture on sub alert."
  },
  "show_alert_text": {
    "type": "checkbox",
    "value": true,
    "comments": "enables/disable alert text under picture."
  },
  "alert_text": {
    "type": "text",
    "value": "[name] is here!",
    "comments": "[name] will get replaced with subscribers name."
  },
  "alert_text_font_size": {
    "type": "select",
    "value": "5xl",
    "options": [
      "xs",
      "sm",
      "base",
      "lg",
      "xl",
      "2xl",
      "3xl",
      "4xl",
      "5xl",
      "6xl",
      "7xl",
      "8xl",
      "9xl"
    ]
  },
  "alert_text_color": {
    "type": "text",
    "value": "#FFFFFF",
    "comments": "can be hex or word."
  },
  "alert_text_background_color": {
    "type": "text",
    "value": "#000000",
    "comments": "can be hex or word."
  },
  "automated_shoutouts": {
    "type": "select",
    "value": "Tier 1",
    "options": ["None", "Tier 1", "Tier 2", "Tier 3"],
    "comments": "Selecting a lower Tier includes all Tiers above it.(ex: Tier 2 includes Tier 2 & 3). You will need a registered !so command."
  }
};
