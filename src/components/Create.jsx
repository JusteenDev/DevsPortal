import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { getDatabase, set, ref } from "@firebase/database";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useState } from 'react';

const Create = ({ setBottomNavDisabled }) => { // Accept the prop from App
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreatingGroup, setCreatingGroup] = useState(false);

  const createThreadInfo = (e) => {
    e.preventDefault(); // Prevent form submission
    const db = getDatabase();
    const auth = getAuth();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    const id = `${timestamp}${random}`;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        set(ref(db, `threads/${id}`), {
          groupName: e.target.groupName.value,
          dateCreated: timestamp,
          threadID: id,
          members: [uid],
          URL: "https://firebasestorage.googleapis.com/v0/b/devsmessenger.appspot.com/o/profile.jpg?alt=media&token=ea4e27c5-ef01-4f15-9af6-9a30cc21e2bd"
        });
      } else {
        alert('No authenticated user');
      }
    });

    closeModal(); // Close modal and reset state
  };

  const closeModal = () => {
    setModalOpen(false);
    setCreatingGroup(false);
    setBottomNavDisabled(false); // Enable bottom nav when closing modal
  };

  const modalComponent = () => {
    return (
      <>
        {isModalOpen && (
          <dialog id="my_modal_3" className="modal sm:modal-middle modal-bottom" open>
            <div className="modal-box max-w-[400px] bg-base-200 rounded-xl">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>
                ✕
              </button>
              {!isCreatingGroup ? (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-extrabold">Create</h3>
                  <button type="button" className="btn btn-primary text-white" onClick={() => alert("New message functionality")}>
                    New Message
                  </button>
                  <button type="button" className="btn btn-primary text-white" onClick={() => {
                    setCreatingGroup(true);
                    setBottomNavDisabled(true); // Disable bottom nav when creating a group
                  }}>
                    Create Group
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-2" onSubmit={createThreadInfo}>
                  <h3 className="text-md">Create Group</h3>
                  <input type="text" name="groupName" placeholder="Group Name" className="input w-full" required />
                  <button type="submit" className="btn btn-primary mt-4 text-white">Create</button>
                  <button type="button" className="btn btn-ghost mt-2" onClick={() => {
                    setCreatingGroup(false);
                    setBottomNavDisabled(true); // Disable bottom nav when going back
                  }}>
                    Back
                  </button>
                </form>
              )}
            </div>
          </dialog>
        )}
      </>
    );
  };

  return (
    <div className="create-group-container fixed bottom-20 right-4">
      <button className="btn w-[60px] h-[60px] rounded-full flex items-center" onClick={() => {
        setModalOpen(true);
        setBottomNavDisabled(true); // Disable bottom nav when opening modal
      }}>
        <BiSolidMessageSquareEdit className="w-[40px] h-[40px]" />
      </button>
      {modalComponent()}
    </div>
  );
};

export default Create;