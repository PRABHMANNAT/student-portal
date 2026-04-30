import collectionsDemo from '../demo/collections.json';
import jobsDemo from '../demo/jobs.json';
import notesDemo from '../demo/notes.json';
import roadmapDemo from '../demo/roadmap.json';
import { apiRequest, buildApiUrl } from './client';

const LOCAL_COLLECTIONS_KEY = 'nexus-local-collections';

function readLocalCollections() {
  try {
    const raw = window.localStorage.getItem(LOCAL_COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalCollections(items) {
  window.localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(items));
}

const demoAuth = {
  token: 'demo-token',
  user: {
    id: 'demo-user',
    name: 'Demo Student',
    email: 'demo@nexus.local'
  },
  meta: {
    mode: 'demo',
    provider: 'client-fallback'
  }
};

export const roadmapApi = {
  generate(payload) {
    return apiRequest({
      path: '/api/roadmap/generate',
      method: 'POST',
      body: payload,
      fallbackData: roadmapDemo
    });
  },
  async save(payload) {
    const response = await apiRequest({
      path: '/api/roadmap/save',
      method: 'POST',
      body: payload,
      fallbackData: {
        id: `saved-${Date.now()}`,
        savedAt: new Date().toISOString(),
        meta: {
          mode: 'demo',
          provider: 'client-fallback'
        }
      }
    });

    const nextLocal = [
      {
        id: response.id,
        type: 'roadmap',
        title: payload.roadmap.title,
        summary: payload.roadmap.description || payload.roadmap.title,
        tags: ['roadmap', payload.roadmap.title.toLowerCase()],
        payload: payload.roadmap,
        savedAt: response.savedAt
      },
      ...readLocalCollections()
    ].filter(
      (item, index, items) => items.findIndex((entry) => entry.id === item.id) === index
    );

    writeLocalCollections(nextLocal);
    return response;
  },
  collections(userId) {
    return apiRequest({
      path: `/api/roadmap/collections/${userId}`,
      fallbackData: {
        roadmaps: readLocalCollections()
          .filter((item) => item.type === 'roadmap')
          .map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            savedAt: item.savedAt,
            roadmap: item.payload
          })),
        meta: {
          mode: 'demo',
          provider: 'client-fallback'
        }
      }
    });
  }
};

export const jobsApi = {
  search(payload) {
    return apiRequest({
      path: '/api/jobs/search',
      method: 'POST',
      body: payload,
      fallbackData: jobsDemo
    });
  },
  getById(id) {
    const fallbackJob = jobsDemo.jobs.find((item) => item.id === id) || jobsDemo.jobs[0];
    return apiRequest({
      path: `/api/jobs/${id}`,
      fallbackData: {
        job: fallbackJob
      }
    });
  },
  async save(payload) {
    const response = await apiRequest({
      path: '/api/jobs/save',
      method: 'POST',
      body: payload,
      fallbackData: {
        id: `saved-${Date.now()}`,
        savedAt: new Date().toISOString(),
        meta: {
          mode: 'demo',
          provider: 'client-fallback'
        }
      }
    });

    const nextLocal = [
      {
        id: response.id,
        type: 'jobs',
        title: payload.job.title,
        summary: `${payload.job.company} • ${payload.job.location}`,
        tags: ['jobs', ...(payload.job.tags || []).slice(0, 3).map((tag) => tag.toLowerCase())],
        payload: payload.job,
        savedAt: response.savedAt
      },
      ...readLocalCollections()
    ].filter(
      (item, index, items) => items.findIndex((entry) => entry.id === item.id) === index
    );

    writeLocalCollections(nextLocal);
    return response;
  }
};

export const notesApi = {
  async generateStream(payload, handlers = {}) {
    const { onChunk, onDone, onError } = handlers;

    try {
      const response = await fetch(buildApiUrl('/api/notes/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok || !response.body) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const rawEvent of events) {
          const dataLine = rawEvent
            .split('\n')
            .find((line) => line.startsWith('data: '));

          if (!dataLine) {
            continue;
          }

          const payloadText = dataLine.slice(6);

          if (payloadText === '[DONE]') {
            onDone?.({
              note: notesDemo.note,
              meta: {
                mode: 'live',
                provider: 'sse'
              }
            });
            return;
          }

          const eventPayload = JSON.parse(payloadText);

          if (eventPayload.text) {
            onChunk?.(eventPayload.text);
          }
        }
      }

      onDone?.({
        note: notesDemo.note,
        meta: {
          mode: 'live',
          provider: 'sse'
        }
      });
    } catch (error) {
      const tokens = notesDemo.note.content.match(/\S+\s*/g) || [];

      for (const token of tokens) {
        onChunk?.(token);
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }

      onError?.(error);
      onDone?.({
        note: notesDemo.note,
        meta: {
          mode: 'demo',
          provider: 'client-fallback',
          reason: error.message
        }
      });
    }
  },
  async save(payload) {
    const response = await apiRequest({
      path: '/api/notes/save',
      method: 'POST',
      body: payload,
      fallbackData: {
        id: `saved-${Date.now()}`,
        savedAt: new Date().toISOString(),
        meta: {
          mode: 'demo',
          provider: 'client-fallback'
        }
      }
    });

    const nextLocal = [
      {
        id: response.id,
        type: 'notes',
        title: payload.title,
        summary: payload.title,
        tags: ['notes', 'athena'],
        payload,
        savedAt: response.savedAt
      },
      ...readLocalCollections()
    ].filter(
      (item, index, items) => items.findIndex((entry) => entry.id === item.id) === index
    );

    writeLocalCollections(nextLocal);
    return response;
  },
  comment(payload) {
    return apiRequest({
      path: '/api/notes/comment',
      method: 'POST',
      body: payload,
      fallbackData: {
        success: true,
        comment: {
          id: `comment-${Date.now()}`,
          ...payload
        },
        meta: {
          mode: 'demo',
          provider: 'client-fallback'
        }
      }
    });
  },
  list(userId) {
    return apiRequest({
      path: `/api/notes/${userId}`,
      fallbackData: {
        notes: [notesDemo.note],
        meta: {
          mode: 'demo',
          provider: 'client-fallback'
        }
      }
    });
  }
};

export const authApi = {
  login(payload) {
    return apiRequest({
      path: '/api/auth/login',
      method: 'POST',
      body: payload,
      fallbackData: demoAuth
    });
  },
  register(payload) {
    return apiRequest({
      path: '/api/auth/register',
      method: 'POST',
      body: payload,
      fallbackData: demoAuth
    });
  },
  me(token) {
    return apiRequest({
      path: '/api/auth/me',
      token,
      fallbackData: demoAuth
    });
  }
};

export const collectionsApi = {
  async list(userId, token) {
    const response = await apiRequest({
      path: `/api/collections/${userId}`,
      token,
      fallbackData: collectionsDemo
    });

    const local = readLocalCollections();
    const serverItems = response.collections || [];
    const merged = [...local, ...serverItems].filter(
      (item, index, items) => items.findIndex((entry) => entry.id === item.id) === index
    );

    return {
      ...response,
      collections: merged.sort(
        (left, right) => new Date(right.savedAt || 0).getTime() - new Date(left.savedAt || 0).getTime()
      )
    };
  },
  async save(payload, token) {
    const response = await apiRequest({
      path: '/api/collections',
      method: 'POST',
      body: payload,
      token,
      fallbackData: {
        collection: {
          ...payload,
          id: `saved-${Date.now()}`,
          savedAt: new Date().toISOString()
        }
      }
    });

    const nextLocal = [response.collection, ...readLocalCollections()].filter(
      (item, index, items) => items.findIndex((entry) => entry.id === item.id) === index
    );
    writeLocalCollections(nextLocal);

    return response;
  },
  async remove(id, token) {
    const response = await apiRequest({
      path: `/api/collections/${id}`,
      method: 'DELETE',
      token,
      fallbackData: {
        success: true
      }
    });

    writeLocalCollections(readLocalCollections().filter((item) => item.id !== id));
    return response;
  }
};
