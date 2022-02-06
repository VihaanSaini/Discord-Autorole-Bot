const { Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const VS = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"] });
const config = require('./config');


VS.on('ready', () => {
    console.log(`I have connected to ${VS.user.tag} and watching ${VS.guilds.cache.size} servers.`)
})


VS.on('messageCreate', async(message) => {
    if (message.content.toLowerCase().startsWith(config.command)) {
        if (message.member.permissions.has(config.perms)) {
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            if (!args[0]) {
                message.channel.send({ content: `Command not ran properly. \`${config.command} <role> <message>\`` })
            } else {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
                let e3 = new MessageEmbed()
                    .setDescription(`Please make to mention a role/input the id of the role. \`${config.command} <@role> <message>\``)
                    .setColor(config.embed.color)
                    .setFooter(config.embed.footer)
                if (!role) return message.channel.send({ embeds: [e3] });
                let msg = args.slice(1).join(` `)
                let e2 = new MessageEmbed()
                    .setDescription(`Please input the message. \`${config.command} <r@ole> <message>\``)
                    .setColor(config.embed.color)
                    .setFooter(config.embed.footer)
                if (!msg) return message.channel.send({ embeds: [e2] })
                let mainembed = new MessageEmbed()
                    .setColor(config.embed.color)
                    .setDescription(msg)
                    .setFooter(config.embed.footer)
                let row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setLabel(`React to Receive: ${role.name} Role`)
                        .setStyle("PRIMARY")
                        .setCustomId(`role-${role.id}`)
                    )
                message.channel.send({ embeds: [mainembed], components: [row] })
            }
        } else {
            message.channel.send({ content: "Access denied." })
        }
    }
})

VS.on('interactionCreate', async(interaction) => {
    if(!interaction) return
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("role-")) return;
    await interaction.deferUpdate()
    let id = interaction.customId
    let role = id.split('role-')
    role = role.pop()
    role = interaction.guild.roles.cache.get(role)
    if (!role) return
    if (interaction.member.roles.cache.has(role.id)) {
        interaction.member.roles.remove(role.id)
        let e1 = new MessageEmbed()
            .setColor(config.embed.color)
            .setDescription(`${role.name} role has been removed from you.`)
        interaction.followUp({ embeds: [e1], ephemeral: true })
    } else {
        interaction.member.roles.add(role.id)
        let e1 = new MessageEmbed()
            .setColor(config.embed.color)
            .setDescription(`${role.name} role has been added to you.`)
        interaction.followUp({ embeds: [e1], ephemeral: true })
    }

})


VS.login(config.token).catch(e => {
    if (e) {
        console.log(` You have an invalid token in config.js`)
    }
})
