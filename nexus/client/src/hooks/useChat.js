import { useMemo } from 'react';

import { useChatContext } from '../context/ChatContext';

export function useChat(agent) {
  const { messagesByAgent, pushMessage, resetMessages, updateMessage } = useChatContext();

  return useMemo(
    () => ({
      messages: messagesByAgent[agent] || [],
      pushMessage: (message) => pushMessage(agent, message),
      updateMessage: (id, patch) => updateMessage(agent, id, patch),
      resetMessages: () => resetMessages(agent)
    }),
    [agent, messagesByAgent, pushMessage, resetMessages, updateMessage]
  );
}
