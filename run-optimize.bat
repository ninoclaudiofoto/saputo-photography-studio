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
    goto pause
)

echo.
echo [OK] optimize.js completato con successo.
call :maybe_git_push
goto pause

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

:maybe_git_push
set "response="
set /p "response=Vuoi eseguire git add/commit/push? (y/N): "
if /I not "%response%"=="y" (
    echo Operazione git ignorata.
    exit /b 0
)
call :git_push
if errorlevel 1 (
    echo [WARN] Operazioni git non completate.
) else (
    echo Git push completato correttamente.
)
exit /b 0

:git_push
for /f %%b in ('git rev-parse --abbrev-ref HEAD 2^>NUL') do set "CURRENT_BRANCH=%%b"
if "%CURRENT_BRANCH%"=="" (
    echo [ERROR] Non sembra un repo Git o non riesco a leggere il branch corrente.
    exit /b 1
)

git status --porcelain >NUL 2>&1 || (
    echo [ERROR] git status non disponibile.
    exit /b 1
)

echo.
echo Eseguo git add -A ...
git add -A || (
    echo [ERROR] git add fallito.
    exit /b 1
)

git diff --cached --quiet && (
    echo Nessuna modifica da committare. Salto git push.
    exit /b 0
)

set "commit_msg=chore: update media"
echo Commit: %commit_msg%
git commit -m "%commit_msg%" || (
    echo [ERROR] git commit fallito.
    exit /b 1
)

echo Push su %CURRENT_BRANCH% ...
git push origin %CURRENT_BRANCH% || (
    echo [ERROR] git push fallito.
    exit /b 1
)

echo Git push completato con successo.
exit /b 0

:pause
echo.
pause
goto end

:end
popd >NUL
endlocal
