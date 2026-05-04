import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ChatContext = createContext(null);

const welcomeMessages = {
  roadmap: [],
  jobs: [
    {
      id: 'jobs-welcome',
      role: 'assistant',
      text: 'What role are you targeting?'
    }
  ],
  notes: [
    {
      id: 'notes-welcome',
      role: 'assistant',
      text: 'Athena generates structured markdown notes. Ask for a concept, lecture topic, or system overview.'
    }
  ],
  collections: [
    {
      id: 'collections-welcome',
      role: 'assistant',
      text: 'Collections tracks every saved roadmap, job lead, and note pack. Filter by topic or type here.'
    }
  ]
};

export function ChatProvider({ children }) {
  const [messagesByAgent, setMessagesByAgent] = useState(welcomeMessages);

  const pushMessage = useCallback((agent, message) => {
    const id = `${agent}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setMessagesByAgent((current) => ({
      ...current,
      [agent]: [
        ...(current[agent] || []),
        {
          id,
          ...message
        }
      ]
    }));
    return id;
  }, []);

  const updateMessage = useCallback((agent, id, patch) => {
    setMessagesByAgent((current) => ({
      ...current,
      [agent]: (current[agent] || []).map((message) => (message.id === id ? { ...message, ...patch } : message))
    }));
  }, []);

  const resetMessages = useCallback((agent) => {
    setMessagesByAgent((current) => ({
      ...current,
      [agent]: welcomeMessages[agent] || []
    }));
  }, []);

  const value = useMemo(
    () => ({
      messagesByAgent,
      pushMessage,
      updateMessage,
      resetMessages
    }),
    [messagesByAgent, pushMessage, resetMessages, updateMessage]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatContext must be used inside ChatProvider');
  }

  return context;
}
