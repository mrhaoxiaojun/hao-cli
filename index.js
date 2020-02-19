#!/usr/bin/env node

const program = require('commander'); // node.js命令行界面的完整解决方案
const shell = require('shelljs'); // Nodejs使用ShellJS操作目录文件
const chalk = require('chalk'); // 添加背景色
const inquirer = require('inquirer'); //一个用户与命令行交互的工具
const clone = require('./lib/clone'); 
const pkg = require('./package');

program
  .version(pkg.version)
  .usage("hao <command>")
  .description(pkg.dependencies)

program
  .command('init')
  .alias('i')
  .description('请选择模版初始化工程')
  .action(function() {
    require('figlet')('H A O', function(err, data) {
      if (data) {
        console.log(chalk.red(data))
      }

      console.log('目前hao-cli支持以下模板：');
      listTemplateToConsole();

      const prompt = inquirer.createPromptModule();
      prompt({
        type: 'list',
        name: 'type',
        message: '项目类型:',
        default: 'ui   - Vue 2.0 基于cli2x UI组件库',
        choices: [
          'ui          - Vue 2.0 基于cli2x UI组件库',
          'v2Cli2m     - Vue 2.0 基于cli2x m端最佳实践',
          'v2Cli2pc    - Vue 2.0 基于cli2x pc端最佳实践',
          'v2Cli3m     - Vue 2.0 基于cli3x m端最佳实践',
          'v2Cli3pc    - Vue 2.0 基于cli3x pc端最佳实践',
          'gulp-multipage    - gulp 基于gulp pc&m端多页应用最佳实践',
        ],
      }).then((res) => {
        const type = res.type.split(' ')[0];
        prompt({
          type: 'input',
          name: 'project',
          message: '项目名称:',
          validate: function (input) {
            // Declare function as asynchronous, and save the done callback
            const done = this.async();
            // Do async stuff
            setTimeout(function() {
              if (!input) {
                // Pass the return value in the done callback
                done('You need to provide a dirName.');
                return;
              }
              // Pass the return value in the done callback
              done(null, true);
            }, 0);
          }
        }).then((iRes) => {
          const project = iRes.project;
          let pwd = shell.pwd();
          clone(`https://github.com/mrhaoxiaojun/hao-${type}.git`, pwd + `/${project}`, {
            success() {
              // 删除 git 目录
              shell.rm('-rf', pwd + `/${project}/.git`);

              // 提示信息
              console.log(`项目地址：${pwd}/${project}/`);
              console.log('接下来你可以：');
              console.log('');
              console.log(chalk.blue(`    $ cd ${project}`));
              console.log(chalk.blue(`    $ npm install`));
              console.log(chalk.blue(`    $ ....`));
              console.log('');
            },
            fail(err) {
              console.log(chalk.red(`${err}`));
            },
            onData(data = '') {
              const d = data.toString();
              if (d.indexOf('fatal') !== -1 || d.indexOf('error') !== -1) {
                console.log(chalk.red(`${data}`));
              } else {
                console.log(chalk.blue(`${data}`));
              }
            },
          })
        });
      });
    });
  })

program
  .on('--help', function() {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log(chalk.blue('  $ hao i'));
  console.log(chalk.blue('  $ hao init'));
  console.log('');
  console.log('All Available Templates:');
  listTemplateToConsole();
});

program.parse(process.argv);

function listTemplateToConsole() {
  console.log('');
  console.log(chalk.green('  ui        - Vue 2.0 基于cli2x UI组件库'));
  console.log(chalk.green('  v2Cli2m   - Vue 2.0 基于cli2x m端最佳实践'));
  console.log(chalk.green('  v2Cli2pc  - Vue 2.0 基于cli2x pc端最佳实践'));
  console.log(chalk.green('  v2Cli3m   - Vue 2.0 基于cli3x m端最佳实践'));
  console.log(chalk.green('  v2Cli3pc  - Vue 2.0 基于cli3x pc端最佳实践'));
  console.log(chalk.green('  gulp-multipage  - gulp 基于gulp pc&m端多页应用最佳实践'));
  console.log('');
}