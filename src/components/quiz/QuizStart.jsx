import React, { useState } from 'react'
import quizApi from '../../api/quizApi'

export default function QuizStart(){
  const [concept, setConcept] = useState('13')
  const [num, setNum] = useState(5)
  const [session, setSession] = useState(null)

  const start = async () => {
    try {
      const r = await quizApi.start({ concept_id: Number(concept), num_questions: Number(num) })
      setSession(r)
    } catch (e) { console.error(e) }
  }

  return (
    <div className="card">
      <h3>Start Quiz</h3>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <input value={concept} onChange={(e)=>setConcept(e.target.value)} style={{padding:8}} />
        <input value={num} onChange={(e)=>setNum(e.target.value)} style={{width:80,padding:8}} />
        <button className="btn" onClick={start}>Start</button>
      </div>
      {session && <pre style={{marginTop:12}}>{JSON.stringify(session,null,2)}</pre>}
    </div>
  )
}
