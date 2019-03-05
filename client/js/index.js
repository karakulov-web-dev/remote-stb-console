var RemoteStbConsole = /** @class */ (function() {
  function RemoteStbConsole() {
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
  RemoteStbConsole.prototype.log = function(text) {
    try {
      setLog(this.mac, text);
    } catch (e) {
      console.log(e);
      setLog(this.mac, "log error");
    }
  };
  return RemoteStbConsole;
})();
var RemoteControlService = /** @class */ (function() {
  function RemoteControlService(remoteStbConsole) {
    this.remoteStbConsole = remoteStbConsole;
  }
  RemoteControlService.prototype.start = function() {
    this.infinityChecks();
  };
  RemoteControlService.prototype.infinityChecks = function() {
    var _this = this;
    this.check();
    setTimeout(function() {
      _this.infinityChecks();
    }, 5000);
  };
  RemoteControlService.prototype.check = function() {
    var _this = this;
    checkRemoteControl(this.remoteStbConsole.mac, function(result) {
      if (result.status) {
        _this.openConnection();
      } else {
        _this.closeConnection();
      }
    });
  };
  RemoteControlService.prototype.openConnection = function() {
    this.remoteStbConsole.remoteControlConnection.connect();
  };
  RemoteControlService.prototype.closeConnection = function() {
    this.remoteStbConsole.remoteControlConnection.disconnect();
  };
  return RemoteControlService;
})();
var RemoteControlConnection = /** @class */ (function() {
  function RemoteControlConnection(remoteStbConsole) {
    this.remoteStbConsole = remoteStbConsole;
    this.interval = undefined;
  }
  RemoteControlConnection.prototype.connect = function() {
    var _this = this;
    clearInterval(this.interval);
    this.interval = setInterval(function() {
      _this.getCommands();
    }, 1000);
  };
  RemoteControlConnection.prototype.disconnect = function() {
    clearInterval(this.interval);
  };
  RemoteControlConnection.prototype.getCommands = function() {
    var _this = this;
    getCommands(this.remoteStbConsole.mac, function(result) {
      _this.remoteStbConsole.commandRunner.run(result.result);
    });
  };
  return RemoteControlConnection;
})();
var CommandRunner = /** @class */ (function() {
  function CommandRunner(remoteStbConsole) {
    this.remoteStbConsole = remoteStbConsole;
  }
  CommandRunner.prototype.run = function(commands) {
    this.setCommands(commands)
      .createFunctions()
      .runFunctions();
  };
  CommandRunner.prototype.setCommands = function(commands) {
    this.commands = commands;
    return this;
  };
  CommandRunner.prototype.createFunctions = function() {
    this.functions = this.commands
      .map(function(command) {
        try {
          return new Function("console", command);
        } catch (e) {
          return undefined;
        }
      })
      .filter(function(functionItem) {
        if (functionItem) {
          return functionItem;
        }
      });
    return this;
  };
  CommandRunner.prototype.runFunctions = function() {
    var _this = this;
    this.functions.forEach(function(functionItem) {
      try {
        functionItem(_this.remoteStbConsole);
      } catch (e) {
        _this.remoteStbConsole.log("runFunction error");
        console.log(e);
      }
    });
    return this;
  };
  return CommandRunner;
})();
function checkRemoteControl(mac, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "http://45.76.94.35:3000/check-remote-control?mac=" + mac,
    true
  );
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        cb(result);
      }
    }
  };
}
function getCommands(mac, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", "http://45.76.94.35:3000/get-commands?mac=" + mac, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        cb(result);
      }
    }
  };
}
function setLog(mac, log) {
  var xhr = new XMLHttpRequest();
  xhr.open("post", "http://45.76.94.35:3000/set-logs?mac=" + mac, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      log: log
    })
  );
}
window.remoteStbConsole = new RemoteStbConsole();
