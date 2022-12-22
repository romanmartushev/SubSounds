<script>
import EventQueue from "./js/EventQueue";
import tmi from "tmi.js";
import { useSubStore } from "./stores/subs";
import axios from "axios";

export default {
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
    };
  },
  async mounted() {
    this.getConfig();
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
      this.subSound(context);
    },
    getConfig() {
      const vm = this;
      axios
        .get("/config.json", {
          responseType: "json",
        })
        .then((response) => {
          vm.config = response.data;
        });
    },
    subSound(context) {
      if (
        context.subscriber &&
        !this.subs.has(context.username) &&
        context.username !== this.broadcaster
      ) {
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
              `${activeSub.display_name} has arrived!`,
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
      if (this.config.automated_shoutouts["value"] !== "None") {
        if (
          autoShouout === "Tier 1" &&
          parseInt(context.badges.subscriber) >= 1000
        ) {
          this.client.say(this.broadcaster, `!so @${context["display-name"]}`);
        } else if (
          autoShouout === "Tier 2" &&
          parseInt(context.badges.subscriber) >= 2000
        ) {
          this.client.say(this.broadcaster, `!so @${context["display-name"]}`);
        } else if (
          autoShouout === "Tier 3" &&
          parseInt(context.badges.subscriber) >= 3000
        ) {
          this.client.say(this.broadcaster, `!so @${context["display-name"]}`);
        }
      }
    },
    getPosition() {
      const placements = {
        "center center": "justify-center items-center",
        "center left": "justify-center items-start",
        "center right": "justify-center items-end",
        "top center": "justify-start items-center",
        "top left": "justify-start items-start",
        "top right": "justify-start items-end",
        "bottom center": "justify-end items-center",
        "bottom left": "justify-end items-start",
        "bottom right": "justify-end items-end",
      };
      return placements[this.config.sub_alert_placement["value"]];
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
  },
};
</script>

<template>
  <transition name="bounce">
    <div
      class="absolute w-full h-full flex flex-col p-4"
      :class="getPosition()"
      v-if="modal.active"
    >
      <img
        v-if="config.enable_profile_picture['value']"
        class="w-1/5"
        :src="modal.src"
      />
      <h2 class="text-5xl mt-1 p-2 pl-6 bg-black text-white">
        {{ modal.text }}
      </h2>
    </div>
  </transition>
</template>
