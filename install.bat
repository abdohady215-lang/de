@echo off
setlocal enabledelayedexpansion
set PATH=C:\Program Files\nodejs;%PATH%
cd /d d:\news
call "C:\Program Files\nodejs\npm.cmd" install
pause
