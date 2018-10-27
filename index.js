// Dependancies
const Discord = require('discord.js');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json')
const moment = require('moment')
const util = require('./util/index')
moment().format();

//TODO Follow message on channel that we are interested by, not all of them

// Bots initialisation
const discordBot = new Discord.Client;
const telegramBot = new TelegramBot(config.telegramToken);


const discords = config.discords;

let dates = {};
//For every Discords with here activated, we add a date elemnt
discords.forEach(element => {
    if (element.here) {
        dates[element.channel] = moment().subtract(7, 'days')
    }
});

// Connexion
discordBot.login(config.discordToken);

//For every message on the discord
discordBot.on('message', function (message) {

    //For every Discords
    let discords = config.discords;
    discords.forEach(element => {

        if (message.channel.name === element.channel) {

            //Is the message coming from the bot ? 
            if (!util.isMessageAlreadyPosted(message.content)) {

                telegramBot.sendMessage(config.telegramChatID, element.Name + ": " + message.content);

                if (element.here) {
                    //Is any here have already send in the last config.delayHereControl minutes ? 
                    let testDate = moment(dates[element.channel]);
                    if (testDate.add(config.delayHereControl, 'minutes').isBefore(moment())) {

                        //Let's check if there is no already a @here in the message
                        if (!util.isHerePresent(message.content)) {

                            //Send a @here on the channel
                            message.channel.send("@here : Nouveau 100 détecté !");
                        }
                        //Let's save the date
                        dates[element.channel] = moment();
                    }
                }

                //We are going to sent this message to all the neighbords that have asked for it.
                discords.forEach(discord => {
                    if (discord.neighbords) {
                        let neighbords = discord.neighboards_name;
                        neighbords.forEach(neihboard => {
                            if (neihboard === element.Name) {
                                const channel = discordBot.channels.find('name', discord.channel)
                                channel.send(element.Name + " : " + message.content)
                            }
                        })
                    }
                })
            }
        }
    });
})


