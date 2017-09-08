import { IAddress, IMessage, UniversalBot } from 'botbuilder';
import { ConversationState } from '../../src/IConversation';
import { sendMirrorMessages } from '../utils';
// import { IHandoffMessage } from './../IHandoffMessage';
import { IProvider } from './../provider/IProvider';

/**
 * mirrors messages sent to the customer, whether they be from the bot or agents.
 * @param provider data provider for transcription services
 */
export function getBotMirrorMiddleware(bot: UniversalBot, provider: IProvider): (s: IMessage, n: Function) => Promise<void> {
    return async (message: IMessage, next: Function): Promise<void> => {
        const convo = await provider.getOrCreateNewCustomerConversation(message.address);

        // if in agent mode, bot messages are either going to or from a customer/agent
        if (convo.conversationState !== ConversationState.Agent) {
            // const messagesToSend =
            //     convo.watchingAgents.map((watchingAddress: IAddress) => Object.assign({}, message, { address: watchingAddress }));
            const agentMirrorAddresses = convo.watchingAgents;

            sendMirrorMessages(bot, message, convo.watchingAgents);
        }
// TODO => DELETE THIS
        next();
    };
}