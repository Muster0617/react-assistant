import request from 'umi-request';

export async function fileUpload(data: any) {
  return request('/sys/common/upload', {
    method: 'POST',
    body: data,
    requestType: 'form',
  });
}
