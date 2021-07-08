export default function (Alpine) {
    Alpine.directive('ajax', (el) => {
        if(el.nodeName != "FORM"){
            return;
        }

        el.addEventListener('submit', (event) => {
            // cancel normal submit
            event.preventDefault();

            // pack form data
            var formData = new FormData(el);

            // get data from form
            var url = el.getAttribute("action").includes('http') ? el.getAttribute("action") : api_base_domain + el.getAttribute("action");
            var method = el.getAttribute("method");

            axios.get(base_domain + '/sanctum/csrf-cookie').then(async (response) => {
                var res = await axios({
                    url: url,
                    data: formData,
                    method: method,
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500
                    }
                }).then(function (r) {
                    return r;
                })
                .catch(function (error) {
                    //handle error
                    return error;
                });
                if(res != null){
                    el._x_dataStack[0].errors = {};
                    if(res.isAxiosError){
                        console.log(res);
                    }else{
                        if(res.data.errors != undefined){
                            for (const [key, value] of Object.entries(res.data.errors)) {
                                el._x_dataStack[0].errors[key] = value;
                            }
                        }
                        el._x_dataStack[0].status = res.data.status;
                        el._x_dataStack[0].message = res.data.message;
                        el._x_dataStack[0].data = res.data.data;
                    }
                    
                }
            }).catch(function (err) {
                //handle error
                console.log(err);
            });
        })
    })
}

function makeRequestCreator() {
    var call;
    return function(url) {
        if (call) {
            call.cancel();
        }
        call = axios.CancelToken.source();
        return axios.get(url, { cancelToken: call.token }).then((response) => {
            console.log(response.title)
        }).catch(function(thrown) {
            if (axios.isCancel(thrown)) {
                console.log('First request canceled', thrown.message);
            } else {
                // handle error
            }
        });
    }
}
