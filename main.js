import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import electronUpdater from 'electron-updater';

const { autoUpdater } = electronUpdater;

const APP_NAME = 'CROWN DRIVE ACADEMY';
const isDev = process.argv.includes('--dev');

// نص نافذة التحديث (عملية Electron الرئيسية لا تصلها لغة الواجهة، فالنص بلغتين معاً)
const UPDATE_DIALOG = {
  message: (version) =>
    `يتوفر إصدار جديد (${version}) وتم تنزيله.\nUne nouvelle version (${version}) est prête.`,
  restartNow: 'إعادة التشغيل الآن / Redémarrer maintenant',
  later: 'لاحقاً / Plus tard',
};
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

// هذه المنافذ يجب أن تبقى ضمن localOrigins في back/app.js وإلا يرفض CORS الطلبات
// (صفحات file:// ترسل Origin: null فلا تصلح هنا).
const DEV_URL = 'http://localhost:5173';
const PROD_PORT = 5180;
const PROD_URL = `http://localhost:${PROD_PORT}`;

const distDir = path.join(import.meta.dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, PROD_URL).pathname);
    } catch {
      res.writeHead(400);
      return res.end();
    }
    if (pathname.endsWith('/')) pathname += 'index.html';

    const filePath = path.join(distDir, path.normalize(pathname));
    if (!filePath.startsWith(distDir + path.sep)) {
      res.writeHead(403);
      return res.end();
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not found');
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PROD_PORT, '127.0.0.1', () => resolve(server));
  });
}

function createWindow(url) {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: '#ffffff',
    title: APP_NAME,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once('ready-to-show', () => {
    win.maximize();
    win.show();
  });

  const origin = new URL(url).origin;

  win.on('page-title-updated', (event) => event.preventDefault());

  win.webContents.setWindowOpenHandler(({ url: target }) => {
    if (/^https?:\/\//.test(target)) shell.openExternal(target);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, target) => {
    if (new URL(target).origin !== origin) event.preventDefault();
  });

  win.loadURL(url);
  if (isDev) win.webContents.openDevTools({ mode: 'detach' });
}

// التحديث التلقائي من إصدارات GitHub (ينزّل في الخلفية). نافذة "إعادة التشغيل" اختيارية
// حتى لا ينقطع المترشح أثناء الاختبار؛ وإن اختار "لاحقاً" يُثبَّت التحديث عند إغلاق التطبيق.
function setupAutoUpdate() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('error', (err) => console.error('auto-update:', err?.message || err));
  autoUpdater.on('update-downloaded', async (info) => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: APP_NAME,
      message: UPDATE_DIALOG.message(info.version),
      buttons: [UPDATE_DIALOG.restartNow, UPDATE_DIALOG.later],
      defaultId: 0,
      cancelId: 1,
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });

  const check = () => autoUpdater.checkForUpdates().catch(() => {});
  check();
  setInterval(check, UPDATE_CHECK_INTERVAL_MS);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);
    ipcMain.handle('app:version', () => app.getVersion());
    if (!isDev) {
      if (!fs.existsSync(path.join(distDir, 'index.html'))) {
        dialog.showErrorBox(APP_NAME, `لم يتم العثور على ملفات الواجهة في:\n${distDir}\nشغّل: npm run build`);
        return app.quit();
      }
      try {
        await startStaticServer();
      } catch {
        dialog.showErrorBox(APP_NAME, `المنفذ ${PROD_PORT} مستعمل من برنامج آخر. أغلقه ثم أعد تشغيل التطبيق.`);
        return app.quit();
      }
    }
    createWindow(isDev ? DEV_URL : PROD_URL);
    if (app.isPackaged) setupAutoUpdate();
  });

  app.on('window-all-closed', () => app.quit());
}
