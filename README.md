# Maven Project Version

这是一个VS Code插件，用于批量更新Maven项目中的版本号。当您需要升级多模块Maven项目的版本时，这个插件可以通过VS Code界面自动更新所有相关的版本号，包括项目版本、父模块版本以及相关依赖模块的版本。

## 功能特点

- 一键更新项目版本号
- 自动更新父模块引用的版本号
- 自动更新子模块的版本号
- 自动更新项目内部依赖的版本号
- 支持多模块项目结构
- 与VS Code无缝集成

## 安装方法

您可以通过以下方式安装此插件：

1. 在VS Code中打开扩展视图（Ctrl+Shift+X）
2. 搜索 "Maven Project Version"
3. 点击安装

或者，您也可以从[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=felixsun.maven-project-version-plugin-vs)下载安装。

## 使用方法

1. 打开包含Maven项目的工作区（必须包含pom.xml文件）
2. 通过以下方式之一启动插件：
   - 按下 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（macOS）打开命令面板
   - 输入 "更新Maven项目版本" 并选择该命令
3. 在弹出的输入框中输入新的版本号
4. 插件将自动更新项目中所有相关的版本号

## 示例

假设您有一个多模块项目结构如下：

```
parent-project (1.0.0)
├── module-a (1.0.0)
├── module-b (1.0.0)
└── module-c (1.0.0)
```

执行插件并输入新版本号 "2.0.0" 后，所有模块的版本将被更新为2.0.0，同时所有内部依赖的版本引用也会被更新。

## 注意事项

- 此插件只会更新与当前项目groupId相同的依赖版本
- 确保在执行前已经备份您的项目文件
- 建议在版本控制系统中执行，以便于回滚更改

## 已知问题

- 暂无已知问题

## 版本历史

### 0.0.1

- 初始版本发布
- 实现基本的Maven项目版本更新功能

## 反馈与贡献

如果您有任何问题或建议，请在[GitHub仓库](https://github.com/felixsun/maven-project-version-plugin-vs)提交issue或pull request。

## 许可证

[MIT License](https://github.com/felixsun/maven-project-version-plugin-vs/blob/main/LICENSE)
