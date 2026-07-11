import { Client } from "pg";

async function query(queryText, params) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();

    const result = await client.query(queryText, params);

    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA_CERT_BASE64) {
    return {
      ca: Buffer.from(process.env.POSTGRES_CA_CERT_BASE64, "base64").toString(
        "utf8",
      ),
      rejectUnauthorized:
        process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== "false",
    };
  }

  return process.env.NODE_ENV === "development" ? false : true;
}
