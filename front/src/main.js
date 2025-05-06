// ================================================
//  III  M   M  PPPP    OOO   RRRR   TTTTT   SSS
//   I   MM MM  P   P  O   O  R   R    T    S
//   I   M M M  P   P  O   O  R   R    T     SSS
//   I   M   M  PPPP   O   O  RRRR     T        S
//   I   M   M  P      O   O  R  R     T        S
//  III  M   M  P       OOO   R   R    T    SSSS
// ================================================
// * * * IMPORTS



import './style.css'



// ===========================================================================================================================
//  V   V    A    RRRR   III    A    BBB    L      EEEEE   SSS         GGG   L       OOO   BBB      A    L      EEEEE   SSS
//  V   V   A A   R   R   I    A A   B  B   L      E      S           G   G  L      O   O  B  B    A A   L      E      S
//  V   V  A   A  R   R   I   A   A  BBBB   L      EEE     SSS        G      L      O   O  BBBB   A   A  L      EEE     SSS
//   V V   AAAAA  RRRR    I   AAAAA  B   B  L      E          S       G  GG  L      O   O  B   B  AAAAA  L      E          S
//   V V   A   A  R  R    I   A   A  B   B  L      E          S       G   G  L      O   O  B   B  A   A  L      E          S
//    V    A   A  R   R  III  A   A  BBBB   LLLLL  EEEEE  SSSS         GGGG  LLLLL   OOO   BBBB   A   A  LLLLL  EEEEE  SSSS
// ===========================================================================================================================
// * * * VARIABLES GLOBALES



let gItems = []
let gSummary = ""



// ==========================================================================================
//   QQQ   U   U  EEEEE  L       QQQ   U   U  EEEEE        CCC   H   H   OOO    SSS   EEEEE
//  Q   Q  U   U  E      L      Q   Q  U   U  E           C   C  H   H  O   O  S      E
//  Q   Q  U   U  EEE    L      Q   Q  U   U  EEE         C      HHHHH  O   O   SSS   EEE
//  Q Q Q  U   U  E      L      Q Q Q  U   U  E           C      H   H  O   O      S  E
//  Q  Q   U   U  E      L      Q  Q   U   U  E           C   C  H   H  O   O      S  E
//   QQ Q   UUU   EEEEE  LLLLL   QQ Q   UUU   EEEEE        CCC   H   H   OOO   SSSS   EEEEE
// ==========================================================================================
// * * * QUELQUE CHOSE



document.getElementById('search').addEventListener('input', (e) => {
	if (gItems.length > 0) {
		let t = gItems.filter((item) => item.title.toLowerCase().includes(e.currentTarget.value.toLowerCase()))
		displayItems(t)
	}
})

document.getElementById('sort').addEventListener('input', (e) => {
	sortItems(e.currentTarget.value)
	displayItems(gItems)
})

// Trier gItems par rapport à un filtre
function sortItems(filtre = "newToOld") {
	switch (filtre) {
		case 'alpha': // tri par ordre alphabétique
			gItems = gItems.sort((a, b) => a.title.localeCompare(b.title))
			break;
		case 'oldToNew': // tri du plus ancien au plus récent
			gItems = gItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate))
			break;
		default: // tri du plus récent au plus ancien
			gItems = gItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
			break;
	}
}



// ====================================
//  FFFFF  EEEEE  TTTTT   CCC   H   H
//  F      E        T    C   C  H   H
//  FFF    EEE      T    C      HHHHH
//  F      E        T    C      H   H
//  F      E        T    C   C  H   H
//  F      EEEEE    T     CCC   H   H
// ====================================
// * * * FETCH



function fetchData() {
	fetch('https://veille.nolannparcheminer.fr/api/feed')
	// fetch('http://127.0.0.1:3000/api/feed')
		.then(response => response.json())
		.then(response => {
			console.log(response)
			gItems = response
			sortItems()
			displayItems(gItems)
		})
		.catch(error => {
			document.getElementById('content-error').style.display = 'block'
			console.error(`erreur: ${error}`)
		})
	fetch('https://veille.nolannparcheminer.fr/summary')
	// fetch('http://127.0.0.1:3000/summary')
		.then(response => response.json())
		.then(response => {
			gSummary = response.message
			console.log(response.message)

			let appElement = document.getElementById('app')
			let summaryContainer = document.createElement('p')
			summaryContainer.textContent = response.message
			summaryContainer.setAttribute('id','summary')
			document.body.insertBefore(summaryContainer, appElement)
		})
		.catch(error => {
			console.error(`erreur: ${error}`)
		})
}



// ==============================================================
//    A    FFFFF  FFFFF  III   CCC   H   H    A     GGG   EEEEE
//   A A   F      F       I   C   C  H   H   A A   G   G  E
//  A   A  FFF    FFF     I   C      HHHHH  A   A  G      EEE
//  AAAAA  F      F       I   C      H   H  AAAAA  G  GG  E
//  A   A  F      F       I   C   C  H   H  A   A  G   G  E
//  A   A  F      F      III   CCC   H   H  A   A   GGGG  EEEEE
// ==============================================================
// * * * AFFICHAGE



function displayItems(items) {
	document.getElementById('loading').style.display = 'block'
	const appElement = document.getElementById('app')
	while (appElement.lastChild) {
		appElement.removeChild(appElement.lastChild)
	}

	if (items.length < 1) {
		document.getElementById('loading').style.display = 'none'
		document.getElementById('no-content').style.display = 'block'
		return
	}

	document.getElementById('no-content').style.display = 'none'
	items.forEach(item => {
		const itemDiv = document.createElement('div')
		itemDiv.classList.add('item')

		const itemTitleElement = document.createElement('h3')
		itemTitleElement.textContent = item.title

		const itemDateElement = document.createElement('p')
		itemDateElement.classList.add('date')
		itemDateElement.textContent = (new Date(item.pubDate)).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })

		const itemContentElement = document.createElement('p')
		itemContentElement.classList.add('ellipsed')
		itemContentElement.textContent = item.contentSnippet || item.content || ''

		const itemSourceElement = document.createElement('p')
		itemSourceElement.innerHTML = `Source : <a href="${item.feedLink}">${item.feedTitle}<a>`

		let itemFooterElement = document.createElement('div')
		itemFooterElement.classList.add('item-footer')

		const itemLinkElement = document.createElement('a')
		itemLinkElement.href = item.link
		itemLinkElement.title = `Lire l'article`
		itemLinkElement.innerHTML = `
			<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px"><path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"/></svg>`
		// <img title="Lire l'article sur le site d'origine" src="/lien-externe.svg" alt="Icone: lire l'article sur le site original" />`

		const itemTagElement = document.createElement('span')
		itemTagElement.classList.add('tag')
		itemTagElement.textContent = item.tag
		itemTagElement.setAttribute('class', 'tag')
		switch (item.tag) {
			case 'programmation': itemTagElement.classList.add('tag-green'); break;
			case 'automobile': itemTagElement.classList.add('tag-blue'); break;
			default: itemTagElement.classList.add('tag-white'); break;
		}
		
		itemFooterElement.appendChild(itemLinkElement)
		itemFooterElement.appendChild(itemTagElement)

		itemDiv.appendChild(itemTitleElement)
		itemDiv.appendChild(itemDateElement)
		itemDiv.appendChild(itemContentElement)
		itemDiv.appendChild(itemSourceElement)
		itemDiv.appendChild(itemFooterElement)
		appElement.appendChild(itemDiv)

		itemDiv.addEventListener('click', () => {
			let overlay = document.querySelector('.overlay')
			overlay.style.display = 'flex'
			document.body.style.overflow = "hidden";

			let itemModal = document.getElementById('item-modal')

			let modalTitle = document.createElement('h2')
			modalTitle.textContent = item.title

			let modalDate = document.createElement('p')
			modalDate.textContent = 'Publié le ' + (new Date(item.pubDate)).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })

			let modalSource = document.createElement('p')
			modalSource.innerHTML = `Lien du site : <a href="${item.feedLink}">${item.feedTitle}</a>`
			
			let modalArticleSource = document.createElement('p')
			modalArticleSource.innerHTML = `Lien original l'article : <a href="${item.link}">${item.feedTitle} - ${item.title}</a>`

			let modalContent = document.createElement('div')
			modalContent.innerHTML = item.content

			itemModal.appendChild(modalTitle)
			itemModal.appendChild(modalDate)
			itemModal.appendChild(modalSource)
			itemModal.appendChild(modalArticleSource)
			itemModal.appendChild(modalContent)

		})
	})
	document.getElementById('loading').style.display = 'none'
}



// ==============================================================
//  L        A         M   M   OOO   DDD      A    L      EEEEE
//  L       A A        MM MM  O   O  D  D    A A   L      E
//  L      A   A       M M M  O   O  D   D  A   A  L      EEE
//  L      AAAAA       M   M  O   O  D   D  AAAAA  L      E
//  L      A   A       M   M  O   O  D  D   A   A  L      E
//  LLLLL  A   A       M   M   OOO   DDD    A   A  LLLLL  EEEEE
// ==============================================================
// * * * LA MODALE



document.getElementById("overlay").addEventListener("click", function (e) {
	if (e.target === this) {
		let modal = document.getElementById('item-modal')
		while(modal.lastChild) {
			modal.removeChild(modal.lastChild)
		}
		this.style.display = "none";
		document.body.style.overflow = "";
	}
});



// ==========================================================================================
//  BBB     OOO   U   U  TTTTT   OOO   N   N        SSS    CCC   RRRR    OOO   L      L
//  B  B   O   O  U   U    T    O   O  NN  N       S      C   C  R   R  O   O  L      L
//  BBBB   O   O  U   U    T    O   O  N N N        SSS   C      R   R  O   O  L      L
//  B   B  O   O  U   U    T    O   O  N  NN           S  C      RRRR   O   O  L      L
//  B   B  O   O  U   U    T    O   O  N   N           S  C   C  R  R   O   O  L      L
//  BBBB    OOO    UUU     T     OOO   N   N       SSSS    CCC   R   R   OOO   LLLLL  LLLLL
// ==========================================================================================
// * * * BOUTON SCROLL



const scrollTopBtn = document.getElementById("scrollTopBtn");

// Affiche ou cache le bouton selon le scroll
window.addEventListener("scroll", function () {
  if (window.scrollY > 200) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0 });
});








fetchData()


