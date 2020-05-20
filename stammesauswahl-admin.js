window.addEventListener("load", async () => {
    stammesauswahlAdmin = true;

    document.getElementById("paste-button").addEventListener("click", () => {
        console.log(stammesauswahlParse(document.getElementById("stammesauswahl_plugin_paste").value));
        document.getElementById("stammesauswahl_setting_hidden").value = document.getElementById("stammesauswahl_plugin_paste").value.length;
    });
});

function stammesauswahlParse(pdf = "") {
    let dvs = {};
    pdf.match(/Diözesen[\s\S]*Diözesen/g)[0].replace(/Diözese ([\wäöü-]+) (\d\d)\/(\d\d)\/(\d\d)/g, "°$1°$2°$3°$4").match(/°.*/g)
        .map(d => d.split("°")).forEach(d => dvs[d[1]] = { name: d[0], bezirke: {}, hasBezirke: true });
console.log(dvs);
console.log(pdf.match(/Bezirke[\s\S]*Bezirke/g))
    pdf.match(/Bezirke[\s\S]*Bezirke/g)[0].replace(/\d{1,3} ([A-Z](?:[^\/]°[a-z].?\/ ?[A-Z])+)(\d\d)\/(\d\d)\/(\d\d)/g, "°$1°$2°$3°$4\n").match(/°.*/g)
        .map(b => b.split("°")).forEach(b => dvs[b[1]].bezirke[b[2]] = { name: b[0], staemme: [] });

    Object.values(dvs).filter(d => Object.keys(d.bezirke).length == 0).forEach(d => {
        d.hasBezirke = false;
        d.bezirke[undefined] = ({ name: "", staemme: [] });
    });

    pdf.match(/Stämme[\s\S]*Stämme/g)[0].replace(/(?:Stamm°Siedlung) (.*) (\d\d)\/(\d\d)\/(\d\d)/g, "°$1°$2°$3°$4").match(/°.*/g)
        .map(s => s.split("°")).forEach(s => dvs[s[1]].bezirke[dvs[s[1]].hasBezirke ? s[2] : undefined].staemme.push(s[0]));

    console.log(dvs);
}