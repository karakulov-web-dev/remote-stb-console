import express from "express";
import MacStore from "./MacStore";

let app = express();
app.use(express.json());

app.get("/", function(req, res) {
  res.send("remote-stb-console1");
});

app.use("/client", express.static(__dirname + "/client"));

// client api start
app.get("/check-remote-control", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (typeof req.query.mac !== "undefined") {
    if (macStore.has(req.query.mac)) {
      status = true;
    }
  }
  res.send(JSON.stringify({ status }));
});

app.get("/get-commands", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (typeof req.query.mac !== "undefined") {
    if (macStore.has(req.query.mac)) {
      status = true;
    }
    var result = macStore.getCommands(req.query.mac);
  }
  res.send(JSON.stringify({ status, result }));
});

app.post("/set-logs", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (
    typeof req.query.mac !== "undefined" &&
    typeof req.body.log !== "undefined"
  ) {
    if (macStore.has(req.query.mac)) {
      status = true;
    }
  }
  macStore.setLog(req.query.mac, req.body.log);
  res.send(JSON.stringify({ status }));
});
// admin api start

// checkAdminPassword
app.use(function(req, res, next) {
  if (typeof req.body.password === "undefined") {
    res.send(JSON.stringify({ status: false }));
    return;
  }
  if (req.body.password !== "1234qwerty") {
    res.send(JSON.stringify({ status: false }));
    return;
  }
  next();
});

// createRemoteControl
app.post("/create-remote-control", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (typeof req.query.mac !== "undefined") {
    status = true;
  }
  macStore.createMacStoreItem(req.query.mac);
  res.send(JSON.stringify({ status }));
});

// deleteremoteControl
app.post("/delete-remote-control", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (typeof req.query.mac !== "undefined") {
    status = true;
  }
  macStore.deleteMacStoreItem(req.query.mac);
  res.send(JSON.stringify({ status }));
});

// sendCommand
app.post("/send-command", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (typeof req.query.mac !== "undefined") {
    if (typeof req.body.command === "string") {
      status = true;
    }
  }
  if (status) {
    macStore.sendCommand(req.query.mac, req.body.command);
  }
  res.send(JSON.stringify({ status }));
});

// getLogs
app.post("/get-logs", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();
  if (typeof req.query.mac !== "undefined") {
    if (macStore.has(req.query.mac)) {
      status = true;
    }
    var result = macStore.getLogs(req.query.mac);
  }
  res.send(JSON.stringify({ status, result }));
});

//getAllMac
app.post("/get-all-mac", function(req, res) {
  let status: boolean = false;
  let macStore = new MacStore();

  var result = [...macStore.getKeys()];

  if (result.length > 0) {
    status = true;
  }

  res.send(JSON.stringify({ status, result }));
});

app.listen(3000);
console.log("remote-stb-console started on port 3000");
