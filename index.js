// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const { AdaptiveCardsBot } = require('./bots/adaptiveCardsBot');

// Read botFilePath and botFileSecret from .env file.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

console.log(process.env.MicrosoftAppID);
console.log(process.env.MicrosoftAppPassword);

// Create adapter. See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    //appId: process.env.MicrosoftAppID,
    //appPassword: process.env.MicrosoftAppPassword
    appId: '37608e1c-79b0-48e1-a074-e01be75fe53c',
    appPassword: 'U2=_-P0a.dRJX25@[_UN-qJZPf.Yi5/R'
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log v.s. Application Insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user.
    await context.sendActivity(`Oops. Something went wrong!`);
};

// Create the AdaptiveCardsBot.
const bot = new AdaptiveCardsBot();

// Create HTTP server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
