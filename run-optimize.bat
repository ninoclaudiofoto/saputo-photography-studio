@echo off
color 0b
setlocal ENABLEDELAYEDEXPANSION

set "PROJECT_DIR=%~dp0"
pushd "%PROJECT_DIR%" >NUL

call :check_node || goto end

echo.
echo Running optimize.js...
node optimize.js
if errorlevel 1 (
    echo.
    echo [ERROR] optimize.js non e' andato a buon fine.
    goto done
)

echo.
echo [OK] optimize.js completato con successo.
call :maybe_git_push

:done
echo.
pause

:end
popd >NUL
endlocal
exit /b

:check_node
where node >NUL 2>&1 || (
    echo Node.js non trovato. Installa manualmente Node LTS da https://nodejs.org/ e riprova.
    exit /b 1
)
echo Node.js trovato.
exit /b 0

:maybe_git_push
set "response="
set /p "response=Vuoi eseguire git add/commit/push? (y/N): "
if /I not "%response%"=="y" (
    echo Operazione git ignorata.
    exit /b 0
)
call :git_push
exit /b 0

:git_push
for /f %%b in ('git rev-parse --abbrev-ref HEAD 2^>NUL') do set "CURRENT_BRANCH=%%b"
if "%CURRENT_BRANCH%"=="" (
    echo [WARN] Non riesco a determinare il branch corrente. Salto git push.
    exit /b 0
)

git status --porcelain >NUL 2>&1 || (
    echo [WARN] git status non disponibile. Salto git push.
    exit /b 0
)

git diff --quiet && git diff --cached --quiet && (
    echo Nessuna modifica rilevata, git push non necessario.
    exit /b 0
)

echo.
echo Eseguo git add -A ...
git add -A || (
    echo [ERROR] git add fallito.
    exit /b 1
)

git diff --cached --quiet && (
    echo Nessuna modifica da committare dopo git add. Salto git push.
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
