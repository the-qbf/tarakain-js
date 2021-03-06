// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const { ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const AdaptiveCard = require('../resources/adaptiveCard.json');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

const USER_PROFILE = 'USER_PROFILE';

class UserProfile {
    constructor(name, vote) {
        this.name = name;
        this.vote = vote;
    }
}




class MainDialog extends ComponentDialog {
    constructor(logger) {
        super('MainDialog');
        
        //this.userProfile = userState.createProperty(USER_PROFILE);

        if (!logger) {
            logger = console;
            logger.log('[MainDialog]: logger not passed in, defaulting to console');
        }

        this.logger = logger;

        // Define the main dialog and its related components.
        this.addDialog(new ChoicePrompt('cardPrompt'));

        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.choiceCardStep.bind(this),
	    this.showCardStep.bind(this)
        ]));

        // The initial child Dialog to run.
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        //this.initialDialogId = 'cardPrompt'
		
		this.RESULT = {};
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * 1. Prompts the user if the user is not in the middle of a dialog.
     * 2. Re-prompts the user when an invalid input is received.
     *
     * @param {WaterfallStepContext} stepContext
     */
    async choiceCardStep(stepContext) {
        this.logger.log('MainDialog.choiceCardStep');

        // Create the PromptOptions which contain the prompt and re-prompt messages.
        // PromptOptions also contains the list of choices available to the user.
        const options = {
            prompt: 'Tara Kain?',
            retryPrompt: 'Paki-ayos',
            choices: this.getChoices()
        };
		
		//await stepContext.repromptDialog()
		
		console.log(stepContext.context.activity)
		switch (stepContext.context.activity.text) {
        case '<at>Test</at> G':
			this.RESULT[stepContext.context.activity.from.name] = stepContext.context.activity.text;
            break;
        case '<at>Test</at> Pass':
			this.RESULT[stepContext.context.activity.from.name] = stepContext.context.activity.text;
            break;
        case '<at>Test</at> Pabili':
			this.RESULT[stepContext.context.activity.from.name] = stepContext.context.activity.text;
            break;
        default:
            break;
        }
		
		console.log(this.RESULT)
		
		
		return await stepContext.prompt('cardPrompt', options);

        // Prompt the user with the configured PromptOptions.
        //return await stepContext.repromptDialog()
    }

    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} stepContext
     */
    async showCardStep(stepContext) {
       /* this.logger.log('MainDialog.showCardStep');
        
        //console.log(stepContext)
        //console.log(stepContext.result)
        //console.log(stepContext.context)
        //console.log(stepContext.context.activity)
		//console.log(stepContext.context.activity.from)
		//console.log(stepContext.context.activity.from.name)
		//console.log(stepContext.context.activity.id)

		console.log(this.createGCard())
		
        switch (stepContext.result.value) {
        case 'G':
            await stepContext.context.sendActivity({ attachments: [this.createGCard()] });
			
            break;
        case 'Pass':
            await stepContext.context.updateActivity({ attachments: [this.createPassCard()] });
            break;
        case 'Pabili':
            await stepContext.context.sendActivity({ attachments: [this.createPabiliCard()] });
            break;
        default:
            stepContext.context.sendActivity(stepContext.result.value);
            await stepContext.context.sendActivity({
                attachments: [
                    this.createGCard(),
                    this.createPassCard(),
                    this.createPabiliCard()
                ],
                attachmentLayout: AttachmentLayoutTypes.Carousel
            });
            break;
        }
		await stepContext.context.deleteActivity(stepContext.context.activity.id);
		
        // Give the user instructions about what to do next
        //await stepContext.context.sendActivity(stepContext.result.value);

        return await stepContext.endDialog();
    */
	    stepContext.context.sendActivity(this.RESULT)
	}
    /**
     * Create the choices with synonyms to render for the user during the ChoicePrompt.
     * (Indexes and upper/lower-case variants do not need to be added as synonyms)
     */
    getChoices() {
        const cardOptions = [
            {
                value: 'G',
                synonyms: ['g']
            },
            {
                value: 'Pass',
                synonyms: ['pass']
            },
            {
                value: 'Pabili',
                synonyms: ['pabili']
            }
        ];

        return cardOptions;
    }

    // ======================================
    // Helper functions used to create cards.
    // ======================================

    createGCard() {
        return CardFactory.adaptiveCard(AdaptiveCard);
    }

    createPassCard() {
        return CardFactory.animationCard(
            'Microsoft Bot Framework',
            [
                { url: 'https://i.giphy.com/Ki55RUbOV5njy.gif' }
            ],
            [],
            {
                subtitle: 'Animation Card'
            }
        );
      //  return CardFactory.adaptiveCard(AdaptiveCard);
    }

    createPabiliCard() {
      /*  return CardFactory.audioCard(
            'I am your father',
            ['https://www.mediacollege.com/downloads/sound-effects/star-wars/darthvader/darthvader_yourfather.wav'],
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Read more',
                    value: 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back'
                }
            ]),
            {
                subtitle: 'Star Wars: Episode V - The Empire Strikes Back',
                text: 'The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leigh Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing the film\'s story and serving as executive producer. The second installment in the original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. and stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.',
                image: 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'
            }
        );*/
        return CardFactory.adaptiveCard(AdaptiveCard);
    }
}

module.exports.MainDialog = MainDialog;
