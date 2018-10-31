const config = require("./../config.json");

export class util {
  static isHerePresent(message: string) {
    return message.indexOf("@here") !== -1;
  }

  static isMessageAlreadyPosted(message: string) {
    if (message === "@here : Nouveau 100 détecté !") return true;
    const discords = config.discords;

    for (let i = 0; i < discords.length; i++) {
      const discord = discords[i];
      if (message.indexOf(discord.Name + " : ") !== -1) {
        return true;
      }
    }

    return false;
  }
}
