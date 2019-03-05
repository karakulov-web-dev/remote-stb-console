interface Stb {
  RDir(param: string): string;
}

interface HttpCallbackFunction<T> {
  (result: T): void;
}
interface HTTPRequestSimpleResult {
  status: boolean;
}

interface HTTPRequestResultArrString extends HTTPRequestSimpleResult {
  result: string[];
}

declare var stb: Stb;

class RemoteStbConsole {
  constructor() {
    try {
      this.mac = stb.RDir("MACAddress");
    } catch (e) {
      console.log(e);
      this.mac = "test";
    }
    this.commandRunner = new CommandRunner(this);
    this.remoteControlConnection = new RemoteControlConnection(this);
    this.remoteControlService = new RemoteControlService(this);
    this.remoteControlService.start();
  }
  public mac: string;
  public remoteControlService: RemoteControlService;
  public remoteControlConnection: RemoteControlConnection;
  public commandRunner: CommandRunner;

  public log(text: string): void {
    try {
      setLog(this.mac, text);
    } catch (e) {
      console.log(e);
      setLog(this.mac, "log error");
    }
  }
}

class RemoteControlService {
  constructor(private remoteStbConsole: RemoteStbConsole) {}
  public start(): void {
    this.infinityChecks();
  }
  private infinityChecks(): void {
    this.check();
    setTimeout(() => {
      this.infinityChecks();
    }, 5000);
  }
  private check(): void {
    checkRemoteControl(this.remoteStbConsole.mac, result => {
      if (result.status) {
        this.openConnection();
      } else {
        this.closeConnection();
      }
    });
  }
  private openConnection(): void {
    this.remoteStbConsole.remoteControlConnection.connect();
  }
  private closeConnection(): void {
    this.remoteStbConsole.remoteControlConnection.disconnect();
  }
}

class RemoteControlConnection {
  constructor(private remoteStbConsole: RemoteStbConsole) {}
  public connect(): void {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.getCommands();
    }, 1000) as any;
  }
  public disconnect(): void {
    clearInterval(this.interval);
  }
  private getCommands() {
    getCommands(this.remoteStbConsole.mac, result => {
      this.remoteStbConsole.commandRunner.run(result.result);
    });
  }
  private interval: number = undefined;
}

class CommandRunner {
  constructor(private remoteStbConsole: RemoteStbConsole) {}
  run(commands: string[]): void {
    this.setCommands(commands)
      .createFunctions()
      .runFunctions();
  }
  setCommands(commands: string[]): CommandRunner {
    this.commands = commands;
    return this;
  }
  createFunctions(): CommandRunner {
    this.functions = this.commands
      .map(command => {
        try {
          return new Function("console", command);
        } catch (e) {
          return undefined;
        }
      })
      .filter(functionItem => {
        if (functionItem) {
          return functionItem;
        }
      });
    return this;
  }
  runFunctions(): CommandRunner {
    this.functions.forEach(functionItem => {
      try {
        functionItem(this.remoteStbConsole);
      } catch (e) {
        this.remoteStbConsole.log("runFunction error");
        console.log(e);
      }
    });
    return this;
  }
  private functions: Function[];
  private commands: string[];
}

function checkRemoteControl(
  mac: string,
  cb: HttpCallbackFunction<HTTPRequestSimpleResult>
): void {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    `http://45.76.94.35:3000/check-remote-control?mac=${mac}`,
    true
  );
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let result: HTTPRequestSimpleResult = JSON.parse(xhr.responseText);
        cb(result);
      }
    }
  };
}

function getCommands(
  mac: string,
  cb: HttpCallbackFunction<HTTPRequestResultArrString>
): void {
  var xhr = new XMLHttpRequest();
  xhr.open("get", `http://45.76.94.35:3000/get-commands?mac=${mac}`, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let result: HTTPRequestResultArrString = JSON.parse(xhr.responseText);
        cb(result);
      }
    }
  };
}

function setLog(mac: string, log: string): void {
  var xhr = new XMLHttpRequest();
  xhr.open("post", `http://45.76.94.35:3000/set-logs?mac=${mac}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      log
    })
  );
}

(<any>window).remoteStbConsole = new RemoteStbConsole();
