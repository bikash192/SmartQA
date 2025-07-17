import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container text-center py-5">
      <h2 className="mb-3">SmartQA - Get Started!</h2>

      <p className="mb-2">
        Click on <strong>Create Room</strong> if you are the host. Share the code with participants.
      </p>

      <p className="mb-4">
        If you're a participant, click on <strong>Join Room</strong> and ask for the room code from the host.
      </p>

      <div>
        <Link to="/create" className="btn btn-primary mx-2">Create Room</Link>
        <Link to="/join" className="btn btn-success mx-2">Join Room</Link>
      </div>
    </div>
  );
}

export default Home;
