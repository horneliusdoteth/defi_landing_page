import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import FormWizard from './components/FormWizard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<FormWizard />} />
      </Routes>
    </BrowserRouter>
  )
}
