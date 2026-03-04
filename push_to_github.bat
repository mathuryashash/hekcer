@echo off
cd /d "d:\vscode\heckerhaibhai"
echo === Step 1: Git Init ===
git init
echo === Step 2: Check Remotes ===
git remote -v
echo === Step 3: Add Remote (if needed) ===
git remote remove origin 2>nul
git remote add origin https://github.com/mathuryashash/hekcer.git
echo === Step 4: Stage all files ===
git add -A
echo === Step 5: Create commit ===
git commit -m "feat: add The Vault app with FastAPI backend, Next.js frontend, password verification UI" 2>&1
echo === Step 6: Push to main branch ===
git branch -M main
git push -u origin main --force 2>&1
echo === Step 7: Create feature branch for PR ===
git checkout -b feature/vault-complete 2>&1
git push origin feature/vault-complete --force 2>&1
echo === DONE: PR branch pushed. Now open a PR on GitHub manually. ===
pause
