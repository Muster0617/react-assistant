import { request } from 'umi';

export async function fileUpload(data) {
  return request('/sys/common/upload', {
    method: 'POST',
    body: data,
    requestType: 'form',
  });
}
