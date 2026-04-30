import { collectionsDemo, demoUser } from './demoCatalog.js';

const memoryUsers = [
  {
    id: demoUser.id,
    name: demoUser.name,
    email: demoUser.email,
    passwordHash: '$2b$10$LwGg.rZoV8qvHTTbs5iJ4eSZRvb.jm0X4v9Oc/mF0L4BjB5gb85mu'
  }
];

const memoryCollections = [...collectionsDemo];

export function listMemoryUsers() {
  return memoryUsers;
}

export function listMemoryCollections() {
  return memoryCollections;
}

export function upsertMemoryUser(user) {
  const existingIndex = memoryUsers.findIndex((entry) => entry.email === user.email);

  if (existingIndex >= 0) {
    memoryUsers[existingIndex] = { ...memoryUsers[existingIndex], ...user };
    return memoryUsers[existingIndex];
  }

  memoryUsers.push(user);
  return user;
}

export function addMemoryCollection(collection) {
  memoryCollections.unshift(collection);
  return collection;
}

export function deleteMemoryCollection(id) {
  const index = memoryCollections.findIndex((entry) => entry.id === id || entry._id?.toString() === id);

  if (index === -1) {
    return false;
  }

  memoryCollections.splice(index, 1);
  return true;
}

