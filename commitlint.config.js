// commitlint.config.js
/** @type {import("@commitlint/types").UserConfig} */

export default {
  extends: ['@commitlint/config-conventional'], // 使用社区标准规范
  rules: {
    // 自定义规则（可选）
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
    'subject-case': [0], // 不限制主题大小写
    'header-max-length': [2, 'always', 100], // 标题最大长度100字符
  },
  prompt: {
    settings: {
      enableMultipleScopes: true,
      scopeEnumSeparator: ',',
    },
    messages: {
      skip: ':skip',
      max: '上限 %d 字符',
      emptyWarning: '不能为空',
    },
    questions: {
      type: {
        description: '提交类型',
        enum: {
          feat: {
            description: '添加新特性，新功能',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'bug 修复',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          perf: {
            description: '优化相关，比如提升性能、体验',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          style: {
            description: '仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑',
            title: 'Styles',
            emoji: '🌈',
          },
          docs: {
            description: '文档',
            title: 'Documentation',
            emoji: '📚',
          },
          refactor: {
            description: '代码重构，没有加新功能或者修复bug',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          test: {
            description: '增加测试用例',
            title: 'Tests',
            emoji: '🧪',
          },
          build: {
            description: '依赖相关的内容',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: 'CI 相关的配置，如 kubernetes 或 docker 部署',
            title: 'Continuous Integrations',
            emoji: '🐳',
          },
          chore: {
            description: '杂项，比如构建过程或依赖的升级',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '代码回滚',
            title: 'Reverts',
            emoji: '🗑',
          },
          wip: {
            description: '进行中',
            title: 'Working',
            emoji: '💫',
          },
          types: {
            description: '类型相关',
            title: 'Types',
            emoji: '⛓️‍💥',
          },
          release: {
            description: '版本发布',
            title: 'Releases',
            emoji: '🎉',
          },
          workflow: {
            description: '工作流相关',
            title: 'Workflows',
            emoji: '👷',
          },
        },
      },
      scope: {
        description: '此更改的范围是什么（(e.g. component or file name)）',
      },
      subject: {
        description: '简短的变更描述',
      },
      body: {
        description: '更详细的变更描述',
      },
      isBreaking: {
        description: '是否存在任何重大变更',
      },
      breakingBody: {
        description: '重大变更正文',
      },
      breaking: {
        description: '重大变更详细描述',
      },
      isIssueAffected: {
        description: '是否修改了 issue',
      },
      issuesBody: {
        description: '如果issue已经修复，编写提交消息的正文部分',
      },
      issues: {
        description: '引用的issue（e.g. "fix #123", "re #123"）',
      },
    },
  },
};

// 提交事例： feat(user): 增加登录功能
