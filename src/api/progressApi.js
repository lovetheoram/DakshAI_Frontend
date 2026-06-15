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
  }
}

export default progressApi
