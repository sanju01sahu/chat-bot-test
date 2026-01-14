import{SecretsManagerClient, GetSecretValueCommand,} from "@aws-sdk/client-secrets-manager"
import mysql from "mysql2/promise"
import dotenv from 'dotenv'

dotenv.config()
// AWS Secrets Manager
// const secretName = process.env.DB_SECRET_NAME;
const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
const concordSecret = process.env.CONCORD_CRM_SECRET;
let concordPoolPromise = null;

export const dbPool = async () => {
  if (concordPoolPromise) {
    return concordPoolPromise;
  }
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: concordSecret,
      VersionStage: "AWSCURRENT",
    })
  );
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = JSON.parse(
    response.SecretString
  );
  concordPoolPromise = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
  });
  return concordPoolPromise;
};
