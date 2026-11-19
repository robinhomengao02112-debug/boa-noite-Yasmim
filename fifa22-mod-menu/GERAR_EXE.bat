@echo off
rem Gera "FIFA22 Mod Menu.exe" nesta pasta e cria o atalho na area de trabalho.
cd /d "%~dp0"
python -m pip install --upgrade pyinstaller || goto erro
python -m PyInstaller --noconfirm --onefile --windowed --name "FIFA22 Mod Menu" ^
  --add-data "modelo_mod.lua;." app.pyw || goto erro
copy /y "dist\FIFA22 Mod Menu.exe" "%~dp0" >nul
rmdir /s /q build dist 2>nul
del /q "FIFA22 Mod Menu.spec" 2>nul
powershell -NoProfile -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\FIFA22 Mod Menu.lnk'); $s.TargetPath='%~dp0FIFA22 Mod Menu.exe'; $s.WorkingDirectory='%~dp0'; $s.Save()"
echo.
echo Pronto! Use o atalho "FIFA22 Mod Menu" na area de trabalho.
pause
exit /b 0
:erro
echo.
echo Deu erro ao gerar o .exe. Voce ainda pode abrir o app pelo INICIAR.bat.
pause
exit /b 1
