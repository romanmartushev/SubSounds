<script>
import EventQueue from "./js/EventQueue";
import tmi from "tmi.js";
import { useSubStore } from "./stores/subs";
import axios from "axios";
import ModalComponent from "./components/ModalComponent.vue";

export default {
  components: { ModalComponent },
  data() {
    return {
      client: null,
      opts: {
        channels: [import.meta.env.VITE_TWITCH_CHANNEL],
        options: {
          clientId: import.meta.env.VITE_CLIENT_ID,
          skipUpdatingEmotesets: true,
        },
        identity: {
          username: import.meta.env.VITE_TWITCH_CHANNEL,
          password: import.meta.env.VITE_TWITCH_OAUTH,
        },
      },
      config: {},
      broadcaster: import.meta.env.VITE_TWITCH_CHANNEL,
      eventQueue: new EventQueue(),
      subs: useSubStore(),
      auth_token: "",
      modal: {
        active: false,
        src: "",
        text: "",
        isVideo: false,
      },
      testing: false,
    };
  },
  async mounted() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.testing = urlParams.has("testing");

    this.config = await axios
      .get("/config.json", {
        responseType: "json",
      })
      .then((response) => {
        return response.data;
      });

    this.client = new tmi.client(this.opts);
    this.client.on("message", this.onMessageHandler);
    this.client.on("connected", this.onConnectedHandler);
    this.client.connect();

    this.auth_token = await axios
      .post("https://id.twitch.tv/oauth2/token", {
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        grant_type: "client_credentials",
      })
      .then((response) => {
        return response.data.access_token;
      });
  },
  watch: {
    eventQueue: {
      handler() {
        this.eventQueue.execute();
      },
      deep: true,
    },
  },
  methods: {
    onConnectedHandler(addr, port) {
      console.log(`* Connected to ${addr}:${port}`);
    },
    onMessageHandler(target, context, msg, self) {
      let condition =
        context.subscriber &&
        !this.subs.has(context.username) &&
        context.username !== this.broadcaster;

      if (this.testing) {
        condition = context.subscriber && !this.subs.has(context.username);
      }

      if (condition) {
        const vm = this;
        axios
          .get(`https://api.twitch.tv/helix/users?id=${context["user-id"]}`, {
            headers: {
              Authorization: `Bearer ${this.auth_token}`,
              "Client-Id": import.meta.env.VITE_CLIENT_ID,
            },
          })
          .then((response) => {
            const activeSub = response.data.data[0];
            context.profile_image_url = activeSub.profile_image_url;
            context.display_name = activeSub.display_name;
            vm.eventQueue.add(vm.setModal, [
              true,
              activeSub.profile_image_url,
              this.subAlertText(
                vm.config.alert_text["value"],
                activeSub.display_name
              ),
            ]);
            axios.get(`/subSounds/${context.username}.mp3`).then(() => {
              vm.eventQueue.add(vm.playSound, [
                `/subSounds/${context.username}.mp3`,
              ]);
            });
          });
        this.subs.add(context);
        this.handleShoutOut(context);
      }
    },
    handleShoutOut(context) {
      const autoShouout = this.config.automated_shoutouts["value"];
      const tierList = {
        None: 999999,
        "Tier 1": 1000,
        "Tier 2": 2000,
        "Tier 3": 3000,
      };
      if (parseInt(context.badges.subscriber) >= tierList[autoShouout]) {
        this.client.say(this.broadcaster, `!so @${context["display-name"]}`);
      }
    },
    playSound(sound) {
      return new Promise((resolve) => {
        const audio = new Audio(sound);
        audio.play();
        audio.onended = resolve;
      });
    },
    setModal(active = false, img = "", text = "", time = 5000) {
      return new Promise((resolve) => {
        this.modal = {
          active: active,
          src: img,
          text: text,
        };
        const vm = this;
        setTimeout(() => {
          vm.modal = {
            active: false,
            src: "",
            text: "",
          };
        }, time);
        resolve();
      });
    },
    subAlertText(string, name) {
      return string.replace("[name]", name);
    },
  },
};
</script>

<template>
  <transition name="bounce">
    <modal-component
      v-if="Object.keys(config).length !== 0"
      :position="config.alert_placement['value']"
      :show="modal.active"
      :show-image="config.show_profile_picture['value']"
      :show-text="config.show_alert_text['value']"
      :image-src="modal.src"
      :text="modal.text"
      :text-size="config.alert_text_font_size['value']"
      :text-color="config.alert_text_color['value']"
      :text-bg-color="config.alert_text_background_color['value']"
    />
  </transition>
  <button
    class="bg-red-500 py-1 px-2 rounded m-3 text-white"
    v-if="testing"
    @click="subs.$reset()"
  >
    Reset
  </button>
</template>
