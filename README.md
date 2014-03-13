# node.js-blog-starter  #

本项目是一个使用Node.js编写的个人博客系统，同时也使用了其他一些第三方Node.js开源框架和模块，如Express，Mongoose和Mocha等。数据库存储使用的是Mongodb。

本博客系统的功能比较简单，拥有最基本的博客系统的管理功能，前后端都有代码实现。同时，文章和页面管理都支持实时Markdown风格的编辑器，普通游客的评论也支持Markdown。本博客系统还提供了Akismet来帮助你管理评论。

就如本项目命所见那样，这个博客系统是提供给大家作为学习参考的，你可以从里面学到一些不错的知识点：

* 使用Express来搭建Web应用的框架
* 使用Mongoose来组织你的数据模型
* 使用Mongodb来存储session
* 使用Mocha和Chai进行测试

当然，知识点远远不止上面这些。最后，我希望这个博客系统能帮你入门Node.js。

演示地址：[node-blog-starter](http://112.124.35.12:3000);

## 特别说明 ##

本博客系统的前台和后台的页面是由 @willerce 设计和提供的，而且本博客的原版来自于 [@willerce](http://willerce.com/) 的[noderce](https://github.com/willerce/noderce)。

与[noderce](https://github.com/willerce/noderce)的不同点在于，本博客系统的代码基本都是重写的，使用Mongoose来做数据库存储，Session使用Mongodb来作存储介质，添加了一些新的模块等等。为想学习Node.js的同学提供一点帮助，仅此而已。

## 安装 ##

### 克隆项目到本地 ###

```
git clone https://github.com/happen-zhang/node.js-blog-starter.git path-to-your-dir
```

### 安装依赖 ###

```
cd path-to-your-dir

npm install
```

### 修改配置 ###

博客系统的配置文件都存放在`/config`目录下，你可以在里面找到需要修改的配置文件。

### 运行程序 ###

请先确保你的Mongodb数据库服务是开启的，然后执行下面的命令运行服务：,

```
npm start
```

### 初始化数据 ###

服务启动后，请访问网站的更目录`/`，或者是`/admin/install`，系统会提示你进行初始化。

## 测试 ##

请先确保安装了Mocha：

```
npm install -g mocha
```

然后在项目的根目录下运行下面的命令：

```
npm test
```

## License ##

(The MIT License)

Copyright (c) 2014 happen-zhang <zhanghaipeng404@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
