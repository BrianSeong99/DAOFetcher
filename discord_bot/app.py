import openai

openai.api_key = "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"

messages = []

def gpt_response(msg):
    item =  {"role": "user", "content": msg}
    messages.append(item)
    # ChatGPT is powered by gpt-3.5-turbo, OpenAI’s most advanced language model.
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    return str(response['choices'][0]['message']['content']).strip()

def main():
    print(gpt_response("Summarize the following text: 1. A lot of people have no clue when they first join a DAO discord server, and gets really easy for people to get overwhelmed by the amounts of informations in discord. 2. Not everybody wants to  buy the membership first to get to know a DAO community, if there can be a cheaper or lighter access to the community to get to know the DAO first before they make their purchase decision, would solve the problem. 3. Not everyone has the same chain access to DAO communities, some might only have a chain gas token that is not native to the original DAO community’s membership NFT. We propose a DAO intelligence tool, for those who just want to know whats going on with the DAO instead of interacting with the discord server. Get up to date with the latest information with a digest."))

if __name__ == "__main__":
    main()
