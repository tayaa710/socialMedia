import './message.css'
const Message = ({own}) => {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="messageImg" />
                <p className="messageText">
                Hello this is a message
                </p>
            </div>
            <div className="messageBottom">
                <p className="messageTime">1 hour ago</p>
            </div>
        </div>
    )
}

export default Message