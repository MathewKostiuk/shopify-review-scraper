import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import Channel from "./Channel";
import NewChannel from "./NewChannel";

type ChannelProps = {
  id: number,
  name: string,
  url: string,
  brand_id: number,
};

type ChannelsArray = Array<ChannelProps>;

export default function Channels(): JSX.Element {
  const [channels, setChannels] = useState<ChannelsArray>([]);

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
      setChannels(json.channels);
    }
    fetchChannels();
  }, []);

  const ChannelElements = channels.map((channel) => {
    return <Channel
      key={channel.id}
      id={channel.id}
      name={channel.name}
      url={channel.url}
      brand_id={channel.brand_id}
    />
  });

  return (
    <div className="Channels">
      {ChannelElements}
      <NewChannel />
      <Outlet />
    </div>
  );
}
