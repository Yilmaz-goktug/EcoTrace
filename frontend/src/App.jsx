import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center min-h-screen bg-blue-50"><h1 className="text-3xl font-bold text-green-600">EcoTrace Frontend Hazır!</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
