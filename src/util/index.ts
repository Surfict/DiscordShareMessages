import config from './../config.json';
import { configStruct } from '../type.js';
import { Client, Message} from 'discord.js';

import i18next = require("i18next");




export class util {

  static isHerePresent(message: string): boolean {
    return message.indexOf("@here") !== -1;
  }

  static isMessageAlreadyPosted(message: string): boolean {
    if (message === i18next.t("fromBot.nouveau100") || message === i18next.t("fromBot.rappel") || message === i18next.t("fromBot.help") || message === i18next.t("fromBot.commandeIntrouvable")) {
      return true;
    }
    const discords = config.discords;

    for (let i = 0; i < discords.length; i++) {
      const discord = discords[i];
      if (message.indexOf(discord.name + ", ") !== -1) {
        return true;
      }
    }
    return false;
  }

  static imagesToArray(message: Message) : string[]
  {
    let files : string[] = [];
    if (message.attachments.size > 0) {
      message.attachments.forEach(attach => {
        files.push(attach.url);
      });
    }
    return files;
  }

  static async isConfigOk(discordBot: Client) {

    const conf: configStruct = config;
    //Data consistency
    const discordsNames: string[] = [];
    const discordsNeighboardsNames: string[] = [];
    const discordsChannels: string[] = [];
    conf.discords.forEach(discord => {
      discordsNames.push(discord.name);
      discordsChannels.push(discord.channelId);
      discord.neighboards_name.forEach(neighoard => {
        discordsNeighboardsNames.push(neighoard);
      });
    })


    if (!discordsNeighboardsNames.every(r => discordsNames.indexOf(r) !== -1)) {
      throw ("There is no data consistency between the discords and theirs neighboards. Please check the config file.")
    }

    // Are the channel id provided found by the bot ? (is the bot on the Discord server, and is the ID provided good ?)
    await discordBot.login(config.discordBotToken);
    discordsChannels.forEach(channel => {
      const chan = discordBot.channels.get(channel)
      if (!chan) {
        throw ("The channel " + channel + " is not find by the discord bot. Please check your configuration file.");
      }
    });

    //Are the Discord ids provided found by the bot ?
    conf.discords.forEach(discord => {
      const disc = discordBot.guilds.get(discord.discordId)
      if (!disc) {
        throw ("The discord " + discord.discordId + " is not find by the discord bot. Please check your configuration file.");
      }
    })
  }

  static async checkTelegramBot(telegramBot: any) {
    try {
      await telegramBot.sendMessage(config.telegramChatID, "Le scanner des 4 vient d'être lancé :)\nNous avons actuellement " + config.discords.length + " discords en collaboration !");
    }
    catch (error) {
      throw ("Telegram bot didn't start. Please verify your tokenBot Id or your chat id in the config file. Message error : " + error)
    }
  }

  static async checkDiscordBot(discordBot: any) {
    try {
      await discordBot.login(config.discordBotToken)
    }
    catch (error) {
      throw ("Discord bot didn't start. Please verify your token in the config file. Message error : " + error)
    }
  }
}

