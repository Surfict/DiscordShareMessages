const config = require('./../config.json')

module.exports = class util {

    static isHerePresent(message) {
        if (message.indexOf("@here") !== -1) {
            return true
        }
        return false
    }

    static isMessageAlreadyPosted(message) {
        if (message === "@here : Nouveau 100 détecté !")
            return true;
        const discords = config.discords;


        for (let i = 0; i < discords.length; i++) {
            const discord = discords[i]
            if (message.indexOf(discord.Name + " : ") !== -1) {
                return true;
            }
        }

        return false;
    }
}