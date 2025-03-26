import { processFetch } from "/js/helpers/Rest.js";

const DataSourceService = () => {
    const find = async (id_data_service, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/data-source/find/${id_data_service}`;
        
        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }
    
    const insert = async ({url_base, domain, name, description}, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/data-source/insert';
        
        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({ url_base, name, description });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const update = async ({id, url_base, domain, name, description}, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/data-source/update';
        const data = {};
        data.method = 'PUT';
        data.body = JSON.stringify({ id, url_base, name, description });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const list = async (success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/data-source/list`;
        
        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const remove = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/data-source/delete/${id_data_source}`;
        
        const data = {};
        data.method = 'DELETE';
        
        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return {
        find, list, insert, remove, update
    };
};

const PortalScraperService = () => {
    const find = async (id_portal_scraper, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/portal-scraper/find/${id_portal_scraper}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const insert = async ({id_data_source, name, url_path }, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/portal-scraper/insert';

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({
            id_data_source,
            name,
            url_path
        });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const update = async ({id, id_data_source, name, url_path }, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/portal-scraper/update';

        const data = {};
        data.method = 'PUT';
        data.body = JSON.stringify({
            id_portal_scraper: id,
            id_data_source,
            name,
            url_path
        });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const list = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/portal-scraper/list/${id_data_source}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const remove = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/portal-scraper/delete/${id_data_source}`;

        const data = {};
        data.method = 'DELETE';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const test = async ({ id_data_source, id_portal_scraper, link }, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/portal-scraper/test`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({ id_data_source, id_portal_scraper, link });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const process = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/portal-scraper/process`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({ id_data_source });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const saveScraper = async ({id_portal_scraper, file}, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/portal-scraper/save-scraper`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({id_portal_scraper, file});
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return {
        find, list, insert, remove, test, saveScraper, update, process
    };
}

const EstateLinkService = () => {
    const list = async ({ id_data_source, page, size }, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate-link/list`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({
            id_data_source,
            page,
            size
        });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
}

const EstateScraperService = () => {
    const find = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate-scraper/find/${id_data_source}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const test = async ({ id_data_source, link }, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate-scraper/test`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({ id_data_source, link });
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const process = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate-scraper/process/${id_data_source}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const saveScraper = async ({ id_data_source, file }, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate-scraper/save`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({
            id_data_source,
            file,
            user_agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
        });

        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return {
        find, test, saveScraper, process
    }
}

export { 
    DataSourceService, PortalScraperService, EstateLinkService, EstateScraperService
}