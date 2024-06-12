const vocabList = `fisica:Physik
foce:Mund
fiume:Fluss
allargare:vergrößern
quindi:daher
antica:uralt
nonché:sowie
ovest:Westen
est:Ost
chiusura:Schließung
Carlo Magno:Karl der Große
insediamento:Siedlung
re:König
crescita:Wachstum
vescovo:Bischof
diocesi:Bistum
scoperta:Entdeckung
secolo:Jahrhundert
viene iniziata:ist gestartet
dopo:Nach
ottenere:erhalten
impero:Reich
diventare:werden
poi:dann
municipio:Rathaus
ricco:reich
ascoltare:hören
volere:Wollen
appartenere:gehören
modo:Art und Weise`



vocabs = []

function loadVocab(text) {
    const lines = text.split('\n')
    vocabs = lines.map(line => {
        const [first, second] = line.split(':')
        return [first.trim(), second.trim()]
    })
}

function setNewVocabPair() {
    const pair = vocabs[Math.floor(Math.random()*vocabs.length)]
    console.log(pair[0])
    document.getElementById("card-front").innerHTML = pair[0]
    document.getElementById("card-back").innerHTML = pair[1]
}

loadVocab(vocabList)
setNewVocabPair()
document.getElementById('card').addEventListener('click', async function() {
    this.classList.toggle('flipped')
    await new Promise(r => setTimeout(r, 200));
    if(!this.classList.contains('flipped')) setNewVocabPair()
});

