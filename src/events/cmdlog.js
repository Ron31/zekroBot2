const Main = require('../main')
const Logger = require('../util/logger')
const client = Main.client
const Mysql = Main.mysql
const Statics = require('../util/statics')
const Embeds = require('../util/embeds')
const { RichEmbed } = require('discord.js')


var logchanid = {}

exports.reset = (guild) => {
    logchanid[guild.id] = null
}

function getlogchan(guild, cb) {
    if (!logchanid[guild.id]) {
        Mysql.query(`SELECT * FROM guilds WHERE guild = '${guild.id}'`, (err, res) => {
            if (!err && res) {
                if (res.length > 0)
                    logchanid[guild.id] = res[0].cmdlogchan ? res[0].cmdlogchan : 'unset'
                else
                    logchanid[guild.id] = 'unset'
            }
            cb()
        })
    } else
        cb()
}

Main.cmd.event.on('commandExecuted', msg => {
    let guild = msg.member.guild
    
    getlogchan(guild, () => {
        let logchan = guild.channels.find(c => c.id == logchanid[guild.id])
        if (logchan) {
            logchan.send('', new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.avatarURL)
                .setDescription('```' + msg.content + '```')
                .setFooter('#' + msg.channel.name)
                .setTimestamp(msg.createdAt)
                .setColor(Statics.COLORS.main)
            )
        }
    })
})