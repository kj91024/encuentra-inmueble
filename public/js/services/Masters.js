import { processFetch } from "/js/helpers/Rest.js";

const CurrencyService = () => {
    const list = async (success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/currency/list`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
};

const DepartamentService = () => {
    const list = async (success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/departament/list`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
};

const ProvinceService = () => {
    const list = async (id_departament, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/province/list/${id_departament}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
};

const DistrictService = () => {
    const list = async (id_departament, id_province, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/district/list/${id_departament}/${id_province}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
};

const OperationService = () => {
    const list = async (success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/operation/list`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
};

const PropertyService = () => {
    const list = async (success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/property/list`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list }
};

const EstateService = () => {
    const list = async (filter, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate/list`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify(filter);
        data.headers = { 'Content-Type': 'application/json' };

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const find = async (id, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate/find/${id}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const findLink = async (link, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/estate/find-link`;

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify({ link });
        data.headers = { 'Content-Type': 'application/json' };

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { list, find, findLink }
};

const UserService = () => {
    const find = async (id_user, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/user/find/${id_user}`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const insert = async (body, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/user/insert';

        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify(body);
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const update = async (body, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/user/update';
        const data = {};
        data.method = 'PUT';
        data.body = JSON.stringify(body);
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const session = async (body, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = '/api/user/session';
        const data = {};
        data.method = 'POST';
        data.body = JSON.stringify(body);
        data.headers = {'Content-Type': 'application/json'};

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const list = async (success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/user/list`;

        const data = {};
        data.method = 'GET';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    const remove = async (id_data_source, success_callback = () => {}, error_callback = () => {}) => {
        const endpoint = `/api/user/delete/${id_data_source}`;

        const data = {};
        data.method = 'DELETE';

        await processFetch(endpoint, data, success_callback, error_callback);
    }

    return { find, list, insert, remove, update, session };
};

export {
    CurrencyService, DepartamentService, ProvinceService, DistrictService,
    OperationService, PropertyService, EstateService, UserService
}