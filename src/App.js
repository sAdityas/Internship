import React , {useState , useEffect} from 'react';
import io from 'socket.io-client';
import './App.css';


const socket = io('http://localhost:4000');


function App() {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);


  useEffect(() => {
    
    const history = JSON.parse(localStorage.getItem('chat_history')) || [];
    if (history) {
      setMessageList(history);
    }
    socket.emit('chat_history');

    socket.on('chat_history', (history) => {
      setMessageList(history);
    });

    socket.on('receive message', (data) => {
      setMessageList((prev)=> [prev, data]);
    });
    return () =>{
      socket.off("chat_history");
      socket.off("receive message");
    }
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if(message.trim()){
      const newMessage = {
        text: message,
        id: Date.now(),
      };
      socket.emit('send message', newMessage);
      setMessageList((prev) => [...prev, newMessage]);
      setMessage('');
      localStorage.setItem('chat_history', JSON.stringify([...messageList, newMessage]));
    }
  };

  return (
    <div className="App">
      <h2>Chat Application</h2>
      <div className='chat-container'>
        {messageList.map((message) => (
          <div key={message.id} className='chat-box'>
            <strong>User: </strong>{message.text}
          </div>
        ))}
      </div>
      <div className='chat-input'>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input=box"
        />
        <button type="submit" className='send-button'>
          Send
        </button>
      </form>
    </div>
    </div>
  );
}

export default App;
