module.exports = {
    name: 'limit',
    alias: ['cekglimit','ceklimit','glimit'],
    category: 'info',
    desc: 'mengecek limit',
    isSpam: true,
    async run(msg, conn, q, map) {
			prefix = map.prefix
                if (msg.mentions.length !== 0){
                    msg.reply(`Limit : ${prem.checkPremiumUser(msg.mentions[0], premium) ? 'Unlimited' : `${getLimit(msg.mentions[0], limitCount, limit)}/${limitCount}`}\nLimit Game : ${cekGLimit(msg.mentions[0], gcount, glimit)}/${gcount}\nBalance : $${getBalance(msg.mentions[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                } else {
                    msg.reply(`Limit : ${isPremium ? 'Unlimited' : `${getLimit(msg.sender, limitCount, limit)}/${limitCount}`}\nLimit Game : ${cekGLimit(msg.sender, gcount, glimit)}/${gcount}\nBalance : $${getBalance(msg.sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                }
    }
    }
