module.exports = {
  name: "dashboard",
  alias: ["db"],
  desc: "display " + config.namebot + " bot dashboard info",
category: "info",
isSpam: true,
wait: true,
async run(msg, conn) {
  dashboard.sort(function(a, b){return b.success - a.success})
let success = dashboard.map(a => a.success)
let failed = dashboard.map(a => a.failed)
let jumlah = require('mathjs').evaluate(success.join('+')) + require('mathjs').evaluate(failed.join('+'))
let teks = `*➤ Global HIT*\n\n`
 teks += `*➢ HIT*\n`
teks+= `*⌘ Global:* ${jumlah}\n`
teks += `*⌘ Success:* ${require('mathjs').evaluate(success.join('+'))}\n`
teks += `*⌘ Failed:* ${require('mathjs').evaluate(failed.join('+'))}\n\n`
 teks += `*➤ Most Command Global*\n\n`
 let dbny = dashboard.length > 5 ? 5 : dashboard.length
for (let i = 0; i < dbny; i++) {
teks += `*➢ #${dashboard[i].name}* : ${dashboard[i].success + dashboard[i].failed}\n`
teks += `*⌘ Success:* ${dashboard[i].success}\n`
teks += `*⌘ Failed:* ${dashboard[i].failed}\n\n`
}
await msg.reply(teks, { adReply: true })
}
}
