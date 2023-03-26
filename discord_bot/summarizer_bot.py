import discord
import openai
import os
import datetime
from discord.ext import commands, tasks
from dotenv import load_dotenv
import requests

utc = datetime.timezone.utc

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
CHANNEL_ID = int(os.getenv("CHANNEL_ID"))
SERVER_ID = int(os.getenv("SERVER_ID"))

POLYBASE_URL = "https://testnet.polybase.xyz/v0/collections/ConversationMessages/records"
headers = {
    "Accept": "application/json",
    # "X-Polybase-Signature": "v=0,t=1671884992,h=eth-personal-sign,sig=0xd5ba40aff8360200c802895e2106a9a8b809f99be35fcdf4d751e516256b17307afba149f48c1a8f4dde171cf43b6c225ec42cc641fda45894ab73ca5b4c738e/DAO-Fetcher"
}
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
        #await message.channel.send('Generating summary...this may take some time depending on the length of the messages in #announcements.')

        # Find the announcements channel
        announcements_channel = discord.utils.get(client.get_all_channels(), name='announcements')

        # # Get the last 5 messages from the channel
        # messages = await announcements_channel.history(limit=5)
        
        # # Save the message contents in an array
        # message_contents = []
        # for message in messages:
        #     message_contents.append(message.content)

        # print(message_contents)

        announcements_channel = client.get_channel(1088205336806182962)

        # get the last 5 messages from the channel
        message_contents = []
        async for msg in announcements_channel.history(limit=3):
            message_contents.append(msg.content)

        # # get the last 5 messages
        # msg_arr = []
        # async for msg in message.channel.history(limit=6):
        #     #latest_message = msg
        #     msg_arr.append(msg.content)

        # # drop the first message (the command)
        # msg_arr.pop(0)

        latest_message = ''.join(message_contents)

        print(f'latest_message: {latest_message}')

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

        data = {
            "args": [summary]
        }

        # send request
        response = requests.post(POLYBASE_URL, json=data, headers=headers)

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
