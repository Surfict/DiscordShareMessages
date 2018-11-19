import { Client, Message, TextChannel } from "discord.js";
import { DiscordStruct } from "../types/type";
import { configEnum } from "../types/enum";
import config from "./../config.json";
export class Checks {
  message: Message;
  discord: DiscordStruct | undefined;
  newValue: string | undefined;
  botClient: Client;

  constructor(message: Message, botClient: Client) {
    this.message = message;
    this.discord = undefined;
    this.botClient = botClient;

    // config.discords.find( discord => discord.discordId === this.message.guild.id);
  }

  checkAllUpdateCommands(newValue: string, configType: configEnum) {
    this.newValue = newValue;
    switch (configType) {
      case configEnum.hereOwn:
        return this.checkHereOwn();
      case configEnum.hereGlobal:
        return this.checkHereGlobal();
      case configEnum.neighboardActivation:
        return this.checkNeighoardActivation();
      case configEnum.neighboardListAdd:
        return this.checkNeighboardListAdd();
      case configEnum.neighboardListRemove:
        return this.checkNeighboardListRemove();
      case configEnum.channelIdUpdate:
        return this.checkChannelIdUpdate();
    }
  }

  checkHereOwn() {
    if (this.newValue !== "true" && this.newValue !== "false") {
      this.message.channel.send(
        "Impossible de changer le statut des Here en cas de nouveau message sur votre discord. Paramètre incorrect. Pour rappel, la commande doit être de la forme !hereLocalActivé true ou !hereLocalActivé false"
      );
      return false;
    }
    return true;
  }

  checkHereGlobal() {
    if (this.newValue !== "true" && this.newValue !== "false") {
      this.message.channel.send(
        "Impossible de changer le statut des Here en cas de nouveau message venant des autres discords. Paramètre incorrect. Pour rappel, la commande doit être de la forme !hereGlobalActivétrue ou !hereGlobalActivé false"
      );
      return false;
    }
    return true;
  }

  checkNeighoardActivation() {
    if (this.newValue !== "true" && this.newValue !== "false") {
      this.message.channel.send(
        "Impossible de changer le statut de l'activation des alertes. Paramètre incorrect. Pour rappel, la commande doit être de la forme !messagesExterieurs ou !messagesExterieurs false"
      );
      return false;
    }
    return true;
  }

  checkNeighboardListAdd() {
    const discordName = this.newValue!.substring(
      25,
      this.newValue!.length
    ).trim();
    let discordID = "";
    config.discords.forEach(discord => {
      if (discord.name === discordName) {
        discordID = discord.discordId;
      }
    });

    if (!discordID) {
      this.message.channel.send(
        "Impossible d'ajouter ce discord. Paramètre incorrect. Pour rappel, la commande doit être de la forme !ajouterDiscordPartenaire nomDiscordPartenaire"
      );
      return false;
    }

    //Is the discord already in the list ?
    if (
      this.discord!.neighboards_name.some(
        neighboarddName => neighboarddName === discordName
      )
    ) {
      this.message.channel.send(
        "Impossible d'ajouter ce discord, il fait déjà partis de votre liste. Paramètre incorrect. Pour rappel, la commande doit être de la forme !enleverDiscordPartenaire nomDiscordPartenaire"
      );
      return false;
    }
    return true;
  }

  checkNeighboardListRemove() {
    const discordName = this.newValue!.substring(
      25,
      this.newValue!.length
    ).trim();
    let channelID = "";
    config.discords.forEach(discord => {
      if (discord.name === discordName) {
        channelID = discord.channelId;
      }
    });

    if (!channelID) {
      this.message.channel.send(
        "Impossible d'enlever ce discord. Paramètre incorrect, ce discord n'est pas géré par le scanner des 4. Pour rappel, la commande doit être de la forme !enleverDiscordPartenaire nomDiscordPartenaire"
      );
      return false;
    }

    //Is the discord in the list ?
    if (
      !this.discord!.neighboards_name.some(
        neighboarddName => neighboarddName === discordName
      )
    ) {
      this.message.channel.send(
        "Impossible d'enlever ce discord, il n'est pas dans votre liste. Paramètre incorrect. Pour rappel, la commande doit être de la forme !enleverDiscordPartenaire nomDiscordPartenaire"
      );
      return false;
    }
    return true;
  }

  checkChannelIdUpdate() {
    const chan = this.botClient.channels.get(this.newValue!) as TextChannel;
    if (!chan) {
      this.message.channel.send(
        "Impossible de modifier la channel. Paramètre inccorect. Pour rappel, la commande doit être de la forme !updateChannel100 IDchannel"
      );
      return false;
    } else {
      //Is the channel from the same discord ?
      if (chan.guild.id !== this.discord!.discordId) {
        this.message.channel.send(
          "Impossible de modifier la channel. La channel fournie appartient à un autre discord que celui que vous administrez."
        );
        return false;
      }
    }

    return true;
  }

  authenticate() {
    config.discords.forEach(discord => {
      if (
        discord.adminsIds.some(adminId => adminId === this.message.author.id)
      ) {
        this.discord = discord;
      }
    });

    if (!this.discord) {
      this.message.channel.sendMessage(
        "Erreur d'authentification : le bot n'a pas pu vous authentifier."
      );
      return false;
    }
    return true;
  }
}
