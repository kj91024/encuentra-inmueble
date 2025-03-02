import { processFetch } from "/js/helpers/Rest.js";

const DataSourceService = () => {
    const find = async (id, successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = `/api/data-source/find/${id}`;
        
        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, successCallback, errorCallback);
    }
    
    const save = async (content, successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = '/api/data-source/save';
        
        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify(content);

        await processFetch(endpoint, data, successCallback, errorCallback);
    }

    const list = async (successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = `/api/data-source/list`;
        
        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, successCallback, errorCallback);
    }

    const remove = async (id, successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = `/api/data-source/delete/${id}`;
        
        const data = {};
        data.method = 'DELETE';
        
        await processFetch(endpoint, data, successCallback, errorCallback);
    }

    return {
        find, list, save, remove
    };
};

export { 
    DataSourceService
}