require('coffeescript/register');
require('extendutils')

const { Client, RichEmbed } = require('discord.js')
const Colors = require('colors')
const fs = require('fs')
const Cloc = require('./util/cloc')
const Logger = require('../src/util/logger')
const { CmdHandler } = require('./core/cmdhandler')
const { MySql } = require('./core/mysql')
const { Config } = require('./core/config')
const { CrashCollector } = require('./util/crashCollector')

const package = require('../package.json')

exports.VERSION = package.version
exports.package = package
exports.argv = process.argv
exports.startupTime = Date.now()

Logger.debug('Debug mode enabled')

if (!fs.existsSync('tmp')){
    fs.mkdirSync('tmp');
}

// Config loader
var confHandler = new Config()
var config = confHandler.getConfig()

exports.mysql = new MySql(config.mysql)

// Client and CommandHandler setup
exports.client = new Client()
exports.config = config
exports.cmd = new CmdHandler(exports.client, config.prefix)
exports.onCrash = []


require('./events/eventregistry')
require('./core/xp')

exports.loadModLoader = () => {
    exports.modloader = require('./core/modloader')
}

new CrashCollector('./crash_logs', () => {
    exports.onCrash.forEach(f => {
        try { f() }
        catch (e) {}
    })
})

exports.client.login(config.token)