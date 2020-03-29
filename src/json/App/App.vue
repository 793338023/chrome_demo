<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12"
        ><el-input
          type="textarea"
          :autosize="{ minRows: 10 }"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input
      ></el-col>
      <el-col :span="12"><json-view :data="json"/></el-col>
    </el-row>
    <el-row>
      <el-button @click="format">格式化</el-button>
    </el-row>
  </div>
</template>

<script>
import jsonView from "vue-json-views";

window.chrome.storage.local.get(["zhang_a", "zhang_m"], result => {
  console.log(result);
});

export default {
  name: "app",
  data() {
    return {
      json: {},
      textarea: ""
    };
  },
  methods: {
    format() {
      try {
        this.json = JSON.parse(this.textarea);
      } catch (err) {
        alert(err);
      }
    }
  },
  components: {
    jsonView
  }
};
</script>

<style></style>
