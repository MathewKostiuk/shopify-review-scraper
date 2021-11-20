import { useEffect, useState } from "react";

function Channels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await fetch(
        '/api/1.0/channels/',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      setChannels(json);
    }
    fetchChannels();
  }, []);
}

export default Channels;
