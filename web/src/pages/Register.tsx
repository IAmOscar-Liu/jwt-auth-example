import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await register({
          variables: {
            email,
            password,
          },
        });
        console.log(response);
        history.push("/");
      }}
    >
      <div>
        <label htmlFor="register-email">email: </label>
        <input
          id="register-email"
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="register-password">password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <input type="submit" value="register" />
    </form>
  );
};
export default Register;
