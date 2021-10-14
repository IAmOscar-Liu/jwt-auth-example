import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { getAccessToken, setAccessToken } from "./accessToken";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: `bearer ${getAccessToken()}`,
      },
    });
  }

  return forward(operation);
});

const client = new ApolloClient({
  // uri: "http://localhost:4000/graphql",
  // link: httpLink,
  // link: authLink.concat(httpLink),
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();
        if (!token) {
          return true;
        }

        try {
          const { exp }: any = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch (error) {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include",
        });
      },
      handleFetch: (accessToken) => setAccessToken(accessToken),
      handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      },
    }),
    authLink,
    httpLink,
  ]),
  // credentials: "include",
  cache: new InMemoryCache({}),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
