import axiosClient from "./axiosClient";

const adminApi = {

  getConceptList: async () => {
    const r = await axiosClient.get("/api/syllabus/conceptlist/");
    return r.data;
  },

  generateMeta: async (conceptId, chapter) => {
    const r = await axiosClient.post("/api/admin/generate-meta/", {
      concept_id: conceptId,
      chapter: chapter,
    });
    return r.data;
  },

  generateQuestions: async (conceptId) => {
    const r = await axiosClient.post("/api/admin/generate-questions/", {
      concept_id: conceptId,
    });
    return r.data;
  },
};

export default adminApi;