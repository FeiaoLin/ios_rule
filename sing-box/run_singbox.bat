@echo off
rem 获取当前脚本所在的目录
set SCRIPT_DIR=%~dp0

rem 进入当前目录
cd /d "%SCRIPT_DIR%"

rem 执行规则集编译命令，并将输出文件保存在当前目录
.\sing-box.exe rule-set compile --output "%SCRIPT_DIR%lfa-proxy.srs" "%SCRIPT_DIR%lfa-proxy.json"

rem 执行第二个规则集编译命令，并将输出文件保存在当前目录
.\sing-box.exe rule-set compile --output "%SCRIPT_DIR%lfa-direct.srs" "%SCRIPT_DIR%lfa-direct.json"

rem 脚本结束
echo Script executed successfully.
pause
