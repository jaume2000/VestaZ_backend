import { SessionsClient } from '@google-cloud/dialogflow-cx';

export async function chatbotService(text:string, sessionId:string):Promise<any> {
    if (!text || !sessionId) {
    throw new Error('El texto y el ID de sesión son obligatorios.');
    }

    // Configurar el cliente de Dialogflow CX
    const client = new SessionsClient({
        apiEndpoint: 'europe-west1-dialogflow.googleapis.com',
    });
    
    const sessionPath = client.projectLocationAgentSessionPath(
    process.env.PROJECT_ID!,
    process.env.LOCATION!,
    process.env.AGENT_ID!,
    sessionId
    );

    // Crear la solicitud
    const request = {
    session: sessionPath,
    queryInput: {
        text: {
        text: text,
        },
        languageCode: process.env.LANGUAGE_CODE!,
    },
    };

    // Enviar la solicitud a Dialogflow
    const [response] = await client.detectIntent(request);

    // Responder con el resultado de Dialogflow
    const queryResult = response.queryResult;
    if (!queryResult) {
        throw new Error('No se pudo obtener el resultado de Dialogflow.');
    }
    console.log(queryResult.responseMessages);
    return {
    response: queryResult?.responseMessages?.map((msg) => msg.text?.text).flat(),
    intent: queryResult?.intent?.displayName,
    parameters: queryResult?.parameters?.fields,
    }
}
  