import { Message, Client } from "discord.js";
import { DiscordStruct } from "../types/type";
import config from "./../config.json";
import { configEnum } from "../types/enum";
import { Checks } from "../checks";
import * as fs from "fs";
import * as path from "path";
export class UpdateConfig {
    message: Message;
    newvalue: string | undefined;
    botClient: Client;

    constructor(message: Message, botClient: Client) {
      this.message = message;
      this.botClient = botClient;
    }

    hereLocal()
    {
        let configDiscord =  this.findDiscord();
        config.delayHereControl = +this.newvalue!;
        fs.writeFile(
          path.join(__dirname, "../../src/config.json"),
          JSON.stringify(config),
          error => {
            console.log(error);
          }
        );
        fs.writeFile(
          path.join(__dirname, "../config.json"),
          JSON.stringify(config),
          error => {
            console.log(error);
          }
        );
    }

    findDiscord()
    {
     let discordUser : DiscordStruct;
    config.discords.forEach(discord => {
            if (
              discord.adminsIds.some(adminId => adminId === this.message.author.id)
            ) {
              discordUser = discord;
            }
          });

          return discordUser!;
    }
}