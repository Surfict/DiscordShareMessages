// Dependancies
import Discord, { GuildChannel, Message, Channel, TextChannel } from 'discord.js';
const TelegramBot = require('node-telegram-bot-api');
import config from './config.json';
import { configStruct } from "./type.js";
import moment, { Moment } from 'moment';
import { util } from "./util/index.js";

moment().format();

//TODO Follow message on channel that we are interested by, not all of them

// Bots initialisation
const discordBot = new Discord.Client;
const telegramBot = new TelegramBot(config.telegramToken);


//Var init
let dates: { [date: string]: Moment } = {};
let configWithStruct: configStruct = config;
let discords = configWithStruct.discords;

//Is the config well ?


//For every Discords with here activated, we add a date elemnt
discords.forEach(discord => {
    if (discord.here) {
        dates[discord.channelId] = moment().subtract(7, 'days')
    }
});

// Connexion
discordBot.login(config.discordToken);

//For every message on the discord
discordBot.on('message', (message: Message) => {

    //For every Discords
    let discords = config.discords;
    discords.forEach(element => {

        if (message.channel.id === element.channelId) {

            //Is the message coming from the bot ?
            if (!util.isMessageAlreadyPosted(message.content)) {

                telegramBot.sendMessage(config.telegramChatID, element.name + ": " + message.content);

                if (element.here) {
                    //Is any here have already send in the last config.delayHereControl minutes ?
                    let testDate = moment(dates[element.channelId]);
                    if (testDate.add(config.delayHereControl, 'minutes').isBefore(moment())) {

                        //Let's check if there is no already a @here in the message
                        if (!util.isHerePresent(message.content)) {

                            //Send a @here on the channel
                            message.channel.send("@here : Nouveau 100 détecté !");
                        }
                        //Let's save the date
                        dates[element.channelId] = moment();
                    }
                }

                //We are going to sent this message to all the neighbords that have asked for it.
                discords.forEach(discord => {
                    if (discord.neighboards) {
                        let neighbords = discord.neighboards_name;
                        neighbords.forEach(neihboard => {
                            if (neihboard === element.name) {
                                const channel = discordBot.channels.get(discord.channelId)! as TextChannel;
                                if (channel !== undefined) {
                                    channel.send(element.name + " : " + message.content)
                                }
                            }
                        })
                    }
                })
            }
        }
    });
})


