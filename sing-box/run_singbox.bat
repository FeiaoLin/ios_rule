@echo off
rem ��ȡ��ǰ�ű����ڵ�Ŀ¼
set SCRIPT_DIR=%~dp0

rem ���뵱ǰĿ¼
cd /d "%SCRIPT_DIR%"

rem ִ�й��򼯱��������������ļ������ڵ�ǰĿ¼
.\sing-box.exe rule-set compile --output "%SCRIPT_DIR%lfa-proxy.srs" "%SCRIPT_DIR%lfa-proxy.json"

rem ִ�еڶ������򼯱��������������ļ������ڵ�ǰĿ¼
.\sing-box.exe rule-set compile --output "%SCRIPT_DIR%lfa-direct.srs" "%SCRIPT_DIR%lfa-direct.json"

rem �ű�����
echo Script executed successfully.
pause
