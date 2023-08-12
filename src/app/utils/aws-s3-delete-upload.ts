import configs from '../config/s3'

export const awsS3DeleteImage = async (key: string): Promise<void> => {
  const s3 = configs.s3

  await s3.deleteObject({
    Bucket: configs.aws_bucket,
    Key: key
  })
}