import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

export default function ChatUserlist(props: any) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }

  function handleProfile() {
    console.log('handle profile');
    setAnchorEl(null);
  }

  function handleInvite() {
    console.log('handle invite');
    setAnchorEl(null);
  }

  function handleNewMessage() {
    console.log('handle new message');
    setAnchorEl(null);
    props.setIsNewMessage(true);
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
        variant="h5"
      >
        Users
      </Typography>
      <Box>
        <Box onContextMenu={handleClick}>
          {/* I have delete UserList sign tsannie */}
        </Box>
        <Menu
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleNewMessage}>New Message</MenuItem>
          <MenuItem onClick={handleInvite}>Invite to play</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
