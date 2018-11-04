import Discord, { GuildChannel, Message, Channel, TextChannel } from 'discord.js';
import TelegramBot from 'node-telegram-bot-api'
import config from './config.json';
import { configStruct } from "./type.js";
import moment, { Moment, now } from 'moment';
import { util } from "./util/index.js";
import { Command } from './commands/index.js';
import { EventEmitter } from 'events'

moment().format();

// TODO Follow message on channel that we are interested by, not all of them

/**************Checks ************************/
let conf: configStruct = config;
let err = new EventEmitter;
err.on('error', value => {
    console.error(value);
    process.exit();
});

// Bots initialisation
// Discord
let discordBot = new Discord.Client;
util.checkDiscordBot(discordBot).catch(e => {
    err.emit('error', e)
});;

// Telegram
const telegramBot = new TelegramBot(conf.telegramBotToken);
util.checkTelegramBot(telegramBot).catch(e => {
    err.emit('error', e)
});;


util.isConfigOk(discordBot).catch(e => {
    err.emit('error', e)
});

/**************End Checks ************************/

discordBot.login(config.discordBotToken)
discordBot.on('error', console.error);

// Var init
let dates: { [date: string]: Moment } = {};
let discords = conf.discords;

// For every Discords with here activated, we add a date elemnt
discords.forEach(discord => {
    if (discord.here) {
        dates[discord.channelId] = moment().subtract(7, 'days')
    }
});

// For every message on the discord
discordBot.on('message', (message: Message) => {

    //Command to the bot
    if (message.content.indexOf(discordBot.user.id) !== -1) {
        const commandes = new Command(message)
        commandes.sort()
    }

    let discords = conf.discords;
    discords.forEach(element => {

        if (message.channel.id === element.channelId) {
            // Is the message coming from the bot ?
            if (!util.isMessageAlreadyPosted(message.content)) {
                telegramBot.sendMessage(conf.telegramChatID, element.name + ", " + message.author.username + " à " + moment().format("h:mm") + " : " + message.content);

                if (element.here) {
                    // Is any here have already send in the last conf.delayHereControl minutes ?
                    let testDate = moment(dates[element.channelId]);
                    if (testDate.add(conf.delayHereControl, 'minutes').isBefore(moment())) {
                        if (!util.isHerePresent(message.content)) {
                            message.channel.send("@here : Nouveau 100 détecté !");
                        }
                        dates[element.channelId] = moment();
                    }
                }

                // We are going to sent this message to all the neighbords that have asked for it.
                discords.forEach(discord => {
                    if (discord.neighboards) {
                        let neighbords = discord.neighboards_name;
                        neighbords.forEach(neihboard => {
                            if (neihboard === element.name) {
                                const channel = discordBot.channels.get(discord.channelId)! as TextChannel;
                                if (channel !== undefined) {
                                    channel.send(element.name + ", " + message.author.username + " à " + moment().format("h:mm") + " : " + message.content)
                                }
                            }
                        })
                    }
                })
            }
        }
    });
})


