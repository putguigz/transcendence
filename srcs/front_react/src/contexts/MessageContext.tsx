import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { IChannel, IDm, IMessageReceived } from "../components/chat/types";
import { AuthContext, User } from "./AuthContext";
import { ChatDisplayContext } from "./ChatDisplayContext";
import { TransitionContext } from "./TransitionContext";

export const MessageContext = createContext<MessageContextInterface>(
  {} as MessageContextInterface
);

export interface MessageContextInterface {
  socket: Socket | null;
  newMessage: IMessageReceived | null;
  setNewMessage: React.Dispatch<React.SetStateAction<IMessageReceived | null>>;
  chatList: (IChannel | IDm)[];
  setChatList: React.Dispatch<React.SetStateAction<(IChannel | IDm)[]>>;
  channelNotification: boolean;
  setChannelNotification: React.Dispatch<React.SetStateAction<boolean>>;
  inviteList: IChannel[];
  setInvite: React.Dispatch<React.SetStateAction<IChannel[]>>;
}

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [ channelNotification, setChannelNotification ] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<IMessageReceived | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatList, setChatList] = useState<(IChannel | IDm)[]>([]);
  const [ inviteList, setInvite ] = useState<IChannel[]>([]);
  //const { inviteList, setInvite } = useContext(ChatDisplayContext);

  const { displayLocation } = useContext(TransitionContext);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    const newSocket: any = io("http://localhost:4000/chat", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        setNewMessage(data);
        if (displayLocation.pathname !== "/chat" && (user?.id !== data.author.id))
          toast.info(`new message from ${data.author.username}`)
      });
      socket.on("exception", (response) => {
        toast.error(response.message);
      });
      socket.on("inviteChannel", (channel, targetId) => {
        if (displayLocation.pathname !== "/chat" && (user?.id !== channel.owner.id)) {
          if (targetId !== channel.users.find( (elem: User) => elem.id === targetId)?.id &&
            targetId !== channel.admins.find( (elem: User) => elem.id === targetId)?.id &&
            inviteList.find( (elem: IChannel) => elem.id === channel.id) === undefined
          ) { // if target is not in channel and channel is not in invite list
            toast.info(`${channel.owner.username} invited you to ${channel.name}`);
            setChannelNotification(true);
          }
        }
        // set invite only if target is not member or admins of channel
        if (targetId !== channel.users.find( (elem: User) => elem.id === targetId)?.id &&
          targetId !== channel.admins.find( (elem: User) => elem.id === targetId)?.id &&
          targetId !== channel.owner.id
        ) {
          //console.log("pas la stp");
          // check if channel is not already in invite list
          if (inviteList.find( (elem: IChannel) => elem.id === channel.id) === undefined) {
            if (inviteList.length > 0) {
              setInvite([...inviteList, channel]);
            }
            else {
              setInvite([channel]);
            }
          }
        }
        // add channel to the invite list
      });
      return () => {
        socket.off("message");
        socket.off("exception");
        socket.off("inviteChannel");
      };
    }
  }, [socket, user, displayLocation, channelNotification]);

  return (
    <MessageContext.Provider value={{ socket, newMessage, setNewMessage, chatList, setChatList, channelNotification, setChannelNotification, inviteList, setInvite}}>
      {children}
    </MessageContext.Provider>
  );
};
