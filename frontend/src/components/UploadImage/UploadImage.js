import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import Head from 'next/head';
import { S3 } from 'aws-sdk';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import styles from '../CreateFetcher/CreateFetcher.module.css';

const AWS_REGION = 'us-west-2';
const AWS_BUCKET_NAME = 'daofetchervancouver';

const s3 = new S3({
    region: AWS_REGION,
    accessKeyId: 'AKIA3IJFF2NGKBLJ5H3U',
    secretAccessKey: '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'
});

export default function UploadImage(props) {
    const {
        imageUrl,
        setImageUrl,
    } = props;
    const [files, setFiles] = useState([])

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const s3Object = {
            Key: file.name,
            ContentType: file.type,
            Body: file,
            ACL: 'public-read'
        };
        const data = await s3.upload({ Bucket: AWS_BUCKET_NAME, ...s3Object }).promise();
        setImageUrl(data.Location);
    };
    const uploadFile = async (event) => {
        await handleFileChange(event); // Call your existing function
    };
    return (
        <div>
            {/* <div className="App">
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={true}
                    maxFiles={3}
                    server="/api"
                    name="files"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />
            </div> */}
            {/* <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head> */}

            <div>
                <input type="file" onChange={uploadFile} />
                {imageUrl && <img className={styles.iconDisplay} style={{ marginTop: "10px", border: "1px solid black" }} src={imageUrl} width={30} height={30} alt="Uploaded Image" />}
            </div>
        </div>
    );
}
