/**
 * VidyaFloww Desktop — Electron Preload Script
 *
 * The preload script runs in a renderer process before web page content loads.
 * It exposes a secure API surface from the main process to the renderer.
 *
 * TODO: Expose contextBridge APIs as features are implemented.
 */

import { contextBridge } from 'electron';

// Expose safe Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,

  // TODO: Add IPC communication helpers as features are implemented
  // Example: send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  // Example: on: (channel: string, callback: Function) => ipcRenderer.on(channel, callback),
});

export {};
