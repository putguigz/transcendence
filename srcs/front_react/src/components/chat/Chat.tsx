import "./chat.style.scss";
import { MessageProvider } from "../../contexts/MessageContext";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { useContext } from "react";
import Conversation from "./Conversation";
import NotifProvider from "../../contexts/ChatNotificationContext";
import CreateChannelForm from "./CreateChannelForm";
import JoinChannelForm from "./JoinChannelForm";
import ChannelList from "./ChannelList";

function ChatBody() {
  const { display } = useContext(ChatDisplayContext);

  switch (display) {
    case ChatType.CONV:
      return <Conversation />;
    case ChatType.CREATEFORM:
      return <CreateChannelForm />;
    case ChatType.JOINFORM:
      return <JoinChannelForm />;
    default:
      return <></>;
  }
}

function Chat() {
  return (
    <div className="chat">                       
        <MessageProvider>
          <NotifProvider>
            <ChannelList />
            <ChatBody />
          </NotifProvider>
      </MessageProvider>
    </div>
  );
}

export default Chat;
