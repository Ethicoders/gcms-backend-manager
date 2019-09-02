import { ipcRenderer, IpcRendererEvent } from 'electron';

type EventCallback = (event: IpcRendererEvent, ...args: any[]) => void;

export default class Bus {
  public on(name: string, callback: EventCallback) {
    ipcRenderer.on(name, callback);
  }

  public once(name: string, callback: EventCallback) {
    ipcRenderer.once(name, callback);
  }

  public send(name: string, ...args: any[]) {
    ipcRenderer.send(name, args);
  }
}
