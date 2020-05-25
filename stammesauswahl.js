let stammesauswahlAdmin;

window.addEventListener("load", () => {
    stammesauswahlAdmin = !!document.querySelector("#stammesauswahl_plugin_paste");

    Array.apply(null, document.querySelectorAll(".stammesauswahl")).forEach(table => {
        table.querySelector(".stammesauswahl-dv").addEventListener("change", e => stammesauswahlLoadBezirke(table, e.target.value));
        table.querySelector(".stammesauswahl-bezirk").addEventListener("change", e => stammesauswahlLoadStaemme(table, e.target.value));
        table.querySelector(".stammesauswahl-stamm").addEventListener("change", e => {
            if (table.querySelector(".stammesauswahl-stamm option[value='---']")) table.querySelector(".stammesauswahl-stamm option[value='---']").remove();
            table.querySelector(".stammesauswahl-custom-stamm").value = e.target.value;
            table.querySelector(".stammesauswahl-form-bezirk").value = table.querySelector(".stammesauswahl-bezirk").options[table.querySelector(".stammesauswahl-bezirk").selectedIndex].innerText;
            table.querySelector(".stammesauswahl-form-dv").value = table.querySelector(".stammesauswahl-dv").options[table.querySelector(".stammesauswahl-dv").selectedIndex].innerText;
        });

        if (!stammesauswahlAdmin) {
            table.querySelector(".stammesauswahl-custom").addEventListener("click", () => {
                table.querySelector(".stammesauswahl-custom").style.cssText = "display:none";
                table.querySelector(".stammesauswahl-select").style.cssText = "display:unset";

                stammesauswahlLoadBezirke(table, table.querySelector(".stammesauswahl-dv").value);
                table.querySelector(".stammesauswahl-stamm").style.cssText = "display:none";
                table.querySelector(".stammesauswahl-bezirk").style.cssText = "display:none";

                table.querySelector(".stammesauswahl-custom-stamm").style.cssText = "display:unset";
                table.querySelector(".stammesauswahl-custom-stamm").value = "";
            });

            table.querySelector(".stammesauswahl-select").addEventListener("click", () => {
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

    let parent = document.querySelector(".stammesauswahl-dv").parentElement;
    while (parent && parent.className != "wpcf7") parent = parent.parentElement;
    if (parent) parent.addEventListener("wpcf7mailsent", () => requestAnimationFrame(() => document.querySelectorAll(".stammesauswahl").forEach(table => stammesauswahlLoad(table))));
});

function stammesauswahlLoad(table) {
    let dv = table.querySelector(".stammesauswahl-dv").getAttribute("defaultValue");
    let bezirk = table.querySelector(".stammesauswahl-bezirk").getAttribute("defaultValue");
    let stamm = table.querySelector(".stammesauswahl-stamm").getAttribute("defaultValue");

    table.querySelector(".stammesauswahl-dv").innerHTML = "";
    let groups = JSON.parse(table.getAttribute("groups"));
    let dvs = groups.map((dv, i) => [i, dv.name, dv.hasBezirke ? dv.bezirke.length : 0, dv.bezirke.map(b => b.staemme.length).reduce((a, b) => a + b)]).sort((a, b) => a[1].localeCompare(b[1]));
    let defaultDv = dvs.find(d => d[1] == dv);
    if (!defaultDv) dvs = [[-1, "---", 0, 0], ...dvs];

    if (stammesauswahlAdmin) {
        table.querySelector(".dv-count").innerText = `(${groups.length})`;
        let bezirkeCount = groups.map(d => d.bezirke.length).reduce((a, b) => a + b);
        let noBezirksCount = groups.filter(d => !d.hasBezirke).length;
        table.querySelector(".bezirk-count").innerText = `(${bezirkeCount}+${noBezirksCount})`;
        table.querySelector(".stamm-count").innerText = `(${groups.map(d => d.bezirke.map(b => b.staemme.length).reduce((a, b) => a + b)).reduce((a, b) => a + b)})`;
    }


    dvs.forEach(d => {
        let option = document.createElement("option");
        option.value = d[0];
        option.innerText = d[1] + (stammesauswahlAdmin && d[3] > 0 ? ` (${d[2]} | ${d[3]})` : "");
        table.querySelector(".stammesauswahl-dv").appendChild(option);
    });
    if (defaultDv) table.querySelector(".stammesauswahl-dv").value = defaultDv[0];

    stammesauswahlLoadBezirke(table, defaultDv?.[0], bezirk, stamm);
}

function stammesauswahlLoadBezirke(table, dvIndex, bezirk, stamm) {
    if (dvIndex !== undefined && table.querySelector(".stammesauswahl-dv option[value='-1']")) table.querySelector(".stammesauswahl-dv option[value='-1']").remove();
    table.querySelector(".stammesauswahl-bezirk").innerHTML = "";

    let dv = JSON.parse(table.getAttribute("groups"))[dvIndex];
    table.querySelector(".stammesauswahl-bezirk").disabled = !dv?.hasBezirke;

    let bezirke = dv ? dv.bezirke.map((b, i) => [i, b.name, b.staemme.length]).sort((a, b) => a[1].localeCompare(b[1])) : [];
    let defaultBezirk = dv?.hasBezirke ? bezirke.find(b => b[1] == bezirk) : bezirke[0];
    if (!defaultBezirk) bezirke = [[-1, "---", 0], ...bezirke];

    bezirke.forEach(b => {
        let option = document.createElement("option");
        option.value = b[0] >= 0 ? dvIndex + "," + b[0] : -1;
        option.innerText = (b[1] || "-") + (stammesauswahlAdmin && b[2] > 0 ? ` (${b[2]})` : "");
        table.querySelector(".stammesauswahl-bezirk").appendChild(option);
    });
    if (defaultBezirk) table.querySelector(".stammesauswahl-bezirk").value = dvIndex + "," + defaultBezirk[0];

    stammesauswahlLoadStaemme(table, dvIndex + "," + defaultBezirk?.[0], stamm);
}

function stammesauswahlLoadStaemme(table, bezirkIndexes, stamm) {
    if (bezirkIndexes.split(",")[1] >= 0 && table.querySelector(".stammesauswahl-bezirk option[value='-1']")) table.querySelector(".stammesauswahl-bezirk option[value='-1']").remove();
    table.querySelector(".stammesauswahl-stamm").innerHTML = "";

    let dv = JSON.parse(table.getAttribute("groups"))[parseInt(bezirkIndexes.split(",")[0])];
    let bezirk = dv?.bezirke[parseInt(bezirkIndexes.split(",")[1])];
    table.querySelector(".stammesauswahl-stamm").disabled = !bezirk;

    let staemme = bezirk ? bezirk.staemme.sort() : [];
    let defaultStamm = staemme.find(s => s == stamm);
    if (!defaultStamm) staemme = ["---", ...staemme];

    staemme.forEach(s => {
        let option = document.createElement("option");
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
            table.querySelector(".stammesauswahl-form-dv").value = dv?.name;
            table.querySelector(".stammesauswahl-form-bezirk").value = "Achtung: Stamm selbst eingegeben!";
        }
    }
}