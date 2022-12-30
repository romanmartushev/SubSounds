const { createApp } = Vue;

const app = createApp({
	data() {
		return {
			config,
			url: "",
			env,
		};
	},
	mounted() {
		this.url = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${this.env.client_id}&redirect_uri=http://localhost&scope=channel_subscriptions`;
	},
	methods: {
		subAlertText(string, name) {
			return string.replace("[name]", name);
		},
		toTitle(string) {
			return string.replaceAll("_", " ");
		},
		saveConfig() {
			const file = new File(['var config = ' + JSON.stringify(this.config) + ';'], "my-config.js");
			const textFile = window.URL.createObjectURL(file);

			const element = document.createElement('a');
			element.setAttribute('href', textFile);
			element.setAttribute('download', "my-config.js");
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
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

app.mount('#app');
