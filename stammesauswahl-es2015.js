"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var stammesauswahlAdmin;
window.addEventListener("load", function () {
  stammesauswahlAdmin = !!document.querySelector("#stammesauswahl_plugin_paste");
  Array.apply(null, document.querySelectorAll(".stammesauswahl")).forEach(function (table) {
    table.querySelector(".stammesauswahl-dv").addEventListener("change", function (e) {
      return stammesauswahlLoadBezirke(table, e.target.value);
    });
    table.querySelector(".stammesauswahl-bezirk").addEventListener("change", function (e) {
      return stammesauswahlLoadStaemme(table, e.target.value);
    });
    table.querySelector(".stammesauswahl-stamm").addEventListener("change", function (e) {
      if (table.querySelector(".stammesauswahl-stamm option[value='---']")) table.querySelector(".stammesauswahl-stamm option[value='---']").remove();
      table.querySelector(".stammesauswahl-custom-stamm").value = e.target.value;
      table.querySelector(".stammesauswahl-form-bezirk").value = table.querySelector(".stammesauswahl-bezirk").selectedOptions[0].innerText;
      table.querySelector(".stammesauswahl-form-dv").value = table.querySelector(".stammesauswahl-dv").selectedOptions[0].innerText;
    });

    if (!stammesauswahlAdmin) {
      table.querySelector(".stammesauswahl-custom").addEventListener("click", function () {
        table.querySelector(".stammesauswahl-custom").style.cssText = "display:none";
        table.querySelector(".stammesauswahl-select").style.cssText = "display:unset";
        stammesauswahlLoadBezirke(table, table.querySelector(".stammesauswahl-dv").value);
        table.querySelector(".stammesauswahl-stamm").style.cssText = "display:none";
        table.querySelector(".stammesauswahl-bezirk").style.cssText = "display:none";
        table.querySelector(".stammesauswahl-custom-stamm").style.cssText = "display:unset";
        table.querySelector(".stammesauswahl-custom-stamm").value = "";
      });
      table.querySelector(".stammesauswahl-select").addEventListener("click", function () {
        table.querySelector(".stammesauswahl-custom").style.cssText = "display:unset";
        table.querySelector(".stammesauswahl-select").style.cssText = "display:none";
        stammesauswahlLoadBezirke(table, table.querySelector(".stammesauswahl-dv").value);
        table.querySelector(".stammesauswahl-stamm").style.cssText = "display:unset";
        table.querySelector(".stammesauswahl-bezirk").style.cssText = "display:unset";
        table.querySelector(".stammesauswahl-custom-stamm").style.cssText = "display:none";
      });
    }

    stammesauswahlLoad(table);
  });
  var parent = document.querySelector(".stammesauswahl-dv").parentElement;

  while (parent && parent.className != "wpcf7") {
    parent = parent.parentElement;
  }

  if (parent) parent.addEventListener("wpcf7mailsent", function () {
    return requestAnimationFrame(function () {
      return document.querySelectorAll(".stammesauswahl").forEach(function (table) {
        return stammesauswahlLoad(table);
      });
    });
  });
});

function stammesauswahlLoad(table) {
  var dv = table.querySelector(".stammesauswahl-dv").getAttribute("defaultValue");
  var bezirk = table.querySelector(".stammesauswahl-bezirk").getAttribute("defaultValue");
  var stamm = table.querySelector(".stammesauswahl-stamm").getAttribute("defaultValue");
  table.querySelector(".stammesauswahl-dv").innerHTML = "";
  var groups = JSON.parse(table.getAttribute("groups"));
  var dvs = groups.map(function (dv, i) {
    return [i, dv.name, dv.hasBezirke ? dv.bezirke.length : 0, dv.bezirke.map(function (b) {
      return b.staemme.length;
    }).reduce(function (a, b) {
      return a + b;
    })];
  }).sort(function (a, b) {
    return a[1].localeCompare(b[1]);
  });
  var defaultDv = dvs.find(function (d) {
    return d[1] == dv;
  });
  if (!defaultDv) dvs = [[-1, "---", 0, 0]].concat(_toConsumableArray(dvs));

  if (stammesauswahlAdmin) {
    table.querySelector(".dv-count").innerText = "(".concat(groups.length, ")");
    var bezirkeCount = groups.map(function (d) {
      return d.bezirke.length;
    }).reduce(function (a, b) {
      return a + b;
    });
    var noBezirksCount = groups.filter(function (d) {
      return !d.hasBezirke;
    }).length;
    table.querySelector(".bezirk-count").innerText = "(".concat(bezirkeCount, "+").concat(noBezirksCount, ")");
    table.querySelector(".stamm-count").innerText = "(".concat(groups.map(function (d) {
      return d.bezirke.map(function (b) {
        return b.staemme.length;
      }).reduce(function (a, b) {
        return a + b;
      });
    }).reduce(function (a, b) {
      return a + b;
    }), ")");
  }

  dvs.forEach(function (d) {
    var option = document.createElement("option");
    option.value = d[0];
    option.innerText = d[1] + (stammesauswahlAdmin && d[3] > 0 ? " (".concat(d[2], " | ").concat(d[3], ")") : "");
    table.querySelector(".stammesauswahl-dv").appendChild(option);
  });
  if (defaultDv) table.querySelector(".stammesauswahl-dv").value = defaultDv[0];
  stammesauswahlLoadBezirke(table, defaultDv === null || defaultDv === void 0 ? void 0 : defaultDv[0], bezirk, stamm);
}

function stammesauswahlLoadBezirke(table, dvIndex, bezirk, stamm) {
  if (dvIndex !== undefined && table.querySelector(".stammesauswahl-dv option[value='-1']")) table.querySelector(".stammesauswahl-dv option[value='-1']").remove();
  table.querySelector(".stammesauswahl-bezirk").innerHTML = "";
  var dv = JSON.parse(table.getAttribute("groups"))[dvIndex];
  table.querySelector(".stammesauswahl-bezirk").disabled = !(dv === null || dv === void 0 ? void 0 : dv.hasBezirke);
  var bezirke = dv ? dv.bezirke.map(function (b, i) {
    return [i, b.name, b.staemme.length];
  }).sort(function (a, b) {
    return a[1].localeCompare(b[1]);
  }) : [];
  var defaultBezirk = (dv === null || dv === void 0 ? void 0 : dv.hasBezirke) ? bezirke.find(function (b) {
    return b[1] == bezirk;
  }) : bezirke[0];
  if (!defaultBezirk) bezirke = [[-1, "---", 0]].concat(_toConsumableArray(bezirke));
  bezirke.forEach(function (b) {
    var option = document.createElement("option");
    option.value = b[0] >= 0 ? dvIndex + "," + b[0] : -1;
    option.innerText = (b[1] || "-") + (stammesauswahlAdmin && b[2] > 0 ? " (".concat(b[2], ")") : "");
    table.querySelector(".stammesauswahl-bezirk").appendChild(option);
  });
  if (defaultBezirk) table.querySelector(".stammesauswahl-bezirk").value = dvIndex + "," + defaultBezirk[0];
  stammesauswahlLoadStaemme(table, dvIndex + "," + (defaultBezirk === null || defaultBezirk === void 0 ? void 0 : defaultBezirk[0]), stamm);
}

function stammesauswahlLoadStaemme(table, bezirkIndexes, stamm) {
  if (bezirkIndexes.split(",")[1] >= 0 && table.querySelector(".stammesauswahl-bezirk option[value='-1']")) table.querySelector(".stammesauswahl-bezirk option[value='-1']").remove();
  table.querySelector(".stammesauswahl-stamm").innerHTML = "";
  var dv = JSON.parse(table.getAttribute("groups"))[parseInt(bezirkIndexes.split(",")[0])];
  var bezirk = dv === null || dv === void 0 ? void 0 : dv.bezirke[parseInt(bezirkIndexes.split(",")[1])];
  table.querySelector(".stammesauswahl-stamm").disabled = !bezirk;
  var staemme = bezirk ? bezirk.staemme.sort() : [];
  var defaultStamm = staemme.find(function (s) {
    return s == stamm;
  });
  if (!defaultStamm) staemme = ["---"].concat(_toConsumableArray(staemme));
  staemme.forEach(function (s) {
    var option = document.createElement("option");
    option.value = s;
    option.innerText = s;
    table.querySelector(".stammesauswahl-stamm").appendChild(option);
  });
  if (defaultStamm) table.querySelector(".stammesauswahl-stamm").value = defaultStamm;

  if (!stammesauswahlAdmin) {
    if (table.querySelector(".stammesauswahl-custom").style.display != "none") {
      table.querySelector(".stammesauswahl-custom-stamm").value = defaultStamm ? defaultStamm : "---";
      table.querySelector(".stammesauswahl-form-dv").value = defaultStamm ? dv.name || "---" : "---";
      table.querySelector(".stammesauswahl-form-bezirk").value = defaultStamm ? bezirk.name || "---" : "---";
    } else {
      table.querySelector(".stammesauswahl-form-dv").value = dv === null || dv === void 0 ? void 0 : dv.name;
      table.querySelector(".stammesauswahl-form-bezirk").value = "Achtung: Stamm selbst eingegeben!";
    }
  }
}