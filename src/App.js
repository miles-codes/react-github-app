import React from 'react';
import './App.css';
import Store, { reducer } from "./Store";
import { getRepos, getUser } from "./Api";
import { Repo } from "./RepoComponent";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.store = new Store(reducer)
    }

    state = {
        searchValue: '',
        profilePicture: '',
        username: '',
        email: '',
        githubProfile: '',
        repos: [],
        sortedAsc: true,
        loading: false,
        error: ''
    }

    handleSearchUpdate = (event) => this.setState({ searchValue: event.target.value })

    handleSubmit = async (event) => {
        event.preventDefault()

        if (!this.state.searchValue) {
            this.setState({ error: 'Empty string not allowed' })
            return
        }
        this.setState({ loading: true, error: '' })

        const storeState = this.store.getState()
        if (storeState && this.state.searchValue in storeState){
            if (this.state.username !== storeState[this.state.searchValue].login) {
                let user = storeState[this.state.searchValue].user
                let repos = storeState[this.state.searchValue].repos
                this.setState({
                    profilePicture: user.avatar_url,
                    username: user.login,
                    email: user.email,
                    githubProfile: user.html_url,
                    repos: repos
                })
            }
            this.setState({ loading: false })

            return
        }

        try {
            const user = await getUser(this.state.searchValue)
            const repos = await getRepos(user.repos_url)
            this.setState({
                profilePicture: user.avatar_url,
                username: user.login,
                email: user.email,
                githubProfile: user.html_url,
                repos: repos,
                loading: false,
                sortedAsc: true
            })
            this.store.dispatch({ [this.state.searchValue]: {user, repos} })
        }
        catch (e) {
            this.setState({ loading: false, error: this.state.searchValue + ' not found' })
        }
    }

    sortRepos = () => {
        if (this.state.sortedAsc)
            this.setState({
                repos: this.state.repos.sort((a, b) => (a.name < b.name) ? 1 : -1),
                sortedAsc: false
            })
        else
            this.setState({
                repos: this.state.repos.sort((a, b) => (a.name > b.name) ? 1 : -1),
                sortedAsc: true
            })
    }

    render() {
        return (
            <div className="App">
                <h1>Search for GitHub accounts</h1>
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="Input"
                        value={this.state.searchValue}
                        placeholder="Search users"
                        onChange={this.handleSearchUpdate}
                    />
                    <button onClick={this.handleSubmit}>search</button>
                </form>
                {this.state.loading && <div className="Loader" />}
                {this.state.error && <p className="Error">{this.state.error}</p>}
                {this.state.username &&
                    <div>
                        <div className="Profile">
                            <img src={this.state.profilePicture} className="Picture" alt="profile"/>
                            <div className="Profile-row">
                                <p>{this.state.username}</p>
                                {this.state.email && <p>{this.state.email}</p>}
                                <a href={this.state.githubProfile} target="_blank" rel="noreferrer">GitHub profile</a>
                            </div>
                        </div>

                        <div className="Repos">
                            <h3>Repositories:</h3>
                            <button onClick={this.sortRepos}>sort by name {this.state.sortedAsc ? "desc" : "asc"}</button>
                            <ul>
                                {this.state.repos.map(repo => (
                                    <Repo key={repo.id} name={repo.full_name} description={repo.description} url={repo.html_url} />
                                ))}
                            </ul>
                        </div>
                    </div>
                }

            </div>
        );
    }
}

export default App;
