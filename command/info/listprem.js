module.exports = {
  name: "listpremium",
  alias: ["listprem", "listvip"],
  category: "info",
  isSpam: true,
  async run(msg, conn) {
  let txt = `List Prem\nJumlah : ${premium.length}\n\n`
  if(premium[0]) {
  for (let i of premium){
    let cekvip = ms(i.expired - Date.now())
    txt += `*ID :* @${i.id.split("@")[0]}\n*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
   }
   }
   msg.reply(txt,true)
   }
   }