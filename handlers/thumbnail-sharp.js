const sharp = require('sharp');
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

  const  bucket="thumbnailpoc"; const file='10mb.jpg' ;const width=1924 ;const height=974 
  console.log("Starting")
    const imageBuffer = await get(file, bucket);
  console.log("fetched")
    const mime= imageBuffer.ContentType;
    const resizedImageBuffer= await sharp(imageBuffer.Body)
    .resize(200, 200)
    .toFormat('jpg')
    .toBuffer()

      console.log(resizedImageBuffer)
      const newFileName = "Sharp-thumbnail-"+file;



 console.log("writing")
      await write(resizedImageBuffer, newFileName, bucket, 'public-read', mime);
     return "done";
};

module.exports={createThumbnail}

