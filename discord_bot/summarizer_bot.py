import discord
import openai
import os
import datetime
from discord.ext import commands, tasks

utc = datetime.timezone.utc

openai.api_key = "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"
DISCORD_TOKEN = "MTA4Nzk2ODU4ODQ2MTI1MjY0OA.GH9FQU.qyTkrQJjYqVtIrIOi7JiJbKe0lNmZ61SAGvzmE"
CHANNEL_ID = 1088175702957903957
SERVER_ID = 1088175702366502932

messages = []

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_guild_join(guild):
    # Get the default channel for the server
    channel = guild.text_channels[0]
    # Send a "hello" message to the channel
    await channel.send("Hello! I am a summarizer bot. I will summarize messages in the #announcements channel.")

@client.event
async def on_message(message):
    # get a reference to the server you want to list the text channels for
    server = client.get_guild(SERVER_ID) # replace 'server_id' with the ID of the server you want to list the text channels for

    # get a list of all the text channels in the server
    text_channels = [channel.name for channel in server.text_channels]
    
    if 'summarizer-channel' not in text_channels:
        await message.guild.create_text_channel('summarizer-channel')

    if message.channel.name == 'announcements':
        # get the last message
        msg_arr = []
        async for msg in message.channel.history(limit=10):
            #latest_message = msg
            msg_arr.append(msg.content)

        latest_message = ''.join(msg_arr)

        text = f"Summarize the following text in bullet point format, while ignoring '@everyone' and including links where necessary: {latest_message}"

        item =  {"role": "user", "content": text}
        messages.append(item)
        
        # Generate a summary of the message using GPT-3
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            # max_tokens=50,
            # temperature=0.5,
            # n=1,
            # stop=None,
            # timeout=60,
        )

        summary = str(response['choices'][0]['message']['content']).strip()

        summary_channel = discord.utils.get(client.get_all_channels(), name='summarizer-channel')
        print(summary_channel)
        
        # Send the summary to a designated channel in your Discord server
        #summary_channel = client.get_channel(CHANNEL_ID)
        await summary_channel.send(f'-------------------- \n **Summary:** \n{summary}\n --------------------')

# Run the Discord bot
client.run(DISCORD_TOKEN)
