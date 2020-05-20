let stammesauswahlGrps;
let stammesauswahlAdmin = false;

window.addEventListener("load", async () => {
    document.getElementById("stammesauswahl-dv").addEventListener("change", e => stammesauswahlLoadBezirke(e.target.value));
    document.getElementById("stammesauswahl-bezirk").addEventListener("change", e => stammesauswahlLoadStaemme(e.target.value));
    document.getElementById("stammesauswahl-stamm").addEventListener("change", () => {
        if (document.querySelector("#stammesauswahl-stamm option[value='---']")) document.querySelector("#stammesauswahl-stamm option[value='---']").remove();
    });

    stammesauswahlGrps = await fetch("https://wp.schoolyourself.de/wp-content/uploads/2020/05/gruppierungen.txt").then(r => r.json());
    if (stammesauswahlAdmin) {
        document.getElementById("dv-count").innerText = `(${Object.keys(stammesauswahlGrps.dvs).length})`;
        document.getElementById("bezirk-count").innerText = `(${Object.keys(stammesauswahlGrps.bezirke).length})`;
        document.getElementById("stamm-count").innerText = `(${Object.keys(stammesauswahlGrps.staemme).length})`;
    }
    stammesauswahlLoad();

    let parent = document.getElementById("stammesauswahl-dv").parentElement;
    while (parent && parent.className != "wpcf7") parent = parent.parentElement;
    if (parent) parent.addEventListener("wpcf7mailsent", () => requestAnimationFrame(stammesauswahlLoad));
});

function stammesauswahlLoad() {
    let dv = document.getElementById("stammesauswahl-dv").getAttribute("defaultValue");
    let bezirk = document.getElementById("stammesauswahl-bezirk").getAttribute("defaultValue");
    let stamm = document.getElementById("stammesauswahl-stamm").getAttribute("defaultValue");

    document.getElementById("stammesauswahl-dv").innerHTML = "";
    let dvs = Object.keys(stammesauswahlGrps.dvs).sort();
    if (dvs.indexOf(dv) == -1) dvs = ["---", ...dvs];

    dvs.forEach(d => {
        let option = document.createElement("option");
        option.value = d;
        option.innerText =  d;
        document.getElementById("stammesauswahl-dv").appendChild(option);
    });
    if (dvs.indexOf(dv) != -1) document.getElementById("stammesauswahl-dv").value = dv;

    stammesauswahlLoadBezirke(dv, bezirk, stamm, true);
}

function stammesauswahlLoadBezirke(dv, bezirk, stamm) {
    if (dv && document.querySelector("#stammesauswahl-dv option[value='---']")) document.querySelector("#stammesauswahl-dv option[value='---']").remove();
    document.getElementById("stammesauswahl-bezirk").innerHTML = "";

    let bezirke = Object.keys(stammesauswahlGrps.bezirke).filter(b => stammesauswahlGrps.bezirke[b] > stammesauswahlGrps.dvs[dv] && stammesauswahlGrps.bezirke[b] < stammesauswahlGrps.dvs[dv] + 10000).sort();
    if (bezirke.indexOf(bezirk) == -1) bezirke = ["---", ...bezirke];

    bezirke.forEach(b => {
        let option = document.createElement("option");
        option.value = b;
        option.innerText = b;
        document.getElementById("stammesauswahl-bezirk").appendChild(option);
    });
    if (bezirke.indexOf(bezirk) != -1) document.getElementById("stammesauswahl-bezirk").value = bezirk;

    stammesauswahlLoadStaemme(bezirke.length > 0 && bezirke[bezirke.length - 1] != "---" ? (bezirk && bezirke.indexOf(bezirk) != -1) ? bezirk : 0 : dv, bezirke.length > 1, stamm);
}

function stammesauswahlLoadStaemme(bezirkOrDv, bz = true, stamm = null) {
    if (bezirkOrDv && bz && document.querySelector("#stammesauswahl-bezirk option[value='---']")) document.querySelector("#stammesauswahl-bezirk option[value='---']").remove();
    document.getElementById("stammesauswahl-stamm").innerHTML = "";

    let staemme = Object.keys(stammesauswahlGrps.staemme).filter(s => stammesauswahlGrps.staemme[s] > (bz ? stammesauswahlGrps.bezirke[bezirkOrDv] : stammesauswahlGrps.dvs[bezirkOrDv]) && stammesauswahlGrps.staemme[s] < (bz ? stammesauswahlGrps.bezirke[bezirkOrDv] : stammesauswahlGrps.dvs[bezirkOrDv]) + (bz ? 100 : 10000)).sort();
    if (staemme.indexOf(stamm) == -1) staemme = ["---", ...staemme];

    staemme.forEach(s => {
        let option = document.createElement("option");
        option.value = s;
        option.innerText = s;
        document.getElementById("stammesauswahl-stamm").appendChild(option);
    });
    if (staemme.indexOf(stamm) != -1) document.getElementById("stammesauswahl-stamm").value = stamm;
}