import { Message } from "discord.js";
import { DiscordStruct } from "../types/type";
import { configEnum } from "../types/enum";
import { Checks } from "../checks";

export class UpdateConfig {
    message: Message;
    discord: DiscordStruct | undefined;

    constructor(message: Message) {
      this.message = message;
      this.discord = undefined; // config.discords.find( discord => discord.discordId === this.message.guild.id);
    }

    


}