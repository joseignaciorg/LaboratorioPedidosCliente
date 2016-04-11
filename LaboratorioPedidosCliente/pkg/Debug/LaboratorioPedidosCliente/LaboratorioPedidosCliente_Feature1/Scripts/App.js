
//funcion que nos devuelve los parametros de la url
function getQueryStringParams(sParam) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

var currentContext;
var hostWebContext;
var web;
var list;

//Funcion que nos duvelve los pedidos del cliente actual y sus correspondientes funciones de callback
function getList(id) {
    clearInfo();
    var lista = hostWebContext.get_web().get_lists().getByTitle("PedidosClientes");

    var query = new SP.CamlQuery();
    query.set_viewXml("<View Scope='RecursiveAll'><Query><Where><Contains><FieldRef Name='Cliente_x003a_ID' /><Value Type='Text'>" + id + "</Value></Contains></Where></Query></View>");
    list = lista.getItems(query);
    currentContext.load(list);
    currentContext.executeQueryAsync(Function.createDelegate(this, onSuccess), Function.createDelegate(this, onFail));
}

//funicon de callback de satisfactorio
function onSuccess() {
    if (list.get_count() != 0) {
        var listEnum = list.getEnumerator();
        var n = 1;
        var total = 0;
        var tabla = $("#TablaPedidos tbody");
        while (listEnum.moveNext()) {
            var html = "<tr>";
            var actual = listEnum.get_current();
            var d = actual.get_item("Fecha");
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            html += "<td>" + actual.get_item("NumeroPedido") + "</td>";
            html += "<td>" + day + "-" + month + "-" + year + "</td>";
            html += "<td>" + actual.get_item("Total") + "€ </td>";
            n++;
            tabla.append(html);
        }

        var nombre = actual.get_item("Cliente_x003a_Nombre_x0020_compl").get_lookupValue();
        $("#Nombre").text(nombre);
        $("#NumeroPedidos").text("Pedidos: " + (n - 1));
        $("#MostrarPedidos").css("display", "block");
        $("#SinPedidos").css("display", "none");
    }
    else {
        $("#MostrarPedidos").css("display", "none");
        $("#SinPedidos").css("display", "block");
    }
}

//funcion de callback de error
function onFail() {
    alert("Error");
}

//funcion para limpiar informacion
function clearInfo() {
    var t = $("#TablaPedidos>tbody>tr");
    t.remove();
    $("#NumeroPedidos").text("");
    $("#Total").text("");
}

function init() {

    var hostUrl = decodeURIComponent(getQueryStringParams("SPHostUrl"));

    currentContext = new SP.ClientContext.get_current();

    hostWebContext = new SP.AppContextSite(currentContext, hostUrl);

    web = hostWebContext.get_web();

    var id = getQueryStringParams("SPListItemId");

    getList(id);

}

$(document).ready(function () {
    ExecuteOrDelayUntilScriptLoaded(init, "sp.js");
});


//'use strict';

//ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

//function initializePage()
//{
//    var context = SP.ClientContext.get_current();
//    var user = context.get_web().get_currentUser();

//    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
//    $(document).ready(function () {
//        getUserName();
//    });

//    // This function prepares, loads, and then executes a SharePoint query to get the current users information
//    function getUserName() {
//        context.load(user);
//        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//    }

//    // This function is executed if the above call is successful
//    // It replaces the contents of the 'message' element with the user name
//    function onGetUserNameSuccess() {
//        $('#message').text('Hello ' + user.get_title());
//    }

//    // This function is executed if the above call fails
//    function onGetUserNameFail(sender, args) {
//        alert('Failed to get user name. Error:' + args.get_message());
//    }
//}
