import { getDatabase, ref, onValue } from "@firebase/database";
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useLongPress } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Chats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState([]); // State to store filtered threads
  const [loading, setLoading] = useState(true); // Loading state
  const db = getDatabase();
  const auth = getAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const attrs = useLongPress(() => {
      setIsOpen(true);
    },
    {
      onStart: (event) => console.log("Press started"),
      onFinish: (event) => console.log("Press Finished"),
      onCancel: (event) => console.log("Press cancelled"),
      threshold: 500,
    }
  );

  useEffect(() => {
    const threadsRef = ref(db, 'threads/'); // Reference to the threads node
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid; // Get the current user's UID

        // Listen for changes in the threads
        onValue(threadsRef, (snapshot) => {
          const data = snapshot.val(); // Get the value of the snapshot

          if (data) {
            // Map the threads data
            const threadsArray = Object.keys(data).map((key) => ({
              id: key,
              groupName: data[key].groupName || 'Unnamed Group', // Default if groupName is missing
              members: data[key].members || [], // Use an empty array if members do not exist
              url: data[key].URL || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp', // Default avatar URL if not present
            }));

            // Filter threads where the current user is included in the members
            const userThreads = threadsArray.filter(thread => thread.members.includes(uid));

            setThreads(userThreads); // Set only threads that include the user
          }
          
          
          setLoading(false); // Data has been fetched, set loading to false
        });
      }
    });

    return () => unsubscribe();
  }, [db, auth]);

  const handleThreadClick = (id) => {
    navigate(`/message/${id}`); // Navigate to the message route with the thread ID
  };

  // Conditional rendering: Show loading animation while data is loading
  if (loading) {
    return (
      <div className=" flex flex-col items-center p-2">
        <div className="loading-wrapper mt-auto mb-auto flex flex-col items-center">
          <span className="loading loading-infinity loading-md w-10 h-10"></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        {threads.map((thread) => (
          <div {...attrs} key={thread.id} onClick={() => handleThreadClick(thread.id)} className="p-1 ml-2 bg-base-100 flex gap-2 items-center cursor-pointer">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={thread.url} alt={`Avatar for ${thread.groupName}`} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold">{thread.groupName}</h2>
              <p className="text-xs">Justeen James Tolentino: I love you jh...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;