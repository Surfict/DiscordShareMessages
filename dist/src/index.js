"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependancies
const discord_js_1 = __importDefault(require("discord.js"));
const TelegramBot = require('node-telegram-bot-api');
const config_json_1 = __importDefault(require("./config.json"));
const moment_1 = __importDefault(require("moment"));
const index_js_1 = require("../util/index.js");
moment_1.default().format();
//TODO Follow message on channel that we are interested by, not all of them
// Bots initialisation
const discordBot = new discord_js_1.default.Client;
const telegramBot = new TelegramBot(config_json_1.default.telegramToken);
let dates = {};
let configWithStruct = config_json_1.default;
let discords = configWithStruct.discords;
//For every Discords with here activated, we add a date elemnt
discords.forEach(discord => {
    if (discord.here) {
        dates[discord.channel] = moment_1.default().subtract(7, 'days');
    }
});
// Connexion
discordBot.login(config_json_1.default.discordToken);
//For every message on the discord
discordBot.on('message', function (message) {
    //For every Discords
    let discords = config_json_1.default.discords;
    discords.forEach(element => {
        if (message.channel.name === element.channel) {
            //Is the message coming from the bot ?
            if (!index_js_1.util.isMessageAlreadyPosted(message.content)) {
                telegramBot.sendMessage(config_json_1.default.telegramChatID, element.name + ": " + message.content);
                if (element.here) {
                    //Is any here have already send in the last config.delayHereControl minutes ?
                    let testDate = moment_1.default(dates[element.channel]);
                    if (testDate.add(config_json_1.default.delayHereControl, 'minutes').isBefore(moment_1.default())) {
                        //Let's check if there is no already a @here in the message
                        if (!index_js_1.util.isHerePresent(message.content)) {
                            //Send a @here on the channel
                            message.channel.send("@here : Nouveau 100 détecté !");
                        }
                        //Let's save the date
                        dates[element.channel] = moment_1.default();
                    }
                }
                //We are going to sent this message to all the neighbords that have asked for it.
                discords.forEach(discord => {
                    if (discord.neighboards) {
                        let neighbords = discord.neighboards_name;
                        neighbords.forEach(neihboard => {
                            if (neihboard === element.name) {
                                const channel = discordBot.channels.find('name', discord.channel);
                                channel.send(element.name + " : " + message.content);
                            }
                        });
                    }
                });
            }
        }
    });
});
