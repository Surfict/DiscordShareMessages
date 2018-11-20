import { Client, Message } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { DiscordStruct } from "../types/type";
import config from "./../config.json";
import { messageDecomposeEnum } from "../types/enum.js";
import { Command } from ".";
export class UpdateConfig {
  message: Message;
  botClient: Client;
  discord: DiscordStruct | undefined;
  commands: Command;

  constructor(message: Message, botClient: Client, command: Command) {
    this.message = message;
    this.botClient = botClient;
    this.commands = command;
    config.discords.forEach(discord => {
      if (
        discord.adminsIds.some(adminId => adminId === this.message.author.id)
      ) {
        this.discord = discord;
      }
    });
  }

  hereLocal() {
    const newValue = this.newValueDecompose(messageDecomposeEnum.FIRST);
    this.discord!.here.own = (newValue === "true");
    this.writeUpdateinConfigs();
    this.successReturn();
  }

  hereGlobal() {
    const newValue = this.newValueDecompose(messageDecomposeEnum.FIRST);
    this.discord!.here.everyTime = (newValue === "true");
    this.writeUpdateinConfigs();
    this.successReturn();
  }

  NeighoardActivation()
  {
    const newValue = this.newValueDecompose(messageDecomposeEnum.FIRST);
    this.discord!.neighboards = (newValue === "true");
    this.writeUpdateinConfigs();
    this.successReturn();

  }

  NeighboardListAdd()
  {
    const newValue = this.newValueDecompose(messageDecomposeEnum.ALL_ATER_0, 25);
    this.discord!.neighboards_name.push(newValue);
    this.writeUpdateinConfigs();
    this.successReturn();
  }

  NeighboardListRemove()
  {

      const newValue = this.newValueDecompose(messageDecomposeEnum.ALL_ATER_0, 25);
      this.discord!.neighboards_name = this.discord!.neighboards_name.filter(neighboard => neighboard !== newValue);
      this.writeUpdateinConfigs();
      this.successReturn();
  }

  ChannelIdUpdate()
  {
    const newValue = this.newValueDecompose(messageDecomposeEnum.FIRST);
    this.discord!.channelId = newValue;
    this.writeUpdateinConfigs();
    this.successReturn();
  }

  newValueDecompose(typeMessage: messageDecomposeEnum, lenghtSlice?: number) {
    switch (typeMessage) {
      case messageDecomposeEnum.FIRST:
        const sliceMessage = this.message.content
          .replace(/\s\s+/g, " ")
          .split(" ");
        return sliceMessage[1];

      case messageDecomposeEnum.ALL_ATER_0:
        const messageWithoutCommand = this.message.content.substring(
          lenghtSlice! + 1,
          this.message.content.length
        );
        return messageWithoutCommand;
    }
  }

  writeUpdateinConfigs() {
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

  successReturn()
  {
    this.message.channel.send("Configuration modifiée avec succès.")
    this.commands.resume();
  }
}
