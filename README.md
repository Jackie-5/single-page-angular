### angular + webpack + es6

> 单页面应用 + 按需加载的路由配置。

> 主文件为 src下的文件

### js配置

> index.html做为入口页面, js文件夹下的main.js为主文件的js。

> controllers里面的文件为不同的页面不同需要加载的js。

> lib文件夹下的所有文件为组件js这个文件夹不会被打包转换,输出后会丢弃这个文件夹下的所有文件。

### route-tpl配置

> content文件夹为每个页面单独的html模板。

> header 为页面的头部

> nav 为导航

### less 配置

> 主文件为 main.less 最后打包出来后只有一个css

> component 文件夹为公共组件的css

> controllers 为每个子页面所需的css