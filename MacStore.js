"use strict";
exports.__esModule = true;
var MacStore = /** @class */ (function () {
    function MacStore() {
        if (MacStore._instance) {
            return MacStore._instance;
        }
        MacStore._instance = this;
        this.map = new Map();
    }
    MacStore.prototype.has = function (mac) {
        return this.map.has(mac);
    };
    MacStore.prototype.getCommands = function (mac) {
        var item = this.map.get(mac);
        if (item) {
            return item.getCommands();
        }
        else {
            return [];
        }
    };
    MacStore.prototype.getLogs = function (mac) {
        var item = this.map.get(mac);
        if (item) {
            return item.getLogs();
        }
        else {
            return [];
        }
    };
    MacStore.prototype.setLog = function (mac, log) {
        var item = this.map.get(mac);
        if (item) {
            item.setLog(log);
        }
    };
    MacStore.prototype.createMacStoreItem = function (mac) {
        this.map.set(mac, new MacStoreItem());
    };
    MacStore.prototype.deleteMacStoreItem = function (mac) {
        this.map["delete"](mac);
    };
    MacStore.prototype.sendCommand = function (mac, command) {
        var item = this.map.get(mac);
        if (item) {
            item.setCommand(command);
        }
    };
    MacStore.prototype.getKeys = function () {
        return this.map.keys();
    };
    return MacStore;
}());
exports["default"] = MacStore;
var MacStoreItem = /** @class */ (function () {
    function MacStoreItem() {
        this.commands = [];
        this.logs = [];
    }
    MacStoreItem.prototype.getCommands = function () {
        var commands = this.commands;
        this.commands = [];
        return commands;
    };
    MacStoreItem.prototype.getLogs = function () {
        return this.logs;
    };
    MacStoreItem.prototype.setLog = function (log) {
        this.logs.unshift(log);
        if (this.logs.length > 15) {
            this.logs.length = 15;
        }
    };
    MacStoreItem.prototype.setCommand = function (command) {
        this.commands.unshift(command);
        if (this.commands.length > 15) {
            this.commands.length = 15;
        }
    };
    return MacStoreItem;
}());
