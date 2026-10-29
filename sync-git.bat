@echo off
chcp 65001
echo 正在同步到 GitHub Task13 仓库...
git add .
git commit -m "feat: Agent终极整合(全量CRUD/记忆/推荐/CSV导入导出/UI统一)"
git remote set-url origin https://github.com/alangao22/Task13.git
git push origin main
echo 同步完成！
pause
