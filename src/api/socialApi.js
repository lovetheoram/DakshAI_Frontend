import axiosClient from "./axiosClient";

const BASE = "/api/social";

const socialApi = {
  // ======================================================
  // POSTS
  // ======================================================

  // Feed (optional concept filter)
  // getPosts: (conceptId = null) =>
  //   axiosClient.get(`${BASE}/posts/`, {
  //     params: conceptId ? { concept_id: conceptId } : {},
  //   }),
  getPosts: (filters = {}) =>
  axiosClient.get(`${BASE}/posts/`, {
    params: filters,
  }),

  getPost: (postId) => axiosClient.get(`${BASE}/posts/${postId}/`),

  createPost: (formData) =>
    axiosClient.post(`${BASE}/posts/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Like / Unlike
  likePost: (postId) =>
    axiosClient.post(`${BASE}/posts/${postId}/like/`),

  unlikePost: (postId) =>
    axiosClient.delete(`${BASE}/posts/${postId}/like/`),

  // ======================================================
  // COMMENTS
  // ======================================================
  addComment: (postId, content) =>
    axiosClient.post(`${BASE}/posts/${postId}/comments/`, { content }),

  getComments: (postId) =>
    axiosClient.get(`${BASE}/posts/${postId}/comments/list/`),

  // ======================================================
  // FOLLOW
  // ======================================================
  followUser: (userId) =>
    axiosClient.post(`${BASE}/users/${userId}/follow/`),

  unfollowUser: (userId) =>
    axiosClient.delete(`${BASE}/users/${userId}/follow/`),

  getFollowers: (userId) =>
    axiosClient.get(`${BASE}/users/${userId}/followers/`),

  getFollowing: (userId) =>
    axiosClient.get(`${BASE}/users/${userId}/following/`),

  // ======================================================
  // NOTIFICATIONS
  // ======================================================
  getNotifications: () =>
    axiosClient.get(`${BASE}/notifications/`),

  markNotificationRead: (notificationId) =>
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
  // USER
  // ======================================================
  getProfile: (userId) =>
    axiosClient.get(`${BASE}/users/${userId}/profile/`),

  getSuggestedUsers: () =>
    axiosClient.get(`${BASE}/users/suggested/`),
};

export default socialApi;
