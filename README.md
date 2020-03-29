# chrome_demo

## 启动项目

```
npm run build-watch

```

会走 manifest.development.json 配置，但一般`npm run build-watch`打包出来的就可以在 chrome 上使用，当然如果有要求可以把开发与生产区分，那么就要使用 manifest.production.json。

## manifest

开发时修改`manifest.development.json`

```
"web_accessible_resources": ["fonts/*", "css/*", "js/*"]
允许加载清单，要在这里把打包出的dist里需要加载的静态资源都填入，否则会出现无法加载的情况
```

## 热加载

使用 hot-reload.js 文件，然后对 vue.config.js 与 manifest.development.json 修改。

```
vue.config.js
添加开发情况下
// 开发环境将热加载文件复制到dist文件夹
if (process.env.NODE_ENV !== "production") {
  plugins.push(
    CopyWebpackPlugin([
      {
        from: path.resolve("src/utils/hot-reload.js"),
        to: path.resolve("dist")
      }
    ])
  );
}
```

```
manifest.development.json
对background添加hot-reload.js

"background": {
    "scripts": ["./js/background.js", "hot-reload.js"],
    "persistent": true
  },
```

### chrome API

#### chrome.tabs.query

获取具有指定属性的所有标签页，如果没有指定任何属性的话则获取所有标签页。

```
// active 标签页在窗口中是否为活动标签页。
// currentWindow 标签页是否在当前窗口中。
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

  // 向指定标签页中的内容脚本发送一个消息，当发回响应时执行一个可选的回调函数。当前应用在指定标签页中的每一个内容脚本都会收到 chrome.runtime.onMessage 事件。

  chrome.tabs.sendMessage(tabs[0].id, {...msg, to: 'content'});
})
```

[chrome.tbas](https://chajian.baidu.com/developer/extensions/tabs.html)

#### chrome.runtime

1. getURL
   将应用或应用安装目录内的相对路径转换为完全限定的 URL。

2. sendMessage

向您的应用/应用或另一个应用/应用中的其他事件监听者发送单个消息。与 runtime.connect 类似，但是只发送单个消息（可以有响应）。如果向您自己的应用发送消息，每个网页中都会产生 runtime.onMessage 事件；如果发送至另一个应用则产生 runtime.onMessageExternal 事件。注意，应用不能使用该方法向内容脚本发送消息。要向内容脚本发送消息，请使用 tabs.sendMessage。

3. id
   应用/应用的标识符。

[chrome.runtime](https://chajian.baidu.com/developer/apps/runtime.html)

### 脚本内部通信

```
postMessage(data:any)
window.addEventListener("message", function(event) {
  // 获取传输过来的data
  const data = event.data;

},false)
```

## chrome.storage

1. 用户数据可以与 chrome 自动同步（通过 storage.sync）,只要用户登录了 chrome 账号，则能够全量同步浏览器
2. 扩展程序的脚本能够直接访问用户的数据，不需要通过 background js
3. 即使使用 split 隐身行为，也可以保留用户的扩展程序设置
4. 异步批量读写操作，比阻塞和串行的 localStorage 更快
5. 用户数据可以存储对象（localStorage 是将对象 string 到字符串中）
6. 可以读取管理员为扩展配置的企业策略（使用带有模式的 storage.managed 做 schema）

[chrome.storage](http://www.ptbird.cn/chrome-extensions-storage.html)

## chrome 打开新页签

```
如:
window.chrome.tabs.create({
        url: window.chrome.extension.getURL(val + ".html")
      });
```

## 数据保存

这个在哪都可以使用，没有限制

chrome.storage.local.set

```
window.chrome.storage.local.set({
          zhang_a: '{"name":"zhang"}',
          zhang_m: "保存数据"
        });
```

chrome.storage.local.get

```
window.chrome.storage.local.get(["zhang_a", "zhang_m"], result => {
  console.log(result);
});
```

chrome.storage.local.remove

```
chrome.storage.local.remove("zhang_a",()=>{
  // 删除后回调
})
```

## 使用

1. content 可以操作 DOM,所以可以在此处插入标签，引入文件，那么就可以直接对项目进行操作或获取信息，也是脚本内容，所以可以使用 chrome.runtime.sendMessage 传输数据

如:

```
chrome.runtime.sendMessage(chrome.runtime.id, {type: 'content', to: 'background', data: true});
```

2. background 指定一个 background.js 文件，这个 js 文件是扩展被安装后会一直运行在浏览器中的程序，比如我们要保存一些扩展运行时的状态，缓存一些数据，或者绑定一些浏览器的事件等代码都可以放到这个 js 文件中。

3. popup 为点击图标弹出页面，可以当一个普通页面开发，但传输要使用 chrome.tabs 的方式

4. options 为选项页面，右击图标选择选项就是打开的就是这个页面。

传输方式在脚本里互相传输可以使用

```
postMessage(data:any)
window.addEventListener("message", function(event) {
  // 获取传输过来的data
  const data = event.data;

},false)
```

传到插件里可以使用

```
脚本发出使用的
chrome.runtime.sendMessage(chrome.runtime.id, {type: 'content', to: 'background', data: true});

插件发出要使用
window.chrome.tabs.query({ active: true, currentWindow: true }, function(
        tabs
      ) {
        window.chrome.tabs.sendMessage(tabs[0].id, { to: "content" });
      });

监听方式都是一样
window.chrome.runtime.onMessage.addListener(msg => {
  if (msg.to === "content") {
    postMessage({
      from: "content",
      to: "pageScript",
      data: window.chrome.extension.getURL(msg.data + ".html")
    });
  }
});
```

## 多页面打包与多个 js 打包

修改 vue.config.js

1. 页面修改 chromeName

```
const chromeName = ["popup", "options", "json"];
```

会打包出 popup，options，json 三个页面

2. 只打包 js 修改 entry

```
···
configureWebpack: {
    entry: {
      content: "./src/content/index.js",
      background: "./src/background/index.js",
      pageScript: "./src/pageScript/index.js"
    },
    output: {
      filename: "js/[name].js"
    },
    plugins: plugins
  },
···
```

会在 js 里文件里打包出 content，background，pageScript 三个 js 文件。

具体请参考代码

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### [vue-cli3 开发 Chrome 插件实践](https://blog.csdn.net/weixin_34404393/article/details/91476348)

### [chrome 插件开发资料](https://github.com/sxei/chrome-plugin-demo)
