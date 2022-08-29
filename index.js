import TelegramApi from 'node-telegram-bot-api'
import https from "node:https"
// const token = ''
const token = ''

const bot = new TelegramApi(token, { polling: true })
let bigData = {}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Информация о пользователе' },
        { command: '/btc', description: 'Курс BTC' },
    ])
    const startMenu = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [{ text: 'Продать машину', callback_data: 'sellCar' }, { text: 'Снять объявление', callback_data: 'cancelSell' },],
                    [{ text: 'Предложить цену', callback_data: 'setBid' }, { text: 'Снять предложение', callback_data: 'cancelBid' },]
                ]
            }
        )
    }
    const sellCarMenu = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        { text: 'Марка', callback_data: 'brand' },
                        { text: 'Модель', callback_data: 'model' },
                        { text: 'Год', callback_data: 'year' },
                        { text: 'Фото', callback_data: 'photo' },
                        { text: 'Описание', callback_data: 'description' }
                    ],
                ]
            }
        )
    }
    bot.on('message', async (msg) => {
        console.log(msg);
        const text = msg.text;
        const chatId = msg.chat.id;
        let options = {
            "parse_mode": "Markdown",
            "reply_markup": JSON.stringify({
                "keyboard": [
                    // [{ text: "Location", request_location: true }],
                    [{ text: "Поделится контактными данными", request_contact: true }]
                ],
                "one_time_keyboard": true,
                "resize_keyboard": true,
            })
        };

        if (text === "/start") {
            await bot.sendPhoto(chatId, 'https://telegramchannels.me/storage/stickers/wildbill/big_wildbill_5.png')
            await bot.sendMessage(chatId, `Добро пожаловать на канал AvtoBy \nМеня зовут Wild Bill`)
            return await bot.sendMessage(msg.chat.id, "Давай знакомится", options).then((msg) => {

            });

        }
        if (text === "/info") {
            return await bot.sendMessage(chatId, `Твоя информация: ${JSON.stringify(msg.chat)}`)
        }
        if (text === "/btc") {

            const url = `https://blockchain.info/stats?format=json`;

            return https.get(url, res => {
                let data = []
                res.on('data', chunk => {
                    data.push(chunk)
                })
                res.on('end', async () => {
                    let dataBuffer = Buffer.concat(data).toString();
                    const body = JSON.parse(dataBuffer);
                     await bot.sendMessage(chatId, `Курс: ${body.market_price_usd}, объем торгов : ${body.trade_volume_btc} `)
                })
            })
        }
        // console.log('msg:', msg);
        if (!msg.reply_to_message && !msg.contact) return await bot.sendMessage(chatId, `Смисле...`)

    })

    bot.on('contact', async (msg) => {
        const chatId = msg.chat.id;
        const contact = msg.contact
        await bot.sendMessage(chatId, `Hey ${contact.first_name} !`,
            {
                reply_markup: JSON.stringify({
                    remove_keyboard: true
                })
            });
        await bot.sendMessage(chatId, `Могу помочь тебе:`, startMenu)
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === 'sellCar') {
            return await bot.sendMessage(chatId, `Расскажи о своей ласточке:`, sellCarMenu)
            // bot.sendMessage(chatId, `
            // <a href="www.ubt.bby">Hello</a>
            // `, {parse_mode: 'HTML'});
            // bot.sendMediaGroup(chatId,['sadsad'])
            // bot.sendVenue(chatId,54.949386,26.3621141)
            // bot.sendLocation(chatId,54.949386,26.3621141)
        }
        if (data === 'brand') {

            let opts = {
                reply_markup: JSON.stringify(
                    {
                        force_reply: true
                    }
                )
            };
            return await bot.sendMessage(chatId, `Какая марка?`, opts).then((sended) => {
                let chatId = sended.chat.id;
                let messageId = sended.message_id;
                bot.onReplyToMessage(chatId, messageId, (message) => {
                    bot.sendMessage(chatId, `Ага`)
                    const brand = message.text
                    bigData[chatId] = { ...bigData[chatId], brand }
                });
            });
        }
        if (data === 'model') {

            let opts = {
                reply_markup: JSON.stringify(
                    {
                        force_reply: true
                    }
                )
            };
            return await bot.sendMessage(chatId, `Какая модель?`, opts).then((sended) => {
                let chatId = sended.chat.id;
                let messageId = sended.message_id;
                bot.onReplyToMessage(chatId, messageId, (message) => {
                    bot.sendMessage(chatId, `Та ты шо`)
                    const model = message.text
                    bigData[chatId] = { ...bigData[chatId], model }

                });
            });
        }
        if (data === 'year') {

            let opts = {
                reply_markup: JSON.stringify(
                    {
                        force_reply: true
                    }
                )
            };
            return await bot.sendMessage(chatId, `А год какой?`, opts).then((sended) => {
                let chatId = sended.chat.id;
                let messageId = sended.message_id;
                bot.onReplyToMessage(chatId, messageId, (message) => {
                    bot.sendMessage(chatId, `Пушка`)
                    const year = message.text
                    bigData[chatId] = { ...bigData[chatId], year }

                });
            });
        }
        if (data === 'description') {

            let opts = {
                reply_markup: JSON.stringify(
                    {
                        force_reply: true
                    }
                )
            };
            return await bot.sendMessage(chatId, `Есть подробности?`, opts).then((sended) => {
                let chatId = sended.chat.id;
                let messageId = sended.message_id;
                bot.onReplyToMessage(chatId, messageId, (message) => {
                    bot.sendMessage(chatId, `Полный комплект. Жди торги!`)
                    const description = message.text
                    bigData[chatId] = { ...bigData[chatId], description }

                });
            });
        }
        if (data === 'photo') {
            let opts = {
                reply_markup: JSON.stringify(
                    {
                        force_reply: true
                    }
                )
            };
            return await bot.sendMessage(chatId, `Фотки есть?`, opts).then((sended) => {
                let chatId = sended.chat.id;
                let messageId = sended.message_id;
                bot.onReplyToMessage(chatId, messageId, async (msg) => {
                    if (msg.photo && msg.photo[0]) {
                        const image = await bot.getFile(msg.photo[1].file_id);
                        // bigData[chatId] = { ...bigData[chatId], image: JSON.stringify(image) }

                        const filePath = image.file_path
                        const url = `https://api.telegram.org/file/bot${token}/${filePath}`;

                        https.get(url, res => {
                            // res.setEncoding('')
                            let data = []
                            res.on('data', chunk => {
                                data.push(chunk)
                            })
                            res.on('end', async () => {
                                let dataBuffer = Buffer.concat(data)
                                await bot.sendMessage(chatId, `Хто так фоткает, посмотри шо ты мне прислал`)
                                await bot.sendPhoto(chatId, dataBuffer)
                            })
                        })
                    }
                    if (msg.document) {
                        const file_id = msg.document.file_id;
                        const image = await bot.getFile(file_id);
                        // bigData[chatId] = { ...bigData[chatId], image: JSON.stringify(image) }

                        const file_path = image.file_path
                        const url = `https://api.telegram.org/file/bot${token}/${file_path}`;
                        https.get(url, res => {
                            // res.setEncoding('')
                            let data = []
                            res.on('data', chunk => {
                                data.push(chunk)
                            })
                            res.on('end', async () => {
                                let dataBuffer = Buffer.concat(data)
                                await bot.sendMessage(chatId, `Хто так фоткает, посмотри шо ты мне прислал`)
                                await bot.sendPhoto(chatId, dataBuffer)
                            })
                        })
                    }
                });
            });

        }
        if (data === 'cancelSell') {
            return await bot.sendMessage(chatId, `Шота ты рано нажимаешь ту кнопку.`)
            // bot.sendMessage(chatId, `
            // <a href="www.ubt.bby">Hello</a>
            // `, {parse_mode: 'HTML'});
            // bot.sendMediaGroup(chatId,['sadsad'])
            // bot.sendVenue(chatId,54.949386,26.3621141)
            // bot.sendLocation(chatId,54.949386,26.3621141)
        }
        if (data === 'setBid') {
            return await bot.sendMessage(chatId, `Шота ты рано нажимаешь ту кнопку.`)

            // bot.sendMessage(chatId, `
            // <a href="www.ubt.bby">Hello</a>
            // `, {parse_mode: 'HTML'});
            // bot.sendMediaGroup(chatId,['sadsad'])
            // bot.sendVenue(chatId,54.949386,26.3621141)
            // bot.sendLocation(chatId,54.949386,26.3621141)
        }
        if (data === 'cancelBid') {
            return await bot.sendMessage(chatId, `Шота ты рано нажимаешь ту кнопку.`)

            // bot.sendMessage(chatId, `
            // <a href="www.ubt.bby">Hello</a>
            // `, {parse_mode: 'HTML'});
            // bot.sendMediaGroup(chatId,['sadsad'])
            // bot.sendVenue(chatId,54.949386,26.3621141)
            // bot.sendLocation(chatId,54.949386,26.3621141)
        }
    })

}

start();
