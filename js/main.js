const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      client: null,
      opts: {
        channels: [env.channel],
        options: {
          clientId: env.client_id,
          skipUpdatingEmotesets: true,
        },
        identity: {
          username: env.channel,
          password: env.oauth,
        }
      },
      config,
      broadcaster: env.channel,
      broadcaster_id: "",
      eventQueue: new EventQueue(),
      subs: new Subs(),
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

    this.client = new tmi.client(this.opts);
    this.client.on("message", this.onMessageHandler);
    this.client.on("connected", this.onConnectedHandler);
    this.client.connect();

    this.auth_token = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.client_id}&client_secret=${env.client_secret}&grant_type=client_credentials`,{
      method: 'POST',
    }).then((response) => response.json())
        .then((data) => {
          return data.access_token;
        });

    this.broadcaster_id = await fetch(`https://api.twitch.tv/helix/users?login=${this.broadcaster}`, {
      headers: {
        Authorization: `Bearer ${this.auth_token}`,
        "Client-Id": env.client_id,
      },
    })
        .then((response) => response.json())
        .then((data) => {
          return data.data[0].id;
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
        fetch(`https://api.twitch.tv/helix/users?id=${context["user-id"]}`, {
          headers: {
            Authorization: `Bearer ${vm.auth_token}`,
            "Client-Id": env.client_id,
          },
        })
            .then((response) => response.json())
            .then((data) => {
              const activeSub = data.data[0];
              context.profile_image_url = activeSub.profile_image_url;
              context.display_name = activeSub.display_name;
              vm.eventQueue.add(vm.setModal, [
                `./subSounds/${context.username}.mp3`,
                activeSub.profile_image_url,
                this.subAlertText(
                    vm.config.alert_text["value"],
                    activeSub.display_name
                ),
              ]);
            });
        this.subs.add(context);
        this.handleShoutOut(context);
      }
    },
    setModal(sound, img = "", text = "") {
      return new Promise((resolve) => {
        this.modal = {
          active: true,
          src: img,
          text: text,
        };
        const vm = this;
        const audio = new Audio(sound);
        audio.play();
        audio.onended = function() {
          vm.modal = {
            active: false,
            src: "",
            text: "",
          };
          setTimeout(() => {
            resolve();
          },2000)
        };
        audio.onerror = function() {
          setTimeout(() => {
            vm.modal = {
              active: false,
              src: "",
              text: "",
            };
            setTimeout(() => {
              resolve();
            },2000)
          }, 5000);
        };
      });
    },
    handleShoutOut(context) {
      const vm = this;
      fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${vm.broadcaster_id}&user_id=${context["user-id"]}`, {
        headers: {
          Authorization: `Bearer ${env.sub_oauth}`,
          "Client-Id": env.client_id,
        },
      })
          .then((response) => response.json())
          .then((data) => {
            const tier = data.data[0].tier;

            const autoShouout = vm.config.automated_shoutouts["value"];
            const tierList = {
              None: 999999,
              "Tier 1": 1000,
              "Tier 2": 2000,
              "Tier 3": 3000,
            };
            if (parseInt(tier) >= tierList[autoShouout]) {
              vm.client.say(vm.broadcaster, `!so @${context["display-name"]}`);
            }
          });
    },
    subAlertText(string, name) {
      return string.replace("[name]", name);
    },
  },
});

app.component(
    'ModalComponent',
    {
      name: "SubComponent",
      props: {
        position: {
          type: String,
          required: true,
        },
        show: {
          type: Boolean,
          required: true,
        },
        showImage: {
          type: Boolean,
          required: true,
        },
        showText: {
          type: Boolean,
          required: true,
        },
        imageSrc: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        textSize: {
          type: String,
          required: true,
        },
        textColor: {
          type: String,
          required: true,
        },
        textBgColor: {
          type: String,
          required: true,
        },
      },
      methods: {
        getTextSize() {
          return `text-${this.textSize}`;
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
          return placements[this.position];
        },
      },
      template: `
        <div
            class="absolute w-full h-full flex flex-col p-4"
            :class="getPosition()"
            v-if="show"
        >
            <div class="flex flex-col items-center">
              <img
                v-if="showImage"
                width="300"
                height="300"
                :src="imageSrc"
                class="rounded shadow-2xl shadow-black"
              />
              <h2
                v-if="showText"
                class="rounded shadow-2xl shadow-black mt-1 px-4 py-2 bg-black text-white"
                :class="getTextSize()"
                :style="{ color: textColor, backgroundColor: textBgColor }"
              >
                {{ text }}
              </h2>
          </div>
        </div>
      `
    }
)

app.mount("#app");
