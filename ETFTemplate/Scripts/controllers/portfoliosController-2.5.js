﻿
LoyolApp = LoyolApp || {};

// Constructor of the controller
LoyolApp.PortfolioController = function () {
    this.Code = '';
}

// Get all the data from API portfolios related to one portfolio
LoyolApp.PortfolioController.prototype.get = function (action, data, callback, onerror) {

    var session = LoyolApp.Session.getInstance().get();
    if (session && session.keepSignedIn && session.token) {
        var token = session.token,
            url = LoyolApp.Settings.domain + '/api/Portfolios/' + action;

        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: url,
            async : false,
            data: data,
            crossDomain: true,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token);
            },
            success: callback,
            error: function (xhr, status, error) {
                if (onerror)
                    onerror(error);
                else
                    alert(status);            }
        });
    }
}

// Post the data to the controller API portfolios
LoyolApp.PortfolioController.prototype.post = function (action, data, callback) {
    var session = LoyolApp.Session.getInstance().get();
    if (session && session.keepSignedIn && session.token) {
        var token = session.token,
            url = LoyolApp.Settings.domain + '/api/portfolios/' + action;

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            mimeType: 'multipart/form-data',
            cache: false,
            processData: false,
            crossDomain: true,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token);
            },
            success: function (data) {
                callback(data);
            },
            error: function (xhr, status, error) {
                alert(status);
            }
        });
    }
}

// Post the data from form to the controller API portfolios
LoyolApp.PortfolioController.prototype.postform = function (action, data, callback) {
    var session = LoyolApp.Session.getInstance().get();
    if (session && session.keepSignedIn && session.token) {
        var token = session.token,
            url = LoyolApp.Settings.domain + '/api/portfolios/' + action;

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: false,
            processData: false,
            crossDomain: true,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token);
            },
            fail: function () {
                alert('fail');
            },
            success: callback,
            error: function (xhr, status, error) {
                alert(error);
            }
        });
    }
}

// render select controls
LoyolApp.PortfolioController.prototype.select = function (divname, callback) {
    this.get('UserIndex', null, function (lst) {
        $.each(lst, function (i, item) {
            $('<option value="' + item.code + '">').text(item.name).appendTo(divname);
        });
        if (callback)
            callback();
    })
}

// render select controls
LoyolApp.PortfolioController.prototype.exists = function (id, callback) {
    var session = LoyolApp.Session.getInstance().get();
    if (session && session.keepSignedIn && session.token) {
        var token = session.token,
            url = session.domain + '/api/Portfolios/Get';

        $.ajax({
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            url: url,
            data: { code: id },
            crossDomain: true,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", 'Bearer ' + token);
            },
            success: function (p) { callback(true, p); },
            error: function (xhr, status, error) {
                callback(false, null);
            }
        });
    }
}

LoyolApp.PortfolioController.prototype.populateHoldings = function (data, div) {

    var myLocalFormat = { style: "currency", currency: "EUR" };
    var session = LoyolApp.Session.getInstance().get();

    $(div).empty();
    $.each(data.Holdings, function (i, item) {
        var a = $('<a>').html(item.Asset.name).attr('href', session.domain + '/' + item.Asset.url).attr('target', '_blank');
        var tr = $('<tr>').append(
            $('<td>').append($('<img>').addClass('td-img').attr('src', item.Asset.imageurl)),
            $('<td>').text(item.Asset.type == 'portfolio' ? 'Modèle' : item.Asset.code ),
            $('<td>').html(a),
            $('<td>').text(item.Asset.category),
            $('<td class="text-end">').text(item.qty.toFixed(4)),
            $('<td class="text-end">').text(item.costprice.toFixed(3)),
            $('<td class="text-end">').text(item.unrealizedpnl.toLocaleString("fr-FR", myLocalFormat)),
            $('<td class="text-end">').text(parseFloat(100 * item.return).toFixed(2) + "%"),
            $('<td class="text-end">').text(item.marketprice),
            $('<td class="text-end">').text(item.npv.toLocaleString("fr-FR", myLocalFormat)),
            $('<td class="text-end">').text(item.weight + '%')
        );
        tr.appendTo(div);
    });
}

// fill the documents tables
LoyolApp.PortfolioController.prototype.populateDocuments = function (data, div) {
    var tbody = div.find('tbody'),
        title = div.data('document');
    tbody.empty();
    $.each(data, function (i, item) {
        if (item.title == title) {
            var a = $('<a>').attr('href', item.url).text(item.title);
            var tr = $('<tr>').append(
                $('<td>').append($('<img>').addClass('td-img').attr('src', 'https://etfreporting.com' + item.icon)),
                $('<td>').text(item.code),
                $('<td>').text(item.name),
                $('<td>').append(a));
            tr.appendTo(tbody);
        }
    });
}

// fill the documents tables
LoyolApp.PortfolioController.prototype.populateCompliances = function (data, div) {
    var tbody = div.find('tbody');
    tbody.empty();
    $.each(data, function (i, w) {
        var tr = $('<tr>').append(
            $('<td>').text(w.name),
            $('<td class="text-center">').text(w.status),
            $('<td class="text-end">').text(w.minvalue.toFixed(2)),
            $('<td class="text-end">').text(w.maxvalue.toFixed(2)),
            $('<td class="text-end">').text(w.value.toFixed(2)));
        tr.addClass(w.status == 'Not complied' ? 'table-warning' : 'table-success');
        tr.appendTo(tbody);
    });
}
// fill the indicators tables
LoyolApp.PortfolioController.prototype.populateIndicatorsTable = function (data, body) {
    body.empty();
    $.each(data, function (i, obj) {
        var net = (100 * obj.netreturn).toFixed(2),
            std = (100 * obj.stddev).toFixed(2),
            shp = obj.sharpe.toFixed(2),
            mdd = (100 * obj.maxdrawdown).toFixed(2),
            var95 = (100 * obj.var95).toFixed(2);
        tr = $('<tr>').append(
            $('<td class="text-center">').text(obj.depth),
            $('<td class="text-end">').text(net + "%"),
            $('<td class="text-end">').text(std + "%"),
            $('<td class="text-end">').text(shp),
            $('<td class="text-end">').text(mdd + "%"),
            $('<td class="text-end">').text(var95 + "%")
        );
        tr.appendTo(body);
    });
}

// fill the indicator item fields
LoyolApp.PortfolioController.prototype.populateIndicators = function (data) {
    $.each(data, function (i, obj) {
        if (obj.depth == "STD") {
            $('.indicator-item').each(function () {
                var item = $(this);
                val = (100 * obj[item.data('indicator')]).toFixed(2),
                    item.html(val + '%');
            })
        }
    });
}