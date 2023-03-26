import streamlit as st
import openai
import gpt_index
from gpt_index import download_loader
from gpt_index import GPTSimpleVectorIndex, GPTTreeIndex, SimpleDirectoryReader
from streamlit_chat import message
import langchain
from langchain import OpenAI
from langchain.chains import VectorDBQAWithSourcesChain
import os
from PIL import Image
from pathlib import Path
from s3path import S3Path
import boto3
from streamlit_extras.no_default_selectbox import selectbox
import streamlit_analytics
import base64
import tempfile
import nltk

nltk.download('punkt')

FAVICON_IMAGE = 'img/favicon.ico'

st.set_page_config(page_title="GPT", page_icon=FAVICON_IMAGE, layout="wide", initial_sidebar_state="expanded")

openai.api_key = 'OPEN_AI_API_KEY'
OPENAI_API_KEY = openai.api_key

BUCKET_NAME = 'coursedelta'

s3_client = boto3.client('s3', 
    aws_access_key_id= 'AWS_ACCESS_KEY_ID',
    aws_secret_access_key= 'AWS_SECRET_ACCESS_KEY')

os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY

MAIN_IMAGE = Image.open('img/athens_banner.jpg')

loaded = False

# Sidebar
# --------------------------------
streamlit_analytics.start_tracking()

with st.sidebar:

    def generate_response(index, prompt):
        response = index.query(prompt)
        return response

    orgs = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Delimiter='/')

    org_list = []

    if orgs.get('CommonPrefixes') is not None:
        for obj in orgs.get('CommonPrefixes'):
            org_list.append(obj.get('Prefix').strip('/'))
        
        chosen_org = selectbox(
            'Select a school/organization',
            org_list,
            no_selection_label="---",)
    
        if chosen_org:
            result = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Delimiter='/', Prefix=f'{chosen_org}/')    

            class_list = []

            if result is not None:
                for obj in result.get('CommonPrefixes'):
                    file_name = obj.get('Prefix')
                    # remove org name and trailing slash
                    file_name = file_name.replace(f'{chosen_org}/', '').strip('/')
                    class_list.append(file_name)

                chosen_class = selectbox(
                    'Select a class',
                    class_list,
                    no_selection_label="---",)

                if chosen_class:
                    files = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f'{chosen_org}/{chosen_class}/')
                    class_files = []

                    if files is not None:
                        files = files.get('Contents')

                        for obj in files:
                            f_name = obj.get('Key').split('/')[2].strip()
                            if not (f_name == '' or f_name == 'json_indices'):
                                name = obj.get('Key').replace(f'{chosen_org}/{chosen_class}/', '').strip('/')
                                class_files.append(name)

                        file = selectbox(
                        'Choose a file (might take some time to load)',
                        class_files,
                        no_selection_label="---",)

                        if file:
                            json_files = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f'{chosen_org}/{chosen_class}/json_indices/')

                            if json_files is not None:
                                json_files = json_files.get('Contents')

                            json_files_list = []

                            for obj in json_files:
                                f_name = obj.get('Key').split('/')[3].strip()
                                # remove the .json
                                f_name = f_name.replace('.json', '')
                                json_files_list.append(f_name)

                            if file not in json_files_list:
                                st.write('First time loading this file, generating index for future use...')
                                S3Reader = download_loader("S3Reader")

                                loader = S3Reader(bucket=BUCKET_NAME, key=f'{chosen_org}/{chosen_class}/{file}',
                                                aws_access_id='AWS_ACCESS_KEY_ID',
                                                aws_access_secret='AWS_SECRET_ACCESS_KEY')

                                documents = loader.load_data()

                                index = GPTSimpleVectorIndex(documents)

                                # create temp directory for upload
                                with tempfile.TemporaryDirectory() as temp_dir:
                                    index.save_to_disk(f'{temp_dir}/{file}.json')
                                    with open(f"{temp_dir}/{file}.json", "rb") as f:
                                        s3_client.upload_fileobj(f, BUCKET_NAME, f'{chosen_org}/{chosen_class}/json_indices/{file}.json')
                            
                            st.write('Loading file from index...')
                            # download json temporarily to load index
                            with tempfile.TemporaryDirectory() as temp_dir:
                                s3_client.download_file(BUCKET_NAME, f'{chosen_org}/{chosen_class}/json_indices/{file}.json', f'{temp_dir}/{file}.json')

                                index = GPTSimpleVectorIndex.load_from_disk(f'{temp_dir}/{file}.json')

                                st.write('Loaded!')

                                loaded = True

                                #s3_client.upload_fileobj('input.json', BUCKET_NAME, f'{chosen_org}/{chosen_class}/json_indices/{f}')



                                # if not (f_name == '' or f_name == 'json_indices'):
                                #     name = obj.get('Key').replace(f'{chosen_org}/{chosen_class}/json_indices/', '').strip('/')
                                #     json_files_list.append(name)





                            # documents = loader.load_data()

                            # index = GPTSimpleVectorIndex(documents)
                            #loaded = True

# @st.experimental_memo(ttl=600)
# def displayPDF(file):
#     # Opening file from file path
#     with open(file, "rb") as f:
#         base64_pdf = base64.b64encode(f.read()).decode('utf-8')

#     # Embedding PDF in HTML
#     pdf_display = F'<iframe src="data:application/pdf;base64,{base64_pdf}" width="700" height="1000" type="application/pdf">'

#     # Displaying File
#     st.markdown(pdf_display, unsafe_allow_html=True)

if loaded:
    col1, col2 = st.columns(2)
    with col1:
        st.header("Enter Prompt")

        # col1, col2, col3 = st.columns([1,1,1])
        # with col1:
        st.info('*Summarize this document*')
        # with col2:
        #st.write('{Explain what is meant by ...}')
        # with col3:
        st.info('*What are some follow-up questions?*')

        input_text = st.text_area(label="Sample prompts ⬆", height=100)
        chat_button = st.button("Do the Magic! ✨")

        if chat_button and input_text.strip() != "":
            with st.spinner("Loading...💫"):
                openai_answer = generate_response(index, input_text)
                st.success(openai_answer)
        else:
            st.error("Please enter something! ⚠")
    with col2:
        st.header("File Preview")

        if file.endswith('.pdf'):
            st.write('May experience preview issues with Chrome, try Firefox or Safari if preview does not load.')
            with tempfile.TemporaryDirectory() as temp_dir:
                filepath = f'{temp_dir}/{file}'
                s3_client.download_file(BUCKET_NAME, f'{chosen_org}/{chosen_class}/{file}', f'{temp_dir}/temp.pdf')

                # only works with hard-coded file name for some reason
                with open(f'{temp_dir}/temp.pdf', "rb") as f:
                    base64_pdf = base64.b64encode(f.read()).decode('utf-8')

                # Embedding PDF in HTML
                pdf_display = F'<iframe src="data:application/pdf;base64,{base64_pdf}" width="700" height="900" type="application/pdf">'

                # Displaying File
                st.markdown(pdf_display, unsafe_allow_html=True)
        elif file.endswith('.txt'):
            with tempfile.TemporaryDirectory() as temp_dir:
                filepath = f'{temp_dir}/{file}'
                s3_client.download_file(BUCKET_NAME, f'{chosen_org}/{chosen_class}/{file}', f'{temp_dir}/temp.txt')

                # only works with hard-coded file name for some reason
                with open(f'{temp_dir}/temp.txt', "r") as f:
                    st.write(f.read())
        elif file.endswith('.jpg') or file.endswith('.png'):
            st.write('JPG and PNG files are not supported for preview, querying might not work correctly.')
        else:
            st.warning("File preview not supported for given file type.")
            st.write("Prompting should still be functional.")

else:
    image = st.image(MAIN_IMAGE, use_column_width='auto')
    st.title("Welcome to AthensGPT! 🏛️")
    st.markdown("> ### ChatGPT for your documents")
    st.markdown('Click [here](https://docs.google.com/forms/d/e/1FAIpQLSfHib8QlR8tTJx42oLWwenqjN_sls54JanXnCh05l4SQ1R-zg/viewform) to stay updated!')
    st.warning("Select a class or upload your own file(s) from the sidebar to get started. Or try out our new AI text detector tool.")
# --------------------------------


# Hide bottom watermark
# --------------------------------
hide_menu_style = """
        <style>
        #MainMenu {visibility: hidden; }
        footer {visibility: hidden;}
        </style>
        """
st.markdown(hide_menu_style, unsafe_allow_html=True)
# --------------------------------

streamlit_analytics.stop_tracking(unsafe_password="a")
