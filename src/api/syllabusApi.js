import axiosClient from './axiosClient'

const syllabusApi = {
  getTree: async () => {
    const r = await axiosClient.get('/api/syllabus/tree/')
    return r.data
  },
  getConceptList: async () => {
    const r = await axiosClient.get('/api/syllabus/conceptlist/')
    return r.data     
  },
  getSubtopicConcepts: async (subtopicId) => {
    const r = await axiosClient.get(`/api/syllabus/subtopic/${subtopicId}/concepts/`)
    return r.data
  }
  
}

export default syllabusApi


