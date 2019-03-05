"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var MacStore_1 = __importDefault(require("./MacStore"));
var app = express_1["default"]();
app.use(express_1["default"].json());
app.get("/", function (req, res) {
    res.send("remote-stb-console1");
});
app.use("/client", express_1["default"].static(__dirname + "/client"));
// client api start
app.get("/check-remote-control", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined") {
        if (macStore.has(req.query.mac)) {
            status = true;
        }
    }
    res.send(JSON.stringify({ status: status }));
});
app.get("/get-commands", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined") {
        if (macStore.has(req.query.mac)) {
            status = true;
        }
        var result = macStore.getCommands(req.query.mac);
    }
    res.send(JSON.stringify({ status: status, result: result }));
});
app.post("/set-logs", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined" &&
        typeof req.body.log !== "undefined") {
        if (macStore.has(req.query.mac)) {
            status = true;
        }
    }
    macStore.setLog(req.query.mac, req.body.log);
    res.send(JSON.stringify({ status: status }));
});
// admin api start
// checkAdminPassword
app.use(function (req, res, next) {
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
app.post("/create-remote-control", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined") {
        status = true;
    }
    macStore.createMacStoreItem(req.query.mac);
    res.send(JSON.stringify({ status: status }));
});
// deleteremoteControl
app.post("/delete-remote-control", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined") {
        status = true;
    }
    macStore.deleteMacStoreItem(req.query.mac);
    res.send(JSON.stringify({ status: status }));
});
// sendCommand
app.post("/send-command", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined") {
        if (typeof req.body.command === "string") {
            status = true;
        }
    }
    if (status) {
        macStore.sendCommand(req.query.mac, req.body.command);
    }
    res.send(JSON.stringify({ status: status }));
});
// getLogs
app.post("/get-logs", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    if (typeof req.query.mac !== "undefined") {
        if (macStore.has(req.query.mac)) {
            status = true;
        }
        var result = macStore.getLogs(req.query.mac);
    }
    res.send(JSON.stringify({ status: status, result: result }));
});
//getAllMac
app.post("/get-all-mac", function (req, res) {
    var status = false;
    var macStore = new MacStore_1["default"]();
    var result = __spread(macStore.getKeys());
    if (result.length > 0) {
        status = true;
    }
    res.send(JSON.stringify({ status: status, result: result }));
});
app.listen(3000);
console.log("remote-stb-console started on port 3000");
