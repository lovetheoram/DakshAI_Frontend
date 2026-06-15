import React, { useState, useEffect } from 'react'
import quizApi from '../../api/quizApi'
import QuestionCard from './QuestionCard'

export default function Quiz(){
  const [conceptId, setConceptId] = useState(13)
  const [numQuestions, setNumQuestions] = useState(5)

  const [session, setSession] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])

  const [startTime, setStartTime] = useState(null)
  const [finalResult, setFinalResult] = useState(null)

  // -----------------------
  // Start the quiz
  // -----------------------
  const startQuiz = async () => {
    try {
      const r = await quizApi.start({
        concept_id: Number(conceptId),
        num_questions: Number(numQuestions),
        mode: 'fresh'
      })

      setSession(r)
      setStartTime(Date.now())   // start timer
      setAnswers([])
      setCurrentIndex(0)
      setFinalResult(null)
    } catch (e) {
      console.error(e)
    }
  }

  // -----------------------
  // Record answer
  // -----------------------
  const handleAnswer = (qid, optionIndex) => {
    const newAns = [...answers]
    newAns[currentIndex] = { question_id: qid, marked_option: optionIndex }
    setAnswers(newAns)

    if (currentIndex + 1 < session.questions.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // -----------------------
  // Submit quiz
  // -----------------------
  const submitQuiz = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000)

    const r = await quizApi.submit({
      session_id: session.session_id,
      duration_seconds: duration,
      answers: answers
    })

    setFinalResult(r)
  }

  // -----------------------
  // UI RENDER
  // -----------------------

  // --- 1. Start screen ---
  if (!session) {
    return (
      <div className="card" style={{padding:20}}>
        <h2 style={{marginBottom:10}}>Start Quiz</h2>

        <div style={{display:'flex', gap:8}}>
          <input
            value={conceptId}
            onChange={e=>setConceptId(e.target.value)}
            placeholder="Concept ID"
            style={{padding:8}}
          />

          <input
            value={numQuestions}
            onChange={e=>setNumQuestions(e.target.value)}
            placeholder="Questions"
            style={{padding:8, width:90}}
          />

          <button className="btn" onClick={startQuiz}>Start</button>
        </div>
      </div>
    )
  }

  // --- 2. Final results ---
  if (finalResult) {
    return (
      <div className="card" style={{padding:20, textAlign:'center'}}>
        <h2>Quiz Completed 🎉</h2>
        <h3>Score: {(finalResult.score * 100).toFixed(1)}%</h3>

        <button className="btn" style={{marginTop:20}} onClick={()=>{
          setSession(null)
          setFinalResult(null)
        }}>
          Restart
        </button>
      </div>
    )
  }

  // --- 3. Question UI ---
  const q = session.questions[currentIndex]
  const total = session.questions.length

  return (
    <div className="card" style={{padding:20}}>
      <h3>Quiz In Progress</h3>

      {/* Progress bar */}
      <div style={{
        height:10,
        background:'#ddd',
        borderRadius:50,
        margin:'10px 0'
      }}>
        <div style={{
          height:'100%',
          width: `${(currentIndex+1)/total*100}%`,
          background:'#4a90e2',
          borderRadius:50,
          transition:'0.3s'
        }}></div>
      </div>

      <div style={{marginBottom:10}}>
        Question {currentIndex+1} / {total}
      </div>

      <QuestionCard q={q} onAnswer={handleAnswer} />

      {(currentIndex === total-1) && (
        <button className="btn" style={{marginTop:20}} onClick={submitQuiz}>
          Submit Quiz
        </button>
      )}
    </div>
  )
}
