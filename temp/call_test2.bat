@echo off
goto MAIN
:A
echo A
exit /b
:MAIN
call :A
echo done
exit /b
