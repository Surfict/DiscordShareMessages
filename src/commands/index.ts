import { Message } from "discord.js";
import i18next from "i18next";
import { discordStruct } from "../type.js";
import config from "./../../config.json";
import { Util } from "../util/index.js";
import * as fs from 'fs';
import * as path from 'path';
export class Command {
  message: Message;
  discord: discordStruct | undefined;

  constructor(message: Message) {
    this.message = message;
    this.discord = undefined // config.discords.find( discord => discord.discordId === this.message.guild.id);
  }

  sort(from: string) {
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
    }
   else if (messageTab[tabbMessagePlace] === "!test") {
    this.test();
  }
  else if (messageTab[tabbMessagePlace] === "!test2") {
    this.test2();
  } else if (messageTab[tabbMessagePlace] === "!rappel") {
      this.rappel();
    }
    //That commmand ask to the bot to not forward the message to others discords, so there is just nothing to do.
    else if (messageTab[1] === "!nofollow" || messageTab[1] === "!n") {
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


  test2()
  {
    console.log(config.delayHereControl)
  }
   test()
  {
    const messageTab = this.message.content.replace(/\s\s+/g, " ").split(" ");
    config.delayHereControl = +messageTab[1];
    console.log(path.join(__dirname,"../../config.json"));
    fs.writeFile(path.join(__dirname,"../../config.json"), config, (error) => {
      console.log(error);
  })

  console.log("after" + config.delayHereControl);


    //Arg valides ?
    if (this.message.content[1] === "recevoir")
    {
      if (this.message.content[1] === "true")
      {
        config.delayHereControl = 3;
      }
      else if (this.message.content[1] === "false")
      {

      }

      else{
        this.message.channel.send("Parametres incorrects")
      }
    }





  }
}
