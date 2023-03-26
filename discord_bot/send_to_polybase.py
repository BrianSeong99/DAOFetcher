
import requests

# POLYBASE_URL = "https://testnet.polybase.xyz/v0/collections/ConversationMessages/records"
POLYBASE_URL = "https://testnet.polybase.xyz/collections/testing%2FName/records"
# headers = {
#     "Accept": "application/json",
#     # "X-Polybase-Signature": "v=0,t=1671884992,h=eth-personal-sign,sig=0xd5ba40aff8360200c802895e2106a9a8b809f99be35fcdf4d751e516256b17307afba149f48c1a8f4dde171cf43b6c225ec42cc641fda45894ab73ca5b4c738e/DAO-Fetcher"
# }

headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
}

summary = "test"

data = {
    "args": ["a", "b"]
}

# send request
response = requests.post(POLYBASE_URL, headers=headers, data=data)

# handle response
if response.status_code == 200:
    # request was successful
    print(response.text)
else:
    # request failed
    print("Request failed with status code:", response.status_code)
