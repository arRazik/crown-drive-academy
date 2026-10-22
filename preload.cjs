// جسر آمن بين Electron والواجهة (preload بصيغة CommonJS لأن النافذة في وضع sandbox)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  getVersion: () => ipcRenderer.invoke('app:version'),
});
