export interface HereStruct {
  own: boolean;
  everyTime: boolean;
}

export interface DiscordStruct {
  discordId: string;
  adminsIds: string[],
  name: string;
  here: HereStruct;
  neighboards: boolean;
  neighboards_name: string[];
  channelId: string;
}

export interface ConfigStruct {
  discordBotToken: string;
  discords: DiscordStruct[];
  telegramBotToken: string;
  telegramChatID: string;
  delayHereControl: number;
}
