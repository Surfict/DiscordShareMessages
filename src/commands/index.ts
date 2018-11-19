import i18next from "i18next";
import { DiscordStruct } from "../types/type.js";
import config from "./../config.json";
import { Util } from "../util/index.js";
import * as fs from "fs";
import * as path from "path";
import { typeMessageEnum, configEnum } from "../types/enum.js";
import { Checks } from "../checks/index.js";
import { Client, Message } from "discord.js";
import { UpdateConfig } from "./update-config.js";
export class Command {
  message: Message;
  discord: DiscordStruct | undefined;
  checks: Checks;
  updateConfig: UpdateConfig;

  constructor(message: Message, botClient: Client) {
    this.message = message;
    this.discord = undefined; // config.discords.find( discord => discord.discordId === this.message.guild.id);
    this.checks = new Checks(message, botClient);
    this.updateConfig = new UpdateConfig(message, botClient);
  }

  sort(from: typeMessageEnum) {
    const messageTab = this.message.content.replace(/\s\s+/g, " ").split(" ");
    const tabbMessagePlace = Util.stringForPmOrChannel(from);
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
    } else if (messageTab[tabbMessagePlace] === "!test") {
      this.test();
    } else if (messageTab[tabbMessagePlace] === "!test2") {
      this.test2();
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
      this.checks.checkAllUpdateCommands(
        messageTab[tabbMessagePlace + 1],
        configEnum.hereGlobal
      );
    } else if (messageTab[tabbMessagePlace] === "!updateChannel100") {
      this.checks.checkAllUpdateCommands(
        messageTab[tabbMessagePlace + 1],
        configEnum.channelIdUpdate
      );
    } else if (messageTab[tabbMessagePlace] === "!messagesExterieurs") {
      this.checks.checkAllUpdateCommands(
        messageTab[tabbMessagePlace + 1],
        configEnum.neighboardActivation
      );
    } else if (messageTab[tabbMessagePlace] === "!ajouterDiscordPartenaire") {
      this.checks.checkAllUpdateCommands(
        this.message.content,
        configEnum.neighboardListAdd
      );
    } else if (messageTab[tabbMessagePlace] === "!enleverDiscordPartenaire") {
      this.checks.checkAllUpdateCommands(
        this.message.content,
        configEnum.neighboardListRemove
      );
    } else {
      this.badCommand();
    }
  }

  help() {
    this.message.channel.send(i18next.t("fromBot.help"));
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
      if (
        this.discord.neighboards &&
        this.discord.neighboards_name.length > 0
      ) {
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
      if (this.discord.here) {
        this.message.channel.send("Here : activé");
      } else {
        this.message.channel.send("Here : désactivé");
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

  test2() {
    console.log(config.delayHereControl);
  }
  test() {
    const messageTab = this.message.content.replace(/\s\s+/g, " ").split(" ");
    config.delayHereControl = +messageTab[1];
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

    console.log("after" + config.delayHereControl);

    //Arg valides ?
    if (this.message.content[1] === "recevoir") {
      if (this.message.content[1] === "true") {
        config.delayHereControl = 3;
      } else if (this.message.content[1] === "false") {
      } else {
        this.message.channel.send("Parametres incorrects");
      }
    }
  }
}
