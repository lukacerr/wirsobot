@echo off
cls

echo WIRSOBOT
echo.
echo Run mode:
echo 1- Developer mode
echo 2- Release mode
echo.
set /P mode= 

if %mode%==1 (npm run dev) else (npm run build && npm run release) 