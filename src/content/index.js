// 通过Chrome插件的API加载字体文件
function insertElementIcons() {
  let elementIcons = document.createElement("style");
  elementIcons.type = "text/css";
  elementIcons.textContent =
    "@font-face {" +
    'font-family: "element-icons";' +
    "src: url(" +
    window.chrome.extension.getURL("fonts/element-icons.woff") +
    ") format('woff')," +
    "url(" +
    window.chrome.extension.getURL("fonts/element-icons.ttf ") +
    ") format('truetype');}" /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/;
  document.head.appendChild(elementIcons);
}

// 通过Chrome插件的API加载css文件
function insertElementCss() {
  let elementCss = document.createElement("link");
  elementCss.type = "text/css";
  elementCss.rel = "stylesheet";
  elementCss.href = window.chrome.extension.getURL("css/content.css");
  document.head.appendChild(elementCss);
}

// 插入pageScript
function insertElementjs(path) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", window.chrome.extension.getURL(path + ".js"));
  document.documentElement.appendChild(script);
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    insertElementIcons();
    insertElementCss();
    insertElementjs("js/pageScript");
  }
};

// 接受来此popup数据
window.chrome.runtime.onMessage.addListener(msg => {
  if (msg.to === "content") {
    postMessage({
      from: "content",
      to: "pageScript",
      data: window.chrome.extension.getURL(msg.data + ".html")
    });
  }
});
