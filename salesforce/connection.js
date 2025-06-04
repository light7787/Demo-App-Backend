require('dotenv').config();
const jsforce = require('jsforce');

let connection;

async function getConnection() {
  if (connection && connection.accessToken) {
    return connection;
  }

  connection = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL
  });

  try {
    const passwordWithToken = process.env.SF_PASSWORD + process.env.SF_TOKEN;
    await connection.login(
      process.env.SF_USERNAME,
      passwordWithToken
    );
    console.log('Successfully connected to Salesforce');
    return connection;
  } catch (error) {
    console.error('Salesforce connection error:', error.message);
    throw error;
  }
}

module.exports = { getConnection };