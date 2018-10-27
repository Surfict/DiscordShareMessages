# DiscordToTelegram
This discord bot take messages from different discord servers and allows you to forward this messages :
- To another discords
- To a telegram group

It has been specially designed to make a cooperation system beetween Pokemon go Discord server in the same area that want to share some informations beetween them (like report perfect mons), but it can be used easily for another purpose if you need to  group message from differents discord and send them to a unique telegram group or some discord channels. 

For example, you can :
- Take messages from differents discord server and send them to a unique discord channel
- Create a collaboration system : let's say you have discord 1, 2 3 and each of this discord have a channel created for the collaboration. Each discord will receive the message from the others discord (or you can say, if you are discord 2, I want to receive the message from 1 but not from 3.)

# Install
Create at the root of the project a config.json file, based on config.exemple.json (copy paste it) and fill it with your telegram/discord bots, etc. If you don't do this, the app won't work.

Then, go to the root folder of the project in a terminal
- npm install
- node index.js to launch the bot


# Configuration file
- discordToken : The token of your discord bot
- discords : The different discords that will share messages.
- telegramToken : telegram bot token
- telegramChatID : Telegram group id
- delayHereControl : if you need to have a automatic here when someome post a message, you can set the delay between two here in this option.


