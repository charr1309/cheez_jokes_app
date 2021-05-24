import React, {Component} from 'react';
import axios from 'axios';

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    };
    constructor(props) {
        super(props);
        this.state = {jokes: []};
    }
    async componentDidMount() {
        let jokes = [];
        while(jokes.length < this.props.numJokesToGet){
            let res = await axios.get("https://icanhazdadjoke.com/", {
                headers: {Accept: "application/json"}
    });
    jokes.push(res.data.joke);//res.data.joke is the path to a joke from the api
    
    }
    this.setState({jokes: jokes});//will overwrite whatever is in the jokes array
}
    render () {
        return (
            <div>
                <h1>Dad Jokes</h1>
            </div>
        );
    }
}
 export default JokeList;