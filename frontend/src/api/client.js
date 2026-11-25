const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || (data?.data && JSON.stringify(data.data)) || 'Request failed';
    throw new Error(errorMsg);
  }

  return data?.data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getCurrentUser: () => request('/users/me'),
  getPublicUser: (id) => request(`/users/${id}/public`),

  // Properties
  searchProperties: (params = {}) => {
    const query = new URLSearchParams();
    if (params.city) query.append('city', params.city);
    if (params.minRent) query.append('minRent', params.minRent);
    if (params.maxRent) query.append('maxRent', params.maxRent);
    if (params.bachelorFriendly !== undefined) query.append('bachelorFriendly', params.bachelorFriendly);
    return request(`/properties?${query.toString()}`);
  },
  getProperty: (id) => request(`/properties/${id}`),
  createProperty: (payload) => request('/properties', { method: 'POST', body: JSON.stringify(payload) }),
  getMyProperties: () => request('/properties/my'),

  // Connections
  sendConnection: (propertyId, message) => 
    request(`/connections/properties/${propertyId}`, { method: 'POST', body: JSON.stringify({ message }) }),
  getIncomingConnections: () => request('/connections/incoming'),
  getOutgoingConnections: () => request('/connections/outgoing'),
  acceptConnection: (id) => request(`/connections/${id}/accept`, { method: 'PUT' }),
  rejectConnection: (id) => request(`/connections/${id}/reject`, { method: 'PUT' }),

  // Stays
  createStay: (payload) => request('/stays', { method: 'POST', body: JSON.stringify(payload) }),
  getMyStays: () => request('/stays/my'),
  getStay: (id) => request(`/stays/${id}`),
  confirmMoveIn: (id) => request(`/stays/${id}/confirm-move-in`, { method: 'PUT' }),
  confirmMoveOut: (id) => request(`/stays/${id}/confirm-move-out`, { method: 'PUT' }),
  disputeStay: (id, reason) => request(`/stays/${id}/dispute`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Reviews
  submitReview: (stayId, payload) => 
    request(`/stays/${stayId}/reviews`, { method: 'POST', body: JSON.stringify(payload) }),
  getPropertyReviews: (propertyId) => request(`/properties/${propertyId}/reviews`),
  getUserReviews: (userId) => request(`/users/${userId}/reviews`),
};
