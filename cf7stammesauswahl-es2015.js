//babeljs.io
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var cf7stammesauswahlAdmin;
window.addEventListener("load", function () {
  cf7stammesauswahlAdmin = !!document.querySelector("#cf7stammesauswahl-plugin-paste");
  Array.apply(null, document.querySelectorAll(".cf7stammesauswahl")).forEach(function (table) {
    table.querySelector(".cf7stammesauswahl-dv").addEventListener("change", function (e) {
      return cf7stammesauswahlLoadBezirke(table, e.target.value);
    });
    table.querySelector(".cf7stammesauswahl-bezirk").addEventListener("change", function (e) {
      return cf7stammesauswahlLoadStaemme(table, e.target.value);
    });
    table.querySelector(".cf7stammesauswahl-stamm").addEventListener("change", function (e) {
      if (table.querySelector(".cf7stammesauswahl-stamm option[value='---']")) table.querySelector(".cf7stammesauswahl-stamm option[value='---']").remove();
      table.querySelector(".cf7stammesauswahl-custom-stamm").value = e.target.value;
      table.querySelector(".cf7stammesauswahl-form-bezirk").value = table.querySelector(".cf7stammesauswahl-bezirk").options[table.querySelector(".cf7stammesauswahl-bezirk").selectedIndex].innerText;
      table.querySelector(".cf7stammesauswahl-form-dv").value = table.querySelector(".cf7stammesauswahl-dv").options[table.querySelector(".cf7stammesauswahl-dv").selectedIndex].innerText;
    });

    if (!cf7stammesauswahlAdmin) {
      table.querySelector(".cf7stammesauswahl-custom").addEventListener("click", function () {
        table.querySelector(".cf7stammesauswahl-custom").style.cssText = "display:none";
        table.querySelector(".cf7stammesauswahl-select").style.cssText = "display:unset";
        cf7stammesauswahlLoadBezirke(table, table.querySelector(".cf7stammesauswahl-dv").value);
        table.querySelector(".cf7stammesauswahl-stamm").style.cssText = "display:none";
        table.querySelector(".cf7stammesauswahl-bezirk").style.cssText = "display:none";
        table.querySelector(".cf7stammesauswahl-custom-stamm").style.cssText = "display:unset";
        table.querySelector(".cf7stammesauswahl-custom-stamm").value = "";
      });
      table.querySelector(".cf7stammesauswahl-select").addEventListener("click", function () {
        table.querySelector(".cf7stammesauswahl-custom").style.cssText = "display:unset";
        table.querySelector(".cf7stammesauswahl-select").style.cssText = "display:none";
        cf7stammesauswahlLoadBezirke(table, table.querySelector(".cf7stammesauswahl-dv").value);
        table.querySelector(".cf7stammesauswahl-stamm").style.cssText = "display:unset";
        table.querySelector(".cf7stammesauswahl-bezirk").style.cssText = "display:unset";
        table.querySelector(".cf7stammesauswahl-custom-stamm").style.cssText = "display:none";
      });
    }

    cf7stammesauswahlLoad(table);
  });
  var parent = document.querySelector(".cf7stammesauswahl-dv").parentElement;

  while (parent && parent.className != "wpcf7") {
    parent = parent.parentElement;
  }

  if (parent) parent.addEventListener("wpcf7mailsent", function () {
    return requestAnimationFrame(function () {
      return Array.apply(null,document.querySelectorAll(".cf7stammesauswahl")).forEach(function (table) {
        return cf7stammesauswahlLoad(table);
      });
    });
  });
});

function cf7stammesauswahlLoad(table) {
  var dv = table.querySelector(".cf7stammesauswahl-dv").getAttribute("defaultValue");
  var bezirk = table.querySelector(".cf7stammesauswahl-bezirk").getAttribute("defaultValue");
  var stamm = table.querySelector(".cf7stammesauswahl-stamm").getAttribute("defaultValue");
  table.querySelector(".cf7stammesauswahl-dv").innerHTML = "";
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

  if (cf7stammesauswahlAdmin) {
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
    option.innerText = d[1] + (cf7stammesauswahlAdmin && d[3] > 0 ? " (".concat(d[2], " | ").concat(d[3], ")") : "");
    table.querySelector(".cf7stammesauswahl-dv").appendChild(option);
  });
  if (defaultDv) table.querySelector(".cf7stammesauswahl-dv").value = defaultDv[0];
  cf7stammesauswahlLoadBezirke(table, defaultDv === null || defaultDv === void 0 ? void 0 : defaultDv[0], bezirk, stamm);
}

function cf7stammesauswahlLoadBezirke(table, dvIndex, bezirk, stamm) {
  if (dvIndex !== undefined && table.querySelector(".cf7stammesauswahl-dv option[value='-1']")) table.querySelector(".cf7stammesauswahl-dv option[value='-1']").remove();
  table.querySelector(".cf7stammesauswahl-bezirk").innerHTML = "";
  var dv = JSON.parse(table.getAttribute("groups"))[dvIndex];
  table.querySelector(".cf7stammesauswahl-bezirk").disabled = !(dv === null || dv === void 0 ? void 0 : dv.hasBezirke);
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
    option.innerText = (b[1] || "-") + (cf7stammesauswahlAdmin && b[2] > 0 ? " (".concat(b[2], ")") : "");
    table.querySelector(".cf7stammesauswahl-bezirk").appendChild(option);
  });
  if (defaultBezirk) table.querySelector(".cf7stammesauswahl-bezirk").value = dvIndex + "," + defaultBezirk[0];
  cf7stammesauswahlLoadStaemme(table, dvIndex + "," + (defaultBezirk === null || defaultBezirk === void 0 ? void 0 : defaultBezirk[0]), stamm);
}

function cf7stammesauswahlLoadStaemme(table, bezirkIndexes, stamm) {
  if (bezirkIndexes.split(",")[1] >= 0 && table.querySelector(".cf7stammesauswahl-bezirk option[value='-1']")) table.querySelector(".cf7stammesauswahl-bezirk option[value='-1']").remove();
  table.querySelector(".cf7stammesauswahl-stamm").innerHTML = "";
  var dv = JSON.parse(table.getAttribute("groups"))[parseInt(bezirkIndexes.split(",")[0])];
  var bezirk = dv === null || dv === void 0 ? void 0 : dv.bezirke[parseInt(bezirkIndexes.split(",")[1])];
  table.querySelector(".cf7stammesauswahl-stamm").disabled = !bezirk;
  var staemme = bezirk ? bezirk.staemme.sort() : [];
  var defaultStamm = staemme.find(function (s) {
    return s == stamm;
  });
  if (!defaultStamm) staemme = ["---"].concat(_toConsumableArray(staemme));
  staemme.forEach(function (s) {
    var option = document.createElement("option");
    option.value = s;
    option.innerText = s;
    table.querySelector(".cf7stammesauswahl-stamm").appendChild(option);
  });
  if (defaultStamm) table.querySelector(".cf7stammesauswahl-stamm").value = defaultStamm;

  if (!cf7stammesauswahlAdmin) {
    if (table.querySelector(".cf7stammesauswahl-custom").style.display != "none") {
      table.querySelector(".cf7stammesauswahl-custom-stamm").value = defaultStamm ? defaultStamm : "---";
      table.querySelector(".cf7stammesauswahl-form-dv").value = defaultStamm ? dv.name || "---" : "---";
      table.querySelector(".cf7stammesauswahl-form-bezirk").value = defaultStamm ? bezirk.name || "---" : "---";
    } else {
      table.querySelector(".cf7stammesauswahl-form-dv").value = dv === null || dv === void 0 ? void 0 : dv.name;
      table.querySelector(".cf7stammesauswahl-form-bezirk").value = "Achtung: Stamm selbst eingegeben!";
    }
  }
}