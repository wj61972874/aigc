import request from "./request";

export function apiGeneratePoem(data: any): Promise<any> {
  return request.post(`http://115.29.214.125:3000/api/aigc/textGenerate`, data);
}
