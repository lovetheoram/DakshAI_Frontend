import { useEffect, useState } from "react";
import socialApi from "../../api/socialApi";
// import FollowButton from "../Profile/FollowButton";
import FollowButton from "./FollowButton";

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);

useEffect(() => {
  socialApi.getSuggestedUsers().then((res) => {
    setUsers(res.data.suggestions || []); 
  });
}, []);


  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="font-bold mb-3">Suggested Users</h3>

      {users.map((u) => (
        <div key={u.id} className="flex justify-between py-2">
          <span>{u.username}</span>
          <FollowButton userId={u.id} isFollowing={u.is_following} />
        </div>
      ))}
    </div>
  );
}
