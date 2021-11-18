const jimp = require('jimp');
const AWS=require("aws-sdk");
const s3Client = new AWS.S3({region:'us-east-2'})
async function get(fileName, bucket) {
        const params = {
            Bucket: bucket,
            Key: fileName,
        };

        let data = await s3Client.getObject(params).promise();
      
        if (!data) {
            throw Error(`Failed to get file ${fileName}, from ${bucket}`);
        }
        return data;
}

async function write(data, fileName, bucket, ACL, ContentType) {
        const params = {
            Bucket: bucket,
            Body: Buffer.isBuffer(data) ? data : JSON.stringify(data),
            Key: fileName,
            ACL,
            ContentType,
        };
        console.log('params', params);

        const newData = await s3Client.putObject(params).promise();
        
        if (!newData) {
            throw Error('there was an error writing the file');

        }

        return newData;
    }

const createThumbnail = async (event, context)=>{

  const  bucket="thumbnailpoc"; const file='10mb.jpg' ;const width=1920;const height= 974; 
    const imageBuffer = await get(file, bucket);
  
     const jimpImage = await jimp.read(imageBuffer.Body);
    const mime = jimpImage.getMIME();
    // //resize(w,h).write('resize1.png');
     const resizedImageBuffer = await jimpImage.resize(width, height).getBufferAsync(mime);
     const newFileName = "thumbnail-"+file;

     await write(resizedImageBuffer, newFileName, bucket, 'public-read', mime);
     return "done";
};

module.exports={createThumbnail}

