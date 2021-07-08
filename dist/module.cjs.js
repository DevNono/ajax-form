var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// builds/module.js
__export(exports, {
  default: () => module_default
});

// src/index.js
function src_default(Alpine) {
  Alpine.directive("ajax", (el) => {
    if (el.nodeName != "FORM") {
      return;
    }
    el.addEventListener("submit", (event) => {
      event.preventDefault();
      var formData = new FormData(el);
      var url = el.getAttribute("action").includes("http") ? el.getAttribute("action") : api_base_domain + el.getAttribute("action");
      var method = el.getAttribute("method");
      axios.get(base_domain + "/sanctum/csrf-cookie").then(async (response) => {
        var res = await axios({
          url,
          data: formData,
          method,
          validateStatus: function(status) {
            return status < 500;
          }
        }).then(function(r) {
          return r;
        }).catch(function(error) {
          return error;
        });
        if (res != null) {
          el._x_dataStack[0].errors = {};
          if (res.isAxiosError) {
            console.log(res);
          } else {
            if (res.data.errors != void 0) {
              for (const [key, value] of Object.entries(res.data.errors)) {
                el._x_dataStack[0].errors[key] = value;
              }
            }
            el._x_dataStack[0].status = res.data.status;
            el._x_dataStack[0].message = res.data.message;
            el._x_dataStack[0].data = res.data.data;
          }
        }
      }).catch(function(err) {
        console.log(err);
      });
    });
  });
}

// builds/module.js
var module_default = src_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
