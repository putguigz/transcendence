import { Button, List, ListItemButton, Popover } from "@mui/material";
import React, { useContext, useState } from "react";
import { api } from "../../../../const/const";
import { ChannelsContext } from "../../../../contexts/ChannelsContext";
import { IChannel, IChannelActions } from "../../types";

interface RevokeAdminProps {
  userTargeted: any;
}

export default function RevokeAdmin(props: RevokeAdminProps) {
  const { channelData } = useContext(ChannelsContext);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log("makeAdmin", channelData);
    revokeAdmin(props.userTargeted, channelData);
  }

  function createChannelActions(channel: any, targetUsername: string) {
    //console.log("channel = ", channel);
    const newChannel: IChannelActions = {
      channel_name: channel.data.name,
      target: targetUsername,
    };
    console.log(newChannel);
    return newChannel;
  }

  async function revokeAdmin(user: any, channel: any) {
    const newChannel = createChannelActions(channel, user.username);

    if (newChannel.target !== "") {
      await api
        .post("channel/revokeAdmin", newChannel)
        .then((res) => {
          console.log("user in not admin anymore");
          console.log(channel);
        })
        .catch((res) => {
          console.log("invalid channels");
          console.log(res);
        });
    }
  }

  return (
    <Button
      sx={{
        color: "black",
        ml: "1vh",
      }}
      onClick={(event) => {
        handleClick(event);
      }}
    >
      RevokeAdmin
    </Button>
  );
}
