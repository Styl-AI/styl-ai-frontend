export function processConversation(conversation) {
    try {
        const processedMessages = [];
        if(conversation?.conversationsList?.length>0){

            conversation?.conversationsList.forEach((msg) => {
              const message = msg.conversation.user_query;
              const parsedContent = msg.conversation.ai_response;
              const googleSearchResp = msg?.conversation?.google_search_response
              const messageId = msg["_id"] ?? ""
          
              processedMessages.push(
                { text: message, isUser: true, productList: [] },
                {
                  text: parsedContent ?? [],
                  isUser: false,
                  productList: googleSearchResp ?? [],
                  messageId:messageId 
                }
              );
            });
        }
      
        return processedMessages;
        
    } catch (error) {
        console.error("error while processing conversation",{error});
        return []
    }
  }

export function formatConversation(conversationData) {
    const formattedConversation = conversationData?.conversationsList?.map(conversation => {
        return {
            user_reply: conversation?.conversation?.user_query,
            ai_response: conversation?.conversation.ai_response?.ai_reply,
            google_search_response: conversation?.conversation?.google_search_response
        };
    });

    return formattedConversation;
}
