import { useMemo } from 'react';

import { useChatContext } from '../context/ChatContext';

export function useChat(agent) {
  const { messagesByAgent, pushMessage, resetMessages } = useChatContext();

  return useMemo(
    () => ({
      messages: messagesByAgent[agent] || [],
      pushMessage: (message) => pushMessage(agent, message),
      resetMessages: () => resetMessages(agent)
    }),
    [agent, messagesByAgent, pushMessage, resetMessages]
  );
}

