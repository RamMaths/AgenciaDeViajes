import axios from 'axios';

export const postRequest = (url, data, cbSuccess, cbError, headers=null) => {
  axios({
    method: 'post',
    url,
    data,
    headers
  }).then(res => {
    cbSuccess(res);
  }, err => {
    cbError(err);
  });
};

export const getRequest = (url, cbSuccess, cbError, headers=null) => {
  axios({
    method: 'get',
    url,
    headers
  }).then(res => {
    cbSuccess(res);
  }, err => {
    cbError(err);
  });
};

export const patchRequest = (url, data, cbSuccess, cbError, headers=null) => {
  axios({
    method: 'patch',
    url,
    data,
    headers
  }).then(res => {
    cbSuccess(res);
  }, err => {
    cbError(err);
  });
};

export const deleteRequest = (url, data, cbSuccess, cbError, headers=null) => {
  axios({
    method: 'delete',
    url,
    data,
    headers
  }).then(res => {
    cbSuccess(res);
  }, err => {
    cbError(err);
  });
};
