@echo off
chcp 65001
echo 正在同步到 GitHub Task13 仓库...
git add .
git commit -m "feat: 统一浅色UI、修复按钮跳转、Agent全业务覆盖"
git remote set-url origin https://github.com/alangao22/Task13.git
git push origin main
echo 同步完成！
pause
