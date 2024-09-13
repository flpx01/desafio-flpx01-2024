// Dados dos recintos e animais
const recintos = [
  { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3, tamanho: 1 }] },
  { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
  { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1, tamanho: 2 }] },
  { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
  { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1, tamanho: 3 }] }
];

const animais = {
  LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
  LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
  CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
  MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
  GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
  HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
};

class RecintosZoo {
  constructor() {
    this.recintos = recintos;
    this.animais = animais;
  }

  analisaRecintos(animal, quantidade) {
    if (!this.animais[animal]) {
      return { erro: "Animal inválido" };
    }

    if (quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const { tamanho, biomas, carnivoro } = this.animais[animal];
    let recintosViaveis = [];

    for (const recinto of this.recintos) {
      const espacoOcupado = recinto.animais.reduce((total, a) => total + a.quantidade * a.tamanho, 0);
      const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

      const biomaValido = biomas.includes(recinto.bioma) || (recinto.bioma === "savana e rio");
      const precisaDeEspacoExtra = recinto.animais.some(a => a.especie !== animal);
      const espacoNecessario = quantidade * tamanho + (precisaDeEspacoExtra ? 1 : 0);

      const outrosAnimais = recinto.animais.filter(a => a.especie !== animal);

      if (carnivoro && outrosAnimais.length > 0) {
        continue;
      }

      if (!carnivoro && recinto.animais.some(a => this.animais[a.especie].carnivoro)) {
        continue; 
      }

      if (biomaValido && espacoNecessario <= espacoDisponivel) {
        recintosViaveis.push({
          recintoStr: `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel - espacoNecessario} total: ${recinto.tamanhoTotal})`,
          numero: recinto.numero
        });
      }
    }

    recintosViaveis.sort((a, b) => a.numero - b.numero);

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis: recintosViaveis.map(r => r.recintoStr) };
  }
}

export { RecintosZoo as RecintosZoo };
