import axios from "axios";

export function fetcher(url: string, header: Headers) {
  return fetch(url, {
    headers: header,
  }).then((response) => response.json());
}

export function fetcherWithToken (url: string, token: string) {
  return axios
      .get(url, {headers: {Authorization: "Bearer " + token}})
      .then((res) => res.data);
}

export default fetcher;

export function checkStatusOK(status: number) {
  return status >= 200 && status <= 299;
}
