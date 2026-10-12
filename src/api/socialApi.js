import axiosClient from "./axiosClient";

const BASE = "/api/social";

const socialApi = {
  // ======================================================
  // POSTS
  // ======================================================
  getPosts: (filters = {}) =>
    axiosClient.get(`${BASE}/posts/`, {
      params: filters,
    }),

  getPost: (postId) => axiosClient.get(`${BASE}/posts/${postId}/`),

  createPost: (data) => {
    // If FormData (has files), use multipart header, else standard JSON
    const isFormData = data instanceof FormData;
    return axiosClient.post(`${BASE}/posts/`, data, isFormData ? {
      headers: { "Content-Type": "multipart/form-data" },
    } : {});
  },

  editPost: (postId, data) =>
    axiosClient.patch(`${BASE}/posts/${postId}/`, data),

  deletePost: (postId) =>
    axiosClient.delete(`${BASE}/posts/${postId}/`),

  // Like / Unlike
  likePost: (postId) =>
    axiosClient.post(`${BASE}/posts/${postId}/like/`),

  unlikePost: (postId) =>
    axiosClient.delete(`${BASE}/posts/${postId}/like/`),

  // ======================================================
  // COMMENTS
  // ======================================================
  addComment: (postId, content, parentId = null) =>
    axiosClient.post(`${BASE}/posts/${postId}/comments/`, {
      content,
      parent_id: parentId,
    }),

  getComments: (postId) =>
    axiosClient.get(`${BASE}/posts/${postId}/comments/list/`),

  deleteComment: (postId, commentId) =>
    axiosClient.delete(`${BASE}/posts/${postId}/comments/`, {
      data: { comment_id: commentId },
    }),

  // ======================================================
  // COMMUNITIES (Circles / Guilds)
  // ======================================================
  getCommunities: (params = {}) =>
    axiosClient.get(`${BASE}/communities/`, { params }),

  createCommunity: (data) =>
    axiosClient.post(`${BASE}/communities/`, data),

  getCommunityDetail: (slugOrId) =>
    axiosClient.get(`${BASE}/communities/${slugOrId}/`),

  joinCommunity: (communityId) =>
    axiosClient.post(`${BASE}/communities/${communityId}/membership/`),

  leaveCommunity: (communityId) =>
    axiosClient.delete(`${BASE}/communities/${communityId}/membership/`),

  // ======================================================
  // ACTIVITIES & CHALLENGES
  // ======================================================
  getActivities: (params = {}) =>
    axiosClient.get(`${BASE}/activities/`, { params }),

  createActivity: (data) =>
    axiosClient.post(`${BASE}/activities/`, data),

  getActivityDetail: (slugOrId) =>
    axiosClient.get(`${BASE}/activities/${slugOrId}/`),

  participateActivity: (activityId, data) =>
    axiosClient.post(`${BASE}/activities/${activityId}/participate/`, data),

  // ======================================================
  // DISCOVERY & SEARCH
  // ======================================================
  getDiscovery: (params = {}) =>
    axiosClient.get(`${BASE}/discover/`, { params }),

  searchAll: (query) =>
    axiosClient.get(`${BASE}/search/`, { params: { q: query } }),

  // ======================================================
  // FOLLOW & BLOCK
  // ======================================================
  followUser: (userId) =>
    axiosClient.post(`${BASE}/users/${userId}/follow/`),

  unfollowUser: (userId) =>
    axiosClient.delete(`${BASE}/users/${userId}/follow/`),

  getFollowers: (userId) =>
    axiosClient.get(`${BASE}/users/${userId}/followers/`),

  getFollowing: (userId) =>
    axiosClient.get(`${BASE}/users/${userId}/following/`),

  blockUser: (userId) =>
    axiosClient.post(`${BASE}/users/${userId}/block/`),

  unblockUser: (userId) =>
    axiosClient.delete(`${BASE}/users/${userId}/block/`),

  getBlockedUsers: () =>
    axiosClient.get(`${BASE}/users/blocked/`),

  // ======================================================
  // SAFETY & REPORTING
  // ======================================================
  submitReport: (data) =>
    axiosClient.post(`${BASE}/reports/`, data),

  // ======================================================
  // NOTIFICATIONS
  // ======================================================
  getNotifications: () =>
    axiosClient.get(`${BASE}/notifications/`),

  markNotificationRead: (notificationId = null) =>
    axiosClient.post(`${BASE}/notifications/read/`, {
      notification_id: notificationId,
    }),

  // ======================================================
  // MESSAGES
  // ======================================================
  sendMessage: (userId, text) =>
    axiosClient.post(`${BASE}/messages/${userId}/send/`, { text }),

  getMessages: (userId) =>
    axiosClient.get(`${BASE}/messages/${userId}/`),

  getInbox: () =>
    axiosClient.get(`${BASE}/messages/inbox/`),

  // ======================================================
  // USER PROFILES
  // ======================================================
  getProfile: (userId) =>
    axiosClient.get(`${BASE}/users/${userId}/profile/`),

  updateProfile: (data) =>
    axiosClient.patch(`/auth/profile/`, data),

  getSuggestedUsers: () =>
    axiosClient.get(`${BASE}/users/suggested/`),

  // ======================================================
  // MULTIPLAYER LEARNING WORLD (DakshAI Social v4)
  // ======================================================
  getLobby: () =>
    axiosClient.get(`${BASE}/lobby/`),

  pingSession: (status, conceptId = null) =>
    axiosClient.post(`${BASE}/session/ping/`, { status, concept_id: conceptId }),

  getTickets: (eligible = false) =>
    axiosClient.get(`${BASE}/exchange/tickets/`, { params: { eligible: eligible ? "true" : "false" } }),

  createTicket: (conceptId) =>
    axiosClient.post(`${BASE}/exchange/tickets/`, { concept_id: conceptId }),

  performTicketAction: (ticketId, action) =>
    axiosClient.post(`${BASE}/exchange/tickets/${ticketId}/action/`, { action }),

  // ======================================================
  // CONCEPT SPARKS & DETERMINISTIC INSIGHTS
  // ======================================================
  getConceptSparks: (conceptId) =>
    axiosClient.get(`${BASE}/concept-sparks/${conceptId}/`),

  getProgressInsights: () =>
    axiosClient.get(`${BASE}/insights/`),
};

export default socialApi;
