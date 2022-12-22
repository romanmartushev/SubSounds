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
      },
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
    subSound(context) {
      /**
       * To test set if condition to:
       * context.subscriber
       *
       * for stream set if to:
       * context.subscriber &&
       * !this.subs.has(context.username) &&
       * context.username !== this.broadcaster
       */
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
  },
};
</script>

<template>
  <transition name="bounce">
    <div
      class="absolute w-full h-full flex flex-col justify-center items-center"
      v-if="modal.active"
    >
      <img class="w-1/5" :src="modal.src" />
      <h2 class="text-5xl mt-1 p-2 pl-6 bg-black text-white">
        {{ modal.text }}
      </h2>
    </div>
  </transition>
</template>
