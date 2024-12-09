import {Request, Response} from 'express';
import { chatbotService } from '../services/dialogflow.service';
import { addHistoryService } from '../services/history.service';


export async function chatbotChat(req: Request, res: Response): Promise<void> {
    
    const user = req.user;
    if (!user) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    const user_id = user.id;
    if (!user_id) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }


    try{
        const {message, sessionID} = req.body as {message: string, sessionID: string};
        const historyData = [
            {
                message: message,
                bot: false,
                timestamp: Date.now()
            }
        ];

        const response = await chatbotService(message, sessionID);

        historyData.push({
                message: response.response.join(' '),
                bot: true,
                timestamp: Date.now()
            });

        addHistoryService({
            type: 'chat',
            data: {
                sessionID: sessionID,
                history: historyData
            }
        }, [], user_id);
        
        res.json(response);
    }
    catch(error){
        console.log(error);
        if ((error as any).message === 'Machine already exists'){
            res.status(400).json({message: 'Machine already exists'});
            return;
        }
        else {
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}