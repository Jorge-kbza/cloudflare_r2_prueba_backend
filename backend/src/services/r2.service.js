const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

const uploadToR2 = async (file) => {
  const key = `videos/${uuidv4()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await client.send(command);

  // URL pública (simple) `${process.env.R2_ENDPOINT/
  const url = key; // Guardamos solo la clave, no la URL completa

  return url;
};

const getSignedVideoUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: 60 * 20, // 20 minutos
  });

  return url;
};

module.exports = { uploadToR2, getSignedVideoUrl };