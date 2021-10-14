import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMeQuery, useLogoutMutation } from "./generated/graphql";
import { setAccessToken } from "./accessToken";

interface Props {}

const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();
  const [logout /*{ client }*/] = useLogoutMutation();
  const history = useHistory();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>You are logged in as: {data.me.email}</div>;
  } else {
    body = <div>no logged in</div>;
  }

  return (
    <header>
      <div>
        <Link to="/">home</Link>
      </div>
      <div>
        <Link to="/register">register</Link>
      </div>
      <div>
        <Link to="/login">login</Link>
      </div>
      <div>
        <Link to="/bye">bye</Link>
      </div>
      <div>
        {!loading && data && data.me && (
          <button
            onClick={async () => {
              history.push("/");
              await logout({ update: async (store) => await store.reset() });
              setAccessToken("");
              // await client!.resetStore();
            }}
          >
            logout
          </button>
        )}
      </div>
      {body}
    </header>
  );
};
export default Header;
