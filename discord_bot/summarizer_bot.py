import discord
import openai
import os
import datetime
from discord.ext import commands, tasks
from dotenv import load_dotenv
import requests

utc = datetime.timezone.utc

load_dotenv()

POLYBASE_URL = "https://example.com/ENDPOINT"

openai.api_key = os.getenv("OPENAI_API_KEY")
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
CHANNEL_ID = int(os.getenv("CHANNEL_ID"))
SERVER_ID = int(os.getenv("SERVER_ID"))

# print(openai.api_key)
# print(DISCORD_TOKEN)
# print(CHANNEL_ID)
# print(SERVER_ID)

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
    await channel.send("Hello! I am a summarizer bot. I summarize messages in the #announcements channel.")

@client.event
async def on_message(message):
    # get a reference to the server you want to list the text channels for
    server = client.get_guild(SERVER_ID) # replace 'server_id' with the ID of the server you want to list the text channels for
    print(type(SERVER_ID))
    print(server)

    # get a list of all the text channels in the server
    text_channels = [channel.name for channel in server.text_channels]
    
    if 'summarizer-channel' not in text_channels:
        await message.guild.create_text_channel('summarizer-channel')
    
    # # Find the announcements channel by name (change 'announcements' to the actual channel name)
    # channel = discord.utils.get(client.get_all_channels(), name='announcements')

    # # Get all messages in the channel since yesterday
    # yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    # messages = await channel.history(after=yesterday)
    # print(f"messages: {messages}")

    if message.content.startswith('!summarize'):
        await message.channel.send('Generating summary...this may take some time depending on the length of the messages in #announcements.')

        # Find the announcements channel
        announcements_channel = discord.utils.get(client.get_all_channels(), name='announcements')

        print(f'announcements: {announcements_channel}')

        # # Get the last 10 messages from the channel
        # messages = await announcements_channel.history(limit=10)
        
        # # Save the message contents in an array
        # message_contents = []
        # for message in messages:
        #     message_contents.append(message.content)

        # print(message_contents)

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
            temperature=0.5,
            n=1,
            stop=None,
            timeout=60,
        )

        summary = str(response['choices'][0]['message']['content']).strip()

        summary_channel = discord.utils.get(client.get_all_channels(), name='summarizer-channel')
        #print(summary_channel)
        
        # Send the summary to a designated channel in your Discord server
        #summary_channel = client.get_channel(CHANNEL_ID)
        await summary_channel.send(f'-------------------- \n **Summary:** \n{summary}\n --------------------')

        params = {
            "summary": summary
        }

        response = requests.get(POLYBASE_URL, params=params)

        # handle response
        if response.status_code == 200:
            # request was successful
            print(response.text)
        else:
            # request failed
            print("Request failed with status code:", response.status_code)
    
    # # Check if the message is in the announcements channel
    # if message.channel.name == 'announcements':
    #     # get the last message
    #     msg_arr = []
    #     async for msg in message.channel.history(limit=10):
    #         #latest_message = msg
    #         msg_arr.append(msg.content)

    #     latest_message = ''.join(msg_arr)

    #     text = f"Summarize the following text in bullet point format, while ignoring '@everyone' and including links where necessary: {latest_message}"

    #     item =  {"role": "user", "content": text}
    #     messages.append(item)
        
    #     # Generate a summary of the message using GPT-3
    #     response = openai.ChatCompletion.create(
    #         model="gpt-3.5-turbo",
    #         messages=messages,
    #         # max_tokens=50,
    #         # temperature=0.5,
    #         # n=1,
    #         # stop=None,
    #         # timeout=60,
    #     )

    #     summary = str(response['choices'][0]['message']['content']).strip()

    #     summary_channel = discord.utils.get(client.get_all_channels(), name='summarizer-channel')
    #     print(summary_channel)
        
    #     # Send the summary to a designated channel in your Discord server
    #     #summary_channel = client.get_channel(CHANNEL_ID)
    #     await summary_channel.send(f'-------------------- \n **Summary:** \n{summary}\n --------------------')

# Run the Discord bot
client.run(DISCORD_TOKEN)
