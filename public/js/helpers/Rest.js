const processFetch = (endpoint, data, successCallback = () => {}, errorCallback = () => {}, notoken = false) => {
    /*
    if(!notoken) {
        let token = atob(Cookies.get("token"));
        if(!data.headers){
            data.headers = {};
        }
        data.headers['Authorization'] = `Bearer ${token}`;
    }
    */

    fetch(endpoint, data)
        .then((res) => res.json())
        .catch((error) => {
            console.error("Error Fetch: " + error);
        })
        .then((response) => {
            console.log("Success!");
            /*if (response.status === 'success') {
                successCallback(response.success.data);
            } else {
                console.error(response.error.internalMessage);
                console.error(response.error.message);
                errorCallback(response.error);
            }*/
        });
}

const multiFetch = async (requests) => {

    const fetchPromises = requests.map(({ endpoint, data }) => {

        let token = atob(Cookies.get("token"));
        if(!data.headers){
            data.headers = {};
        }
        data.headers['Authorization'] = `Bearer ${token}`;

        return fetch(endpoint, data)
    });

    const responses = await Promise.all(fetchPromises);

    return await Promise.all(responses.map(response => response.json()));
}

const uploadApi = async (link, method, name, element) => {
    let data = {};
    data.method = method;

    const formData = new FormData();
    formData.append(name, element);

    data.body = formData;

    const response = await fetch(link, data);
    return await response.json();
}

const saveRegistry = async (e, list, formData, formConfig) => {
    e.preventDefault();
    clearAlerts(formData, formConfig);

    let target = e.target;
    const link = target.action;
    const response = await connectApi(link, target);

    switch (response.status) {
        case 'error':
            formConfig.main_message = 'Upps, tenemos problemas con algunos datos que haz enviado, porfavor revisalos antes de volver a enviarlos';
            formConfig.style_message = 'danger';

            const message = response.message;
            Object.entries(message).map(entry => {
                const [name, value] = entry;
                formData[name].error = value;
            });
            break;
        case 'success':
            formConfig.main_message = response.message;
            formConfig.style_message = 'success';

            setTimeout(() => {
                target.dispatchEvent(new Event('closeModal'));
            }, 1500);
            break;
    }

    // Fade show
    setTimeout(() => {
        formConfig.show = true;
        Object.entries(formData).map(entry => {
            const [name, value] = entry;
            if (value.error !== null) {
                value.show = true;
            }
        });
    }, 100);

    // Desabilitamos y volvemos a habilitar despues de un tiempo
    formConfig.disabled = true;
    setTimeout(() => formConfig.disabled = false, 1000);

    updateList(list, target.getAttribute('list'));
}

export {
    saveRegistry, uploadApi, processFetch, multiFetch
}