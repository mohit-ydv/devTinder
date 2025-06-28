require('dotenv').config();
const { SESClient } = require('@aws-sdk/client-ses');
const { fromEnv } = require("@aws-sdk/credential-provider-env");

const REGION = "ap-south-1";

const sesClient = new SESClient({
    region: REGION,
    credentials: fromEnv(), // loads from AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
});

module.exports = {
    sesClient
}