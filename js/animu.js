"use strict";

const animu = (function() {

  const login_page = "login.html"

  const token = localStorage.getItem("token")
  if(!token) {
    location.assign(login_page)
  }

  const handle_errors = function(response) {
    if(!response.ok) {
      location.assign(login_page);
      throw Error(response.statusText);
    }
    return response;
  }

  const request = function(url, opts, callback) {
    opts.headers =
      { 'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': token
      }

    return fetch(url, opts)
      .then(handle_errors)
      .then((resp) => resp.json())
      .then(callback)
      .catch((error) => console.log("Animu Request Failed: " + error.message));
  };

  const post = function(url, data, callback) {
    const opts = {
      method: "POST",
      body: JSON.stringify(data),
    };

    return request(url, opts, callback);
  };

  const serializeParams = function(obj) {
    const encURI = encodeURIComponent;
    const params = Object.keys(obj);
    const qs =
      params
      .map((key) => encURI(key) + "=" + encURI(obj[key]))
      .join("&");

    return (params.length && "?" + qs) || "";
  }

  const get = function(url, params, callback) {
    const opts = { method: "GET" };
    url  = url + serializeParams(params);

    return request(url, opts, callback);
  };

  const get_series = function(id, callback) {
    return get("/api/v1/series/" + id, {}, callback);
  };

  const all_series = function(query, callback) {
    return get("/api/v1/series", query, callback);
  };

  const get_episode = function(id, callback) {
    return get("/api/v1/episodes/" + id, {}, callback);
  };

  const test = function() {
    console.log("Animu Module Loaded");
  };

  return {
    get_series: get_series,
    all_series: all_series,
    get_episode: get_episode,
    test: test,
  }
})();
