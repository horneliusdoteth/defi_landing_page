import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Question from './Question'
import { API_URL, CALENDLY_URL } from '../constants'

const QUESTIONS = [
  { key: 'name', text: 'What is your full name?', type: 'text' },
  { key: 'email', text: 'Email for contact', type: 'email' },
  { key: 'phone', text: 'Phone number', type: 'text' },
  {
    key: 'usedBefore',
    text: 'Have you used our products before?',
    type: 'buttons',
    options: ['Yes', 'No']
  },
  {
    key: 'deployAmount',
    text: 'How much do you plan to deploy in DeFi over the next 90 days?',
    type: 'buttons',
    options: ['<25k','25-50k','50-100k','100-250k','250k+']
  },
  {
    key: 'experience',
    text: 'How experienced are you with DeFi?',
    type: 'buttons',
    options: ['Learning','Some but need support','Investing comfortably','Veteran']
  },
  {
    key: 'timeline',
    text: 'When are you looking to get support?',
    type: 'buttons',
    options: ['Now','In a few months','Not sure']
  },
]

export default function FormWizard() {
    const [answers, setAnswers] = useState({})
    const [step, setStep] = useState(0)
    const nav = useNavigate()
  
    const current = QUESTIONS[step]
    const isLast = step === QUESTIONS.length - 1
  
    const onChange = val => setAnswers(a => ({...a,[current.key]:val}))
    const next = () => isLast ? submit() : setStep(s => s + 1)
    const back = () => setStep(s => Math.max(s - 1, 0))
  
    async function submit() {
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers)
        })
        window.location.href = CALENDLY_URL
      } catch {
        alert('Error sending—please try again.')
      }
    }
  
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center">Tell us about you</h2>
  
          <Question
            text={current.text}
            type={current.type}
            options={current.options}
            value={answers[current.key]||''}
            onChange={onChange}
          />
  
          <div className="flex justify-between">
            <button
              onClick={back}
              disabled={step===0}
              className="px-4 py-2 border border-gray-600 rounded disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={next}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white"
            >
              {isLast ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    )
  }
