const acorn = require('acorn');
const fs = require('fs');
const path = require('path');
const buffer = fs.readFileSync(path.resolve(process.cwd(), 'add.test.js')).toString();
generator.parse(buffer, {
    ecmaVersion: 'latest',
}).body;

// 引用一个 Generator 类，用来生成 ast 对应的代码
const Generator = require('./generator');
// 创建 Generator 实例
const gen = new Generator();
// 定义变量decls  存储所有的函数或变量类型节点 Map类型
const decls = new Map();
// 定义变量calledDecls 存储被用到过的函数或变量类型节点 数组类型
const calledDecls = [];

console.log(body)
