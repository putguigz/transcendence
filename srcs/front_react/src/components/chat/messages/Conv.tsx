import { Box, Grid, IconButton } from "@mui/material";
import React, { useContext } from "react";
import MessagesList from "./MessagesList";
import PromptMessage from "./PromptMessage";
import AddIcon from "@mui/icons-material/Add";
import { MessagesContext } from "../../../contexts/MessagesContext";

interface ConvProps { }

export default function Conv(props: ConvProps) {
  return (
    <Box sx={{ border: "1px solid green" }}>
      <MessagesList />
      <PromptMessage />
    </Box>
  );
}
