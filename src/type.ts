export interface hereStruct {
    own : boolean,
    everyTime: boolean
}

export interface discordStruct {
    discordId: string, name: string, here: hereStruct, neighboards: boolean,neighboards_name: string[], channelId: string
}

export interface configStruct {
    discordBotToken: string,
    discords: discordStruct[],
    telegramBotToken: string,
    telegramChatID: string,
    delayHereControl: number
}