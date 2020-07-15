window.addEventListener("load", () => {
    document.getElementById("cf7stammesauswahl-paste-button").removeAttribute("disabled");
    document.getElementById("cf7stammesauswahl-plugin-paste").removeAttribute("disabled");
    document.getElementById("cf7stammesauswahl-paste-button").addEventListener("click", () => {
        try {
            let groups = JSON.stringify(cf7stammesauswahlParse(document.getElementById("cf7stammesauswahl-plugin-paste").value));
            document.getElementById("cf7stammesauswahl_setting_hidden").value = groups;
            Array.apply(null, document.querySelectorAll(".cf7stammesauswahl")).forEach(table => {
                table.setAttribute("groups", groups);
                cf7stammesauswahlLoad(table);
            });
            Array.apply(null, document.querySelectorAll(".cf7stammesauswahl label")).forEach(l => l.style.color = "lightgreen");
        } catch {
            document.getElementById("cf7stammesauswahl-plugin-paste").value = "";
            Array.apply(null, document.querySelectorAll(".cf7stammesauswahl label")).forEach(l => l.style.color = "red");
            alert("Irgendetwas stimmt mit den eingefügten Daten nicht :\ Versuche es nochmal.");
        }
        setTimeout(() => {
            Array.apply(null, document.querySelectorAll(".cf7stammesauswahl label")).forEach(l => l.style.color = "");
        }, 200);
    });
});

function cf7stammesauswahlParse(pdf = "") {
    let dvs = [];
    pdf.match(/Diözesen[\s\S]*Diözesen/g)[0].replace(/Diözese ([\wäöü-]+) (\d\d)\/(\d\d)\/(\d\d)/g, "°$1°$2°$3°$4").match(/°.*/g)
        .map(d => d.split("°")).forEach(d => dvs[parseInt(d[2])] = { name: d[1], bezirke: [], hasBezirke: true });
    
        pdf.match(/Bezirke[\s\S]*Bezirke/g)[0].replace(/\d{1,3} ([A-Z](?:[^\/]|[a-z].?\/ ?[A-Z])+)(\d\d)\/(\d\d)\/(\d\d)/g, "°$1°$2°$3°$4\n").match(/°.*/g)
        .map(b => b.split("°")).forEach(b => dvs[parseInt(b[2])].bezirke[parseInt(b[3])] = { name: b[1].trim(), staemme: [] });

    Object.values(dvs).filter(d => Object.keys(d.bezirke).length == 0).forEach(d => {
        d.hasBezirke = false;
        d.bezirke[0] = ({ name: "", staemme: [] });
    });

    pdf.match(/Stämme[\s\S]*Stämme/g)[0].replace(/(?:Stamm|Siedlung) (.*) (\d\d)\/(\d\d)\/(\d\d)/g, "°$1°$2°$3°$4").match(/°.*/g)
        .map(s => s.split("°")).forEach(s => dvs[parseInt(s[2])].bezirke[dvs[parseInt(s[2])].hasBezirke ? parseInt(s[3]) : 0].staemme.push(s[1]));

    dvs = dvs.filter(d => d);
    dvs.forEach(d => d.bezirke = d.bezirke.filter(b => b));
    dvs.forEach(d => d.bezirke.forEach(b => b.staemme = b.staemme.filter(s => s)));

    return dvs;
}