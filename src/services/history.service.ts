import { IReferenceSet } from '../models/referenceSet.model';
import User from '../models/user.model';
import { HistoryInputType } from '../schemas/history.schema';


export async function getHistoryService(user_id:string) {
    const user_with_history = await User.findById(user_id, 'history').populate('history').exec();
    return user_with_history?.history;
}


export async function addHistoryService(inputData:HistoryInputType, results:IReferenceSet[], user_id:string) {

    const user = await User.findById(user_id)
    if(!user) {
        console.log("User not found");
        return;
    }
    
    if (inputData.type === 'chat') {
        const { sessionID, history } = inputData.data;
        const chat = user.history.chats.get(sessionID);
        if (chat !== undefined) {
            chat.push(...history);
        }
        else {
            user.history.chats.set(sessionID, history);
        }
    }
    else if (inputData.type === 'search') {
        user.history.searches.push({
            ...inputData.data,
            results: results,
            timestamp: inputData.data.timestamp
        });
    }

    await user.save();
}