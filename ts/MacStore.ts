export default class MacStore {
  private static _instance: MacStore;
  constructor() {
    if (MacStore._instance) {
      return MacStore._instance;
    }
    MacStore._instance = this;
    this.map = new Map();
  }
  public has(mac: string): boolean {
    return this.map.has(mac);
  }
  public getCommands(mac: string): string[] {
    let item = this.map.get(mac);
    if (item) {
      return item.getCommands();
    } else {
      return [];
    }
  }
  public getLogs(mac: string): string[] {
    let item = this.map.get(mac);
    if (item) {
      return item.getLogs();
    } else {
      return [];
    }
  }
  public setLog(mac: string, log: string): void {
    let item = this.map.get(mac);
    if (item) {
      item.setLog(log);
    }
  }
  public createMacStoreItem(mac: string): void {
    this.map.set(mac, new MacStoreItem());
  }
  public deleteMacStoreItem(mac: string): void {
    this.map.delete(mac);
  }
  public sendCommand(mac: string, command: string): void {
    let item = this.map.get(mac);
    if (item) {
      item.setCommand(command);
    }
  }
  public getKeys() {
    return this.map.keys();
  }
  private map: Map<string, MacStoreItem>;
}

class MacStoreItem {
  constructor() {
    this.commands = [];
    this.logs = [];
  }
  public getCommands(): string[] {
    let commands = this.commands;
    this.commands = [];
    return commands;
  }
  public getLogs(): string[] {
    return this.logs;
  }
  public setLog(log: string): void {
    this.logs.unshift(log);
    if (this.logs.length > 15) {
      this.logs.length = 15;
    }
  }
  public setCommand(command: string): void {
    this.commands.unshift(command);
    if (this.commands.length > 15) {
      this.commands.length = 15;
    }
  }
  private commands: string[];
  private logs: string[];
}
