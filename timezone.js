const config = require("/home/mike/bottestingserver/config.json");

const Discord = require("discord.js");

exports.timezoneMessage = function(client, message) {
    let date_ob = new Date();
    if (message.author.id === config.germany && ((date_ob.getUTCHours() + 1 ) % 24) < 6){
        var items = [
            "https://cdn.discordapp.com/attachments/699993544705966221/730898296629100614/e56.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/730898291671171143/9dd.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/730898288685088768/c9c.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867884121948164/324-3249612_okay-sleep-united-states-of-america-mammal-cartoon.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867885015334952/its-time-to-sleep-anime-irl-31849687.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867886256717925/162.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867906364473384/anMgj55_700b.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867908289396786/0e1.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867909719785502/da77mqn-c2b6e1b5-18e8-45e6-94c3-efbe5bfc8d42.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867910776619087/7118d2d81bc9aab6603a83d165637ff0.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867911737376778/XH1iuwl_d.webp",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867931559657542/587.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737868061268508754/funny-sleep-memes-98-5d2719c92c03c__700.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/737868187936358503/ff8.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/737868323500589126/43a.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867880900853821/flat1000x1000075f.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/737867882003824650/Kagaposting_3883e4_5955319.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806749488775238/6pagf5k49xp21.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806750868570173/303-3031709_transparent-go-to-sleep-clipart-anime-chibi-memes.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806751984123924/Oritsahighqualitysmugclockstrikes3_44cd86de7bebc306ed29c09af0b53154.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806753565507674/aed.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806755234840596/83c042d3e21872207b6b21204cb32c0e2cab4c78_hq.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806779163213834/images.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806780564242462/0f2f465cd9103cfea738ab1fea7883ab.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806784175538216/tenor.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806785274576956/aKxRZmj_460s.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806786062843914/med_1482475165_image.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806810033553408/511ee7932a30ea35eb8cf5172f553211.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806811132198962/d5834e57e29d2c899ba26f7bad552030.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806812231368715/ty313wtxw9v21.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806818208251904/Kagaposting_448ee3_5955319.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/741806940476145684/tenor.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/759515910909984869/image0.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967250919784519/7c36539350d202a16323407f689b769c.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967252303904798/mgeefcy316821.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967253650145311/Cat_girls_sticker_EN.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967255104913448/ECM4Y59XYAAhyPn.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967256338563092/4eyrevo803r11.jpg",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967281080369172/OK6W_koKDTOqqqLDbIoPAjZUumQmzEEC8H3SW7zGrJ4.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967282268012584/0f2.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967283027050516/11013303.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967284331610142/795324f96d5c1288a7c5ec9febc11f3c.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/761967285517942834/da77mqn-c2b6e1b5-18e8-45e6-94c3-efbe5bfc8d42.png",
            "https://cdn.discordapp.com/attachments/699993544705966221/773377846202728468/1604270547846.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/773378021024333874/f2d3b39371c53dbb7f11aab81fc8085b893fa307_hq.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/773378057833676800/0b75f84df24a6f70f58eb8a57a815198c8498b27a13b64b7ce20acae683d7d72_1.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/773378232292605952/MVfJKs9.gif",
            "https://cdn.discordapp.com/attachments/699993544705966221/773378289179951114/tenor.gif"
        ]
        var random_image = items[Math.floor(Math.random() * items.length)];
        let date_ob = new Date();
        let hours = ((date_ob.getUTCHours() + 1) % 24).toString().padStart(2,"0");
        let minutes = date_ob.getUTCMinutes().toString().padStart(2,"0");
        let seconds = date_ob.getUTCSeconds().toString().padStart(2,"0");
        const embed = new Discord.MessageEmbed()
            .setTitle("Germany Time")
            .setColor(Math.floor(Math.random() * 0xffffff))
            .setDescription(hours + ":" + minutes + ":" + seconds)
            .setImage(random_image);
        message.reply(embed)
    }
}