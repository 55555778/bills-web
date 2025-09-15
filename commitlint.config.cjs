// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'], // 使用社区标准规范
  rules: {
    // 自定义规则（可选）
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // bug修复
        'docs', // 文档更新
        'style', // 代码格式调整
        'refactor', // 代码重构
        'test', // 测试相关
        'chore', // 构建/依赖调整
        'revert', // 回滚提交
      ],
    ],
    'subject-case': [0], // 不限制主题大小写
    'header-max-length': [2, 'always', 100], // 标题最大长度100字符
  },
};
