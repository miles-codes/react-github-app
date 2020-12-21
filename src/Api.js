export const getUser = async (username) => {
    const response = await fetch('https://api.github.com/users/' + username, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    if (response.ok) {
        return await response.json()
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const getRepos = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })

    if (response.ok) {
        return await response.json()
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}