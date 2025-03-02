// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function updatePomVersion(pomPath, newVersion) {
    try {
        const pomContent = fs.readFileSync(pomPath, 'utf-8');
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(pomContent);
        
        // 获取当前项目的groupId
        let projectGroupId = '';
        if (result.project.groupId) {
            projectGroupId = result.project.groupId[0];
        } else if (result.project.parent && result.project.parent[0].groupId) {
            // 如果项目没有直接定义groupId，则使用父模块的groupId
            projectGroupId = result.project.parent[0].groupId[0];
        }

        // 更新项目版本
        if (result.project.version) {
            result.project.version[0] = newVersion;
        }

        // 更新父模块版本引用
        if (result.project.parent && result.project.parent[0].version) {
            result.project.parent[0].version[0] = newVersion;
        }

        // 更新依赖版本 - 只更新与当前项目groupId相同的依赖
        if (result.project.dependencies && result.project.dependencies[0].dependency) {
            for (const dep of result.project.dependencies[0].dependency) {
                if (dep.groupId && dep.groupId[0] === projectGroupId && dep.version) {
                    dep.version[0] = newVersion;
                }
            }
        }

        // 保存更新后的pom文件
        const builder = new xml2js.Builder();
        const updatedXml = builder.buildObject(result);
        fs.writeFileSync(pomPath, updatedXml);
        return true;
    } catch (error) {
        console.error(`更新POM文件失败: ${pomPath}`, error);
        return false;
    }
}

async function activate(context) {
    console.log('Maven Project Version插件已激活');

    let disposable = vscode.commands.registerCommand('maven-project-version-plugin-vs.updateVersion', async function () {
        try {
            // 获取工作区根目录
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage('请先打开一个Maven项目');
                return;
            }

            // 提示用户输入新版本号
            const newVersion = await vscode.window.showInputBox({
                prompt: '请输入新的版本号',
                placeHolder: '例如: 1.0.0'
            });

            if (!newVersion) {
                return;
            }

            // 查找所有pom.xml文件
            const workspaceRoot = workspaceFolders[0].uri.fsPath;
            const pomFiles = glob.sync('**/pom.xml', { cwd: workspaceRoot });

            if (pomFiles.length === 0) {
                vscode.window.showWarningMessage('未找到pom.xml文件');
                return;
            }

            // 更新所有pom文件的版本
            let successCount = 0;
            for (const pomFile of pomFiles) {
                const pomPath = path.join(workspaceRoot, pomFile);
                const success = await updatePomVersion(pomPath, newVersion);
                if (success) {
                    successCount++;
                }
            }

            // 显示更新结果
            vscode.window.showInformationMessage(
                `版本更新完成: 成功更新${successCount}个文件，共${pomFiles.length}个文件`
            );

        } catch (error) {
            vscode.window.showErrorMessage('更新版本时发生错误: ' + error.message);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
