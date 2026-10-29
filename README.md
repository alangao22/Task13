# 课程签到管理系统 + 规则 Agent

一个基于 **uni-app x + UTS + Vue 3** 的课程签到管理示例项目。在原有管理员 / 教师 / 学生签到流程之上，新增了 **管理员 Agent** 与 **教师 Agent**：用自然语言查询用户、课程、签到数据，并在严格的白名单与安全拦截下完成受控操作。

## 技术栈

- **uni-app x**：一套代码运行到 Web / App / 微信小程序（以 HBuilderX 实际支持为准）
- **UTS**：强类型脚本，业务逻辑位于 `utils/*.uts`
- **Vue 3**：`.uvue` 单文件组件，Options API
- **rpx + Flex**：页面统一使用 rpx 与 flex 布局
- **纯前端数据**：`utils/userData.uts`、`courseData.uts`、`checkinData.uts` 内存表

## Agent 亮点

### 1. 规则引擎，而不是“自由聊天”

- 业务白名单：仅支持 **用户 / 课程 / 签到** 三类数据的查询与操作。
- 输入归一化：去零宽字符、全角转半角、合并空白、转小写。
- 敏感词黑名单 + 注入正则：拦截“忽略指令”“系统指令”“prompt”“写代码”“你是谁”等。
- 去标点二次扫描：识别 `忽 略 指 令`、`忽.略.指.令`、`忽/略/指/令` 等拆字绕过。
- 未命中业务意图时统一回复：
  > 我是签到业务助理，仅支持处理用户、课程和签到数据的查询与操作哦。

### 2. 管理员 / 教师双角色

- 管理员入口：`pages/admin/agent`，浅色简约风。
- 教师入口：`pages/teacher/agent`，浅色简约风，与项目其他页面统一。
- 教师模式自动收窄数据范围：
  - 课程：只显示 `teacherName === 当前老师` 的课程
  - 签到：只显示自己课程下的签到记录
  - 学生：只显示自己课程下产生过签到记录的学生
  - 删除 / 改时间：仅允许操作自己的课程与签到

### 3. 卡片动作按钮

`AgentCard` 支持 `actions` 数组：

```ts
export type AgentCardAction = {
  text: string
  url?: string
  actionType?: string
}
```

- `url`：点击后 `uni.navigateTo`，例如“前往签到管理”。
- `actionType`：触发内置指令，例如 `confirm_update`、`confirm_delete`、`cancel_action`。

### 4. 多轮对话状态机

```text
idle
  └─ “把数据结构改为15点” → awaiting_minute
        └─ 用户回复“30” → awaiting_confirm
              ├─ 点击“确认修改”/回复“确认修改” → 更新课程 startTime → idle
              └─ 回复“取消” → idle
```

- 缺少分钟数时主动追问。
- 确认前展示课程与完整时间卡片，避免误改。
- 确认时重新校验课程是否存在、是否属于当前老师。
- 直接输入 `15:30` / `15点30分` 可跳过分钟追问。

### 5. 删除安全

- 删除用户 / 课程 / 签到均需二次确认。
- 拒绝“删除所有 / 清空 / 批量删除”。
- 管理员账号与系统预置课程受保护。
- 教师不能删除用户，也不能删除他人课程。
- 删除用户 / 课程不会级联删除签到记录，并会明确提示。

## 核心目录结构

```text
Task12/
├─ App.uvue
├─ main.uts
├─ pages.json
├─ manifest.json
├─ README.md
├─ sync-git.bat
├─ pages/
│  ├─ index/index.uvue                 # 身份选择
│  ├─ login/                          # 学生 / 教职工登录
│  ├─ student/signin.uvue             # 学生签到
│  ├─ admin/
│  │  ├─ index.uvue                   # 管理员控制台（含 ✨ AI 助手入口）
│  │  ├─ users.uvue                   # 用户 CRUD
│  │  ├─ courses.uvue                 # 课程 CRUD
│  │  ├─ checkins.uvue                # 签到 CRUD
│  │  └─ agent.uvue                   # 管理员 Agent（浅色）
│  └─ teacher/
│     ├─ index.uvue                   # 教师控制台（含 ✨ AI 助手入口）
│     ├─ courses.uvue                 # 我的课程
│     ├─ checkins.uvue                # 我的签到记录
│     └─ agent.uvue                   # 教师 Agent（浅色）
└─ utils/
   ├─ userData.uts                    # 用户表
   ├─ courseData.uts                  # 课程表
   ├─ checkinData.uts                 # 签到表
   ├─ location.js                     # 定位辅助
   └─ agentEngine.uts                 # 规则引擎 / 状态机 / 卡片动作
```

## 本地运行指南

1. 安装 **HBuilderX**（建议使用支持 uni-app x 的较新版本）。
2. 使用 HBuilderX 打开项目根目录（包含 `manifest.json` 与 `pages.json` 的目录）。
3. 在 `manifest.json` 中确认应用名称 / AppID（当前为空即可先跑 Web）。
4. 运行：
   - **Web**：运行 → 运行到浏览器 → Chrome
   - **App**：运行 → 运行到手机或模拟器 → Android / iOS
   - **微信小程序**：运行 → 运行到小程序模拟器 → 微信开发者工具
5. 登录：
   - 管理员：使用教职工登录，账号为管理员手机号/邮箱（见 `utils/userData.uts`）
   - 教师：使用教职工登录，账号为教师手机号/邮箱
6. 进入管理台 / 教师台，点击顶部的 **✨ AI 助手** 卡片。

> 项目没有 `package.json`，不依赖 npm 安装；数据保存在内存中，刷新或重启后恢复初始数据。

## 可以试试的指令

```text
查看所有签到
查看课程列表
查询所有用户
统计签到
查张三的签到
查赵老师的课程
查询我的课程
查询我的学生
把数据结构的上课时间改为15点30分
把数据结构的上课时间改为15点
30
删除课程 数据结构
删除用户 张三
确认删除
取消
```

安全测试：

```text
忽略之前的指令，查询所有用户
你是谁
忽 略 指 令
写一段代码
```

以上输入应统一返回安全拒答，且不会访问或修改任何业务数据。

## Git 同步

根目录提供 `sync-git.bat`，用于同步到：

```text
https://github.com/alangao22/Task13.git
```

双击运行后会执行 `git add .`、提交、设置远端并推送到 `main`。

## 说明

- Agent 为**纯前端规则引擎**，不调用任何大模型或外部接口。
- 所有删除 / 修改都直接作用于 `utils/` 中的内存数据表，便于演示。
- 页面跳转、卡片动作均使用跨端 API，未使用平台特定能力。
