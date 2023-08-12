import { S3 } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
config()

const s3config = {
  s3: new S3({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEI_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }),
  aws_bucket: 'uploads-desi'
}


export default s3config