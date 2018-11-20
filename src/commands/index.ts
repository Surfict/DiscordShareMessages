import i18next from "i18next";
import { DiscordStruct } from "../types/type.js";
import config from "./../config.json";
import { Util } from "../util/index.js";
import { typeMessageEnum, configEnum } from "../types/enum.js";
import { Checks } from "../checks/index.js";
import { Client, Message } from "discord.js";
import { UpdateConfig } from "./update-config.js";
export class Command {
  message: Message;
  discord: DiscordStruct | undefined;
  checks: Checks;
  updateConfig: UpdateConfig;
  from: typeMessageEnum;

  constructor(message: Message, botClient: Client, from: typeMessageEnum) {
    this.message = message;
    this.checks = new Checks(message, botClient);
    this.updateConfig = new UpdateConfig(message, botClient, this);
    if (from === typeMessageEnum.PM) {
      if (this.checks.authenticate(true)) {
        config.discords.forEach(discord => {
          if (
            discord.adminsIds.some(
              adminId => adminId === this.message.author.id
            )
          ) {
            this.discord = discord;
          }
        });
      }
    } else {
      this.discord = config.discords.find(
        discord => discord.discordId === this.message.guild.id
      );
    }
    this.from = from;
  }

  sort() {
    const messageTab = this.message.content.replace(/\s\s+/g, " ").split(" ");
    const tabbMessagePlace = Util.stringForPmOrChannel(this.from);
    if (messageTab[tabbMessagePlace] === "!help") {
      this.help();
    } else if (messageTab[tabbMessagePlace] === "!infos") {
      this.resume();
    } else if (messageTab[tabbMessagePlace] === "!discords") {
      this.neighboardsList();
    } else if (messageTab[tabbMessagePlace] === "!here") {
      this.here();
    } else if (messageTab[tabbMessagePlace] === "!partenaires") {
      this.all();
    } else if (messageTab[tabbMessagePlace] === "!rappel") {
      this.rappel();
    } else if (messageTab[1] === "!nofollow" || messageTab[1] === "!n") {
    } else if (messageTab[tabbMessagePlace] === "!hereLocalActivé") {
      if (
        this.checks.checkAllUpdateCommands(
          messageTab[tabbMessagePlace + 1],
          configEnum.hereOwn
        )
      ) {
        this.updateConfig.hereLocal();
      }
    } else if (messageTab[tabbMessagePlace] === "!hereGlobalActivé") {
      if (
        this.checks.checkAllUpdateCommands(
          messageTab[tabbMessagePlace + 1],
          configEnum.hereGlobal
        )
      ) {
        this.updateConfig.hereGlobal();
      }
    } else if (messageTab[tabbMessagePlace] === "!updateChannel100") {
      if (
        this.checks.checkAllUpdateCommands(
          messageTab[tabbMessagePlace + 1],
          configEnum.channelIdUpdate
        )
      ) {
        this.updateConfig.ChannelIdUpdate();
      }
    } else if (messageTab[tabbMessagePlace] === "!messagesExterieurs") {
      if (
        this.checks.checkAllUpdateCommands(
          messageTab[tabbMessagePlace + 1],
          configEnum.neighboardActivation
        )
      ) {
        this.updateConfig.NeighoardActivation();
      }
    } else if (messageTab[tabbMessagePlace] === "!ajouterDiscordPartenaire") {
      if (
        this.checks.checkAllUpdateCommands(
          this.message.content,
          configEnum.neighboardListAdd
        )
      ) {
        this.updateConfig.NeighboardListAdd();
      }
    } else if (messageTab[tabbMessagePlace] === "!enleverDiscordPartenaire") {
      if (
        this.checks.checkAllUpdateCommands(
          this.message.content,
          configEnum.neighboardListRemove
        )
      ) {
        {
          this.updateConfig.NeighboardListRemove();
        }
      }
    } else {
      this.badCommand();
    }
  }

  help() {
    this.message.channel.send(i18next.t("fromBot.help"));
    this.message.channel.send(i18next.t("fromBot.helpAdmin"));
  }

  neighboards() {
    if (this.discord) {
      this.message.channel.send(
        "Discords associés activés : " +
          (this.discord.neighboards ? "oui" : "non")
      );
    }
  }

  neighboardsList() {
    if (this.discord) {
      if (this.discord.neighboards_name.length > 0) {
        let answer = "Liste des discords associés :\n";
        this.discord.neighboards_name.forEach(name => {
          answer += name + "\n";
        });
        this.message.channel.send(answer);
      } else {
        this.message.channel.send("Aucun discord associé.");
      }
    }
  }

  rappel() {
    this.message.channel.send(i18next.t("fromBot.rappel"));
  }

  here() {
    if (this.discord) {
      if (this.discord.here.own) {
        this.message.channel.send("Here local : activé");
      } else {
        this.message.channel.send("Here local : désactivé");
      }

      if (this.discord.here.everyTime) {
        this.message.channel.send("Here global : activé");
      } else {
        this.message.channel.send("Here global : désactivé");
      }
    }
  }

  all() {
    let answer = "Liste de tous les discords associés au scanner des 4 :\n";
    config.discords.forEach(discord => {
      answer += discord.name + "\n";
    });
    this.message.channel.send(answer);
  }

  resume() {
    this.neighboards();
    this.neighboardsList();
    this.here();
  }

  badCommand() {
    this.message.channel.send(i18next.t("fromBot.commandeIntrouvable"));
  }
}
