<template>
  <div class="min-h-screen w-screen bg-gray-800 p-10">
    <h1 class="text-5xl uppercase text-gray-300">Setup</h1>
    <hr />
    <div class="my-3 flex flex-col" v-for="(value, key) in config" :key="key">
      <label class="text-white capitalize">{{ toTitle(key) }}</label>
      <input
        v-if="config[key]['type'] === 'checkbox'"
        type="checkbox"
        v-model="config[key]['value']"
        class="w-5 h-5"
      />
      <input
        v-if="config[key]['type'] === 'text'"
        type="text"
        v-model="config[key]['value']"
        class="border-2 rounded"
      />
      <input
        v-if="config[key]['type'] === 'number'"
        type="number"
        v-model="config[key]['value']"
        class="border-2 rounded"
      />
      <select
        v-if="config[key]['type'] === 'select'"
        v-model="config[key]['value']"
        class="border-2 rounded"
      >
        <option
          v-for="option in config[key]['options']"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <p
        v-if="config[key]['comments']"
        class="w-full text-sm text-gray-400 mt-1"
      >
        {{ config[key]["comments"] }}
      </p>
    </div>
    <p class="text-gray-300">
      After Saving, replace/place the downloaded my-config.json into
      <code>/public/my-config.json</code>
    </p>
    <button
      class="bg-blue-600 py-1 px-2 rounded text-white"
      @click="saveConfig"
    >
      Save
    </button>
    <div class="mt-5">
      <h2 class="text-4xl uppercase text-gray-300">Preview</h2>
      <hr />
      <div class="relative bg-white w-full rounded mt-3" style="height: 600px">
        <modal-component
          v-if="Object.keys(config).length !== 0"
          :position="config.alert_placement['value']"
          :show="true"
          :show-image="config.show_profile_picture['value']"
          :show-text="config.show_alert_text['value']"
          image-src="/romeboiii.png"
          :text="subAlertText(config.alert_text['value'], 'romeboiii')"
          :text-size="config.alert_text_font_size['value']"
          :text-color="config.alert_text_color['value']"
          :text-bg-color="config.alert_text_background_color['value']"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { saveAs } from "file-saver";
import ModalComponent from "./components/ModalComponent.vue";

export default {
  name: "Setup",
  data() {
    return {
      config: {},
    };
  },
  components: {
    ModalComponent,
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    subAlertText(string, name) {
      return string.replace("[name]", name);
    },
    toTitle(string) {
      return string.replaceAll("_", " ");
    },
    getConfig() {
      const vm = this;
      axios
        .get("/my-config.json", {
          responseType: "json",
        })
        .then((response) => {
          vm.config = response.data;
        })
        .catch(() => {
          axios
            .get("/config.json", {
              responseType: "json",
            })
            .then((response) => {
              vm.config = response.data;
            });
        });
    },
    saveConfig() {
      const file = new File([JSON.stringify(this.config)], "my-config.json");
      saveAs(file, "my-config.json");
    },
  },
};
</script>
