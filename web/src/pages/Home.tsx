import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

const Home: React.FC<Props> = ({}) => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>users:</div>
      <ul>
        {data.users.map((u) => (
          <li key={u.id}>
            {u.email}, {u.id}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
