export interface discordInterface {
    name: string, here: boolean, neighboards: string,neighboards_name: string[], channelId: string
}

export interface configStruct {
    discordToken: string,
    discords: discordInterface[],
    telegramToken: string,
    telegramChatID: string,
    delayHereControl: number
}