import { Message } from "discord.js";
import config from './../config.json';
import { discordStruct } from "../type.js";

export class Command {

    message: Message;
    discord: discordStruct | undefined;

    constructor(message: Message) {
        this.message = message;
        this.discord = config.discords.find(discord => discord.name === this.message.guild.name);
    }

    sort() {
        let messageTab = this.message.content.replace(/\s\s+/g, ' ').split(' ');
        if (messageTab[1] === "help") {
            this.help();
        }
        else if (messageTab[1] === "infos") {
            this.resume();
        }
        else if (messageTab[1] === "discords") {
            this.neighboardsList();
        }
        else if (messageTab[1] === "here") {
            this.here();
        }
        else {
            this.inconnu();
        }
    }

    help() {
        this.message.channel.send("help : Liste des différentes commandes \ninfos : Liste les informations du bot sur ce serveur (liste des discords associés, activation du here) \ndiscords : Liste des discords associés \nhere : Etat d'activation du here")
    }

    neighboards() {
        if (this.discord) {
            this.message.channel.send("Discords associés activés : " + (this.discord.neighboards ? "oui" : "non"));
        }
    }

    neighboardsList() {
        if (this.discord) {
            if (this.discord.neighboards && this.discord.neighboards_name.length > 0) {
                let answer = "Liste des discords associés :\n"
                this.discord.neighboards_name.forEach(name => {
                    answer += name + "\n"
                })
                this.message.channel.send(answer);
            }
            else {
                this.message.channel.send("Aucun discord associé.");
            }
        }
    }

    here() {
        if (this.discord) {
            if (this.discord.here) {
                this.message.channel.send("Here : activé");
            }
            else {
                this.message.channel.send("Here : désactivé");
            }
        }

    }

    resume() {
        this.neighboards();
        this.neighboardsList();
        this.here();
    }

    inconnu() {
        this.message.channel.send("Commande inconnue. Pour la liste des commandes, tappez help");
    }
}