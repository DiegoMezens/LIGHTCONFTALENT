const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const readline = require("readline");

const ROOT = "C:\\Temp\\getesteur\\Talent\\Fichier utilitaire";
const EXE = "C:\\Temp\\getesteur\\Phoenix.exe";
const PREFIX = "CONF_";

const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith(PREFIX));

if (dirs.length === 0) {
  console.log("Aucune configuration trouvée.");
  process.exit();
}

console.log("Configurations disponibles :");
dirs.forEach((d, i) => console.log(`${i + 1}: ${d.name}`));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Choisir une configuration (numéro) : ", answer => {
  const idx = parseInt(answer) - 1;
  if (idx < 0 || idx >= dirs.length) {
    console.log("Choix invalide !");
    rl.close();
    process.exit();
  }

  const selected = dirs[idx].name;
  console.log(`Copie de ${selected} ...`);

  const src = path.join(ROOT, selected);
  fs.readdirSync(src).forEach(file => {
    fs.cpSync(path.join(src, file), path.join(ROOT, file), { recursive: true, force: true });
  });

  console.log("Lancement de Phoenix.exe ...");
  exec(`"${EXE}"`, (err) => {
    if (err) console.error("Erreur :", err);
    else console.log("Terminé !");
    rl.close();
  });
});
