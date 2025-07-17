import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import JoinRoom from './pages/JoinRoom.jsx';
import CreateRoom from './pages/CreateRoom.jsx';
import Question from './pages/Question.jsx';
import Room from './pages/Room.jsx';

const App = () => {
  return (
  

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/question" element={<Question />} />
      <Route path="/room" element={<Room />} />
      <Route path="/room/:code" element={<Room />} /> 
    </Routes>
  )
}

export default App



