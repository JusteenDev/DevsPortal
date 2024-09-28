import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from '@firebase/database';
import { useEffect, useState } from 'react';
import Navbar from './MessageComponent/Navbar.jsx';

const Message = () => {
  const { id } = useParams();
  const [threadData, setThreadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getDatabase();

  useEffect(() => {
    const threadRef = ref(db, `threads/${id}`);
    const messageRef = ref(db, `messages/${id}`);

    const threadData = onValue(threadRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setThreadData({
          id,
          groupName: data.groupName || 'Unnamed Group',
          members: data.members || [],
          url: data.URL || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
        });
      } else {
        setThreadData(null);
      }
      setLoading(false); // Set loading to false when data is fetched
    });

    const messageThread = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      // Handle messages
    });

    return () => {
      messageThread();
      threadData();
    };
  }, [id, db]);

  if (loading) {
    return (
      <div className=" flex flex-col items-center p-2">
        <div className="loading-wrapper mt-auto mb-auto flex flex-col items-center">
          <span className="loading loading-infinity loading-md w-10 h-10"></span>
        </div>
      </div>
    )
  }

  if (!threadData) {
    return <div>No thread found.</div>; // Handle missing data
  }

  return (
    <div>
      <Navbar data={id} />
    </div>
  );
};

export default Message;