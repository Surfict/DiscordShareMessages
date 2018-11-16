import Discord, { Message, TextChannel, DMChannel } from "discord.js";
import TelegramBot from "node-telegram-bot-api";
import config from "./config.json";
import { ConfigStruct, DiscordStruct } from "./types/type.js";
import moment, { Moment, now } from "moment";
import { Util } from "./util/index.js";
import { Command } from "./commands/index.js";
import { EventEmitter } from "events";
import i18next from "i18next";
import { translation } from "./i18n/index.js";

i18next.init({
  lng: "fr_FR",
  debug: false,
  resources: {
    fr_FR: {
      translation: {
        ...translation
      }
    }
  }
});

moment().format();

// TODO Follow message on channel that we are interested by, not all of them

/**************Checks ************************/
let conf: ConfigStruct = config;
let err = new EventEmitter();
err.on("error", value => {
  console.error(value);
  process.exit();
});

// Bots initialisation
// Discord
let discordBot = new Discord.Client();
Util.checkDiscordBot(discordBot).catch(e => {
  err.emit("error", e);
});

// Telegram
const telegramBot = new TelegramBot(conf.telegramBotToken);
Util.checkTelegramBot(telegramBot).catch(e => {
  err.emit("error", e);
});

Util.isConfigOk(discordBot).catch(e => {
  err.emit("error", e);
});

/**************End Checks ************************/

discordBot.login(config.discordBotToken);
discordBot.on("error", console.error);

// Var init
let dates: { [date: string]: Moment } = {};
let discords = conf.discords;

// For every Discords with here activated, we add a date elemnt
discords.forEach(discord => {
  if (discord.here.own || discord.here.everyTime) {
    dates[discord.channelId] = moment().subtract(7, "days");
  }
});

function sendHere(
  element: DiscordStruct,
  message: Message,
  channel?: TextChannel
) {
  // Is any here have already send in the last conf.delayHereControl minutes ?
  let testDate = moment(dates[element.channelId]);
  if (testDate.add(conf.delayHereControl, "minutes").isBefore(moment())) {
    if (!Util.isHerePresent(message.content)) {
      if (channel) {
        channel.send("@here : Nouveau 100 détecté !");
      } else {
        message.channel.send("@here : Nouveau 100 détecté !");
      }
    }
    dates[element.channelId] = moment();
  }
}

// For every message on the discord
discordBot.on("message", (message: Message) => {
  if (!Util.isFromTheBot(message.author.id, discordBot.user.id)) {
    //If the message is private
    if (message.channel instanceof DMChannel) {
      const commandes = new Command(message);
      commandes.sort("pm");
    } else {
      //Command to the bot
      if (message.content.indexOf(discordBot.user.id) !== -1) {
        const commandes = new Command(message);
        commandes.sort("channel");
      } else {
        let discords = conf.discords;
        let files = Util.imagesToArray(message);
        discords.forEach(element => {
          if (message.channel.id === element.channelId) {
            // Is the message coming from the bot ?

            telegramBot.sendMessage(
              conf.telegramChatID,
              element.name +
                ", " +
                message.author.username +
                " à " +
                moment().format("h:mm") +
                " : " +
                message.content
            );

            if (files.length) {
              files.forEach(file => {
                telegramBot.sendPhoto(conf.telegramChatID, file);
              });
            }

            if (element.here.own) {
              sendHere(element, message);
            }

            // We are going to sent this message to all the neighbords that have asked for it.
            discords.forEach(discord => {
              if (discord.neighboards) {
                let neighbords = discord.neighboards_name;
                neighbords.forEach(neihboard => {
                  if (neihboard === element.name) {
                    const channel = discordBot.channels.get(
                      discord.channelId
                    )! as TextChannel;
                    if (channel !== undefined) {
                      if (discord.here.everyTime) {
                        sendHere(discord, message, channel);
                      }
                      channel.send(
                        element.name +
                          ", " +
                          message.author.username +
                          " à " +
                          moment().format("h:mm") +
                          " : " +
                          message.content,
                        { files: files }
                      );
                    }
                  }
                });
              }
            });
          }
        });
      }
    }
  }
});
