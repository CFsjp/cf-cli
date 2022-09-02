// create.js
const path = require("path");
const fs = require("fs-extra");
const Inquirer = require("inquirer");
const Creator = require("./Creator");

// 当前函数中可能存在很多异步操作，因此我们将其包装为 async
module.exports = async function (projectName, options) {
  const cwd = process.cwd(); // 获取当前工作目录
  const targetDir = path.join(cwd, projectName); // 拼接得到项目目录

  if (fs.existsSync(targetDir)) {
    // 判断目录是否存在
    if (options.force) {
      // 删除重名目录(remove是个异步方法)
      await fs.remove(targetDir);
    } else {
      const { isOverwrite } = await new Inquirer.prompt([
        // 返回值为promise
        {
          name: "isOverwrite", // 与返回值对应
          type: "list", // list 类型
          message: "Target directory exists, Please choose an action",
          choices: [
            { name: "Overwrite", value: true },
            { name: "Cancel", value: false },
          ],
        },
      ]);
      // 选择 Cancel
      if (!isOverwrite) {
        console.log("Cancel");
        return;
      } else {
        // 选择 Overwirte ，先删除掉原有重名目录
        console.log("\r\nRemoving");
        await fs.remove(targetDir);
      }
    }
  }

  const creator = new Creator(projectName, targetDir);
  creator.create();
};

// 创建 create 命令时我们配置了 --force 参数，意为强制覆盖。那我们我们在创建一个项目目录时，就会出现三种情况:

// 创建项目时使用 --force 参数，不管是否有同名目录，直接创建
// 未使用 --force 参数，且当前工作目录中不存在同名目录，直接创建
// 未使用 --force 参数，且当前工作目录中存在同名项目，需要给用户提供选择，由用户决定是取消还是覆盖

// 我们来梳理一下这部分的实现逻辑:

// 通过 process.cwd 获取当前工作目录，然后拼接项目名得到项目目录
// 检查是否存在同名目录
// 存在同名目录

// 用户创建项目时使用了 --force 参数，直接删除同名目录
// 未使用 --force 参数，给用户提供交互选择框，由用户决定

// 不存在同名目录，继续创建项目
