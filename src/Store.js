export default class Store {
    constructor(reducer, initialState) {
        this.reducer = reducer
        this.state = initialState
    }

    getState() {
        return this.state
    }

    dispatch(update) {
        this.state = this.reducer(this.state, update)
    }
}

const merge = (prev, next) => Object.assign({}, prev, next)

export const reducer = (state, update) => merge(state, update)
