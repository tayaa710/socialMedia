import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
const Messenger = () => {
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            Menu
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            chatBox
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            Online Friends
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger