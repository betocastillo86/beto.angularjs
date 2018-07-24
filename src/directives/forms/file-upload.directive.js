(function () {
    angular.module('beto.core.directives')
        .directive('coreFileUpload', fileUpload);

    fileUpload.$inject = ['coreFileService', 'coreExceptionService'];

    function fileUpload(fileService, exceptionService) {
        return {
            restrict: 'EA',
            link: link,
            scope: {
                onadded: '=',
                onprogress: '=',
                callbackParam: '@',
                defaultname: '@',
                validextensions: '@',
                validatehorizontal: '@',
                url: '@',
                maxSize: '@'
            }
        };

        function link(scope, element, attrs) {
            angular.element(element).on('change', sendFile);
            var isMultiple = angular.element(element)[0].attributes.multiple !== undefined;

            attrs.$observe('defaultname', updateDefaultName);

            //// Contiene el progreso de cada archivo
            var progressArray = [];
            //// Contiene el indice de los archivos ya cargados
            var iFileSent = 0;
            var alreadyShowedHorizontalError = false;


            function sendFile(e) {
                alreadyShowedHorizontalError = false;
                var fileUpload = element[0];

                //progressArray = new Array();

                var errorSize = false;
                var errorExtensions = false;


                var validExtensionsRegex = scope.validextensions ? new RegExp(scope.validextensions, 'i') : null;
                var serviceUrl = scope.url || '/api/v1/files';
                var validatehorizontal = scope.validatehorizontal ? scope.validatehorizontal : false;
                var maxRequestFileUploadMB = (scope.maxSize || 5)* 1024 * 1024;

                for (var i = 0; i < fileUpload.files.length; i++) {
                    if (fileUpload.files[i].size > maxRequestFileUploadMB) {
                        errorSize = true;
                    }
                    else if (validExtensionsRegex && !validExtensionsRegex.test(fileUpload.files[i].name)) {
                        errorExtensions = true;
                    }
                    else if (validatehorizontal == '1') {
                        validateHorizontalImage(serviceUrl, fileUpload.files[i], fileUpload.files.length);
                    }
                    else
                    {
                        postFileToServer(serviceUrl, fileUpload.files[i]);
                    }
                }

                if (errorSize) {
                    var message = '';
                    if (fileUpload.files.length == 1) {
                        message = 'El archivo no puede exceder las ' + maxRequestFileUploadMB + 'MB. Subir archivos de menor peso.';
                    }
                    else if (iFileSent == 0) {
                        message = 'Los archivos no pueden exceder las ' + maxRequestFileUploadMB + 'MB. Subir archivos de menor peso.';
                    }
                    else {
                        message = 'Hay archivos que exceden las ' + maxRequestFileUploadMB + 'MB. Subir archivos de menor peso.';
                    }

                    exceptionService.handle({ data: { error: { message: message } } });
                    element.val(null);
                }
                else if (errorExtensions) {
                    var message = '';
                    if (fileUpload.files.length == 1) {
                        message = 'El archivo no tiene una extension válida';
                    }
                    else if (iFileSent == 0) {
                        message = 'Los archivos no tienen extensiones válidas.';
                    }
                    else {
                        message = 'Hay archivos no tienen extensiones válidas.';
                    }

                    exceptionService.handle({ data: { error: { message: message } } });
                    element.val(null);
                }
            }

            function onProgress(percentage, indexFile) {
                progressArray[indexFile] = percentage;
                if (scope.onprogress) {
                    scope.onprogress(progressArray);
                }
            }

            function postFileToServer(url, file)
            {
                fileService.post(url, file, scope.defaultname, onProgress, iFileSent)
                    .then(postCompleted)
                    .catch(exceptionService.handle);
                iFileSent++;
            }

            function validateHorizontalImage(url, file, totalImages)
            {
                var _URL = window.URL || window.webkitURL;
                if (_URL) {
                    var x = scope.defaultname;
                    var img = new Image();
                    img.onload = function () {
                        var y = scope.defaultname;
                        if (img.height <= img.width) {
                            postFileToServer(url, file);
                        }
                        else
                        {
                            if (!alreadyShowedHorizontalError)
                            {
                                var message = '';
                                if (totalImages == 1) {
                                    message = 'La imagen no puede tener formato vertical ya que se va a ver cortadas. Debes subir otra imagen.<br><img src="/img/front/ejemplo-mala-foto.png" />';
                                }
                                else {
                                    message = 'Hay imagenes en formato vertical y no pueden ser cargadas ya que se van a ver cortadas. Toma otras fotos en formato <b>horizontal</b>.<br><img src="/img/front/ejemplo-mala-foto.png" />';
                                }

                                exceptionService.handle({ data: { error: { message: message } } });
                                alreadyShowedHorizontalError = true;
                            }
                        }
                    };
                    img.src = _URL.createObjectURL(file);
                }
            }

            function updateDefaultName(newValue) {
                scope.defaultname = newValue;
            }


            function postCompleted(response, percentage, indexFile) {

                var finishedLoad = _.reject(progressArray, function (el) {
                    return el == 101;
                });

                if (!finishedLoad.length)
                {
                    console.log("Se resetea array", progressArray);
                    progressArray = [];
                    iFileSent = 0;
                }

                if (scope.onprogress) {
                    scope.onprogress(progressArray);
                }

                //if it has a callback method for added then call it
                if (scope.onadded) {
                    scope.onadded(response, scope.callbackParam);
                }

                element.val(null);
            }
        }
    }
})();