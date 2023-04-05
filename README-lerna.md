# szero

npm publish --access public

lerna publish from-package

## 基础命令

lerna 主要学习的是 lerna 常用管理命令, 例如 依赖安装，版本管理，发包等。
init 初始化
用来初始化 lerna 项目
lerna init
复制代码
参数:

-i or --independent 使用独立模式, 默认固定模式
--exact 使用固定模式

### create 创建包

将在包集合目录下，新建包基础目录结构 lerna create [名称] [集合目录]

```sh
lerna create utils
```

参数：

- name 名称\
  loc 包集合目录, 单一包集合时为可选。

```json
// leran.json
{
  "packages": [
    // 存在多个包集合
    "source/*",
    "utils/*"
  ]
}
```

// shell\
// 在指定包集合中新增 day 包

```sh
lerna create day utils
```

-- yes 跳过交互配置

learna create day --yes
复制代码

```
--bin 是否为可执行包
--description 包描述
--dependencies 依赖列表
--es-module 初始化为 ES6 模块
--homepage 包首页地址
--keywords npm 查询关键子列表
--license 开源许可
--private 私有包
--registry npm 源
--tag 标签
```

```sh
lerna create day --description=一段描述
```

### boostrap 安装依赖

为所有包安装依赖, 并链接相关的本地依赖包。

```sh
lerna boostrap
```

参数:

--ignore 忽略

安装时，跳过某些包的依赖安装。

lerna bootstrap --ignore [包命|包命匹配规则]
这里的包命指的是 package.json 中 name 属性定义的包名
// 不为 pkg-ts 安装依赖
lerna bootstrap --ignore pkg-ts
// 不为 以 pkg- 开头的包安装依赖
lerna bootstrap --ignore pkg-\*
复制代码

--hoist 提升

正常情况下， 依赖安装在对应的包目录下。有时候多个包有相同的依赖或我们希望依赖相同的包实例, 可以将依赖包安装到根目录。
lerna bootstrap --hoist
复制代码

--nohoist

依赖提升时，忽略部分包, --nohoist=[依赖包名 | 依赖包命匹配规则]
// 依赖提升，但不提升 babe 依赖
lerna bootstrap --hoist --nohoist=babel-\*
复制代码

--strict 严格模式

相同依赖包的版本不兼容时，将报错并终止安装
lerna bootstrap --hoist --strict
复制代码

--ignore-scripts

忽略生命周期钩子的调用
lerna bootstrap --ignore-scripts
复制代码

--npm-client

包管理工具类型
// 使用 yarn 安装依赖
lerna bootstrap --npm-client=yarn

--use-workspaces

开启 workspaces
lerna bootstrap --use-workspaces
复制代码
同时需要在根目录 package.json 配置 workspaces
// root/package.json
{
"workspaces": ["packages/*"]
}
复制代码

--force-local

始终使用本地依赖，无论版本是否匹配
lerna bootstrap --force-local
复制代码

--no-ci / --ci

npm ci 开启 or 关闭
lerna bootstrap --no-ci
or
lerna bootstrap --ci
复制代码

### clean

清理所有依赖, 删除所有包内 node_modules

```sh
lerna clean
```

参数:

--yes

不做确认提示

```sh
lerna clean --yes
```

### list

显示包列表
lerna list
// or
lerna ls
复制代码
参数

--json

以 json 的形式显示

--all | -a

显示所有包，包括私有包

--long | -l

显示扩展信息

--parseable

显示包路径列表

--toposort

按照依赖关系显示

--graph

按照依赖关系以 json 形式显示
进阶命令

### publish

发包
learn publish
复制代码
参数:

form-git

根据 git commit 的 annotaed tag 确定包版本，进行发包
lerna publish from-git
复制代码

from-package

根据 package.json 的版本，进行发包
lerna publish from-package
复制代码

--canary

根据上次版本计算出新的版本号，进行发包。 不会进入版本交互模式中
lerna publish --canary
复制代码

--contents

指定发布的包内容, 类似 package.json 的 files 属性
lern publish --contents lib
复制代码

--dist -tag

新增 dist-tag 标签
lerna publish --dist-tag next
复制代码

--no-verify-access

禁止 npm 权限校验
lerna publish --no-verify-access
复制代码

--preid

为--canary 提供指定的发布标识符
lerna publish --canary

> uses the next semantic prerelease version, e.g.

> 1.0.0 => 1.0.1-alpha.0

lerna publish --canary --preid next

> uses the next semantic prerelease version with a specific prerelease identifier, e.g.

> 1.0.0 => 1.0.1-next.0

复制代码

--pre-dist-tag

--dist-tag 的预发布版本
lerna publish --pre-dist-tag next
复制代码

--registry

使用指定源发布
lerna publish --registry https://cnpmjs.org
复制代码

--tag-version-prefix

自定义版本前缀， 默认: v

# locally

lerna version --tag-version-prefix=''

# on ci

lerna publish from-git --tag-version-prefix=''
复制代码

--ignore-scripts

禁用生命周期钩子脚本
lerna publish --ignory-scripts
复制代码

--yes

跳过确认
lerna publish --canary --yes
复制代码

### add

安装包, 类似 npm i package,
// 为所有包安装 dayjs 依赖
lerna add dayjs
复制代码
参数:

--scope

限制安装范围
// 只为包 pkg-1 安装依赖 dayjs
lerna add dayjs --scope=pkg-1
// 等价于 cd pkg-1/ && npm i dayjs
复制代码

--dev

开发依赖
lerna add rollup --dev
复制代码

--exact

使用精确版本，而不是版本范围。
例如 默认添加版本号: ^1.0.1， 精确版本： 1.0.1

lerna add --exact
复制代码

--peer

添加到 peerDependencies 中
lerna add vue --peer
复制代码

--registry

使用指定源安装
lerna add vue --registry http://r.npm.taobao.org/
复制代码

--no-bootstrap

跳过 bootstrap
lerna add rollup
复制代码

### version

创建新的包版本
执行流程:

标识自上次标记发布以来已更新的包。

新版本的提示。

修改包元数据，执行各个包内的生命周期钩子。

提交修改和标签。

推送到 git 远端分支。

lerna version
复制代码
参数

bump

版本更新方式

major 主版本
mior 副版本
patch 修复版本
premajor 预发布主版本
preminor 预发布副版本
prepatch 预发布修复版本
prerelease 预发布版

参数：
@lerna/version（翻译

### run

指定 package.json 脚本命令
lerna run build
复制代码
参数:

--stream

显示子进程输出
lerna run <命令> --stream
复制代码

--parallel

显示子进程输出, 忽略排序
lerna run <命令> --parallel
复制代码

--no-bail

禁止非零退出
lerna run --no-bail test
复制代码

--no-prefix

禁止包前缀
lerna run --no-prefix
复制代码

--profile

生成性能分析文件
lerna run build --profile
复制代码

--profile-localtion

生成并保存性能分析文件
lerna run build --profile-localtion
复制代码

### exec

在每个包中，执行命令行, run 命令的底层命令
lerna exec -- echo xx > logs.text
复制代码

--scope

限制命令作用范围
lerna exec --scope <包名> -- cd ./src
复制代码

--stream

显示命令输出, 带包前缀
lerna exec --scope localPackage -- ls
复制代码

--parallel

显示命令输出, 忽略排序
lerna exec --parallel localPageck -- ls
复制代码

--no-bail

禁止非零退出
lerna exec --nobail ...
复制代码

--no-prefix

禁止包前缀
lerna exec --no-prefix
复制代码

--profile

生成性能分析文件
lerna exec --profile
复制代码

--profile-localtion

生成并保存性能分析文件
lerna exec --profile --profile-location=logs/profile/ -- <command>
复制代码

### import

导入外部独立包, 例如我们之前为使用 lerna 管理的独立 npm 包， 导入到 lerna 项目包集合后， 可以使用改目录导入相关 git 记录等
lerna import <包地址>
复制代码
参数:

--faltten

lerna import ./package --flatten
复制代码

--dest

根据 lerna.json 指定导入的目录
// lerna.json
{
"packages": [
"pakcages/*",
"utils/*"
]
}
// 执行导入
lerna import ../out-pkg --dest=utils
// out-pkg 将被导入 utils 目录下
复制代码

--preserve-commit

保留原 git 提交者信息以及时间

```sh
lerna import ../out-pkg --preserve-commit
```

### changed

显示下次将发布的包列表， 一般是包版本发生变化

```sh
lerna changed
```

命令参数于 list 命令相同。

```
--json
--ndjson
-a --all
-l --long
-p --parseable
--toposort
--graph
```

### diff

显示包修改内容, 类似 `git diff`

```sh
lerna diff
```

### info

显示环境信息

```sh
lerna info
```

```

```
