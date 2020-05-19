// TODO settings
// TODO rename js functions


let grp;
window.addEventListener("load", async () => {
    document.getElementById("dependent-dropdowns-dv").addEventListener("change", e => dependentDropdownsLoadBezirke(e.target.value));
    document.getElementById("dependent-dropdowns-bezirk").addEventListener("change", e => dependentDropdownsLoadStaemme(e.target.value));
    document.getElementById("dependent-dropdowns-stamm").addEventListener("change", () => {
        if (document.querySelector("#dependent-dropdowns-stamm option[value='---']")) document.querySelector("#dependent-dropdowns-stamm option[value='---']").remove();
    });

    grp = await fetch("https://wp.schoolyourself.de/wp-content/uploads/2020/05/gruppierungen.txt").then(r => r.json());
    dependentDropdownsLoad();

    let parent = document.getElementById("dependent-dropdowns-dv").parentElement;
    while (parent.className != "wpcf7") parent = parent.parentElement;
    parent.addEventListener("wpcf7mailsent",()=>requestAnimationFrame(dependentDropdownsLoad));
});

function dependentDropdownsLoad() {
    let dv = document.getElementById("dependent-dropdowns-dv").getAttribute("defaultValue");
    let bezirk = document.getElementById("dependent-dropdowns-bezirk").getAttribute("defaultValue");
    let stamm = document.getElementById("dependent-dropdowns-stamm").getAttribute("defaultValue");

    document.getElementById("dependent-dropdowns-dv").innerHTML = "";
    let dvs = Object.keys(grp.dvs).sort();
    if (dvs.indexOf(dv) == -1) dvs = ["---", ...dvs];

    dvs.forEach(d => {
        let option = document.createElement("option");
        option.value = d;
        option.innerText = d;
        document.getElementById("dependent-dropdowns-dv").appendChild(option);
    });
    if (dvs.indexOf(dv) != -1) document.getElementById("dependent-dropdowns-dv").value = dv;

    dependentDropdownsLoadBezirke(dv, bezirk, stamm, true);
}

function dependentDropdownsLoadBezirke(dv, bezirk, stamm) {
    if (dv && document.querySelector("#dependent-dropdowns-dv option[value='---']")) document.querySelector("#dependent-dropdowns-dv option[value='---']").remove();
    document.getElementById("dependent-dropdowns-bezirk").innerHTML = "";

    let bezirke = Object.keys(grp.bezirke).filter(b => grp.bezirke[b] > grp.dvs[dv] && grp.bezirke[b] < grp.dvs[dv] + 10000).sort();
    if (bezirke.indexOf(bezirk) == -1) bezirke = ["---", ...bezirke];

    bezirke.forEach(b => {
        let option = document.createElement("option");
        option.value = b;
        option.innerText = b;
        document.getElementById("dependent-dropdowns-bezirk").appendChild(option);
    });
    if (bezirke.indexOf(bezirk) != -1) document.getElementById("dependent-dropdowns-bezirk").value = bezirk;

    dependentDropdownsLoadStaemme(bezirke.length > 0 && bezirke[bezirke.length - 1] != "---" ? (bezirk && bezirke.indexOf(bezirk) != -1) ? bezirk : 0 : dv, bezirke.length > 1, stamm);
}

function dependentDropdownsLoadStaemme(bezirkOrDv, bz = true, stamm = null) {
    if (bezirkOrDv && bz && document.querySelector("#dependent-dropdowns-bezirk option[value='---']")) document.querySelector("#dependent-dropdowns-bezirk option[value='---']").remove();
    document.getElementById("dependent-dropdowns-stamm").innerHTML = "";

    let staemme = Object.keys(grp.staemme).filter(s => grp.staemme[s] > (bz ? grp.bezirke[bezirkOrDv] : grp.dvs[bezirkOrDv]) && grp.staemme[s] < (bz ? grp.bezirke[bezirkOrDv] : grp.dvs[bezirkOrDv]) + (bz ? 100 : 10000)).sort();
    if (staemme.indexOf(stamm) == -1) staemme = ["---", ...staemme];

    staemme.forEach(s => {
        let option = document.createElement("option");
        option.value = s;
        option.innerText = s;
        document.getElementById("dependent-dropdowns-stamm").appendChild(option);
    });
    if (staemme.indexOf(stamm) != -1) document.getElementById("dependent-dropdowns-stamm").value = stamm;
}