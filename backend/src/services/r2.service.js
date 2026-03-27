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

// Cache simple en memoria
const signedUrlCache = new Map();

const uploadToR2 = async (file) => {
  const key = `videos/${uuidv4()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await client.send(command);

  return key; // Guardamos solo la clave, no la URL completa
};

const getSignedVideoUrl = async (key) => {
  const now = Date.now();

  // Verificamos si ya tenemos URL válida en cache
  if (signedUrlCache.has(key)) {
    const { url, expiresAt } = signedUrlCache.get(key);
    if (now < expiresAt) return url;
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: 60 * 20, // 20 minutos
  });

  // Guardamos en cache
  signedUrlCache.set(key, { url, expiresAt: now + expiresIn * 1000 });

  return url;
};

module.exports = { uploadToR2, getSignedVideoUrl };