console.log('JavaScript je učitan');

const radovi = [
    { id: 1, naziv: "Umetnički rad 1", autor: "Autor 1", cena: 100, slika: "slike/rad1.jpg", opis: "Opis rad 1" },
    { id: 2, naziv: "Umetnički rad 2", autor: "Autor 2", cena: 150, slika: "slike/rad2.jpg", opis: "Opis rad 2" },
    { id: 3, naziv: "Umetnički rad 3", autor: "Autor 3", cena: 200, slika: "slike/rad3.jpg", opis: "Opis rad 3" },
    { id: 4, naziv: "Umetnički rad 4", autor: "Autor 4", cena: 100, slika: "slike/rad4.jpg", opis: "Opis rad 4" },
    { id: 5, naziv: "Umetnički rad 5", autor: "Autor 5", cena: 150, slika: "slike/rad5.jpg", opis: "Opis rad 5" },
    { id: 6, naziv: "Umetnički rad 6", autor: "Autor 6", cena: 200, slika: "slike/rad6.jpg", opis: "Opis rad 6" },
    { id: 6, naziv: "Umetnički rad 7", autor: "Autor 7", cena: 250, slika: "slike/rad7.jpg", opis: "Opis rad 7" },
    { id: 6, naziv: "Umetnički rad 8", autor: "Autor 8", cena: 150, slika: "slike/rad8.jpg", opis: "Opis rad 8" }
];

const istaknutiRadovi = [
    { id: 1, naziv: "Umetnički rad 1", autor: "Autor 1", cena: 100, slika: "slike/rad1.jpg", opis: "Opis rad 1" },
    { id: 2, naziv: "Umetnički rad 2", autor: "Autor 2", cena: 150, slika: "slike/rad2.jpg", opis: "Opis rad 2" },
    { id: 3, naziv: "Umetnički rad 3", autor: "Autor 3", cena: 200, slika: "slike/rad3.jpg", opis: "Opis rad 3" },
];

let korpa = JSON.parse(localStorage.getItem('korpa')) || [];

function prikaziRadove(radovi, elementId) {
    const kontejner = document.getElementById(elementId);
    if (kontejner) {
        kontejner.innerHTML = radovi.map(rad => 
            `<div class="rad">
                <img src="${rad.slika}" alt="${rad.naziv}">
                <h5>${rad.naziv}</h5>
                <p>Cena: ${rad.cena}€</p>
                <button class="dugme" onclick="dodajUKorpu(${rad.id}); event.stopPropagation();">Dodaj u korpu</button>
            </div>`
        ).join('');
    }
}

function prikaziIskacuciProzor(poruka) {
    const kontejnerProzor = document.getElementById('iskacuci-prozor');
    const porukaProzor = document.createElement('div');
    
    porukaProzor.className = 'poruka-iskacuci';
    porukaProzor.textContent = poruka;

    kontejnerProzor.appendChild(porukaProzor);

    setTimeout(() => {
        porukaProzor.style.opacity = 1;
    }, 0);

    setTimeout(() => {
        porukaProzor.style.opacity = 0;
        porukaProzor.classList.add('izlaz');

        setTimeout(() => {
            kontejnerProzor.removeChild(porukaProzor);
        }, 500);
    }, 2000);
}

function dodajUKorpu(id) {
    const rad = radovi.find(r => r.id === id);
    const stavkaUKorpi = korpa.find(stavka => stavka.id === id);
    if (stavkaUKorpi) {
        stavkaUKorpi.kolicina++;
    } else {
        korpa.push({ ...rad, kolicina: 1 });
    }
    localStorage.setItem('korpa', JSON.stringify(korpa));
    prikaziIskacuciProzor('Proizvod je dodat u korpu!');
    prikaziStavkeUKorpi();
}

function prikaziStavkeUKorpi() {
    const stavkeKorpe = document.getElementById('stavke-korpe');
    const ukupnaCena = document.getElementById('ukupna-cena');
    if (stavkeKorpe && ukupnaCena) {
        stavkeKorpe.innerHTML = korpa.map((rad, indeks) => 
            `<div class="stavka">
                <img src="${rad.slika}" alt="${rad.naziv}">
                <div class="opis-stavke">
                    <h3>${rad.naziv}</h3>
                    <p>Cena: ${rad.cena}€</p>
                    <div class="kolicina">
                        <button class="dugme-kolicina" onclick="promeniKolicinu(${indeks}, -1)" ${rad.kolicina === 1 ? 'disabled' : ''}>-</button>
                        <span>${rad.kolicina}</span>
                        <button class="dugme-kolicina" onclick="promeniKolicinu(${indeks}, 1)">+</button>
                    </div>
                </div>
                <button class="dugme" onclick="ukloniIzKorpe(${indeks})">Ukloni</button>
            </div>`
        ).join('');
        ukupnaCena.textContent = korpa.reduce((total, rad) => total + rad.cena * rad.kolicina, 0);
    }
}

function promeniKolicinu(indeks, promena) {
    if (korpa[indeks].kolicina + promena > 0) {
        korpa[indeks].kolicina += promena;
    }
    localStorage.setItem('korpa', JSON.stringify(korpa));
    prikaziStavkeUKorpi();
}

function ukloniIzKorpe(indeks) {
    korpa.splice(indeks, 1);
    localStorage.setItem('korpa', JSON.stringify(korpa));
    prikaziStavkeUKorpi();
}

const naruciDugme = document.getElementById('naruci-dugme');
if (naruciDugme) {
    naruciDugme.addEventListener('click', function() {
        if (korpa.length > 0) {
            window.location.href = 'placanje.html';
        } else {
            prikaziIskacuciProzor('Korpa je prazna!');
        }
    });
}

// Validacija forme plaćanja i slanje
const formaPlacanje = document.getElementById('forma-placanje');
if (formaPlacanje) {
    formaPlacanje.addEventListener('submit', function(event) {
        event.preventDefault();

    
        const ime = document.getElementById('ime').value.trim();
        const telefon = document.getElementById('telefon').value.trim();
        const email = document.getElementById('email').value.trim();
        const postanskiBroj = document.getElementById('postanskiBroj').value.trim();
        const adresa = document.getElementById('adresa').value.trim();

        const emailRegex = /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/; 
        const imePrezimeRegex = /.+\s.+/; 
        const telefonRegex = /^[0-9]{9,15}$/;
        const postanskiBrojRegex = /^[0-9]{5}$/; 
        const adresaRegex = /.*\s+.*\d+.*/; 

        let valid = true;
        let errorMessage = '';

        if (!ime) {
            errorMessage += 'Ime i Prezime je obavezno polje.\n';
            valid = false;
        } else if (!imePrezimeRegex.test(ime)) {
            errorMessage += 'Ime i Prezime moraju imati bar jedno ime i jedno prezime.\n';
            valid = false;
        }

        if (!telefon) {
            errorMessage += 'Telefon je obavezno polje.\n';
            valid = false;
        } else if (!telefonRegex.test(telefon)) {
            errorMessage += 'Telefon mora imati između 9 i 15 cifara.\n';
            valid = false;
        }

        if (!email) {
            errorMessage += 'E-mail je obavezno polje.\n';
            valid = false;
        } else if (!emailRegex.test(email)) {
            errorMessage += 'E-mail adresa nije ispravna. Molimo vas da unesete ispravnu e-mail adresu.\n';
            valid = false;
        }

        if (!postanskiBroj) {
            errorMessage += 'Poštanski broj je obavezno polje.\n';
            valid = false;
        } else if (!postanskiBrojRegex.test(postanskiBroj)) {
            errorMessage += 'Poštanski broj mora imati tačno 5 cifara.\n';
            valid = false;
        }

        if (!adresa) {
            errorMessage += 'Adresa je obavezno polje.\n';
            valid = false;
        } else if (!adresaRegex.test(adresa)) {
            errorMessage += 'Adresa mora imati bar jedan razmak i bar jedan broj.\n';
            valid = false;
        }

        if (valid) {
            prikaziIskacuciProzor('Uspešna porudžbina!');
            let korpa = [];
            localStorage.setItem('korpa', JSON.stringify(korpa));
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            prikaziIskacuciProzor(errorMessage.trim());
        }
    });
}


prikaziRadove(istaknutiRadovi, 'istaknuti-radovi');
prikaziRadove(radovi, 'radovi-prodavnica');
prikaziStavkeUKorpi();
