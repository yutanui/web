import axios, { AxiosResponse } from 'axios';

export interface HasId {
  id?: string;
}

export class ApiSync<T extends HasId> {
  constructor(private url: string) {}

  async fetch(id: string): Promise<AxiosResponse> {
    if (!id) {
      throw new Error('Cannot fetch without an id');
    }

    const res = await axios.get(`${this.url}/${id}`);
    return res;
  }

  async fetchAll(): Promise<AxiosResponse> {
    const res = await axios.get(`${this.url}`);
    return res;
  }

  async save(data: T): Promise<AxiosResponse> {
    const { id } = data;
    if (id) {
      return await axios.put(`${this.url}/${id}`, data);
    } else {
      return await axios.post(`${this.url}`, data);
    }
  }
}
