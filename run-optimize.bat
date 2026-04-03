@echo off
setlocal ENABLEDELAYEDEXPANSION

set "PROJECT_DIR=%~dp0"
pushd "%PROJECT_DIR%" >NUL

call :ensure_node
if errorlevel 1 goto end

echo.
echo Running optimize.js...
node optimize.js
if errorlevel 1 (
    echo.
    echo [ERROR] Impossibile completare optimize.js
    goto end
)

echo.
echo [OK] optimize.js completato con successo.
goto end

:ensure_node
where node >NUL 2>&1 && (
    echo Node.js trovato.
    exit /b 0
)

echo Node.js non trovato. Provo a installare la versione LTS...

where winget >NUL 2>&1 && (
    winget install --id OpenJS.NodeJS.LTS -e --source winget --silent
    goto check_node
)

where choco >NUL 2>&1 && (
    choco install nodejs-lts -y
    goto check_node
)

echo Ne winget ne Chocolatey sono disponibili. Installa Node.js manualmente da https://nodejs.org/ e riprova.
exit /b 1

:check_node
where node >NUL 2>&1 && (
    echo Node.js installato correttamente.
    exit /b 0
)

echo Sembra che Node.js non sia ancora disponibile. Chiudi e riapri il terminale, quindi rilancia lo script.
exit /b 1

:end
popd >NUL
endlocal
