export interface discordStruct {
    discordId: string, name: string, here: boolean, neighboards: boolean,neighboards_name: string[], channelId: string
}

export interface configStruct {
    discordBotToken: string,
    discords: discordStruct[],
    telegramBotToken: string,
    telegramChatID: string,
    delayHereControl: number
}