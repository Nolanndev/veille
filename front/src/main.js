import './style.css'

const gItems = []


document.getElementById('search').addEventListener('input', (e) => {
	if (gItems.length > 0) {
		let t = gItems.filter((item) => item.title.includes(e.currentTarget.value))
		displayItems(t)
	}
})

function fetchData() {
	fetch('http://127.0.0.1:3000/api/feed')
		.then(response => response.json())
		.then(response => {
			console.log(response)
			document.getElementById('content-error').style.display = 'none'
			response.items.forEach(item => {
				gItems.push({
					...item,
					feedTitle: response.title,
					feedLink: response.link
				})
			})
			displayItems(gItems)
		})
		.catch(error => {
			document.getElementById('content-error').style.display = 'block'
			console.error(`erreur: ${error}`)
		})
}



function displayItems(items) {
	const appElement = document.getElementById('app')
	while (appElement.lastChild) {
		appElement.removeChild(appElement.lastChild)
	}

	if (items.length < 1) {
		document.getElementById('no-content').style.display = 'block'
		return
	}

	document.getElementById('no-content').style.display = 'none'
	items.forEach(item => {
		const itemDiv = document.createElement('div')
		itemDiv.classList.add('item')

		const itemTitleElement = document.createElement('h3')
		itemTitleElement.textContent = item.title

		const itemContentElement = document.createElement('p')
		itemContentElement.classList.add('ellipsed')
		itemContentElement.textContent = item.contentSnippet || item.content || ''

		const itemSourceElement = document.createElement('p')
		itemSourceElement.innerHTML = `Source : <a href="${item.feedLink}">${item.feedTitle}<a>`

		const itemLinkElement = document.createElement('a')
		itemLinkElement.href = item.link
		itemLinkElement.title = `Lire l'article`
		itemLinkElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px"><path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"/></svg>
    `
		// <img title="Lire l'article sur le site d'origine" src="/lien-externe.svg" alt="Icone: lire l'article sur le site original" />`

		itemDiv.appendChild(itemTitleElement)
		itemDiv.appendChild(itemContentElement)
		itemDiv.appendChild(itemSourceElement)
		itemDiv.appendChild(itemLinkElement)
		appElement.appendChild(itemDiv)

		itemDiv.addEventListener('click', () => {
			console.log("%c Afficher une modal de l'article", "color:rgb(20, 163, 20)")
		})
	})
}



fetchData()



// Halo de lumière autour de la souris
// const halo = document.getElementById('cursor-halo');
// halo.style.display = 'block'
// document.addEventListener('mousemove', (e) => {
//   halo.style.left = `${e.clientX}px`;
//   halo.style.top = `${e.clientY}px`;
// });


