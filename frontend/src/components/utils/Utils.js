import axios from 'axios';

export const postRequest = (url, data, cbSuccess, cbError) => {
  axios({
    method: 'post',
    url,
    data
  }).then(res => {
    cbSuccess(res);
  }, err => {
    cbError(err);
  });
};

export const getRequest = (url, headers=null, cbSuccess, cbError) => {
  axios({
    method: 'get',
    url,
    headers
  }).then(res => {
    cbSuccess(res);
  }, err => {
    cbError(err);
  });
}
