import React from 'react'

export default function QuestionCard({ q, onAnswer }){
  return (
    <div className="card" style={{padding:20}}>
      <div style={{fontWeight:700, fontSize:18}}>
        {q.text}
      </div>

      <div style={{marginTop:12}}>
        {q.options.map((opt, i) => (
          <button
            key={i}
            className="btn"
            onClick={() => onAnswer(q.id, i)}
            style={{
              width:'100%',
              marginBottom:8,
              textAlign:'left',
              padding:12,
              borderRadius:10,
              transition:'0.2s'
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
