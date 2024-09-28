import { IoChatbubble, IoNotifications, IoPeople } from "react-icons/io5";
import React, { useEffect, useState } from 'react';

const BottomNav = ({ setCurrentSection, bottomNavDisabled }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // When the bottom nav should be visible or hidden based on the prop
    setIsVisible(!bottomNavDisabled);
  }, [bottomNavDisabled]);

  return (
    <div className={`btm-nav bg-base-200 fixed bottom-0 left-0 right-0 transition-all duration-300 ${isVisible ? '' : 'hidden'}`}>
      {/* Chat Button */}
      <button onClick={() => setCurrentSection('Chats')} className="flex flex-col gap-1">
        <IoChatbubble className="w-6 h-6" />
        <p className="text-[10px]">Chats</p>
      </button>

      {/* Notifications Button */}
      <button onClick={() => setCurrentSection('Notifications')} className="flex flex-col gap-1">
        <IoNotifications className="w-6 h-6" />
        <p className="text-[10px]">Notifications</p>
      </button>

      {/* People Button */}
      <button onClick={() => setCurrentSection('Peoples')} className="flex flex-col gap-1">
        <IoPeople className="w-6 h-6" />
        <p className="text-[10px]">Peoples</p>
      </button>
    </div>
  );
};

export default BottomNav;