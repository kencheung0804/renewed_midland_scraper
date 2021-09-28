import {ipcRenderer, IpcRenderer} from "electron";

declare global {
    interface Window {
        ipcRenderer: IpcRenderer;
    }
}

window.ipcRenderer = ipcRenderer
declare global {
  const MAIN_WINDOW_WEBPACK_ENTRY: string;
}