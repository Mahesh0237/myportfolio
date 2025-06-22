import config from "@/config";
import { io } from "socket.io-client";

const Socketapi = io(`${config.api_url}`);

export default Socketapi;


// import { io } from "socket.io-client";

// const socket = io("http://localhost:5001", {
//   query: { userId: "1" }, // dynamic value
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// });

// export default socket;
