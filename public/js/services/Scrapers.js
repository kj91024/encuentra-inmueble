import { processFetch } from "/js/helpers/Rest.js";

const DataSourceService = () => {
    const find = (id, successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = `/api/data-source/find/${id}`;
        
        const data = {};
        data.method = 'GET';

        processFetch(endpoint, data, successCallback, errorCallback);
    }
    
    const save = (content, successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = '/api/data-source/save';
        
        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify(content);

        processFetch(endpoint, data, successCallback, errorCallback);
    }

    const list = (successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = `/api/data-source/list`;
        
        const data = {};
        data.method = 'GET';

        processFetch(endpoint, data, successCallback, errorCallback);
    }

    const remove = (id, successCallback = () => {}, errorCallback = () => {}) => {
        const endpoint = `/api/data-source/delete/${id}`;
        
        const data = {};
        data.method = 'DELETE';

        processFetch(endpoint, data, successCallback, errorCallback);
    }

    return {
        find, list, save, remove
    };
};

export { 
    DataSourceService
}