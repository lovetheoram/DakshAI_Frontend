import axiosClient from './axiosClient'

const progressApi = {
  getConcept: async (conceptId) => {
    const r = await axiosClient.get(`/api/progress/concept/${conceptId}/`)
    return r.data
  },

  getHistory: async (conceptId) => {
    const r = await axiosClient.get(`/api/progress/concept/${conceptId}/history/`)
    return r.data
  },

  getSubtopic: async (subtopicId) => {
    const r = await axiosClient.get(`/api/progress/subtopic/${subtopicId}/`)
    return r.data
  },

  // NEW → single call for full dashboard
  getFull: async (conceptId) => {
    const [p, h] = await Promise.all([
      axiosClient.get(`/api/progress/concept/${conceptId}/`),
      axiosClient.get(`/api/progress/concept/${conceptId}/history/`)
    ])
    return {
      progress: p.data,
      history: h.data
    }
  },

  getGoal: async () => {
    const r = await axiosClient.get('/api/progress/goal/')
    return r.data
  },

  getDashboard: async () => {
    const r = await axiosClient.get('/api/progress/dashboard/')
    return r.data
  },

  setGoal: async (data) => {
    const r = await axiosClient.post('/api/progress/goal/', data)
    return r.data
  },

  getDailyTarget: async () => {
    const r = await axiosClient.get('/api/progress/daily-target/')
    return r.data
  },

  logRevision: async (minutes) => {
    const r = await axiosClient.post('/api/progress/daily-target/revision/', { minutes })
    return r.data
  },

  shareDailyTarget: async () => {
    const r = await axiosClient.post('/api/progress/daily-target/share/')
    return r.data
  },

  getDiary: async () => {
    const r = await axiosClient.get('/api/progress/diary/')
    return r.data
  },

  logEnergy: async (data) => {
    const r = await axiosClient.post('/api/progress/diary/energy/', data)
    return r.data
  },

  getStreakStats: async () => {
    const r = await axiosClient.get('/api/progress/streak/')
    return r.data
  }
}

export default progressApi
