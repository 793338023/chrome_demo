// js文件已经加载到项目中了，已经属于项目的一部分，所以可以获取到项目里的一些信息

window.addEventListener(
  "message",
  event => {
    const { data } = event;
    if (data.from === "content" && data.to === "pageScript") {
      // 调用项目中的全局变量
      //   console.log(window.abc(), 111);
      // 打开新页面
      // window.open("https://www.juhe.cn/");
      // if (data.data) {
      //   window.open(data);
      // }
      console.log(data);
    }
  },
  false
);
