'use strict';

// 或直接使用npm包 git-clone

const { spawn } = require('child_process'); // node核心模块子进程
const fs = require('fs');

module.exports = (repo, targetPath, opts = {}) => {
  const { success, fail, onData } = opts;

  emptyDirectory(targetPath, (isEmpty) => {
    // 目录为空终止
    if (!isEmpty) {
      fail(`fatal: destination path '${targetPath}' already exists and is not an empty directory.`);
      abort();
      return;
    }
    const git = opts.git || 'git';
    const args = ['clone'];

    if (opts.shallow) {
      args.push('--depth');
      args.push('1');
    }

    args.push('--');
    args.push(repo);
    args.push(targetPath);

    const child = spawn(git, args); //执行 git clone -- repository directory
    child.on('close', function(status) {
      if (status === 0) {
        if (opts.checkout) {
          _checkout();
        } else {
          success && success();
        }
      } else {
        fail && fail(new Error("Failed with status " + status));
      }
    });
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
      onData && onData(data.toString());
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
      onData && onData(data.toString());
    });

    function _checkout() {
      const args = ['checkout', opts.checkout];
      const process = spawn(git, args, { cwd: targetPath });
      process.on('close', function(status) {
        if (status === 0) {
          success && success();
        } else {
          fail && fail(new Error("'git checkout' failed with status " + status));
        }
      });
    }
  });
};

// 终止进程
function abort() {
  process.exit(1);
}

// 判断目录是否为空
function emptyDirectory(path, fn) {
  fs.readdir(path, function (err, files) {
    if (err && 'ENOENT' !== err.code) {
      abort();
    }

    fn(!files || !files.length);
  });
}