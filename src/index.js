const display = document.getElementById('display')
const setNumber = document.getElementById('setNumber')
const recoverNumber = document.getElementById('recoverNumber')

const regexDisplayReadyToCut = /^\-?(|\d{1,3}[\.\,]|\d{1,3})+[\.\,]?\d+$/
const regexDisplayReadyToPaste = /\-?(|\d{1,3}[\.\,]|\d{1,3})+[\.\,]?\d+[-+*/]$/
const regexOperandsOperators = /\b(?=[-+*/])|(?<=[-+*/])\b/g
const regexKeyboardNumbersOperadors = /^[-+*/,0-9]$/
const regexCalculatorScope = /[-+*/,0-9]/

const arrayKeyboardKeyCodes = [
	'Enter',
	'Backspace',
	'NumpadEnter',
	'Escape',
	'KeyX',
	'KeyV',
]

let expression = display.value

const displayFormat = Intl.NumberFormat('pt-BR', {
	style: 'decimal',
	roundingPriority: 'morePrecision',
})

// const store = this.Storage

function sanitization(valor) {
	valor = valor.replace(/^[+*/,]+$/, '') // se operandores quando display vazio
	valor = valor.replace(/^(0){2,}$/, '$1') // múltiplos zeros à esquerda
	valor = valor.replace(/(\,\W)$/, ',') // se operadores ou demais vírgulas sequentes
	valor = valor.replace(/(,\d+),$/, '$1') // se múliplas vírgulas num só número
	valor = valor.replace(/[a-zA-Z]+$/, '') // alfabeto não permitido
	valor = valor.replace(/[^-+*/,0-9]+$/, '') // somente escopo de uma calculadora

	if (/\W{2,}$/.test(valor) && !/\d[+*/]\-$/.test(valor))
		valor = valor.slice(0, -1) // se operador de substração sucede outro operador para negar um operando subsequente

	//formataçao BR de números após inserir operador matemático
	if (/\d*[\.\,]?\d+[-+*/]$/.test(valor)) {
		let num = valor
			.match(/\d*[\.\,]?\d+(?=\D{1,2}$)/)[0]
			.replace('.', '')
			.replace(',', '.')
		valor = valor.replace(
			/\d*[\.\,]?\d+(?=\D{1,2}$)/,
			displayFormat.format(num)
		)
		console.log('entrou')
	}
	expression = display.value = valor
}

const ops = {
	Enter: () => {
		try {
			if (/\d*[\.\,]?\d+|[-+*/]\d*[\.\,]?\d+/.test(display.value)) {
				if (/^\d*[\.\,]?\d+$/.test(display.value)) return false // checa por caracters não numéricos ao final da sentença
				let equation = display.value.replace(/\./g, '').replace(/,/g, '.')
				let result = Function('return ' + equation)()
				result = Number.parseFloat(result).toFixed(5)
				expression = ''
				display.value = displayFormat.format(result)
				setNumber.disabled = false
				recoverNumber.disabled = true
			}
		} catch (error) {
			display.value = display.value.slice(0, -1) // exclui caracters não numéricos ao final da sentença
		}
	},

	NumpadEnter() {
		this.Enter()
	},
	Backspace: () => {
		expression = display.value = expression.slice(0, -1)
		if (sessionStorage.getItem('number')) {
			recoverNumber.disabled = false
		} else if (display.value === '') {
			recoverNumber.disabled = true
		}

		return false
	},

	Escape: () => {
		expression = display.value = ''
		setNumber.disabled = true
		if (sessionStorage.getItem('number')) {
			recoverNumber.disabled = false
		}
	},

	KeyX: () => {
		if (regexDisplayReadyToCut.test(display.value)) {
			let number = display.value
			console.log(number)
			display.value = ''
			setNumber.disabled = true
			recoverNumber.disabled = false
			sessionStorage.setItem('number', number)
			return false
		}
	},

	KeyV: () => {
		if (regexDisplayReadyToPaste.test(display.value) || display.value === '') {
			display.value += sessionStorage.getItem('number')
			sessionStorage.removeItem('number')
			recoverNumber.disabled = true
		}
	},
}

window.onload = () => {
	var storedNumber = sessionStorage.getItem('number') || undefined
	recoverNumber.disabled = storedNumber ? false : true
}

display.focus()

let eventsForDigitIncome = ['click', 'keyup']
eventsForDigitIncome.forEach(function (ev) {
	document.addEventListener(ev, function (event) {
		display.focus()

		if (event.target.value && ev == 'click') {
			if (regexKeyboardNumbersOperadors.test(event.target.value)) {
				display.value = expression += event.target.value
			} else {
				ops[event.target.dataset.buttons]()
			}
		} else if (
			regexKeyboardNumbersOperadors.test(event.key) &&
			ev === 'keyup'
		) {
			display.value = expression += event.key
		} else if (arrayKeyboardKeyCodes.includes(event.code)) {
			ops[event.code]()
		}

		if (display.value === '') setNumber.disabled = true
		else sanitization(display.value)

		if (regexDisplayReadyToCut.test(display.value)) {
			setNumber.disabled = false
			recoverNumber.disabled = true
		} else {
			setNumber.disabled = true
			recoverNumber.disabled =
				sessionStorage.length &&
				(regexDisplayReadyToPaste.test(expression) || display.value == '')
					? false
					: true
		}
		// expression = display.value
	})
})

display.addEventListener('click', (event) => {
	const end = event.target.value.length
	event.target.setSelectionRange(end, end)
	event.target.focus()
})
