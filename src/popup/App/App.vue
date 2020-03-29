<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <div v-for="item in list" :key="item.key" class="text item">
      <el-link type="primary" @click="openJson(item.key)">{{
        item.value
      }}</el-link>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      title: "工具集",
      list: [
        { key: "json", value: "json格式化" },
        { key: "chache", value: "保存" }
      ]
    };
  },
  methods: {
    handleFn() {
      window.chrome.tabs.query({ active: true, currentWindow: true }, function(
        tabs
      ) {
        window.chrome.tabs.sendMessage(tabs[0].id, { to: "content" });
      });
    },
    openJson(val) {
      if (val === "chache") {
        window.chrome.storage.local.set({
          zhang_a: '{"name":"zhang"}',
          zhang_m: "保存数据"
        });
        return;
      }
      window.chrome.tabs.create({
        url: window.chrome.extension.getURL(val + ".html")
      });
    }
  }
};
</script>

<style>
.box-card {
  min-width: 200px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
