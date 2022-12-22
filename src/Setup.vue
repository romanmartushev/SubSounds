<template>
  <div class="p-10">
    <div class="mb-1 flex" v-for="(value, key) in config" :key="key">
      <label>{{ key }}</label>
      <input
        v-if="config[key]['type'] === 'checkbox'"
        type="checkbox"
        v-model="config[key]['value']"
        class="flex-grow-0"
      />
      <select
        v-if="config[key]['type'] === 'select'"
        v-model="config[key]['value']"
        :multiple="config[key]['multiple']"
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
    </div>
    <button
      class="bg-blue-600 py-1 px-2 rounded text-white"
      @click="saveConfig"
    >
      Save
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { saveAs } from "file-saver";

export default {
  name: "Setup",
  data() {
    return {
      config: {},
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
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
    saveConfig() {
      const file = new File([JSON.stringify(this.config)], "config.json");
      saveAs(file, "config.json");
    },
  },
};
</script>
