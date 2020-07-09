const Discord = require("discord.js");
const db = require("quick.db");
const { Canvas } = require("canvas-constructor");
const { get } = require("node-superfetch");


const bot = new Discord.Client();
const Prefix = "^";

Canvas.registerFont(`${process.cwd()}/assets/font/builtitlingbd.ttf`, "Tes") 
Canvas.registerFont(`${process.cwd()}/assets/font/BebasNeue-Regular.ttf`, "Font2") 
Canvas.registerFont(`${process.cwd()}/assets/font/theboldfont.ttf`, "Font3") 

bot.on("ready", () => {
  console.log("Ready!");
});


bot.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  if (!msg.content.startsWith(Prefix)) return;
  if (!msg.member.hasPermission("ADMINISTRATOR")) return console.log('THIS USER HAS ADMINISTRATOR PERMISSIONS!')

  const args = msg.content.split(" ");
  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(Prefix.length);
  let Argumen = args[1];
  if (command.toUpperCase() === "WELCOME") {
    if (Argumen.toUpperCase() === "ENABLE") {
      msg.channel.send(`Enable`);
      db.set(`${msg.guild.id}.Config.Welcome.ED`, "YA");
    }

    if (Argumen.toUpperCase() === "DISABLE") {
      msg.channel.send(`Disable`);
      db.set(`${msg.guild.id}.Config.Welcome.ED`, "TIDAK");
    }

    if (Argumen.toUpperCase() === "CHANNEL") {
      let Channel = msg.mentions.channels.first();
      if (!Channel) {
        msg.channel.send(`Channel??`);
      } else {
        msg.channel.send(`Channel: ${Channel.id}`);
        db.set(`${msg.guild.id}.Config.Welcome.Channel`, Channel.id);
      }
    }

    if (
      Argumen.toUpperCase() === "MESSAGE" ||
      Argumen.toUpperCase() === "MSG"
    ) {
      let Message = args.slice(2).join(" ");
      if (Message.length > 30) {
        msg.channel.send(`Terlalu panjang`);
      } else {
        msg.channel.send(`Message: ${Message}`);
        db.set(`${msg.guild.id}.Config.Welcome.Message`, Message);
      }
    }

    if (
      Argumen.toUpperCase() === "BACKGROUND" ||
      Argumen.toUpperCase() === "BG"
    ) {
      let Background = args.slice(2).join(" ");
      if (!Background) {
        msg.channel.send(`Background??`);
      } else {
        msg.channel.send(`Background: ${Background}`);
        db.set(`${msg.guild.id}.Config.Welcome.Background`, Background);
      }
    }

    if (Argumen.toUpperCase() === "TEST") {
      let Config = db.get(`${msg.guild.id}.Config.Welcome.ED`);
      if (Config === "YA") {
        let BG = db.get(`${msg.guild.id}.Config.Welcome.Background`);
        if (!BG) BG = "URL DEFAULT BACKGROUND";

        let MSG = db.get(`${msg.guild.id}.Config.Welcome.Message`);
        if (!MSG) MSG = "DEFAULT MESSAGE";

        var imageUrlRegex = /\?size=2048$/g;
        var { body: avatar } = await get(
          msg.author.displayAvatarURL.replace(imageUrlRegex, "?size512")
        );
        var { body: background } = await get(`${BG}`);

        async function createCanvas() {
          return new Canvas(1024, 500)
            .addImage(background, 0, -100)
            .setColor("#ffffff")
            .addCircle(512, 155, 120)
            .addCircularImage(avatar, 512, 155, 115)
            .setTextFont("90px Font3")
            .setTextAlign("center")
            .setColor("#ffffff")
            .addText("WELCOME", 512, 360)
            .setTextFont("50px Font3")
            .setTextAlign("center")
            .setColor("#ffffff")
            .addText(`${msg.member.user.tag}`, 512, 410)
            .setTextFont("35px Font3")
            .setTextAlign("center")
            .setColor("#ffffff")
            .addText(`${MSG}`, 512, 449)
            .toBuffer();
        }

        msg.channel.send({
          files: [{ attachment: await createCanvas(), name: "welcome.png" }]
        });
      } else {
        msg.channel.send(`Enable!?!?`);
      }
    }
  }
});

bot.on("guildMemberAdd", async member => {
  let Config = db.get(`${member.guild.id}.Config.Welcome.ED`);
  if (Config === "YA") {
    let Channel = db.get(`${member.guild.id}.Config.Welcome.Channel`);
    if (!Channel) {
      return;
    } else {
      let BG = db.get(`${member.guild.id}.Config.Welcome.Background`);
      if (!BG) BG = "URL DEFAULT BACKGROUND";

      let MSG = db.get(`${member.guild.id}.Config.Welcome.Message`);
      if (!MSG) MSG = "DEFAULT MESSAGE";

      var imageUrlRegex = /\?size=2048$/g;
      var { body: avatar } = await get(
        member.user.displayAvatarURL.replace(imageUrlRegex, "?size512")
      );
      var { body: background } = await get(`${BG}`);
      async function createCanvas() {
        return new Canvas(1024, 500)
   .addImage(background, 0, -100)
            .setColor("#ffffff")
            .addCircle(512, 155, 120)
            .addCircularImage(avatar, 512, 155, 115)
            .setTextFont("90px Font2")
            .setTextAlign("center")
            .setColor("#ffffff")
            .addText("WELCOME", 512, 360)
            .setTextFont("50px Font2")
            .setTextAlign("center")
            .setColor("#ffffff")
            .addText(`${member.user.tag}`, 512, 410)
            .setTextFont("35px Font2")
            .setTextAlign("center")
            .setColor("#ffffff")
            .addText(`${MSG}`, 512, 449)
            .toBuffer();
      }
      let Channelz = bot.channels.get(`${Channel}`);
      Channelz.send({
        files: [{ attachment: await createCanvas(), name: "welcome.png" }]
      });
    }
  } else {
    return;
  }
});

bot.login("NjY5NjE2Mjk2OTMyOTMzNjUy.XtOYag.zyorp3fYNNv4zsVbKZUqAl3ycbE");
