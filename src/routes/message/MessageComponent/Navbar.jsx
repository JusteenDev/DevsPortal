import { getDatabase, ref, onValue } from '@firebase/database';
import { useEffect, useState } from 'react';

const Navbar = ({ data }) => {
  const [threadData, setThreadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getDatabase();

  useEffect(() => {
    const threadRef = ref(db, `threads/${data}`);

    const threadData = onValue(threadRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setThreadData({
          data,
          groupName: data.groupName || 'Unnamed Group',
          members: data.members || [],
          url: data.URL || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
        });
      } else {
        setThreadData(null);
      }
      setLoading(false); // Set loading to false when data is fetched
    });

    return () => threadData();
  }, [data, db]);

  if (loading) {
    return <div>Loading...</div>; // Display this while loading
  }

  if (!threadData) {
    return <div>No data found.</div>; // Handle no data case
  }

  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-300 w-full flex gap-1 items-center">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <button className="btn btn-ghost btn-xs text-lg mb-[6px] p-0">{threadData.groupName}</button>
            <div className="hidden flex-none lg:block"></div>
          </div>

          {/* Page content here */}
          Content
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li><a>Sidebar Item 1</a></li>
            <li><a>Sidebar Item 2</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;