export interface discordInterface {
    name: string, here: boolean, neighboards: boolean,neighboards_name: string[], channelId: string
}

export interface configStruct {
    discordBotToken: string,
    discords: discordInterface[],
    telegramBotToken: string,
    telegramChatID: string,
    delayHereControl: number
}