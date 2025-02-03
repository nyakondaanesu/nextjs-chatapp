import AppSideBar from "@/components/appSideBar";
import MatchMakingSection from "@/components/matchMakingSection";
import Messages from "@/components/message";

const Chat = () => {
  return (
    <>
      <AppSideBar
        children={<MatchMakingSection children={<Messages></Messages>} />}
      ></AppSideBar>
    </>
  );
};

export default Chat;
