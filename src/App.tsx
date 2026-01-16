import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from './lib/i18n'
import { Header } from './components/Layout/Header'
import { Home } from './pages/Home'
import { ArchitectureDetail } from './pages/ArchitectureDetail'

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/architecture/:id" element={<ArchitectureDetail />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  )
}

export default App
