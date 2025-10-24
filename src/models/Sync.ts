import axios, { AxiosResponse } from 'axios';

interface HasId {
  id?: string;
}

export class Sync<T extends HasId> {
  constructor(private url: string) {}

  async fetch(id: string): Promise<AxiosResponse> {
    if (!id) {
      throw new Error('Cannot fetch without an id');
    }

    const res = await axios.get(`${this.url}/${id}`);
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
