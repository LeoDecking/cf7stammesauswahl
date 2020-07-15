let cf7stammesauswahlAdmin;

window.addEventListener("load", () => {
    cf7stammesauswahlAdmin = !!document.querySelector("#cf7stammesauswahl-plugin-paste");

    Array.apply(null, document.querySelectorAll(".cf7stammesauswahl")).forEach(cf7stammesauswahlDiv => {
        cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").addEventListener("change", e => cf7stammesauswahlLoadBezirke(cf7stammesauswahlDiv, e.target.value));
        cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").addEventListener("change", e => cf7stammesauswahlLoadStaemme(cf7stammesauswahlDiv, e.target.value));
        if (!cf7stammesauswahlAdmin) {
            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").addEventListener("change", e => {
                if (cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm option[value='---']")) cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm option[value='---']").remove();
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom-stamm").value = e.target.value;
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-form-bezirk").value = cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").options[cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").selectedIndex].innerText;
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-form-dv").value = cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").options[cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").selectedIndex].innerText;
            });

            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom").addEventListener("click", () => {
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom").style.cssText = "display:none";
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-select").style.cssText = "display:unset";

                cf7stammesauswahlLoadBezirke(cf7stammesauswahlDiv, cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").value);
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").style.cssText = "display:none";
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").style.cssText = "display:none";

                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom-stamm").style.cssText = "display:unset";
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom-stamm").value = "";
            });

            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-select").addEventListener("click", () => {
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom").style.cssText = "display:unset";
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-select").style.cssText = "display:none";

                cf7stammesauswahlLoadBezirke(cf7stammesauswahlDiv, cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").value);
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").style.cssText = "display:unset";
                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").style.cssText = "display:unset";

                cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom-stamm").style.cssText = "display:none";
            });
        }

        cf7stammesauswahlLoad(cf7stammesauswahlDiv);
    });

    let parent = document.querySelector(".cf7stammesauswahl-dv").parentElement;
    while (parent && parent.className != "wpcf7") parent = parent.parentElement;
    if (parent) parent.addEventListener("wpcf7mailsent", () => requestAnimationFrame(() => Array.apply(null, document.querySelectorAll(".cf7stammesauswahl")).forEach(cf7stammesauswahlDiv => cf7stammesauswahlLoad(cf7stammesauswahlDiv))));
});

function cf7stammesauswahlLoad(cf7stammesauswahlDiv) {
    let dv = cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").getAttribute("defaultValue");
    let bezirk = cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").getAttribute("defaultValue");
    let stamm = cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").getAttribute("defaultValue");

    cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").innerHTML = "";
    let groups = JSON.parse(cf7stammesauswahlDiv.getAttribute("groups"));
    let dvs = groups.map((dv, i) => [i, dv.name, dv.hasBezirke ? dv.bezirke.length : 0, dv.bezirke.map(b => b.staemme.length).reduce((a, b) => a + b)]).sort((a, b) => a[1].localeCompare(b[1]));
    let defaultDv = dvs.find(d => d[1] == dv);
    if (!defaultDv) dvs = [[-1, "---", 0, 0], ...dvs];

    if (cf7stammesauswahlAdmin) {
        cf7stammesauswahlDiv.querySelector(".dv-count").innerText = `(${groups.length})`;
        let bezirkeCount = groups.map(d => d.bezirke.length).reduce((a, b) => a + b);
        let noBezirksCount = groups.filter(d => !d.hasBezirke).length;
        cf7stammesauswahlDiv.querySelector(".bezirk-count").innerText = `(${bezirkeCount}+${noBezirksCount})`;
        cf7stammesauswahlDiv.querySelector(".stamm-count").innerText = `(${groups.map(d => d.bezirke.map(b => b.staemme.length).reduce((a, b) => a + b)).reduce((a, b) => a + b)})`;
    }


    dvs.forEach(d => {
        let option = document.createElement("option");
        option.value = d[0];
        option.innerText = d[1] + (cf7stammesauswahlAdmin && d[3] > 0 ? ` (${d[2]} | ${d[3]})` : "");
        cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").appendChild(option);
    });
    if (defaultDv) cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv").value = defaultDv[0];

    cf7stammesauswahlLoadBezirke(cf7stammesauswahlDiv, !defaultDv ? null : defaultDv[0], bezirk, stamm);
}

function cf7stammesauswahlLoadBezirke(cf7stammesauswahlDiv, dvIndex, bezirk, stamm) {
    if (!cf7stammesauswahlAdmin && dvIndex !== undefined && cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv option[value='-1']")) cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-dv option[value='-1']").remove();
    cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").innerHTML = "";

    let dv = JSON.parse(cf7stammesauswahlDiv.getAttribute("groups"))[dvIndex];
    cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").disabled = !dv || !dv.hasBezirke;

    let bezirke = dv ? dv.bezirke.map((b, i) => [i, b.name, b.staemme.length]).sort((a, b) => a[1].localeCompare(b[1])) : [];
    let defaultBezirk = !dv ? null : dv.hasBezirke ? bezirke.find(b => b[1] == bezirk) : bezirke[0];
    if (!defaultBezirk) bezirke = [[-1, "---", 0], ...bezirke];

    bezirke.forEach(b => {
        let option = document.createElement("option");
        option.value = b[0] >= 0 ? dvIndex + "," + b[0] : -1;
        option.innerText = (b[1] || "-") + (cf7stammesauswahlAdmin && b[2] > 0 ? ` (${b[2]})` : "");
        cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").appendChild(option);
    });
    if (defaultBezirk) cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk").value = dvIndex + "," + defaultBezirk[0];

    cf7stammesauswahlLoadStaemme(cf7stammesauswahlDiv, dvIndex + "," + (!defaultBezirk ? "-1" : defaultBezirk[0]), stamm);
}

function cf7stammesauswahlLoadStaemme(cf7stammesauswahlDiv, bezirkIndexes, stamm) {
    if (!cf7stammesauswahlAdmin && bezirkIndexes.split(",")[1] >= 0 && cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk option[value='-1']")) cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-bezirk option[value='-1']").remove();
    cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").innerHTML = "";

    let dv = JSON.parse(cf7stammesauswahlDiv.getAttribute("groups"))[parseInt(bezirkIndexes.split(",")[0])];
    let bezirk = !dv ? null : dv.bezirke[parseInt(bezirkIndexes.split(",")[1])];
    cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").disabled = !bezirk;

    let staemme = bezirk ? bezirk.staemme.sort() : [];
    let defaultStamm = staemme.find(s => s == stamm);
    if (!defaultStamm) staemme = ["---", ...staemme];

    staemme.forEach(s => {
        let option = document.createElement("option");
        option.value = s;
        option.innerText = s;
        cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").appendChild(option);
    });
    if (defaultStamm) cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-stamm").value = defaultStamm;
    if (!cf7stammesauswahlAdmin) {
        if (cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom").style.display != "none") {
            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-custom-stamm").value = defaultStamm ? defaultStamm : "---";
            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-form-dv").value = defaultStamm ? dv.name || "---" : "---";
            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-form-bezirk").value = defaultStamm ? bezirk.name || "---" : "---";
        } else {
            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-form-dv").value = !dv ? "" : dv.name;
            cf7stammesauswahlDiv.querySelector(".cf7stammesauswahl-form-bezirk").value = "Achtung: Stamm selbst eingegeben!";
        }
    }
}