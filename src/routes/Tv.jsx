import React, { useState, useEffect, useRef } from 'react';

const Tv = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(null);
  const [streamLog, setStreamLog] = useState('');
  const [countryCode, setCountryCode] = useState(''); // Default to 'PH'
  const [inputCountryCode, setInputCountryCode] = useState(''); // For input field
  const [isFetching, setIsFetching] = useState(false); // For loading state

  const videoRef = useRef(null);
  const channelContainerRef = useRef(null);

  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const channelsUrl = `https://iptv-org.github.io/api/channels.json`;
  const streamsUrl = `https://iptv-org.github.io/api/streams.json`;

  const logMessage = (message) => {
    const timestamp = new Date().toISOString();
    setStreamLog((prev) => `${message}\n`);
  };

  const checkStreamLatency = async (streamUrl) => {
    try {
      const startTime = performance.now();
      const response = await fetch(streamUrl, { method: 'GET', mode: 'cors' });
      const latency = performance.now() - startTime;
      logMessage(`${latency.toFixed(2)} ms`);
    } catch (error) {
      // logMessage(`Error fetching stream: ${error.message}`);
    }
  };

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const [channelsResponse, streamsResponse] = await Promise.all([
        fetch(channelsUrl, { mode: 'cors' }),
        fetch(streamsUrl, { mode: 'cors' }),
      ]);

      if (!channelsResponse.ok || !streamsResponse.ok) {
        throw new Error('Network response was not ok.');
      }

      const channelsData = await channelsResponse.json();
      const streamsData = await streamsResponse.json();

      setStreams(streamsData);

      // Filter channels based on country and ensure the channel has a valid stream URL
      const allChannels = channelsData
        .filter(channel => channel.country === countryCode)
        .filter(channel => {
          // Check if the channel has a stream
          const stream = streamsData.find(stream => stream.channel === channel.id);
          return stream && stream.url; // Only keep channels with a valid stream URL
        });

      setChannels(allChannels);
      setFilteredChannels(allChannels);
      setSelectedChannelIndex(0); // Default to the first channel
    } catch (error) {
      // console.error('Error fetching channels or streams:', error);
      // logMessage(`Error fetching data: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchData();
    }
  }, [countryCode]);

  useEffect(() => {
    if (selectedChannelIndex !== null) {
      const intervalId = setInterval(() => {
        if (selectedChannelIndex !== null) {
          const selectedChannel = filteredChannels[selectedChannelIndex];
          const selectedStream = streams.find(stream => stream.channel === selectedChannel.id);
          if (selectedStream) {
            checkStreamLatency(selectedStream.url);
          }
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [selectedChannelIndex, streams]);

  const handleCountryCodeChange = (event) => {
    setInputCountryCode(event.target.value.toUpperCase());
  };

  const handleSearch = () => {
    setCountryCode(inputCountryCode);
  };

  const toggleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) { // Firefox
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) { // IE/Edge
        videoElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  const handleNSFWFilter = (isNSFW) => {
    if (isNSFW) {
      setFilteredChannels(channels.filter(channel => channel.is_nsfw));
    } else {
      setFilteredChannels(channels.filter(channel => !channel.is_nsfw));
    }
  };

  const handleSwipe = (direction) => {
    setSelectedChannelIndex(prevIndex => {
      const newIndex = direction === 'left'
        ? Math.max(prevIndex - 1, 0)
        : Math.min(prevIndex + 1, filteredChannels.length - 1);
      return newIndex;
    });
  };

  const renderStreamContent = () => {
    if (selectedChannelIndex !== null) {
      const selectedChannel = filteredChannels[selectedChannelIndex];
      const selectedStream = streams.find(stream => stream.channel === selectedChannel.id);

      return (
        <>

          <div className="flex gap-1 items-start">
            <h3 className="text-sm font-semibold mb-4 text-left">{selectedChannel.name}</h3>
            <h1 className="text-[8px]">{streamLog}</h1>
          </div>
          {selectedStream ? (
            <>
              <video ref={videoRef} className="w-full rounded-xl" autoPlay src={selectedStream.url} />
              <button onClick={toggleFullscreen} className="mt-2 mb-2 p-2 bg-blue-500 text-white text-sm rounded" > Fullscreen </button>
            </>
          ) : (
            <p className="text-blue-500 hover:underline text-xs"> Out of Coverage </p>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex text-center flex-col items-center ">
      <div className="container mx-auto p-2 flex flex-col items-center">

        <h1 className="text-lg font-bold mb-6 text-center">TV STREAM GLOBAL</h1>

        <div className="mb-2 w-full input input-bordered flex gap-1 items-center">
          <input type="text" value={inputCountryCode} onChange={handleCountryCodeChange} className="grow text-sm w-full max-w-[300px]" placeholder="Enter country code (e.g., PH)" />
          <button onClick={handleSearch} className="btn btn-primary btn-xs max-w-[300px] rounded" disabled={isFetching} > Search </button>
        </div>

        <div className="mt-2 w-full h-[300px] p-1 rounded-xl bg-base-100 max-w-[500px]" id="channelDisplay">
          {renderStreamContent()}
        </div>

        <div className="mt-2 flex w-[330px] max-h-[200px] h-full overflow-x-hidden rounded-xl">
          <div className="channel-container bg-base-100 p-4 flex gap-2" ref={channelContainerRef}>
            {filteredChannels.map((channel, index) => (
              <button key={channel.id} className={`channel btn btn-sm  h-90 p-1 bg-base-300 rounded-lg ${index === selectedChannelIndex ? 'border-2 border-blue-500 bg-blue-500 ml-3 mr-3 text-black' : ''}`} onClick={() => setSelectedChannelIndex(index)}>
                {channel.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tv;