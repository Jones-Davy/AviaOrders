const STORAGE = 'https://airplane-methed.herokuapp.com/airplane/'

export const getStorage = (id) => fetch(STORAGE + id)
.then(response => response.json())
.then(data => data?.seats || [])



export const setStorage = (id, data) => {
    fetch(`${STORAGE}${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    })
}