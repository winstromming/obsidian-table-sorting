import { Plugin } from 'obsidian';

const getSiblings = function (elem: HTMLElement) {
	return Array.prototype.filter.call(elem.parentNode?.children, function (sibling: HTMLElement) {
		return sibling !== elem;
	});
};

export default class TableSortPlugin extends Plugin {

	async onload() {

		this.registerDomEvent(document, 'click', (event) => {
			let target = event.target as HTMLElement

			if (target.nodeName !== "TH") target = target.closest("th") as HTMLElement
			if (target === null || target.parentElement === null) return

			const index = Array.from(target.parentElement.children).indexOf(target)
			const table = target.closest("table")
			if (table === null) return
			const tbody = table.querySelector("tbody")
			if (tbody === null) return

			const siblings: HTMLElement[] = getSiblings(target)
			siblings.forEach(sibling => {
				sibling.removeClass("sort-asc")
				sibling.removeClass("sort-desc")
			})

			if (target.hasClass("sort-desc")) {
				target.removeClass("sort-desc")
				target.addClass("sort-asc")
			} else {
				target.removeClass("sort-asc")
				target.addClass("sort-desc")
			}

			Array.from(tbody.querySelectorAll("tr"))
				.sort((a, b) => {
					const at = a.cells[index].textContent ?? ""
					const bt = b.cells[index].textContent ?? ""
					if (target.hasClass("sort-asc")) {
						if (at < bt) return -1
						if (at > bt) return 1
						return 0
					} else {
						if (at < bt) return 1
						if (at > bt) return -1
						return 0
					}
				})
     .forEach(tr => tbody.appendChild(tr));

		})
	}

}