export class RestService {
    public static fetch = async (endpoint: string) => {
        const res = await fetch(endpoint);
        return await res.text();
    }

    public static fetchAll = async (endpoints: string[]) => {
        const responses = await Promise.all(endpoints.map(url => fetch(url)));
        return await Promise.all(responses.map(res => res.text()));
    }
}