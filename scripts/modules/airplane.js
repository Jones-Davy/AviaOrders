import createElement from "./createElement.js"
import declOfNum from "./declOfNum.js"
import { setStorage, getStorage } from "../service/storage.js"


const createCockpit = (titleText) => {
    const cockpit = createElement('div', {
        className: 'cockpit',
    })

    const title = createElement('h1', {
        className: 'cockpit-title',
        textContent: titleText,
    })

    const button = createElement('button', {
        className: 'cockpit-confirm',
        name: 'send',
        type: 'submit',
        textContent: 'Подтвердить',
        disabled: true,
    })

    cockpit.append(title, button)

    return cockpit
}

const createExit = () => {
    const fuselage = createElement('div', {
        className: 'fuselage exit',
    })

    return fuselage
}

const createBlockSeat = (n, count, bookingSeat) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']

    const fuselage = createElement('ol', {
        className: 'fuselage',
    })

    for(let i = n; i < count + n; i++) {
        const wrapperRow = createElement('li')
        const seats = createElement('ol', {
            className: 'seats', 
        })

        const seatsRow = letters.map( letter => {
            const seat = createElement('li', {
                className: 'seat'
            })

            const wrapperCheck = createElement('label')
            const seatValue = `${i}${letter}`

            const check = createElement('input', {
                name: 'seat',
                type: 'checkbox',
                value: seatValue,
                disabled: bookingSeat.includes(seatValue)
                
            })

            wrapperCheck.append(check)
            seat.append(wrapperCheck)
            return seat

        })
        seats.append(...seatsRow)
        wrapperRow.append(seats)
        fuselage.append(wrapperRow)
    }

    return fuselage

}

const createAirplane = (bookingSeat, title, tourData) => {
    const scheme = tourData.scheme

    const choisesSeat = createElement('form', {
        className: 'choises-seat',
    })

    const plane = createElement('fieldset', {
        className: 'plane',
        name: 'plane'
    })

    const cockpit = createCockpit(title)

    let n = 1

    const elements = scheme.map((type) => {
        if(type === 'exit') {
            return createExit()
        }
        if (typeof type === 'number') {
            const blockseat = createBlockSeat(n, type, bookingSeat)
            n = n + type
            return blockseat
        }

    })

    plane.append(cockpit, ...elements)


    choisesSeat.append(plane)

    return choisesSeat
}

const checkSeat =  (bookingSeat, form, data, id) => {

    form.addEventListener('change', () => {
        const formData = new FormData(form)
        const checked = [...formData].map(([, value]) => value)

        form.send.disabled = checked.length !== data.length

        if (checked.length === data.length) {
            [...form].forEach(item => {
                if (item.checked === false && item.name === 'seat') {
                    item.disabled = true
                }
            })
        } else {
            [...form].forEach(item => {
                if(!bookingSeat.includes(item.value) && item.name === 'seat') {
                    item.disabled = false
                }
        })
    }
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const booking = [...formData].map(([, value]) => value)

        for(let i = 0; i < data.length; i++) {
            data[i].seat = booking[i]
        }

        setStorage(id, data)

        form.remove()

        document.body.innerHTML = `
        <h1 class ="title">Спасибо, хорошего полёта</h1>
        <h2 class = "title">${booking.length === 1 ?
        `Ваше место ${booking}` :
        `Ваши места ${booking}`}</h2>`
    })

}

const airplane = async (main, data, tourData) => {
    const title = `Выберите #${declOfNum(data.length, ['место', 'места', 'мест'])}`

    const dataResponse = await getStorage(tourData.id)

    const bookingSeat = dataResponse.map(item => item.seat)


    const choiseForm = createAirplane(bookingSeat, title, tourData)


    checkSeat(bookingSeat, choiseForm, data, tourData.id)

    main.append(choiseForm)
}

export default airplane