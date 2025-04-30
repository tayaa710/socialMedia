import './chatOnline.css'

const ChatOnline = () => {
    return (
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <div className="chatOnlineFriend">
                    <div className="chatOnlineImgContainer">
                        <img src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="chatOnlineImg" />
                        <div className="chatOnlineBadge">
                            <span className="chatOnlineBadgeIcon"></span>
                        </div>
                    </div>
                    <span className="chatOnlineName">John Doe</span>
                </div>
            </div>
        </div>
    )
}

export default ChatOnline;