import config from './../config.json';
import { configStruct } from '../type.js';
import { fail } from 'assert';
import { exists } from 'fs';
import { TextChannel } from 'discord.js';
const TelegramBot = require('node-telegram-bot-api');

export class util {

  static isHerePresent(message: string): boolean {
    return message.indexOf("@here") !== -1;
  }

  static isMessageAlreadyPosted(message: string): boolean {
    if (message === "@here : Nouveau 100 détecté !") return true;
    const discords = config.discords;

    for (let i = 0; i < discords.length; i++) {
      const discord = discords[i];
      if (message.indexOf(discord.name + " : ") !== -1) {
        return true;
      }
    }
    return false;
  }

  static async isConfigOk(discordBot: any){
    
    let conf: configStruct = config;
    //Data consistency
    let discordsNames : String[]  = [];
    let discordsNeighboardsNames : String[]  = [];
    let discordsChannels: String[] = [];
    conf.discords.forEach(discord => {
      discordsNames.push(discord.name);
      discordsChannels.push(discord.channelId);
      discord.neighboards_name.forEach(neighoard => {
        discordsNeighboardsNames.push(neighoard);
      });
    })

    if (!discordsNeighboardsNames.every(r =>  discordsNames.indexOf(r) !== -1))
    {
      console.error("There is no data consistency between the discords and theirs neighboards. Please check the config file.");
      process.exit();
    }

    // Are the channel id provided found by the bot ? (is the bot on the Discord server, and is the ID provided good ?)
    await discordBot.login(config.discordBotToken);
    discordsChannels.forEach(channel =>  {
      let chan = discordBot.channels.get(channel)
        if (chan === undefined) {
          console.error("The channel " + channel + " is not find by the discord bot. Please check your configuration file.");
          process.exit();
        }
    });
  }

  static async checkTelegramBot(telegramBot: any) {
    try {
      await telegramBot.sendMessage(config.telegramChatID, "Le scanner des 4 vient d'être lancé :)");
    }
    catch (error) {
      console.error("Telegram bot didn't start. Please verify your tokenBot Id or your chat id in the config file. Message error : " + error)
      process.exit();
    }
  }

  static async checkDiscordBot(discordBot: any) {
    try {
      await discordBot.login(config.discordBotToken)
    }
    catch (error) {
      console.error("Discord bot didn't start. Please verify your token in the config file. Message error : " + error)
      process.exit();
    }
  }
}

