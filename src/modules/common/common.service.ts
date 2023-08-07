import aws from 'aws-sdk'
import config from 'config'
import crypto from 'crypto'
import moment from 'moment'
import { promisify } from 'util'
const randomBytes = promisify(crypto.randomBytes)

const region = 'eu-central-1'
const bucketName = config.get<string>('awsS3Bucket')
const accessKeyId = config.get<string>('awsS3AccessKeyId')
const secretAccessKey = config.get<string>('awsS3SecretAccessKey')

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export async function generateUploadURL({ fileName, model: model }: { fileName: string; model: string }) {
  const rawBytes = await randomBytes(16)
  const date = moment().format('YYYYMMDD')
  const rawBytesString = rawBytes.toString('hex')

  const cleanFileName = fileName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const newFilename = `${model}/${date}-${rawBytesString}-${cleanFileName}`

  const params = {
    Bucket: bucketName,
    Key: newFilename,
    Expires: 60
  }

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}
