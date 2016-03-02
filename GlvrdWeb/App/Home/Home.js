/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            $('#check-glvrd').click(getDataFromSelection);
        });
    };

    // Reads data from current document selection and displays a notification
    function getDataFromSelection() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    var text = result.value;
                    glvrd.proofread(text, function (result) {
                        if (result.status == 'ok') {
                            $("#score").html('<span class="score">' + result.score + ' </span> из 10 баллов по шкале Главреда');
                            var r = result.fragments.map(function (f) {
                                var s = text.substr(f.start, f.end - f.start + 1);
                                var hint = f.hint;

                                return '<div class="hint">'+ 
                                    '<div class="hint-title">' + hint.name + '</div>' +
                                    '<div class="stop-word">' + s + '</div>'+
                                    '<div class="hint-desc">' + hint.description + '</div>' +
                                    '</div>';
                            }).join("");

                            $('#results')
                                .html('')
                                .append(r);
                        } else {
                            app.showNotification('Error:', result.message);
                            alert(result.message);
                        }
                    });
                } else {
                    app.showNotification('Error:', result.error.message);
                }
            }
        );
    }
})();